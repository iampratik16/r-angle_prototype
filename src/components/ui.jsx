// =====================================================================
// Reusable design-system primitives (Section 2)
// =====================================================================
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cx, tierColor, sourceColor, scoreHex, sentimentColor } from '../lib/utils'

// ----------------------------- Card ---------------------------------
export function Card({ className, children, ...rest }) {
  return (
    <div
      className={cx(
        'bg-white rounded-2xl border border-slate-200/80 shadow-card',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, icon: Icon, right, className }) {
  return (
    <div className={cx('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-50 text-brand-700 shrink-0">
            <Icon size={18} />
          </span>
        )}
        <div>
          <h3 className="text-[15px] font-semibold text-ink-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

// --------------------------- AnimatedNumber --------------------------
// Smooth count-up that runs once when scrolled into view.
export function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', duration = 1100 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const from = 0
    const to = Number(value) || 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref} className="tnum">
      {prefix}
      {display.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

// ----------------------------- StatCard ------------------------------
export function StatCard({ icon: Icon, label, value, decimals = 0, prefix = '', suffix = '', delta, deltaDir = 'up', tone = 'brand', sub }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    teal: 'bg-emerald-50 text-accent-dark',
    red: 'bg-red-50 text-negative',
    amber: 'bg-amber-50 text-neutral',
    green: 'bg-emerald-50 text-positive',
  }
  const up = deltaDir === 'up'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-4 sm:p-5 h-full">
        <div className="flex items-start justify-between">
          <span className={cx('grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl', tones[tone])}>
            {Icon && <Icon size={20} />}
          </span>
          {delta != null && (
            <span
              className={cx(
                'inline-flex items-center gap-0.5 text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-full',
                up ? 'text-positive bg-emerald-50' : 'text-negative bg-red-50'
              )}
            >
              {up ? '▲' : '▼'} {delta}
            </span>
          )}
        </div>
        <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-ink-900 leading-none">
          <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        </div>
        <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
          {label}
        </div>
        {sub && <div className="mt-1 text-xs text-ink-600">{sub}</div>}
      </Card>
    </motion.div>
  )
}

// ------------------------------ Badge --------------------------------
export function Badge({ children, color = 'slate', className, dot }) {
  const palette = {
    slate: 'text-slate-600 bg-slate-100 border-slate-200',
    brand: 'text-brand-700 bg-brand-50 border-brand-200',
    teal: 'text-accent-dark bg-emerald-50 border-emerald-200',
    green: 'text-positive bg-emerald-50 border-emerald-200',
    amber: 'text-neutral bg-amber-50 border-amber-200',
    red: 'text-negative bg-red-50 border-red-200',
    blue: 'text-blue-700 bg-blue-50 border-blue-200',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
        palette[color] || palette.slate,
        className
      )}
    >
      {dot && <span className={cx('w-1.5 h-1.5 rounded-full', dot)} />}
      {children}
    </span>
  )
}

export function TierBadge({ tier }) {
  const c = tierColor(tier)
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border', c.bg, c.text, c.border)}>
      <span className={cx('w-1.5 h-1.5 rounded-full', c.dot)} />
      {tier}
    </span>
  )
}

export function SourceBadge({ source }) {
  const c = sourceColor[source] || sourceColor.Facebook
  return (
    <span className={cx('inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border', c.bg, c.text, c.border)}>
      {source}
    </span>
  )
}

export function SentimentBadge({ sentiment }) {
  const c = sentimentColor[sentiment]
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border', c.soft, c.text, c.border)}>
      <span className={cx('w-1.5 h-1.5 rounded-full', c.bg)} />
      {c.label}
    </span>
  )
}

// ---------------------------- ScoreBadge -----------------------------
export function ScoreBadge({ score, size = 'md' }) {
  const hex = scoreHex(score)
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1' }
  return (
    <span
      className={cx('inline-flex items-center gap-1 font-bold rounded-lg text-white', sizes[size])}
      style={{ backgroundColor: hex }}
    >
      {Number(score).toFixed(1)}
    </span>
  )
}

// --------------------------- ProgressRing ----------------------------
export function ProgressRing({ value, max = 10, size = 132, stroke = 11, color, trackColor = '#EEF0F9', children }) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(1, value / max))
  const dash = circ * pct
  const ringColor = color || scoreHex(value)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ type: 'spring', stiffness: 60, damping: 16 }}
          style={{ strokeDashoffset: circ - dash }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

// --------------------------- MiniSparkline ---------------------------
export function MiniSparkline({ points = [], color = '#02C39A', width = 120, height = 36 }) {
  if (points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const step = width / (points.length - 1)
  const d = points
    .map((p, i) => {
      const x = i * step
      const y = height - ((p - min) / span) * (height - 4) - 2
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={(points.length - 1) * step}
        cy={height - ((points[points.length - 1] - min) / span) * (height - 4) - 2}
        r={3}
        fill={color}
      />
    </svg>
  )
}

// ------------------------------ PageHeader ---------------------------
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="text-sm text-ink-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ------------------------------ Section ------------------------------
export function MotionItem({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
