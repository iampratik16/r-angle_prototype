import {
  Trophy,
  Mic,
  Headphones,
  ClipboardCheck,
  Split,
  ArrowRight,
  Gift,
  AlertTriangle,
  TrendingUp,
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
  LineChart,
  Line,
  Legend,
  ReferenceLine,
} from 'recharts'
import {
  Card,
  CardHeader,
  PageHeader,
  Badge,
  SentimentBadge,
  MotionItem,
} from '../components/ui'
import {
  team,
  ismTrend,
  ismBenchmark,
  teamAverageConversion,
} from '../data/mockData'
import { cx, inr } from '../lib/utils'

const flow = [
  { icon: Mic, label: 'AI Pitch Generation', detail: 'Founder playbook → scripts' },
  { icon: Headphones, label: 'Live Listening', detail: 'Real-time call capture' },
  { icon: ClipboardCheck, label: 'Compliance Tracking', detail: 'Spoken words vs AI pitch' },
  { icon: Split, label: 'Performance Routing', detail: 'Cream leads vs corrective' },
]

const tierColorMap = {
  'Top Performer': 'green',
  'On Track': 'amber',
  'Needs Coaching': 'red',
}

export default function Performance() {
  const reps = team.filter((t) => t.role !== 'Founder').sort((a, b) => b.ismScore - a.ismScore)
  const best = reps[0]
  const teamAvgIsm = Math.round(reps.reduce((s, r) => s + r.ismScore, 0) / reps.length)
  const cream = reps.filter((r) => r.complianceRate >= 75)
  const corrective = reps.filter((r) => r.complianceRate < 75)

  const benchmarkData = ismBenchmark.map((d) => ({
    ...d,
    'Team Avg': teamAvgIsm,
    Best: best.ismScore,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance & Incentives (ISM)"
        subtitle="Compliance-driven routing, leaderboards & the Individual Sales Metric"
      />

      {/* 4-step process flow */}
      <MotionItem>
        <Card className="p-6">
          <CardHeader title="Performance Engine" subtitle="AI Pitch → Live Listening → Compliance → Routing" icon={TrendingUp} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {flow.map((f, i) => (
              <div key={f.label} className="relative">
                <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 h-full">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-50 text-brand-700">
                    <f.icon size={20} />
                  </span>
                  <div className="mt-3 text-sm font-semibold text-ink-900">{f.label}</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">{f.detail}</div>
                </div>
                {i < flow.length - 1 && (
                  <ArrowRight size={16} className="hidden md:block absolute top-1/2 -right-2.5 -translate-y-1/2 text-slate-300 z-10" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </MotionItem>

      {/* Leaderboard */}
      <MotionItem delay={0.05}>
        <Card className="p-6">
          <CardHeader title="ISM Leaderboard" subtitle="Ranked by Individual Sales Metric" icon={Trophy} />
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-ink-400 border-b border-slate-200">
                  <th className="text-left font-semibold px-3 py-2.5">#</th>
                  <th className="text-left font-semibold px-3 py-2.5">Rep</th>
                  <th className="text-center font-semibold px-3 py-2.5">ISM</th>
                  <th className="text-center font-semibold px-3 py-2.5">Compliance</th>
                  <th className="text-center font-semibold px-3 py-2.5">Calls</th>
                  <th className="text-left font-semibold px-3 py-2.5">Avg Sentiment</th>
                  <th className="text-center font-semibold px-3 py-2.5">Conv. %</th>
                  <th className="text-left font-semibold px-3 py-2.5">Tier</th>
                  <th className="text-right font-semibold px-3 py-2.5">Incentive</th>
                </tr>
              </thead>
              <tbody>
                {reps.map((r, i) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-3 py-3">
                      <span className={cx(
                        'grid place-items-center w-6 h-6 rounded-full text-[11px] font-bold',
                        i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-ink-600'
                      )}>{i + 1}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-700 text-white text-[11px] font-bold">{r.avatar}</span>
                        <div>
                          <div className="font-semibold text-ink-900">{r.name}</div>
                          <div className="text-[11px] text-ink-400">{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-base font-bold text-ink-900">{r.ismScore}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={cx('h-full rounded-full', r.complianceRate >= 75 ? 'bg-positive' : 'bg-negative')} style={{ width: `${r.complianceRate}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-ink-600">{r.complianceRate}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-ink-600">{r.callsToday}</td>
                    <td className="px-3 py-3"><SentimentBadge sentiment={r.avgSentiment} /></td>
                    <td className="px-3 py-3 text-center font-semibold text-ink-900">{r.conversionRate}%</td>
                    <td className="px-3 py-3"><Badge color={tierColorMap[r.tier]}>{r.tier}</Badge></td>
                    <td className="px-3 py-3 text-right font-semibold text-ink-900">{inr(r.incentiveEarned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-ink-400">
            Team average conversion ≈ {teamAverageConversion}% — the 25:1 gap the AI model is built to close against the founder's 100%.
          </div>
        </Card>
      </MotionItem>

      {/* Performance routing lanes */}
      <MotionItem delay={0.08}>
        <Card className="p-6">
          <CardHeader title="Performance Routing" subtitle="Compliance decides lead quality & incentives" icon={Split} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-positive font-bold">
                <Gift size={18} /> High compliance → “Cream” leads + Incentives
              </div>
              <div className="mt-4 space-y-2">
                {cream.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 bg-white rounded-xl border border-emerald-100 p-2.5">
                    <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-700 text-white text-[11px] font-bold">{r.avatar}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink-900">{r.name}</div>
                      <div className="text-[11px] text-ink-400">{r.complianceRate}% compliance</div>
                    </div>
                    <span className="text-sm font-bold text-positive">{inr(r.incentiveEarned)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2 text-negative font-bold">
                <AlertTriangle size={18} /> Low compliance → Corrective action
              </div>
              <div className="mt-4 space-y-2">
                {corrective.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 bg-white rounded-xl border border-red-100 p-2.5">
                    <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-700 text-white text-[11px] font-bold">{r.avatar}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink-900">{r.name}</div>
                      <div className="text-[11px] text-ink-400">{r.complianceRate}% compliance</div>
                    </div>
                    <Badge color="red">Coaching</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </MotionItem>

      {/* Benchmark + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MotionItem delay={0.1}>
          <Card className="p-6 h-full">
            <CardHeader title="ISM vs Team Average vs Best" subtitle="Each rep benchmarked" icon={Trophy} />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={benchmarkData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <ReferenceLine y={teamAvgIsm} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: `Team Avg ${teamAvgIsm}`, fontSize: 10, fill: '#F59E0B', position: 'insideTopRight' }} />
                <ReferenceLine y={best.ismScore} stroke="#16A34A" strokeDasharray="4 4" label={{ value: `Best ${best.ismScore}`, fontSize: 10, fill: '#16A34A', position: 'insideTopRight' }} />
                <Bar dataKey="ISM" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {benchmarkData.map((d) => (
                    <Cell key={d.name} fill={d.ISM >= teamAvgIsm ? '#02C39A' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </MotionItem>

        <MotionItem delay={0.12}>
          <Card className="p-6 h-full">
            <CardHeader title="ISM Trend — Rakesh Behera" subtitle="Improvement after AI coaching" icon={TrendingUp} />
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ismTrend} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[40, 95]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Rakesh Behera" stroke="#02C39A" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Team Avg" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 4" dot={false} />
                <Line type="monotone" dataKey="Best Performer" stroke="#16A34A" strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </MotionItem>
      </div>
    </div>
  )
}
