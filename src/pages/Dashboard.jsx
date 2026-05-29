import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Flame,
  Gauge,
  TrendingUp,
  Radio,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Headphones,
  Zap,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  Card,
  CardHeader,
  StatCard,
  AnimatedNumber,
  ProgressRing,
  Badge,
  SentimentBadge,
  MotionItem,
} from '../components/ui'
import {
  dashboardKpis,
  liveTracking,
  salesWorkflow,
  todaySentiment,
  connectedSystems,
  expectedImpact,
} from '../data/mockData'
import { scoreHex } from '../lib/utils'

export default function Dashboard() {
  const totalFunnel = salesWorkflow[0].count

  return (
    <div className="space-y-6">
      {/* Header strip */}
      <MotionItem>
        <div className="rounded-2xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 text-white p-6 shadow-lift relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-accent-light text-xs font-semibold tracking-wide uppercase">
                <Sparkles size={14} /> AI Sales Command Center
              </div>
              <h1 className="text-2xl font-bold mt-1">R Angle — Sales Monitoring Model</h1>
              <p className="text-white/70 text-sm mt-1">
                Live-space interiors · Odisha → statewide expansion
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2">
              <CheckCircle2 size={16} className="text-accent-light" />
              <span className="text-sm font-medium">All systems connected</span>
            </div>
          </div>
        </div>
      </MotionItem>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Active Leads" value={dashboardKpis.activeLeads} delta="8%" tone="brand" />
        <StatCard icon={Flame} label="Hot Leads (ICP)" value={dashboardKpis.hotLeads} delta="12%" tone="red" />
        <StatCard icon={Gauge} label="Avg Interest Score" value={dashboardKpis.avgInterestScore} decimals={1} delta="0.4" tone="teal" />
        <StatCard icon={TrendingUp} label="Today's Conversion" value={dashboardKpis.todayConversion} decimals={1} suffix="%" delta="1.1%" tone="green" />
        <StatCard icon={Radio} label="Active Live Calls" value={dashboardKpis.activeLiveCalls} tone="amber" sub="Monitored in real time" />
        <StatCard icon={AlertTriangle} label="Escalations Today" value={dashboardKpis.escalationsToday} delta="1" deltaDir="up" tone="red" />
      </div>

      {/* Live salesperson tracking + Sentiment snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Salesperson Tracking — the product's core */}
        <MotionItem delay={0.05} className="lg:col-span-2">
          <Card className="p-6 h-full">
            <CardHeader
              title="Live Salesperson Tracking"
              subtitle="Every rep's call monitored in real time"
              icon={Headphones}
              right={
                <Link
                  to="/live"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark hover:text-accent"
                >
                  Open cockpit <ArrowRight size={15} />
                </Link>
              }
            />
            <div className="space-y-2.5">
              {liveTracking.map((t) => (
                <Link
                  key={t.rep}
                  to="/live"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 hover:shadow-soft transition"
                >
                  <div className="relative">
                    <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-700 text-white text-xs font-bold">
                      {t.avatar}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulseDot" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-ink-900 truncate">{t.rep}</div>
                    <div className="text-[11px] text-ink-400 truncate">
                      with {t.customer} · {t.duration}
                    </div>
                  </div>
                  <SentimentBadge sentiment={t.sentiment} />
                  {/* live green/red pitch-guidance pulse */}
                  <span
                    className={
                      'hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border ' +
                      (t.lastGuidance === 'green'
                        ? 'text-positive bg-emerald-50 border-emerald-200'
                        : 'text-negative bg-red-50 border-red-200')
                    }
                  >
                    <Zap size={11} />
                    {t.lastGuidance === 'green' ? 'On script' : 'Off script'}
                  </span>
                  <div className="text-right w-12">
                    <div className="text-lg font-bold leading-none" style={{ color: scoreHex(t.score) }}>
                      {t.score.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-ink-400">score</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-ink-600">
              <span className="font-semibold text-ink-900">How it works:</span> the AI listens to
              every live call, scores intent in real time, and shows each rep a
              <span className="text-positive font-semibold"> green</span> /
              <span className="text-negative font-semibold"> red</span> cue for whether they spoke
              the recommended pitch — escalating premium calls the moment a rep goes off script.
            </div>
          </Card>
        </MotionItem>

        {/* Live sentiment snapshot */}
        <MotionItem delay={0.1}>
          <Card className="p-6 h-full flex flex-col">
            <CardHeader title="Live Sentiment Snapshot" subtitle="Across today's calls" icon={Radio} />
            <div className="relative flex-1 grid place-items-center min-h-[180px]">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={todaySentiment}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {todaySentiment.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v}%`, n]}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-positive">58%</div>
                  <div className="text-[11px] text-ink-400">positive</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              {todaySentiment.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-ink-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </div>
              ))}
            </div>
            <Link
              to="/live"
              className="mt-4 flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-red-50 text-negative font-semibold text-sm border border-red-200 hover:bg-red-100 transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              3 calls live now — open cockpit
              <ArrowRight size={15} />
            </Link>
          </Card>
        </MotionItem>
      </div>

      {/* Sales pipeline funnel */}
      <MotionItem delay={0.1}>
        <Card className="p-6">
          <CardHeader
            title="Sales Pipeline — 5-Stage Workflow"
            subtitle="Lead Gen → Follow-Up → Site Visit → Budget → Design Phase"
            icon={TrendingUp}
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {salesWorkflow.map((stage, i) => {
              const widthPct = Math.round((stage.count / totalFunnel) * 100)
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="relative"
                >
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 h-full">
                    <div className="flex items-center justify-between">
                      <span className="grid place-items-center w-6 h-6 rounded-lg bg-brand-700 text-white text-[11px] font-bold">
                        {stage.id}
                      </span>
                      {stage.marker && (
                        <Badge color={stage.id === 5 ? 'green' : 'teal'}>{stage.marker}</Badge>
                      )}
                    </div>
                    <div className="mt-3 text-2xl font-bold text-ink-900">
                      <AnimatedNumber value={stage.count} />
                    </div>
                    <div className="text-sm font-semibold text-ink-900 mt-0.5">{stage.name}</div>
                    <div className="text-[11px] text-ink-400 mt-1 leading-snug">{stage.detail}</div>
                    <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      />
                    </div>
                  </div>
                  {i < salesWorkflow.length - 1 && (
                    <ArrowRight
                      size={16}
                      className="hidden md:block absolute top-1/2 -right-2.5 -translate-y-1/2 text-slate-300 z-10"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </Card>
      </MotionItem>

      {/* Connected systems + Expected impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MotionItem delay={0.12} className="lg:col-span-2">
          <Card className="p-6 h-full">
            <CardHeader title="Connected Systems" subtitle="Unified integration layer" icon={CheckCircle2} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {connectedSystems.map((sys) => (
                <div
                  key={sys.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-50 text-brand-700 font-bold text-sm">
                    {sys.name.slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-900 truncate">{sys.name}</div>
                    <div className="text-[11px] text-ink-400 truncate">{sys.category}</div>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-positive">
                    <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulseDot" />
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </MotionItem>

        <MotionItem delay={0.15}>
          <div className="grid grid-rows-2 gap-4 h-full">
            {expectedImpact.map((imp, i) => (
              <Card
                key={imp.label}
                className="p-5 flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-white border-emerald-100"
              >
                <ProgressRing value={imp.value} max={100} size={84} stroke={9} color="#02C39A">
                  <div className="text-lg font-bold text-accent-dark">
                    <AnimatedNumber value={imp.value} suffix="%" />
                  </div>
                </ProgressRing>
                <div>
                  <div className="text-sm font-bold text-ink-900">{imp.label}</div>
                  <div className="text-xs text-ink-600 mt-0.5">{imp.note}</div>
                </div>
              </Card>
            ))}
          </div>
        </MotionItem>
      </div>
    </div>
  )
}
