// Tiny class-name joiner (no extra deps).
export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

// Format INR amounts compactly: 42000 -> "₹42,000", 1250000 -> "₹12.5 L"
export function inr(n) {
  if (n == null) return '—'
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

// Format seconds -> mm:ss
export function mmss(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

// Semantic sentiment colour tokens used consistently across the app.
export const sentimentColor = {
  positive: { text: 'text-positive', bg: 'bg-positive', soft: 'bg-emerald-50', border: 'border-emerald-200', hex: '#16A34A', label: 'Positive' },
  neutral: { text: 'text-neutral', bg: 'bg-neutral', soft: 'bg-amber-50', border: 'border-amber-200', hex: '#F59E0B', label: 'Neutral' },
  negative: { text: 'text-negative', bg: 'bg-negative', soft: 'bg-red-50', border: 'border-red-200', hex: '#DC2626', label: 'Negative' },
}

// Colour for a 0–10 interest score (cold blue → amber → green hot).
export function scoreHex(score) {
  if (score >= 7) return '#16A34A'
  if (score >= 5) return '#02C39A'
  if (score >= 3.5) return '#F59E0B'
  return '#DC2626'
}

export function tierColor(tier) {
  switch (tier) {
    case 'Hot':
      return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' }
    case 'Warm':
      return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' }
    default:
      return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' }
  }
}

export const sourceColor = {
  LinkedIn: { text: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200' },
  WhatsApp: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Facebook: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
}
