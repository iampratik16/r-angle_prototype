import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  ShieldAlert,
  Trophy,
  Mic,
} from 'lucide-react'
import { ProgressRing, Badge } from './ui'
import { pitchTrackerDemo } from '../data/mockData'
import { cx, scoreHex } from '../lib/utils'

// =====================================================================
// Interactive Pitch-Tracker Demo (presenter-controlled).
// For each AI-recommended phrase the presenter clicks whether the rep
// SPOKE it (GREEN box, score +delta) or SKIPPED it (RED box). The live
// Interest Score, compliance % and missed count update instantly; two
// misses trigger an escalation to the founder. Pure local state.
// =====================================================================
export default function PitchTrackerDemo() {
  const { customer, rep, startScore, steps, escalateAfterMisses } = pitchTrackerDemo

  const [idx, setIdx] = useState(0)
  const [events, setEvents] = useState([]) // { step, used, delta }
  const [score, setScore] = useState(startScore)
  const [pop, setPop] = useState(null)

  const finished = idx >= steps.length
  const current = finished ? null : steps[idx]
  const misses = events.filter((e) => !e.used).length
  const used = events.filter((e) => e.used).length
  const compliance = events.length ? Math.round((used / events.length) * 100) : 0
  const escalated = misses >= escalateAfterMisses

  function mark(didSpeak) {
    const step = steps[idx]
    const delta = didSpeak ? step.delta : 0
    setScore((s) => Math.max(0, Math.min(10, Math.round((s + delta) * 10) / 10)))
    setEvents((e) => [...e, { step, used: didSpeak, delta }])
    setPop({ used: didSpeak, delta, id: step.id })
    setIdx((i) => i + 1)
  }

  function reset() {
    setIdx(0)
    setEvents([])
    setScore(startScore)
    setPop(null)
  }

  return (
    <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50/60 to-white p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-700 text-white">
            <Zap size={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-ink-900">Interactive Pitch Tracker</h3>
              <Badge color="teal" dot="bg-accent">Live demo</Badge>
            </div>
            <p className="text-xs text-ink-400">
              Mark whether the rep spoke each recommended phrase — watch the score react in real time.
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-slate-200 text-ink-600 text-sm font-medium hover:text-ink-900 transition"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT — live score + context */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold mb-2 flex items-center gap-1">
              <Mic size={11} /> {rep.name} · {rep.role}
            </div>
            <div className="text-sm font-semibold text-ink-900">{customer.name}</div>
            <div className="text-[11px] text-ink-400 mt-0.5 leading-snug">{customer.note}</div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col items-center">
            <div className="relative">
              <ProgressRing value={score} max={10} size={132} stroke={12}>
                <div className="text-center">
                  <motion.div
                    key={score}
                    initial={{ scale: 0.85 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-extrabold"
                    style={{ color: scoreHex(score) }}
                  >
                    {score.toFixed(1)}
                  </motion.div>
                  <div className="text-[10px] text-ink-400">interest / 10</div>
                </div>
              </ProgressRing>
              <AnimatePresence>
                {pop && (
                  <motion.div
                    key={pop.id}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -26 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={() => setPop(null)}
                    className={cx(
                      'absolute top-1 right-2 text-sm font-bold px-2 py-0.5 rounded-full',
                      pop.used ? 'text-positive bg-emerald-50' : 'text-negative bg-red-50'
                    )}
                  >
                    {pop.used ? `+${pop.delta.toFixed(1)}` : 'missed'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-3">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-center">
                <div className="text-lg font-bold text-positive">{compliance}%</div>
                <div className="text-[10px] text-ink-500">compliance</div>
              </div>
              <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-center">
                <div className="text-lg font-bold text-negative">{misses}</div>
                <div className="text-[10px] text-ink-500">missed</div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — current recommendation / buttons / summary */}
        <div className="lg:col-span-2 flex flex-col">
          {/* progress dots */}
          <div className="flex items-center gap-1.5 mb-3">
            {steps.map((s, i) => {
              const ev = events[i]
              return (
                <div
                  key={s.id}
                  className={cx(
                    'h-1.5 flex-1 rounded-full',
                    ev ? (ev.used ? 'bg-positive' : 'bg-negative') : i === idx ? 'bg-brand-400' : 'bg-slate-200'
                  )}
                />
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="rounded-xl bg-white border border-slate-200 p-5 flex-1"
              >
                <div className="flex items-center gap-2 text-xs text-ink-400">
                  <span className="font-semibold text-brand-700">Step {idx + 1}/{steps.length}</span>
                  <span>·</span>
                  <span>{current.cue}</span>
                </div>
                <div className="mt-3 flex items-start gap-2.5">
                  <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand-50 text-brand-700 shrink-0">
                    <Zap size={15} />
                  </span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">
                      AI recommends ({current.trigger})
                    </div>
                    <p className="text-base font-medium text-ink-900 leading-snug mt-0.5">
                      “{current.phrase}”
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <Badge color="brand">{current.usp}</Badge>
                      <span className="text-positive font-semibold">+{current.delta.toFixed(1)} if spoken</span>
                    </div>
                  </div>
                </div>

                {/* The two demo buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() => mark(true)}
                    className="group flex items-center justify-center gap-2 h-12 rounded-xl bg-positive text-white font-semibold shadow-soft hover:brightness-110 transition"
                  >
                    <CheckCircle2 size={18} /> Rep spoke this phrase
                  </button>
                  <button
                    onClick={() => mark(false)}
                    className="group flex items-center justify-center gap-2 h-12 rounded-xl bg-white border-2 border-red-300 text-negative font-semibold hover:bg-red-50 transition"
                  >
                    <XCircle size={18} /> Rep skipped it
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white border border-slate-200 p-5 flex-1"
              >
                <div className="flex items-center gap-2 text-positive font-bold">
                  <Trophy size={18} /> Call complete
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <Summary label="Final score" value={score.toFixed(1)} color={scoreHex(score)} />
                  <Summary label="Compliance" value={`${compliance}%`} color="#16A34A" />
                  <Summary label="Phrases missed" value={misses} color={misses ? '#DC2626' : '#94A3B8'} />
                </div>
                <p className="text-sm text-ink-600 mt-4">
                  {misses === 0
                    ? 'Perfect run — every recommended phrase was spoken. Interest score and conversion probability maxed out.'
                    : `The rep went off-script ${misses} time${misses > 1 ? 's' : ''}. Each miss is logged against their compliance score and ISM.`}
                </p>
                <button
                  onClick={reset}
                  className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition"
                >
                  <RotateCcw size={15} /> Run the demo again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event log: green / red boxes */}
          {events.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">
                Guidance log
              </div>
              <AnimatePresence initial={false}>
                {events.map((e, i) => (
                  <motion.div
                    key={e.step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cx(
                      'flex items-center gap-3 rounded-lg border px-3 py-2',
                      e.used ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                    )}
                  >
                    {e.used ? (
                      <CheckCircle2 size={16} className="text-positive shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-negative shrink-0" />
                    )}
                    <span className="text-xs text-ink-700 flex-1 truncate">{e.step.usp}</span>
                    <span className={cx('text-xs font-bold', e.used ? 'text-positive' : 'text-negative')}>
                      {e.used ? `+${e.delta.toFixed(1)}` : 'missed'}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Escalation */}
          <AnimatePresence>
            {escalated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 rounded-xl bg-gradient-to-br from-brand-800 to-brand-600 text-white p-4 live-pulse"
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <ShieldAlert size={16} className="text-accent-light" /> Escalation triggered
                </div>
                <p className="text-xs text-white/80 mt-1.5 leading-snug">
                  Rep went off-script {misses} times → routing to{' '}
                  <span className="font-semibold text-white">Ar. Ratan Agarwal (Founder)</span> —
                  premium opportunity protected.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Summary({ label, value, color }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 text-center">
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[11px] text-ink-400">{label}</div>
    </div>
  )
}
