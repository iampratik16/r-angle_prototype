import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Phone,
  User,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Gauge,
  Zap,
} from 'lucide-react'
import { Card, CardHeader, Badge, ProgressRing, MiniSparkline } from '../components/ui'
import SentimentMeter from '../components/SentimentMeter'
import { liveCall, otherCalls } from '../data/mockData'
import { cx, mmss, sentimentColor, scoreHex } from '../lib/utils'

const STEP_MS = 2600 // base cadence between transcript turns

export default function Live() {
  // ---------------- simulation state ----------------
  const [turnIdx, setTurnIdx] = useState(-1) // index of last revealed turn
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [score, setScore] = useState(liveCall.startScore)
  const [sentiment, setSentiment] = useState('neutral')
  const [history, setHistory] = useState([liveCall.startScore]) // sentiment/score sparkline
  const [duration, setDuration] = useState(0) // seconds
  const [guidance, setGuidance] = useState(null) // current AI guidance card
  const [scorePop, setScorePop] = useState(null) // {delta, id}
  const [routedSenior, setRoutedSenior] = useState(false)
  const [escalated, setEscalated] = useState(false)
  const [toast, setToast] = useState(null)

  const transcript = liveCall.transcript
  const finished = turnIdx >= transcript.length - 1
  const feedRef = useRef(null)
  const tickRef = useRef(null)
  const durRef = useRef(null)

  // ---------------- advance one turn ----------------
  const advance = useCallback(() => {
    setTurnIdx((prev) => {
      const next = prev + 1
      if (next >= transcript.length) {
        setPlaying(false)
        return prev
      }
      const turn = transcript[next]

      // sentiment meter + timeline
      setSentiment(turn.sentiment)

      // score update with pop animation
      setScore((s) => {
        const updated = Math.max(0, Math.min(10, Math.round((s + turn.scoreDelta) * 10) / 10))
        setHistory((h) => [...h, updated])
        // routing flip when crossing 5
        if (updated > 5) setRoutedSenior(true)
        return updated
      })
      if (turn.scoreDelta !== 0) {
        setScorePop({ delta: turn.scoreDelta, id: turn.id })
      }

      // guidance event
      if (turn.guidance) {
        setGuidance({ ...turn.guidance, id: turn.id })
      }

      // escalation
      if (turn.escalation) {
        setEscalated(true)
        setToast({
          id: turn.id,
          text: 'Escalating to Ar. Ratan Agarwal (Founder) — premium opportunity protected.',
        })
      }

      return next
    })
  }, [transcript])

  // ---------------- play / pause timer ----------------
  useEffect(() => {
    if (!playing) return
    tickRef.current = setInterval(advance, STEP_MS / speed)
    return () => clearInterval(tickRef.current)
  }, [playing, speed, advance])

  // stop when finished
  useEffect(() => {
    if (finished && playing) setPlaying(false)
  }, [finished, playing])

  // ---------------- duration ticker ----------------
  useEffect(() => {
    if (!playing) return
    durRef.current = setInterval(() => setDuration((d) => d + 1), 1000 / speed)
    return () => clearInterval(durRef.current)
  }, [playing, speed])

  // auto-scroll transcript
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [turnIdx])

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4200)
    return () => clearTimeout(t)
  }, [toast])

  // ---------------- controls ----------------
  function restart() {
    clearInterval(tickRef.current)
    clearInterval(durRef.current)
    setPlaying(false)
    setTurnIdx(-1)
    setScore(liveCall.startScore)
    setSentiment('neutral')
    setHistory([liveCall.startScore])
    setDuration(0)
    setGuidance(null)
    setScorePop(null)
    setRoutedSenior(false)
    setEscalated(false)
    setToast(null)
  }

  const started = turnIdx >= 0
  const visibleTurns = transcript.slice(0, turnIdx + 1)

  return (
    <div className="space-y-5">
      {/* Header + controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
              Live Call Monitoring
            </h1>
            <p className="text-sm text-ink-600">Real-time sentiment, intent scoring & AI pitch guidance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!playing ? (
            <button
              onClick={() => (finished ? restart() : setPlaying(true))}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-accent text-white font-semibold text-sm shadow-soft hover:bg-accent-dark transition"
            >
              <Play size={16} fill="currentColor" />
              {started ? (finished ? 'Replay call' : 'Resume') : 'Simulate live call'}
            </button>
          ) : (
            <button
              onClick={() => setPlaying(false)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-brand-700 text-white font-semibold text-sm shadow-soft hover:bg-brand-800 transition"
            >
              <Pause size={16} fill="currentColor" /> Pause
            </button>
          )}
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-white border border-slate-200 text-ink-600 font-medium text-sm hover:text-ink-900 transition"
          >
            <RotateCcw size={15} /> Restart
          </button>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={cx(
                  'px-2.5 h-8 rounded-lg text-xs font-semibold transition',
                  speed === s ? 'bg-white text-brand-800 shadow-sm' : 'text-ink-600'
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-zone cockpit */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT — context */}
        <div className="xl:col-span-3 space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink-400 font-semibold mb-3">
              <Phone size={13} /> Active Customer
            </div>
            <div className="text-lg font-bold text-ink-900 leading-tight">{liveCall.customer.name}</div>
            <div className="text-xs text-ink-400 mt-1">{liveCall.customer.note}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge color="red" dot="bg-red-500">{liveCall.customer.icpTier} ICP</Badge>
              <Badge color="brand">{liveCall.customer.source}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <MiniStat label="Budget" value={liveCall.customer.budget} />
              <MiniStat label="Stage" value={liveCall.customer.stage} />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink-400 font-semibold mb-3">
              <User size={13} /> Sales Rep
            </div>
            <div className="flex items-center gap-3">
              <div className="grid place-items-center w-10 h-10 rounded-full bg-brand-700 text-white font-bold text-sm">PS</div>
              <div>
                <div className="font-semibold text-ink-900">{liveCall.rep.name}</div>
                <div className="text-xs text-ink-400">{liveCall.rep.role}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-600">Compliance today</span>
                <span className="font-semibold text-ink-900">{liveCall.rep.complianceToday}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${liveCall.rep.complianceToday}%` }} />
              </div>
            </div>
          </Card>

          {/* Duration */}
          <Card className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-wide text-ink-400 font-semibold">
              <Clock size={13} /> Call Duration
            </div>
            <div className="text-4xl font-bold text-ink-900 tnum mt-2">{mmss(duration)}</div>
            <div className="text-[11px] text-ink-400 mt-1 leading-snug">
              Engagement signal: longer call → higher interest
            </div>
          </Card>

          {/* Other active calls */}
          <Card className="p-5">
            <div className="text-[11px] uppercase tracking-wide text-ink-400 font-semibold mb-3">
              Other active calls ({otherCalls.length})
            </div>
            <div className="space-y-2">
              {otherCalls.map((c) => {
                const sc = sentimentColor[c.sentiment]
                return (
                  <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200">
                    <span className={cx('w-2 h-2 rounded-full', sc.bg)} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink-900 truncate">{c.customer}</div>
                      <div className="text-[11px] text-ink-400 truncate">{c.rep} · {c.duration}</div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: scoreHex(c.score) }}>{c.score}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* CENTER — sentiment + transcript */}
        <div className="xl:col-span-6 space-y-5">
          <Card className="p-6">
            <SentimentMeter sentiment={sentiment} />
            {/* sentiment/score timeline */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wide text-ink-400 font-semibold">
                  Sentiment & score timeline
                </span>
                <span className="text-xs text-ink-400">{history.length - 1} turns</span>
              </div>
              <div className="h-12">
                {history.length > 1 ? (
                  <MiniSparkline points={history} width={560} height={48} color="#02C39A" />
                ) : (
                  <div className="h-full grid place-items-center text-xs text-ink-400">
                    Press “Simulate live call” to begin
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Transcript */}
          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-900">Live Transcript</span>
              {playing && (
                <span className="flex items-center gap-1.5 text-xs text-negative font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulseDot" /> recording
                </span>
              )}
            </div>
            <div ref={feedRef} className="h-[360px] overflow-y-auto px-5 py-4 space-y-3 scroll-smooth">
              {!started && (
                <div className="h-full grid place-items-center text-center text-sm text-ink-400">
                  <div>
                    <Phone size={28} className="mx-auto mb-2 text-slate-300" />
                    Transcript will stream here in real time.
                  </div>
                </div>
              )}
              <AnimatePresence initial={false}>
                {visibleTurns.map((t) => {
                  const c = sentimentColor[t.sentiment]
                  const isRep = t.speaker === 'rep'
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cx('flex', isRep ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cx(
                          'max-w-[78%] rounded-2xl px-4 py-2.5 border-l-4',
                          isRep ? 'bg-brand-50 rounded-tr-sm' : 'bg-slate-50 rounded-tl-sm'
                        )}
                        style={{ borderLeftColor: c.hex }}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cx('text-[11px] font-bold', isRep ? 'text-brand-700' : 'text-ink-600')}>
                            {isRep ? liveCall.rep.name : 'Customer'}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: c.hex }}>
                            {c.label}
                          </span>
                        </div>
                        <p className="text-sm text-ink-900 leading-snug">{t.text}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* RIGHT — score + guidance */}
        <div className="xl:col-span-3 space-y-5">
          {/* Live interest score */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink-400 font-semibold mb-3">
              <Gauge size={13} /> Live Interest Score
            </div>
            <div className="relative grid place-items-center">
              <ProgressRing value={score} max={10} size={150} stroke={13}>
                <div className="text-center">
                  <motion.div
                    key={score}
                    initial={{ scale: 0.85 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-extrabold"
                    style={{ color: scoreHex(score) }}
                  >
                    {score.toFixed(1)}
                  </motion.div>
                  <div className="text-[10px] text-ink-400 font-medium">/ 10.0</div>
                </div>
              </ProgressRing>
              {/* score pop */}
              <AnimatePresence>
                {scorePop && (
                  <motion.div
                    key={scorePop.id}
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -28, scale: 1 }}
                    exit={{ opacity: 0, y: -44 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={() => setScorePop(null)}
                    className={cx(
                      'absolute top-2 right-3 text-sm font-bold px-2 py-0.5 rounded-full',
                      scorePop.delta >= 0 ? 'text-positive bg-emerald-50' : 'text-negative bg-red-50'
                    )}
                  >
                    {scorePop.delta >= 0 ? '+' : ''}{scorePop.delta.toFixed(1)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Routing indicator */}
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold mb-1.5">Auto-routing</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={routedSenior ? 'senior' : 'rep'}
                  initial={{ opacity: 0, rotateX: -40 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  exit={{ opacity: 0, rotateX: 40 }}
                  className={cx(
                    'flex items-center gap-2 rounded-xl p-3 border',
                    routedSenior ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'
                  )}
                >
                  {routedSenior ? <TrendingUp size={16} className="text-accent-dark" /> : <User size={16} className="text-blue-700" />}
                  <div>
                    <div className="text-sm font-semibold text-ink-900">
                      {routedSenior ? 'Senior Team / Team Leader' : 'Sales Rep'}
                    </div>
                    <div className="text-[11px] text-ink-600">
                      {routedSenior ? 'Score crossed 5.0 ✓' : 'Below 5.0 threshold'}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>

          {/* AI pitch guidance */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink-400 font-semibold mb-3">
              <Zap size={13} /> AI Live Pitch Guidance
            </div>
            <AnimatePresence mode="wait">
              {guidance ? (
                <GuidanceCard key={guidance.id} guidance={guidance} />
              ) : (
                <div key="idle" className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-ink-400">
                  AI suggestions will appear here during the call.
                </div>
              )}
            </AnimatePresence>

            {/* Escalation banner */}
            <AnimatePresence>
              {escalated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 rounded-xl bg-gradient-to-br from-brand-800 to-brand-600 text-white p-4 live-pulse"
                >
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <ShieldAlert size={16} className="text-accent-light" /> Escalation triggered
                  </div>
                  <p className="text-xs text-white/80 mt-1.5 leading-snug">
                    Routing to <span className="font-semibold text-white">Ar. Ratan Agarwal (Founder)</span> —
                    premium opportunity protected. Zero loss of high-value leads.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 bg-brand-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10"
          >
            <ShieldAlert size={18} className="text-accent-light shrink-0" />
            <span className="text-sm font-medium">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">{label}</div>
      <div className="text-sm font-semibold text-ink-900 truncate">{value}</div>
    </div>
  )
}

function GuidanceCard({ guidance }) {
  const map = {
    green: {
      cls: 'bg-emerald-50 border-emerald-200',
      icon: <CheckCircle2 size={16} className="text-positive" />,
      title: '✓ Phrase used',
      titleCls: 'text-positive',
      tag: 'Score increased',
    },
    red: {
      cls: 'bg-red-50 border-red-200',
      icon: <XCircle size={16} className="text-negative" />,
      title: '✗ Suggested phrase not used',
      titleCls: 'text-negative',
      tag: 'Missed opportunity',
    },
    corrective: {
      cls: 'bg-amber-50 border-amber-300',
      icon: <AlertTriangle size={16} className="text-neutral" />,
      title: 'Corrective response',
      titleCls: 'text-neutral',
      tag: 'Negative sentiment detected',
    },
  }
  const m = map[guidance.type]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cx('rounded-xl border p-4', m.cls)}
    >
      <div className="flex items-center justify-between">
        <div className={cx('flex items-center gap-1.5 text-sm font-bold', m.titleCls)}>
          {m.icon} {m.title}
        </div>
      </div>
      <div className="mt-2 text-sm text-ink-900 leading-snug">
        {guidance.type === 'red' ? 'Recommended: ' : guidance.type === 'corrective' ? 'Suggest: ' : ''}
        <span className="font-medium">“{guidance.phrase}”</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <ArrowRight size={12} className="text-ink-400" />
        <span className="text-[11px] text-ink-600">{guidance.note}</span>
      </div>
    </motion.div>
  )
}
