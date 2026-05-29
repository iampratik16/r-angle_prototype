import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  PenLine,
  Cpu,
  Users,
  Crown,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, PageHeader, Badge, MotionItem } from '../components/ui'
import { founderControls } from '../data/mockData'
import { cx } from '../lib/utils'

const iconFor = {
  'Pitch Structure': PenLine,
  'Problem-Solving Logic': Cpu,
  'Upselling Strategy': Sparkles,
}

export default function Founder() {
  const [controls, setControls] = useState(founderControls)

  function toggle(id) {
    setControls((cs) => cs.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Founder Control Layer"
        subtitle="Founder defines → AI enforces, across the entire team"
      />

      {/* Hero line */}
      <MotionItem>
        <Card className="p-6 bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-white/10 border border-white/15">
              <Crown size={26} className="text-accent-light" />
            </span>
            <div>
              <div className="text-lg font-bold">The founder's 100%-conversion playbook, scaled to the entire team via AI.</div>
              <div className="text-sm text-white/70 mt-1">
                Ar. Ratan Agarwal sets the rules once — the AI enforces them on every monitored call.
              </div>
            </div>
          </div>
        </Card>
      </MotionItem>

      {/* Founder defines → AI enforces cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {controls.map((c, i) => {
          const Icon = iconFor[c.title] || PenLine
          return (
            <MotionItem key={c.id} delay={0.05 + i * 0.05}>
              <Card className="p-0 overflow-hidden h-full flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-50 text-brand-700">
                      <Icon size={18} />
                    </span>
                    <span className="font-semibold text-ink-900">{c.title}</span>
                  </div>
                  <Toggle on={c.active} onClick={() => toggle(c.id)} />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold mb-1.5">
                    Founder defines
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-ink-900 leading-snug flex-1">
                    {c.rule}
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                    <Cpu size={16} className="text-accent-dark shrink-0" />
                    <span className="text-sm text-ink-900">
                      AI enforces across <span className="font-bold">{c.enforcedAcross} reps</span>
                    </span>
                    <Badge color={c.active ? 'green' : 'slate'} className="ml-auto">
                      {c.active ? 'Enforced' : 'Paused'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </MotionItem>
          )
        })}
      </div>

      {/* Enforcement summary */}
      <MotionItem delay={0.2}>
        <Card className="p-6">
          <CardHeader title="Enforcement Reach" subtitle="How the playbook propagates" icon={Users} />
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex-1 rounded-2xl border border-slate-200 p-5 text-center">
              <Crown size={24} className="mx-auto text-brand-700" />
              <div className="mt-2 text-sm font-semibold text-ink-900">1 Founder</div>
              <div className="text-xs text-ink-400">defines the rules</div>
            </div>
            <div className="hidden md:grid place-items-center text-slate-300 text-2xl font-bold">→</div>
            <div className="flex-1 rounded-2xl border border-slate-200 p-5 text-center">
              <ShieldCheck size={24} className="mx-auto text-accent-dark" />
              <div className="mt-2 text-sm font-semibold text-ink-900">AI Enforcement Layer</div>
              <div className="text-xs text-ink-400">listens, scores & guides live</div>
            </div>
            <div className="hidden md:grid place-items-center text-slate-300 text-2xl font-bold">→</div>
            <div className="flex-1 rounded-2xl border border-slate-200 p-5 text-center">
              <Users size={24} className="mx-auto text-blue-600" />
              <div className="mt-2 text-sm font-semibold text-ink-900">9 Reps + Telecallers</div>
              <div className="text-xs text-ink-400">execute consistently</div>
            </div>
          </div>
        </Card>
      </MotionItem>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cx('relative w-11 h-6 rounded-full transition', on ? 'bg-accent' : 'bg-slate-300')}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow"
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
