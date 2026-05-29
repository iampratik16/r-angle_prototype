import { motion } from 'framer-motion'
import { sentimentColor } from '../lib/utils'

// =====================================================================
// SentimentMeter — the HERO visual (Section 8).
// A horizontal segmented gauge that glides between Negative ↔ Neutral ↔
// Positive in real time. `sentiment` sets the target position; framer
// animates the needle + the big label colour smoothly between turns.
// =====================================================================

// Map sentiment to a position on the 0..1 track.
const target = { negative: 0.16, neutral: 0.5, positive: 0.84 }

export default function SentimentMeter({ sentiment = 'neutral' }) {
  const pos = target[sentiment] ?? 0.5
  const c = sentimentColor[sentiment]

  return (
    <div>
      {/* Big current label */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
            Live Sentiment
          </div>
          <motion.div
            key={sentiment}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold leading-none mt-1"
            style={{ color: c.hex }}
          >
            {c.label}
          </motion.div>
        </div>
        <SentimentFace sentiment={sentiment} />
      </div>

      {/* Track */}
      <div className="relative">
        <div
          className="h-5 rounded-full overflow-hidden"
          style={{
            background:
              'linear-gradient(90deg,#DC2626 0%,#F59E0B 50%,#16A34A 100%)',
          }}
        />
        {/* tick labels */}
        <div className="flex justify-between text-[10px] font-semibold text-ink-400 mt-1.5 px-0.5">
          <span className="text-negative">Negative</span>
          <span className="text-neutral">Neutral</span>
          <span className="text-positive">Positive</span>
        </div>

        {/* Needle */}
        <motion.div
          className="absolute -top-2"
          animate={{ left: `${pos * 100}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          style={{ translateX: '-50%' }}
        >
          <div
            className="w-7 h-9 rounded-lg border-[3px] border-white shadow-lg grid place-items-center"
            style={{ background: c.hex }}
          >
            <div className="w-1 h-4 rounded-full bg-white/70" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SentimentFace({ sentiment }) {
  const c = sentimentColor[sentiment]
  return (
    <motion.div
      key={sentiment}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="grid place-items-center w-12 h-12 rounded-full"
      style={{ background: `${c.hex}1a` }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c.hex} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="9" cy="10" r="0.6" fill={c.hex} stroke="none" />
        <circle cx="15" cy="10" r="0.6" fill={c.hex} stroke="none" />
        {sentiment === 'positive' && <path d="M8 14c1.2 1.4 2.6 2 4 2s2.8-.6 4-2" />}
        {sentiment === 'neutral' && <path d="M8.5 15h7" />}
        {sentiment === 'negative' && <path d="M8 16c1.2-1.4 2.6-2 4-2s2.8.6 4 2" />}
      </svg>
    </motion.div>
  )
}
