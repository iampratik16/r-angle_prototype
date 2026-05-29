import {
  Map,
  Brain,
  Cog,
  Database,
  TrendingUp,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  PageHeader,
  Badge,
  ProgressRing,
  AnimatedNumber,
  MotionItem,
} from '../components/ui'
import { aiManagedServices, roadmapPhases, expectedImpact } from '../data/mockData'
import { cx } from '../lib/utils'

const iconFor = {
  'AI Strategist': Brain,
  'ML Engineer': Cog,
  'Data Engineer': Database,
}

const statusColor = {
  Active: 'green',
  Next: 'amber',
  Planned: 'slate',
}

export default function Implementation() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Implementation Roadmap"
        subtitle="AI Managed Services team & phased rollout"
      />

      {/* AI Managed Services */}
      <MotionItem>
        <Card className="p-6">
          <CardHeader title="AI Managed Services Team" subtitle="Who builds & runs the system" icon={Brain} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiManagedServices.map((s, i) => {
              const Icon = iconFor[s.role] || Brain
              return (
                <div key={s.id} className="rounded-2xl border border-slate-200 p-5 hover:shadow-card transition">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 text-brand-700">
                    <Icon size={22} />
                  </span>
                  <div className="mt-3 font-bold text-ink-900">{s.role}</div>
                  <Badge color="teal" className="mt-2">{s.scope}</Badge>
                  <p className="mt-3 text-sm text-ink-600 leading-snug">{s.detail}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </MotionItem>

      {/* Phased timeline */}
      <MotionItem delay={0.05}>
        <Card className="p-6">
          <CardHeader title="Phased Rollout" subtitle="Illustrative delivery timeline" icon={Map} />
          <div className="relative">
            {/* connector line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200 md:hidden" />
            <div className="hidden md:block absolute top-[26px] left-0 right-0 h-0.5 bg-slate-200" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {roadmapPhases.map((p, i) => (
                <div key={p.id} className="relative flex md:block items-start gap-4">
                  <div className="relative z-10 shrink-0">
                    <span
                      className={cx(
                        'grid place-items-center w-8 h-8 rounded-full border-2 bg-white',
                        p.status === 'Active'
                          ? 'border-positive text-positive'
                          : p.status === 'Next'
                          ? 'border-neutral text-neutral'
                          : 'border-slate-300 text-slate-400'
                      )}
                    >
                      {p.status === 'Active' ? <CheckCircle2 size={18} /> : <Circle size={14} />}
                    </span>
                  </div>
                  <div className="md:mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-ink-400">PHASE {p.id}</span>
                      <Badge color={statusColor[p.status]}>{p.status}</Badge>
                    </div>
                    <div className="text-sm font-semibold text-ink-900 mt-1">{p.name}</div>
                    <div className="text-[11px] text-ink-400 mt-0.5">{p.duration}</div>
                    <p className="text-xs text-ink-600 mt-1.5 leading-snug">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </MotionItem>

      {/* Expected impact */}
      <MotionItem delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expectedImpact.map((imp) => (
            <Card key={imp.label} className="p-6 flex items-center gap-5 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
              <ProgressRing value={imp.value} max={100} size={104} stroke={11} color="#02C39A">
                <div className="text-xl font-bold text-accent-dark">
                  <AnimatedNumber value={imp.value} suffix={imp.suffix} />
                </div>
              </ProgressRing>
              <div>
                <div className="flex items-center gap-2 text-accent-dark">
                  <TrendingUp size={18} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Expected Impact</span>
                </div>
                <div className="text-lg font-bold text-ink-900 mt-1">{imp.label}</div>
                <div className="text-sm text-ink-600 mt-0.5">{imp.note}</div>
              </div>
            </Card>
          ))}
        </div>
      </MotionItem>
    </div>
  )
}
