// =====================================================================
// R Angle — Call Analysis API
// Upload a call recording -> Gemini analyses it -> structured report.
//
// Two providers, auto-selected from server/.env:
//   • GEMINI_API_KEY set        -> Google AI Studio (Gemini Files API).
//                                  No GCP roles / bucket needed. Easiest.
//   • else Vertex AI creds set  -> Vertex AI + Cloud Storage (GCP credit).
// Analyses are persisted to server/data/*.json so history survives restarts.
// =====================================================================
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI, createPartFromUri, createUserContent } from '@google/genai'
import { Storage } from '@google-cloud/storage'
import { SYSTEM_INSTRUCTION, buildUserInstruction } from './prompt.js'

const {
  PORT = 8787,
  GEMINI_API_KEY,
  GCP_PROJECT_ID,
  GCP_LOCATION = 'us-central1',
  GCS_BUCKET,
  GEMINI_MODEL = 'gemini-2.5-flash',
  ALLOWED_ORIGIN = 'http://localhost:5173',
} = process.env

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')

// Provider selection — API key wins (simplest); else Vertex if creds exist.
const mode = GEMINI_API_KEY
  ? 'apikey'
  : GCP_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? 'vertex'
    : null
const configured = Boolean(mode)

// 120s client timeout so a single request can never hang indefinitely.
const httpOptions = { timeout: 120000 }
let ai
let storage
if (mode === 'apikey') {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY, httpOptions })
} else if (mode === 'vertex') {
  ai = new GoogleGenAI({ vertexai: true, project: GCP_PROJECT_ID, location: GCP_LOCATION, httpOptions })
  if (GCS_BUCKET) storage = new Storage({ projectId: GCP_PROJECT_ID })
}

// Free/express-tier Gemini frequently returns 503 (overloaded) or 429
// (quota) on individual models. Try the configured model first, then fall
// back through known-good flash models, with exponential backoff per model.
const MODEL_CHAIN = [...new Set([GEMINI_MODEL, 'gemini-flash-latest', 'gemini-2.0-flash'])]

// NOTE: we deliberately do NOT use a strict responseSchema. Constrained-schema
// decoding makes flash models loop into giant run-on output (MAX_TOKENS,
// invalid JSON). The exact JSON shape is specified in the prompt instead
// (see prompt.js), which is fast, concise and reliable.
const GEN_CONFIG = {
  systemInstruction: SYSTEM_INSTRUCTION,
  responseMimeType: 'application/json',
  temperature: 0.4,
  maxOutputTokens: 16000,
  thinkingConfig: { thinkingBudget: 0 }, // off = faster, avoids runaway loops
}

// Tolerantly extract a JSON object from the model text (strip code fences,
// take the outermost {...} if there's any stray prose).
function parseJson(text) {
  let t = (text || '').trim()
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  try {
    return JSON.parse(t)
  } catch {
    const first = t.indexOf('{')
    const last = t.lastIndexOf('}')
    if (first !== -1 && last > first) return JSON.parse(t.slice(first, last + 1))
    throw new SyntaxError('No JSON object found in model output')
  }
}

// Returns parsed analysis. Retries on transient errors (503/429/timeout) AND
// on malformed JSON, falling back across models.
async function generateAnalysis(parts) {
  let lastErr
  for (const model of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = await ai.models.generateContent({
          model,
          contents: createUserContent(parts),
          config: GEN_CONFIG,
        })
        const analysis = parseJson(resp.text) // throws -> retried
        return { analysis, modelUsed: model }
      } catch (e) {
        lastErr = e
        const transient =
          e instanceof SyntaxError ||
          /503|UNAVAILABLE|overloaded|high demand|504|deadline|timeout|429|RESOURCE_EXHAUSTED|quota/i.test(e?.message || '')
        if (!transient) throw e
        await sleep(1000 * 2 ** attempt) // 1s, 2s, 4s
      }
    }
  }
  throw lastErr
}

const mimeByExt = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.flac': 'audio/flac',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const app = express()
app.use(cors({ origin: ALLOWED_ORIGIN.split(',').map((s) => s.trim()) }))
app.use(express.json({ limit: '2mb' }))
const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 80 * 1024 * 1024 } }) // 80 MB

// ── Health ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    credsConfigured: configured,
    mode,
    model: GEMINI_MODEL,
    project: GCP_PROJECT_ID || null,
    bucket: GCS_BUCKET || null,
  })
})

// ── Analyse a recording ───────────────────────────────────────────────
app.post('/api/analyze', upload.single('audio'), async (req, res) => {
  if (!configured) {
    return res.status(503).json({
      error: 'No Gemini provider configured. Set GEMINI_API_KEY (or Vertex creds) in server/.env and restart.',
    })
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded (form field name must be "audio").' })
  }

  const meta = {
    salesperson: req.body.salesperson || '',
    customer: req.body.customer || '',
    product: req.body.product || '',
    notes: req.body.notes || '',
  }
  const ext = path.extname(req.file.originalname).toLowerCase()
  const mimeType = mimeByExt[ext] || 'audio/mpeg'
  const id = randomUUID()

  try {
    let filePart
    let audioUri = null

    if (mode === 'apikey') {
      // Upload via the Gemini Files API and wait until it's ACTIVE.
      let f = await ai.files.upload({ file: req.file.path, config: { mimeType } })
      let tries = 0
      while (f.state === 'PROCESSING' && tries < 90) {
        await sleep(2000)
        f = await ai.files.get({ name: f.name })
        tries++
      }
      if (f.state === 'FAILED') throw new Error('Gemini could not process the audio file.')
      filePart = createPartFromUri(f.uri, f.mimeType || mimeType)
      audioUri = f.uri
    } else {
      // Vertex: stage the file in Cloud Storage, reference its gs:// URI.
      const destination = `calls/${id}${ext || '.mp3'}`
      await storage.bucket(GCS_BUCKET).upload(req.file.path, { destination, metadata: { contentType: mimeType } })
      audioUri = `gs://${GCS_BUCKET}/${destination}`
      filePart = createPartFromUri(audioUri, mimeType)
    }

    const { analysis, modelUsed } = await generateAnalysis([filePart, buildUserInstruction(meta)])

    const record = {
      id,
      createdAt: new Date().toISOString(),
      meta,
      fileName: req.file.originalname,
      audioUri,
      mode,
      modelUsed,
      analysis,
    }

    // Persist locally (history) ...
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(path.join(DATA_DIR, `${id}.json`), JSON.stringify(record))
    // ... and to GCS too when running on Vertex.
    if (mode === 'vertex' && storage && GCS_BUCKET) {
      try {
        await storage.bucket(GCS_BUCKET).file(`analyses/${id}.json`).save(JSON.stringify(record), {
          contentType: 'application/json',
        })
      } catch {
        /* non-fatal */
      }
    }

    res.json(record)
  } catch (err) {
    console.error('[analyze] error:', err)
    res.status(500).json({ error: err?.message || 'Analysis failed.' })
  } finally {
    fs.unlink(req.file.path).catch(() => {})
  }
})

// ── List past analyses (most recent first) ────────────────────────────
app.get('/api/analyses', async (_req, res) => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const files = (await fs.readdir(DATA_DIR)).filter((f) => f.endsWith('.json'))
    const items = await Promise.all(
      files.map(async (f) => {
        const r = JSON.parse(await fs.readFile(path.join(DATA_DIR, f), 'utf8'))
        return {
          id: r.id,
          createdAt: r.createdAt,
          meta: r.meta,
          fileName: r.fileName,
          scores: r.analysis?.scores,
          overall: r.analysis?.sentiment?.overall,
        }
      })
    )
    items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    res.json({ items: items.slice(0, 50) })
  } catch (err) {
    console.error('[analyses] error:', err)
    res.status(500).json({ error: err?.message })
  }
})

// ── Fetch one full analysis ───────────────────────────────────────────
app.get('/api/analyses/:id', async (req, res) => {
  try {
    const r = JSON.parse(await fs.readFile(path.join(DATA_DIR, `${req.params.id}.json`), 'utf8'))
    res.json(r)
  } catch {
    res.status(404).json({ error: 'Analysis not found.' })
  }
})

app.listen(PORT, () => {
  console.log(`▸ R Angle Call-Analysis API on http://localhost:${PORT}`)
  console.log(`  provider mode: ${mode || 'NONE — set GEMINI_API_KEY in server/.env'}`)
  console.log(`  model: ${GEMINI_MODEL}`)
})
