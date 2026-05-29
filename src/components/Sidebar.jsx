import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Gauge,
  Radio,
  MessageSquareText,
  Trophy,
  ShieldCheck,
  X,
} from 'lucide-react'
import { cx } from '../lib/utils'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Lead Intelligence', icon: Users },
  { to: '/scoring', label: 'Intent Scoring Engine', icon: Gauge },
  { to: '/live', label: 'Live Call Monitoring', icon: Radio, live: true },
  { to: '/pitch', label: 'Pitch Guidance & CRM', icon: MessageSquareText },
  { to: '/performance', label: 'Performance & Incentives', icon: Trophy },
  { to: '/founder', label: 'Founder Control Layer', icon: ShieldCheck },
]

export default function Sidebar({ open = false, onClose = () => {} }) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={cx(
          'fixed inset-0 bg-ink-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      <aside
        className={cx(
          'w-64 shrink-0 bg-brand-800 text-white flex flex-col h-screen z-50',
          // Slide-in drawer on mobile; sticky in-flow column on desktop
          'fixed inset-y-0 left-0 transition-transform duration-300 ease-out',
          'lg:sticky lg:top-0 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-brand-900 font-extrabold text-lg shadow-lg">
              R∆
            </div>
            <div>
              <div className="font-bold text-[15px] leading-tight">R Angle</div>
              <div className="text-[11px] text-white/55 tracking-wide">AI Sales Intelligence</div>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden grid place-items-center w-8 h-8 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cx(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white text-brand-800 shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={cx(item.live && !isActive && 'text-red-400')} />
                  <span className="flex-1">{item.label}</span>
                  {item.live && (
                    <span className="inline-flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>
                      <span
                        className={cx(
                          'text-[10px] font-bold tracking-wider',
                          isActive ? 'text-negative' : 'text-red-400'
                        )}
                      >
                        LIVE
                      </span>
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-[11px] font-semibold text-white/80">Prototype — demo data</div>
            <div className="text-[10px] text-white/45 mt-0.5">Simulated AI · no live backend</div>
          </div>
        </div>
      </aside>
    </>
  )
}
