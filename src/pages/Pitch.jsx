import {
  MessageSquareText,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Quote,
  ArrowRight,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  PageHeader,
  Badge,
  MotionItem,
} from '../components/ui'
import { pitchLibrary, escalationRules, guidanceEvents } from '../data/mockData'
import { cx } from '../lib/utils'
import PitchTrackerDemo from '../components/PitchTrackerDemo'

export default function Pitch() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pitch Guidance & CRM"
        subtitle="Founder-approved pitches, live red/green feedback & escalation rules"
      />

      {/* Interactive presenter-controlled demo */}
      <MotionItem>
        <PitchTrackerDemo />
      </MotionItem>

      {/* Red/Green legend demonstration */}
      <MotionItem>
        <Card className="p-6">
          <CardHeader
            title="How Live Guidance Works"
            subtitle="The AI listens and scores every recommended phrase in real time"
            icon={MessageSquareText}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-positive font-bold">
                <CheckCircle2 size={20} /> GREEN — Correct phrase spoken
              </div>
              <div className="mt-3 rounded-xl bg-white border border-emerald-100 p-3 text-sm text-ink-900">
                “Our in-house design team guarantees on-time delivery — that's our core USP.”
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-positive font-semibold">
                <ArrowRight size={15} /> Interest Score +0.5 · conversion probability rises
              </div>
            </div>
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2 text-negative font-bold">
                <XCircle size={20} /> RED — Suggested phrase not used
              </div>
              <div className="mt-3 rounded-xl bg-white border border-red-100 p-3 text-sm text-ink-400 line-through">
                “Every project is monitored on Dezylo for real-time visibility.”
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-negative font-semibold">
                <ArrowRight size={15} /> Missed trust-builder · rep nudged · repeated misses escalate
              </div>
            </div>
          </div>
        </Card>
      </MotionItem>

      {/* Pitch library */}
      <MotionItem delay={0.05}>
        <Card className="p-6">
          <CardHeader title="Pitch Library" subtitle="Founder-approved scripts & objection handling" icon={Quote} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pitchLibrary.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 p-4 hover:shadow-card transition flex flex-col">
                <Badge color="brand" className="self-start">{p.trigger}</Badge>
                <p className="mt-3 text-sm text-ink-900 leading-snug flex-1">“{p.phrase}”</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-ink-400">{p.usp}</span>
                  <span className="text-sm font-bold text-positive">{p.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </MotionItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Escalation rules */}
        <MotionItem delay={0.08}>
          <Card className="p-6 h-full">
            <CardHeader title="Escalation Rules" subtitle="Zero loss of premium opportunities" icon={ShieldAlert} />
            <div className="space-y-3">
              {escalationRules.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                  <span className="grid place-items-center w-6 h-6 rounded-lg bg-amber-100 text-neutral text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink-900">{r}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-gradient-to-br from-brand-800 to-brand-600 text-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ArrowRight size={16} className="text-accent-light" /> Routed to
              </div>
              <div className="mt-1 text-lg font-bold">Ar. Ratan Agarwal</div>
              <div className="text-xs text-white/70">Founder · 100% conversion</div>
            </div>
          </Card>
        </MotionItem>

        {/* Recent guidance events */}
        <MotionItem delay={0.1} className="lg:col-span-2">
          <Card className="p-6 h-full">
            <CardHeader title="Recent Guidance Events" subtitle="Per-call log of phrases used vs missed" icon={MessageSquareText} />
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-ink-400 border-b border-slate-200">
                    <th className="text-left font-semibold px-3 py-2.5">Rep</th>
                    <th className="text-left font-semibold px-3 py-2.5">Lead</th>
                    <th className="text-left font-semibold px-3 py-2.5">Suggested Phrase</th>
                    <th className="text-center font-semibold px-3 py-2.5">Status</th>
                    <th className="text-right font-semibold px-3 py-2.5">Δ Score</th>
                  </tr>
                </thead>
                <tbody>
                  {guidanceEvents.map((e) => (
                    <tr key={e.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 font-medium text-ink-900">{e.rep}</td>
                      <td className="px-3 py-3 text-ink-600">{e.lead}</td>
                      <td className="px-3 py-3 text-ink-600 text-xs">{e.phrase}</td>
                      <td className="px-3 py-3 text-center">
                        {e.used ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-positive bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                            <CheckCircle2 size={13} /> Used
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-negative bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                            <XCircle size={13} /> Missed
                          </span>
                        )}
                      </td>
                      <td className={cx('px-3 py-3 text-right font-bold', e.used ? 'text-positive' : 'text-ink-400')}>
                        {e.delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </MotionItem>
      </div>
    </div>
  )
}
