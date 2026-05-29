import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  X,
  IndianRupee,
  Target,
  ArrowRight,
  CheckCircle2,
  Circle,
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
  TierBadge,
  SourceBadge,
  SentimentBadge,
  ScoreBadge,
  MotionItem,
} from '../components/ui'
import {
  leads,
  leadStats,
  icpDefinition,
  leadsBySource,
  leadsByTier,
} from '../data/mockData'
import { cx, sentimentColor } from '../lib/utils'

const sourceOptions = ['All', 'LinkedIn', 'WhatsApp', 'Facebook']
const tierOptions = ['All', 'Hot', 'Warm', 'Cold']
const routeOptions = ['All', 'Senior Team', 'Sales Rep']

export default function Leads() {
  const [source, setSource] = useState('All')
  const [tier, setTier] = useState('All')
  const [route, setRoute] = useState('All')
  const [selected, setSelected] = useState(null)
  const [sortKey, setSortKey] = useState('interestScore')

  const filtered = useMemo(() => {
    return leads
      .filter((l) => source === 'All' || l.source === source)
      .filter((l) => tier === 'All' || l.icpTier === tier)
      .filter((l) => route === 'All' || l.routedTo === route)
      .sort((a, b) =>
        sortKey === 'name'
          ? a.name.localeCompare(b.name)
          : b[sortKey] - a[sortKey]
      )
  }, [source, tier, route, sortKey])

  const hotMatches = leads.filter((l) => l.icpTier === 'Hot').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Intelligence"
        subtitle="ICP matching, interaction analysis & smart routing"
      />

      {/* Top: ICP definition + smart routing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MotionItem className="lg:col-span-1">
          <Card className="p-6 h-full bg-gradient-to-br from-brand-800 to-brand-600 text-white">
            <div className="flex items-center gap-2 text-accent-light text-xs font-semibold uppercase tracking-wide">
              <Target size={14} /> {icpDefinition.title}
            </div>
            <div className="mt-3 space-y-2">
              {icpDefinition.criteria.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-accent-light shrink-0" />
                  {c}
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/15">
              <div className="text-4xl font-bold">{hotMatches}</div>
              <div className="text-sm text-white/70">leads match the Hot ICP right now</div>
            </div>
          </Card>
        </MotionItem>

        {/* Smart routing two-lane */}
        <MotionItem delay={0.05} className="lg:col-span-2">
          <Card className="p-6 h-full">
            <CardHeader
              title="Smart Routing"
              subtitle="High-value leads auto-routed to the Senior Team"
              icon={ArrowRight}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent-dark">Senior Team</span>
                  <Badge color="green">Score &gt; 5</Badge>
                </div>
                <div className="text-3xl font-bold text-ink-900 mt-3">{leadStats.seniorRouted}</div>
                <div className="text-xs text-ink-600 mt-1">High-value / Hot leads</div>
                <div className="mt-3 flex -space-x-2">
                  {['SM', 'DP', 'RA'].map((a) => (
                    <span key={a} className="grid place-items-center w-7 h-7 rounded-full bg-brand-700 text-white text-[10px] font-bold border-2 border-emerald-50">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-700">Sales Reps & Telecallers</span>
                  <Badge color="blue">Score &lt; 5</Badge>
                </div>
                <div className="text-3xl font-bold text-ink-900 mt-3">{leadStats.repRouted}</div>
                <div className="text-xs text-ink-600 mt-1">Standard nurture queue</div>
                <div className="mt-3 flex -space-x-2">
                  {['PS', 'RB', 'AD', 'MS'].map((a) => (
                    <span key={a} className="grid place-items-center w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold border-2 border-blue-50">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </MotionItem>
      </div>

      {/* Segmentation charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MotionItem delay={0.05}>
          <Card className="p-6">
            <CardHeader title="Leads by Source" icon={Users} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leadsBySource} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {leadsBySource.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </MotionItem>
        <MotionItem delay={0.08}>
          <Card className="p-6">
            <CardHeader title="Leads by ICP Tier" icon={Target} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leadsByTier} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {leadsByTier.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </MotionItem>
      </div>

      {/* Filter bar + table */}
      <MotionItem delay={0.1}>
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <FilterGroup label="Source" options={sourceOptions} value={source} onChange={setSource} />
            <FilterGroup label="ICP Tier" options={tierOptions} value={tier} onChange={setTier} />
            <FilterGroup label="Routing" options={routeOptions} value={route} onChange={setRoute} />
            <div className="ml-auto flex items-center gap-2 text-xs text-ink-400">
              <span>Sort by</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="interestScore">Interest Score</option>
                <option value="conversionProbability">Conversion %</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-ink-400 border-b border-slate-200">
                  <th className="text-left font-semibold px-3 py-2.5">Lead</th>
                  <th className="text-left font-semibold px-3 py-2.5">Source</th>
                  <th className="text-left font-semibold px-3 py-2.5">ICP Tier</th>
                  <th className="text-left font-semibold px-3 py-2.5">ICP Reason</th>
                  <th className="text-center font-semibold px-3 py-2.5">Score</th>
                  <th className="text-left font-semibold px-3 py-2.5">Sentiment</th>
                  <th className="text-center font-semibold px-3 py-2.5">₹500</th>
                  <th className="text-left font-semibold px-3 py-2.5">Routed</th>
                  <th className="text-right font-semibold px-3 py-2.5">Conv. %</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-ink-900">{l.name}</div>
                      <div className="text-[11px] text-ink-400">{l.id} · {l.stage}</div>
                    </td>
                    <td className="px-3 py-2.5"><SourceBadge source={l.source} /></td>
                    <td className="px-3 py-2.5"><TierBadge tier={l.icpTier} /></td>
                    <td className="px-3 py-2.5 text-ink-600 text-xs max-w-[200px] truncate">{l.icpReason}</td>
                    <td className="px-3 py-2.5 text-center"><ScoreBadge score={l.interestScore} size="sm" /></td>
                    <td className="px-3 py-2.5"><SentimentBadge sentiment={l.sentimentTrend} /></td>
                    <td className="px-3 py-2.5 text-center">
                      {l.sitePaid ? (
                        <CheckCircle2 size={17} className="text-positive mx-auto" />
                      ) : (
                        <Circle size={15} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge color={l.routedTo === 'Senior Team' ? 'green' : 'blue'}>{l.routedTo}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-ink-900">{l.conversionProbability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-ink-400">
            Showing {filtered.length} of {leads.length} leads · click a row for interaction analysis
          </div>
        </Card>
      </MotionItem>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && <LeadDrawer lead={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold mb-1.5">{label}</div>
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cx(
              'px-2.5 py-1 rounded-md text-xs font-medium transition',
              value === o ? 'bg-white text-brand-800 shadow-sm' : 'text-ink-600 hover:text-ink-900'
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function LeadDrawer({ lead, onClose }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink-900/30 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-ink-900">Lead Detail</h3>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-lg hover:bg-slate-100 text-ink-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-12 h-12 rounded-full bg-brand-700 text-white font-bold">
              {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="text-lg font-bold text-ink-900">{lead.name}</div>
              <div className="text-xs text-ink-400">{lead.id} · {lead.stage}</div>
            </div>
            <div className="ml-auto"><ScoreBadge score={lead.interestScore} /></div>
          </div>

          <div className="flex flex-wrap gap-2">
            <SourceBadge source={lead.source} />
            <TierBadge tier={lead.icpTier} />
            <SentimentBadge sentiment={lead.sentimentTrend} />
            <Badge color={lead.routedTo === 'Senior Team' ? 'green' : 'blue'}>{lead.routedTo}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Info label="Budget" value={lead.budget} icon={IndianRupee} />
            <Info label="Conversion" value={`${lead.conversionProbability}%`} />
            <Info label="Assigned to" value={lead.assignedTo} />
            <Info label="₹500 site visit" value={lead.sitePaid ? 'Paid ✓' : 'Pending'} />
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-xs font-semibold text-ink-900 mb-1">ICP Match Reason</div>
            <div className="text-sm text-ink-600">{lead.icpReason}</div>
          </div>

          {/* Interaction timeline */}
          <div>
            <div className="text-sm font-semibold text-ink-900 mb-3">Interaction Analysis</div>
            <div className="space-y-0">
              {lead.timeline.map((t, i) => {
                const c = sentimentColor[t.sentiment]
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={cx('w-3 h-3 rounded-full mt-1', c.bg)} />
                      {i < lead.timeline.length - 1 && <span className="w-px flex-1 bg-slate-200" />}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium text-ink-900">{t.label}</div>
                      <div className="text-xs text-ink-400">{t.detail}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold flex items-center gap-1">
        {Icon && <Icon size={11} />} {label}
      </div>
      <div className="text-sm font-semibold text-ink-900 mt-0.5">{value}</div>
    </div>
  )
}
