// =====================================================================
// R Angle — Call Analysis API
// Upload a call recording -> store in Cloud Storage -> analyse with
// Vertex AI Gemini -> return + persist a structured report.
// =====================================================================
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { Storage } from '@google-cloud/storage'
import { VertexAI } from '@google-cloud/vertexai'
import { analysisSchema } from './schema.js'
import { SYSTEM_INSTRUCTION, buildUserInstruction } from './prompt.js'

const {
  PORT = 8787,
  GCP_PROJECT_ID,
  GCP_LOCATION = 'us-central1',
  GCS_BUCKET,
  GEMINI_MODEL = 'gemini-2.5-flash',
  ALLOWED_ORIGIN = 'http://localhost:5173',
} = process.env

// We need a project, a bucket, and credentials on disk to go live.
const credsConfigured = Boolean(
  GCP_PROJECT_ID && GCS_BUCKET && process.env.GOOGLE_APPLICATION_CREDENTIALS
)

const app = express()
app.use(cors({ origin: ALLOWED_ORIGIN.split(',').map((s) => s.trim()) }))
app.use(express.json({ limit: '2mb' }))

const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 80 * 1024 * 1024 } }) // 80 MB

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

let storage
let vertex
if (credsConfigured) {
  storage = new Storage({ projectId: GCP_PROJECT_ID })
  vertex = new VertexAI({ project: GCP_PROJECT_ID, location: GCP_LOCATION })
}

// ── Health: lets the dashboard show a "setup pending" banner ──────────
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    credsConfigured,
    project: GCP_PROJECT_ID || null,
    bucket: GCS_BUCKET || null,
    model: GEMINI_MODEL,
  })
})

// ── Analyse a recording ───────────────────────────────────────────────
app.post('/api/analyze', upload.single('audio'), async (req, res) => {
  if (!credsConfigured) {
    return res.status(503).json({
      error:
        'GCP credentials not configured. Fill server/.env (see server/.env.example) and restart the API.',
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
  const destination = `calls/${id}${ext || '.mp3'}`

  try {
    // 1) Upload the recording to Cloud Storage
    await storage.bucket(GCS_BUCKET).upload(req.file.path, {
      destination,
      metadata: { contentType: mimeType },
    })
    const gsUri = `gs://${GCS_BUCKET}/${destination}`

    // 2) Ask Gemini to analyse the audio directly (no separate STT needed)
    const model = vertex.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
    })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { fileData: { fileUri: gsUri, mimeType } },
            { text: buildUserInstruction(meta) },
          ],
        },
      ],
    })

    const raw = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    let analysis
    try {
      analysis = JSON.parse(raw)
    } catch {
      return res.status(502).json({ error: 'Gemini returned malformed JSON.', raw })
    }

    const record = {
      id,
      createdAt: new Date().toISOString(),
      meta,
      fileName: req.file.originalname,
      audioUri: gsUri,
      analysis,
    }

    // 3) Persist the structured analysis next to the recording
    await storage
      .bucket(GCS_BUCKET)
      .file(`analyses/${id}.json`)
      .save(JSON.stringify(record), { contentType: 'application/json' })

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
  if (!credsConfigured) return res.json({ items: [] })
  try {
    const [files] = await storage.bucket(GCS_BUCKET).getFiles({ prefix: 'analyses/' })
    const items = await Promise.all(
      files.map(async (f) => {
        const [buf] = await f.download()
        const r = JSON.parse(buf.toString())
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
  if (!credsConfigured) return res.status(503).json({ error: 'Not configured.' })
  try {
    const [buf] = await storage.bucket(GCS_BUCKET).file(`analyses/${req.params.id}.json`).download()
    res.json(JSON.parse(buf.toString()))
  } catch {
    res.status(404).json({ error: 'Analysis not found.' })
  }
})

app.listen(PORT, () => {
  console.log(`▸ R Angle Call-Analysis API listening on http://localhost:${PORT}`)
  console.log(`  credentials configured: ${credsConfigured}`)
  if (!credsConfigured) {
    console.log('  → Fill server/.env (copy from server/.env.example) to enable Gemini.')
  }
})
