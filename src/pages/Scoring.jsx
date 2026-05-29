import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Gauge,
  Smile,
  Clock,
  IndianRupee,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Card,
  CardHeader,
  PageHeader,
  Badge,
  ScoreBadge,
  TierBadge,
  MotionItem,
} from '../components/ui'
import { leads, scoreHistogram } from '../data/mockData'
import { cx, scoreHex } from '../lib/utils'

const weights = [
  { key: 'sentiment', label: 'Sentiment (NLP)', icon: Smile, color: '#16A34A', weight: '30%' },
  { key: 'duration', label: 'Call Duration', icon: Clock, color: '#3B82F6', weight: '25%' },
  { key: 'payment', label: '₹500 Site-Visit Signal', icon: IndianRupee, color: '#02C39A', weight: '25%' },
  { key: 'interest', label: 'Interest Level', icon: Heart, color: '#F59E0B', weight: '20%' },
]

export default function Scoring() {
  const sorted = [...leads].sort((a, b) => b.interestScore - a.interestScore)
  const [selectedId, setSelectedId] = useState(sorted[0].id)
  const selected = leads.find((l) => l.id === selectedId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Intent Scoring Engine"
        subtitle="Interest Score (0–10) blends sentiment, duration, ₹500 signal & interest level"
      />

      {/* Formula explainer */}
      <MotionItem>
        <Card className="p-6">
          <CardHeader title="Score Formula" subtitle="Weighted blend of four signals" icon={Gauge} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {weights.map((w) => (
              <div key={w.key} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span
                    className="grid place-items-center w-9 h-9 rounded-lg"
                    style={{ background: `${w.color}1a`, color: w.color }}
                  >
                    <w.icon size={18} />
                  </span>
                  <span className="text-lg font-bold" style={{ color: w.color }}>{w.weight}</span>
                </div>
                <div className="mt-3 text-sm font-semibold text-ink-900">{w.label}</div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: w.color }}
                    initial={{ width: 0 }}
                    animate={{ width: w.weight }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-ink-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="font-semibold text-ink-900">Interest Score</span> = Σ (signal × weight),
            normalised to a 0–10 scale and updated live during every monitored call.
          </div>
        </Card>
      </MotionItem>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routing threshold scale */}
        <MotionItem delay={0.05}>
          <Card className="p-6 h-full">
            <CardHeader
              title="Routing Threshold"
              subtitle="Score > 5 → Team Leaders · Score < 5 → Sales Team"
              icon={ArrowUpRight}
            />
            <div className="relative mt-10 mb-2 px-2">
              {/* gradient track */}
              <div className="h-3 rounded-full" style={{ background: 'linear-gradient(90deg,#DC2626,#F59E0B,#02C39A,#16A34A)' }} />
              {/* threshold line at 5 */}
              <div className="absolute top-0 bottom-0 -mt-6" style={{ left: '50%' }}>
                <div className="w-px h-16 bg-ink-900/40 mx-auto" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Badge color="brand">Threshold · 5.0</Badge>
                </div>
              </div>
              {/* lead dots */}
              <div className="relative h-8">
                {leads.map((l) => (
                  <div
                    key={l.id}
                    title={`${l.name} · ${l.interestScore}`}
                    className="absolute top-1 w-2.5 h-2.5 rounded-full border border-white shadow"
                    style={{ left: `calc(${(l.interestScore / 10) * 100}% - 5px)`, background: scoreHex(l.interestScore) }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-ink-400 mt-1">
                <span>0</span><span>5</span><span>10</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
                <div className="text-xs font-semibold text-blue-700">Below 5</div>
                <div className="text-2xl font-bold text-ink-900">{leads.filter((l) => l.interestScore < 5).length}</div>
                <div className="text-[11px] text-ink-600">→ Sales Team & Telecallers</div>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                <div className="text-xs font-semibold text-accent-dark">Above 5</div>
                <div className="text-2xl font-bold text-ink-900">{leads.filter((l) => l.interestScore >= 5).length}</div>
                <div className="text-[11px] text-ink-600">→ Team Leaders & Managers</div>
              </div>
            </div>
          </Card>
        </MotionItem>

        {/* Histogram */}
        <MotionItem delay={0.08}>
          <Card className="p-6 h-full">
            <CardHeader title="Score Distribution" subtitle="All active leads by interest band" icon={Gauge} />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={scoreHistogram} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={42}>
                  {scoreHistogram.map((b) => (
                    <Cell key={b.bucket} fill={scoreHex(b.low + 0.5)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </MotionItem>
      </div>

      {/* Interactive lead picker */}
      <MotionItem delay={0.1}>
        <Card className="p-6">
          <CardHeader title="Lead Score Breakdown" subtitle="Select a lead to see its score contribution & routing" icon={Heart} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* picker list */}
            <div className="lg:col-span-1 max-h-[360px] overflow-y-auto pr-1 space-y-1.5">
              {sorted.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={cx(
                    'w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition',
                    selectedId === l.id
                      ? 'border-brand-200 bg-brand-50'
                      : 'border-transparent hover:bg-slate-50'
                  )}
                >
                  <ScoreBadge score={l.interestScore} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink-900 truncate">{l.name}</div>
                    <div className="text-[11px] text-ink-400">{l.routedTo}</div>
                  </div>
                  <TierBadge tier={l.icpTier} />
                </button>
              ))}
            </div>

            {/* breakdown */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-lg font-bold text-ink-900">{selected.name}</div>
                    <div className="text-xs text-ink-400">{selected.id} · {selected.budget} · {selected.stage}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: scoreHex(selected.interestScore) }}>
                      {selected.interestScore.toFixed(1)}
                    </div>
                    <div className="text-[11px] text-ink-400">interest score</div>
                  </div>
                </div>

                {/* stacked contribution bar */}
                <div className="mt-5">
                  <div className="text-xs font-semibold text-ink-600 mb-2">Score contribution</div>
                  <div className="flex h-7 rounded-lg overflow-hidden border border-slate-200">
                    {weights.map((w) => {
                      const val = selected.scoreBreakdown[w.key]
                      const pct = (val / selected.interestScore) * 100
                      return (
                        <div
                          key={w.key}
                          className="h-full grid place-items-center text-[10px] font-bold text-white"
                          style={{ width: `${pct}%`, background: w.color }}
                          title={`${w.label}: ${val}`}
                        >
                          {pct > 12 ? val : ''}
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {weights.map((w) => (
                      <div key={w.key} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded" style={{ background: w.color }} />
                        <span className="text-ink-600">{w.label}</span>
                        <span className="ml-auto font-semibold text-ink-900">{selected.scoreBreakdown[w.key]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* routing verdict */}
                <div
                  className={cx(
                    'mt-5 flex items-center gap-3 rounded-xl p-4 border',
                    selected.interestScore >= 5
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-blue-50 border-blue-200'
                  )}
                >
                  {selected.interestScore >= 5 ? (
                    <ArrowUpRight className="text-accent-dark" />
                  ) : (
                    <ArrowDownRight className="text-blue-700" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-ink-900">
                      Routes to {selected.interestScore >= 5 ? 'Team Leaders & Managers' : 'Sales Team & Telecallers'}
                    </div>
                    <div className="text-xs text-ink-600">
                      Score {selected.interestScore.toFixed(1)} {selected.interestScore >= 5 ? 'crosses' : 'is below'} the 5.0 threshold
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </MotionItem>
    </div>
  )
}
