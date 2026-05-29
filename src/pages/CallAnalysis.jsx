import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud,
  FileAudio,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Quote,
  Smile,
  Target,
  Activity,
  Gauge,
  GraduationCap,
  Lightbulb,
  Clock,
  RotateCcw,
  Languages,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  PageHeader,
  Badge,
  SentimentBadge,
  ProgressRing,
  MotionItem,
} from '../components/ui'
import SentimentMeter from '../components/SentimentMeter'
import { cx, scoreHex, sentimentColor } from '../lib/utils'
import { ANALYSIS_API } from '../lib/config'

const ACCEPT = '.mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.mp4,.webm,audio/*'

export default function CallAnalysis() {
  const [health, setHealth] = useState(null)
  const [file, setFile] = useState(null)
  const [meta, setMeta] = useState({ salesperson: '', customer: '', product: '', notes: '' })
  const [status, setStatus] = useState('idle') // idle | analyzing | done | error
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    fetch(`${ANALYSIS_API}/api/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false, credsConfigured: false, offline: true }))
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadHistory() {
    fetch(`${ANALYSIS_API}/api/analyses`)
      .then((r) => r.json())
      .then((d) => setHistory(d.items || []))
      .catch(() => {})
  }

  function pickFile(f) {
    if (!f) return
    setFile(f)
    setStatus('idle')
    setError('')
  }

  async function analyze() {
    if (!file) return
    setStatus('analyzing')
    setError('')
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('audio', file)
      Object.entries(meta).forEach(([k, v]) => fd.append(k, v))
      const res = await fetch(`${ANALYSIS_API}/api/analyze`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed.')
      setResult(data)
      setStatus('done')
      loadHistory()
    } catch (e) {
      setError(e.message || 'Something went wrong.')
      setStatus('error')
    }
  }

  function reset() {
    setFile(null)
    setResult(null)
    setStatus('idle')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function openHistory(id) {
    try {
      const res = await fetch(`${ANALYSIS_API}/api/analyses/${id}`)
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setStatus('done')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch {
      /* ignore */
    }
  }

  const notConfigured = health && !health.credsConfigured

  return (
    <div className="space-y-6">
      <PageHeader
        title="Call Analysis"
        subtitle="Upload a recording — AI produces a full transcript, sentiment, emotion, intent & coaching report"
      >
        <Badge color="teal" dot="bg-accent">Powered by AI</Badge>
      </PageHeader>

      {/* Setup banner */}
      {notConfigured && (
        <MotionItem>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="text-neutral shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-ink-700">
              <span className="font-semibold text-ink-900">Backend not yet connected to Google Cloud.</span>{' '}
              {health.offline
                ? 'The analysis API is not running. Start it with: cd server && npm run dev'
                : 'Add your Vertex AI credentials in server/.env (see server/.env.example), then restart the API.'}{' '}
              Until then, uploads can’t be analysed.
            </div>
          </div>
        </MotionItem>
      )}

      {/* Uploader */}
      <MotionItem delay={0.04}>
        <Card className="p-6">
          <CardHeader title="New Analysis" subtitle="Audio (mp3, wav, m4a…) or mp4 video" icon={UploadCloud} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                pickFile(e.dataTransfer.files?.[0])
              }}
              onClick={() => inputRef.current?.click()}
              className={cx(
                'lg:col-span-2 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition',
                dragOver ? 'border-accent bg-emerald-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-700">
                    <FileAudio size={24} />
                  </span>
                  <div className="font-semibold text-ink-900">{file.name}</div>
                  <div className="text-xs text-ink-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB · click to replace
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-slate-100 text-ink-400">
                    <UploadCloud size={24} />
                  </span>
                  <div className="font-semibold text-ink-900">Drop a call recording here</div>
                  <div className="text-xs text-ink-400">or click to browse</div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <Field label="Salesperson" value={meta.salesperson} onChange={(v) => setMeta({ ...meta, salesperson: v })} placeholder="e.g. Pratik" />
              <Field label="Customer / Prospect" value={meta.customer} onChange={(v) => setMeta({ ...meta, customer: v })} placeholder="e.g. Mr. Sharma" />
              <Field label="Product pitched" value={meta.product} onChange={(v) => setMeta({ ...meta, product: v })} placeholder="e.g. AI consulting" />
              <button
                onClick={analyze}
                disabled={!file || status === 'analyzing' || notConfigured}
                className={cx(
                  'w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition',
                  !file || status === 'analyzing' || notConfigured
                    ? 'bg-slate-200 text-ink-400 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent-dark shadow-soft'
                )}
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Analysing…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Analyse call
                  </>
                )}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-negative flex items-center gap-2">
              <XCircle size={16} /> {error}
            </div>
          )}
        </Card>
      </MotionItem>

      {/* Analysing shimmer */}
      <AnimatePresence>
        {status === 'analyzing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="p-8 text-center">
              <Loader2 size={28} className="mx-auto animate-spin text-accent" />
              <div className="mt-3 font-semibold text-ink-900">AI is listening to the call…</div>
              <div className="text-sm text-ink-400 mt-1">
                Transcribing, scoring sentiment & emotion, and writing coaching notes. This can take 20–60s.
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {status === 'done' && result?.analysis && (
        <Results record={result} onReset={reset} />
      )}

      {/* History */}
      {history.length > 0 && (
        <MotionItem delay={0.06}>
          <Card className="p-6">
            <CardHeader title="Past Analyses" subtitle="Stored in Google Cloud Storage" icon={Clock} />
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-ink-400 border-b border-slate-200">
                    <th className="text-left font-semibold px-3 py-2.5">Call</th>
                    <th className="text-left font-semibold px-3 py-2.5">Salesperson</th>
                    <th className="text-left font-semibold px-3 py-2.5">Overall</th>
                    <th className="text-center font-semibold px-3 py-2.5">Quality</th>
                    <th className="text-right font-semibold px-3 py-2.5">When</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr
                      key={h.id}
                      onClick={() => openHistory(h.id)}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="px-3 py-2.5 font-medium text-ink-900 max-w-[220px] truncate">{h.fileName}</td>
                      <td className="px-3 py-2.5 text-ink-600">{h.meta?.salesperson || '—'}</td>
                      <td className="px-3 py-2.5">
                        {h.overall?.label ? <SentimentBadge sentiment={h.overall.label} /> : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-center font-semibold" style={{ color: scoreHex((h.scores?.conversationQuality || 0)) }}>
                        {h.scores?.conversationQuality != null ? `${h.scores.conversationQuality}/10` : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-right text-ink-400 text-xs">
                        {h.createdAt ? new Date(h.createdAt).toLocaleString('en-IN') : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </MotionItem>
      )}
    </div>
  )
}

// =====================================================================
// Results renderer
// =====================================================================
function Results({ record, onReset }) {
  const a = record.analysis
  const s = a.scores || {}
  const overall = a.sentiment?.overall?.label || 'neutral'

  return (
    <div className="space-y-6">
      {/* header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <FileAudio size={16} className="text-brand-700" />
          <span className="font-semibold text-ink-900">{record.fileName}</span>
          {a.language && (
            <span className="inline-flex items-center gap-1 text-ink-400">
              <Languages size={13} /> {a.language}
            </span>
          )}
          {a.durationEstimate && <span className="text-ink-400">· {a.durationEstimate}</span>}
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-slate-200 text-ink-600 text-sm font-medium hover:text-ink-900 transition"
        >
          <RotateCcw size={14} /> New analysis
        </button>
      </div>

      {/* Summary + scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MotionItem className="lg:col-span-2">
          <Card className="p-6 h-full">
            <CardHeader title="Overall Sentiment" subtitle={a.sentiment?.overall?.summary} icon={Activity} />
            <SentimentMeter sentiment={overall} />
            {a.summary && (
              <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-ink-600">
                {a.summary}
              </div>
            )}
          </Card>
        </MotionItem>

        <MotionItem delay={0.05}>
          <Card className="p-6 h-full">
            <CardHeader title="Scores" icon={Gauge} />
            <div className="grid grid-cols-2 gap-4">
              <ScoreRing label="Conversation" value={s.conversationQuality} />
              <ScoreRing label="Salesperson" value={s.salespersonPerformance} />
              <ScoreRing label="Other party" value={s.receiverProfessionalism} />
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-3">
                <div className="text-[11px] uppercase tracking-wide text-ink-400 font-semibold text-center">Objective met?</div>
                {s.objectiveResolved == null ? (
                  <span className="text-ink-400 mt-1">—</span>
                ) : s.objectiveResolved ? (
                  <span className="inline-flex items-center gap-1 mt-1 text-positive font-bold"><CheckCircle2 size={18} /> Yes</span>
                ) : (
                  <span className="inline-flex items-center gap-1 mt-1 text-negative font-bold"><XCircle size={18} /> No</span>
                )}
              </div>
            </div>
            {(s.conversationQualityReason || s.objectiveResolvedReason) && (
              <p className="mt-3 text-xs text-ink-500 leading-snug">
                {s.conversationQualityReason} {s.objectiveResolvedReason}
              </p>
            )}
          </Card>
        </MotionItem>
      </div>

      {/* Tone + Sentiment journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {a.toneAnalysis?.length > 0 && (
          <MotionItem delay={0.05}>
            <Card className="p-6 h-full">
              <CardHeader title="Tone Analysis" icon={Smile} />
              <div className="space-y-3">
                {a.toneAnalysis.map((t, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink-900 text-sm">{t.speaker}</span>
                      <Badge color="brand">{t.tone}</Badge>
                    </div>
                    <p className="text-xs text-ink-600 mt-1.5 leading-snug">{t.analysis}</p>
                  </div>
                ))}
                {a.toneShifts?.length > 0 && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <div className="text-xs font-semibold text-neutral mb-1">Tone shifts</div>
                    {a.toneShifts.map((sh, i) => (
                      <p key={i} className="text-xs text-ink-600 leading-snug">
                        <span className="font-semibold text-ink-900">{sh.moment}:</span> {sh.description}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </MotionItem>
        )}

        {a.sentiment && (
          <MotionItem delay={0.08}>
            <Card className="p-6 h-full">
              <CardHeader title="Sentiment Journey" subtitle="Start → middle → end" icon={Activity} />
              <Journey title="Caller / Salesperson" data={a.sentiment.caller} />
              <Journey title="Receiver / Customer" data={a.sentiment.receiver} className="mt-4" />
            </Card>
          </MotionItem>
        )}
      </div>

      {/* Emotion + Intent + Mood */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {a.emotionalExpression && (
          <MotionItem delay={0.05}>
            <Card className="p-6 h-full">
              <CardHeader title="Emotional Expression" icon={Smile} />
              <EmotionList title="Caller" items={a.emotionalExpression.caller} />
              <EmotionList title="Receiver" items={a.emotionalExpression.receiver} className="mt-3" />
              {a.emotionalExpression.turningPoint && (
                <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3">
                  <div className="text-xs font-semibold text-negative">Emotional turning point</div>
                  <p className="text-xs text-ink-600 mt-1 leading-snug">{a.emotionalExpression.turningPoint}</p>
                </div>
              )}
            </Card>
          </MotionItem>
        )}

        {a.intent && (
          <MotionItem delay={0.08}>
            <Card className="p-6 h-full">
              <CardHeader title="Intent Detection" icon={Target} />
              <InfoBlock label="Caller — primary" value={a.intent.callerPrimary} />
              <InfoBlock label="Caller — secondary" value={a.intent.callerSecondary} className="mt-3" />
              <InfoBlock label="Receiver" value={a.intent.receiver} className="mt-3" />
            </Card>
          </MotionItem>
        )}

        {a.mood && (
          <MotionItem delay={0.1}>
            <Card className="p-6 h-full">
              <CardHeader title="Mood Assessment" icon={Activity} />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Mood label="Caller · start" value={a.mood.startCaller} />
                <Mood label="Receiver · start" value={a.mood.startReceiver} />
                <Mood label="Caller · end" value={a.mood.endCaller} />
                <Mood label="Receiver · end" value={a.mood.endReceiver} />
              </div>
              {a.mood.trajectory && (
                <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-ink-600 leading-snug">
                  <span className="font-semibold text-ink-900">Trajectory: </span>{a.mood.trajectory}
                </div>
              )}
            </Card>
          </MotionItem>
        )}
      </div>

      {/* Pauses & stress */}
      {(a.pauses?.length > 0 || a.stressIndicators) && (
        <MotionItem delay={0.05}>
          <Card className="p-6">
            <CardHeader title="Pauses & Stress Signals" icon={Clock} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {a.stressIndicators && (
                <div className="space-y-2">
                  <InfoBlock label="Caller stress signals" value={a.stressIndicators.caller} />
                  <InfoBlock label="Receiver stress signals" value={a.stressIndicators.receiver} />
                </div>
              )}
              {a.pauses?.length > 0 && (
                <div className="space-y-2">
                  {a.pauses.map((p, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-3 text-xs">
                      <span className="font-semibold text-ink-900">{p.location}</span>
                      <span className="text-ink-600"> — {p.note} {p.interpretation && `(${p.interpretation})`}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </MotionItem>
      )}

      {/* Insights + recommendations + training */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {a.insights?.length > 0 && (
          <MotionItem delay={0.05}>
            <Card className="p-6 h-full">
              <CardHeader title="Key Insights" icon={Lightbulb} />
              <ul className="space-y-2">
                {a.insights.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                    <span className="grid place-items-center w-5 h-5 rounded-md bg-amber-100 text-neutral text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {ins}
                  </li>
                ))}
              </ul>
            </Card>
          </MotionItem>
        )}

        {a.recommendations?.length > 0 && (
          <MotionItem delay={0.08}>
            <Card className="p-6 h-full">
              <CardHeader title="Recommendations" icon={CheckCircle2} />
              <div className="space-y-2">
                {a.recommendations.map((r, i) => (
                  <div key={i} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="text-sm font-semibold text-positive">{r.title}</div>
                    {r.detail && <p className="text-xs text-ink-600 mt-1 leading-snug">{r.detail}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </MotionItem>
        )}
      </div>

      {/* Training script — the coaching payoff */}
      {a.trainingScript?.length > 0 && (
        <MotionItem delay={0.05}>
          <Card className="p-6 bg-gradient-to-br from-brand-50/60 to-white border-brand-200">
            <CardHeader
              title="Coaching Script — say it like the founder"
              subtitle="Ready-to-use lines to train the team"
              icon={GraduationCap}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {a.trainingScript.map((line, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl bg-white border border-slate-200 p-3">
                  <Quote size={15} className="text-accent-dark shrink-0 mt-0.5" />
                  <span className="text-sm text-ink-900 leading-snug">{line}</span>
                </div>
              ))}
            </div>
          </Card>
        </MotionItem>
      )}

      {/* Transcript */}
      {a.transcript?.length > 0 && (
        <MotionItem delay={0.05}>
          <Card className="p-6">
            <CardHeader title="Transcript" subtitle="Diarised · sentiment-tagged · punctuation preserved" icon={Quote} />
            <div className="space-y-3">
              {a.transcript.map((t, i) => {
                const c = sentimentColor[t.sentiment] || sentimentColor.neutral
                const isRep = t.role === 'salesperson'
                return (
                  <div key={i} className={cx('flex', isRep ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cx('max-w-[80%] rounded-2xl px-4 py-2.5 border-l-4', isRep ? 'bg-brand-50' : 'bg-slate-50')}
                      style={{ borderLeftColor: c.hex }}
                    >
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[11px] font-bold text-ink-700">{t.speaker}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: c.hex }}>
                          {c.label}
                        </span>
                        {t.emotion && <Badge color="slate" className="!py-0">{t.emotion}</Badge>}
                      </div>
                      <p className="text-sm text-ink-900 leading-snug">{t.text}</p>
                      {t.pause && <p className="text-[11px] text-ink-400 italic mt-1">⏸ {t.pause}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </MotionItem>
      )}
    </div>
  )
}

// ── small helpers ─────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full h-9 rounded-lg border border-slate-200 px-3 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </label>
  )
}

function ScoreRing({ label, value }) {
  const v = value ?? 0
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 p-2">
      <ProgressRing value={v} max={10} size={78} stroke={8} color={scoreHex(v)}>
        <div className="text-base font-bold" style={{ color: scoreHex(v) }}>
          {value != null ? value : '—'}
        </div>
      </ProgressRing>
      <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold mt-1 text-center">{label}</div>
    </div>
  )
}

function Journey({ title, data, className }) {
  if (!data) return null
  const stages = [
    { k: 'start', label: 'Start' },
    { k: 'middle', label: 'Middle' },
    { k: 'end', label: 'End' },
  ]
  return (
    <div className={className}>
      <div className="text-xs font-semibold text-ink-900 mb-1.5">{title}</div>
      <div className="grid grid-cols-3 gap-2">
        {stages.map((st) => (
          <div key={st.k} className="rounded-lg bg-slate-50 border border-slate-200 p-2">
            <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">{st.label}</div>
            <div className="text-xs text-ink-700 mt-0.5 leading-snug">{data[st.k] || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmotionList({ title, items, className }) {
  if (!items?.length) return null
  return (
    <div className={className}>
      <div className="text-xs font-semibold text-ink-900 mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((e, i) => (
          <span key={i} title={e.evidence} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-ink-700 border border-slate-200">
            {e.emotion}
          </span>
        ))}
      </div>
    </div>
  )
}

function InfoBlock({ label, value, className }) {
  return (
    <div className={cx('rounded-xl border border-slate-200 p-3', className)}>
      <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">{label}</div>
      <div className="text-sm text-ink-800 mt-0.5 leading-snug">{value || '—'}</div>
    </div>
  )
}

function Mood({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
      <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">{label}</div>
      <div className="text-ink-700 mt-0.5 leading-snug">{value || '—'}</div>
    </div>
  )
}
