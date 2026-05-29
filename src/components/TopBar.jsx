import { useLocation } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'

const titles = {
  '/': 'Dashboard',
  '/leads': 'Lead Intelligence',
  '/scoring': 'Intent Scoring Engine',
  '/live': 'Live Call Monitoring',
  '/pitch': 'Pitch Guidance & CRM',
  '/performance': 'Performance & Incentives',
  '/founder': 'Founder Control Layer',
}

export default function TopBar() {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'R Angle'
  const today = new Date('2026-05-29T10:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-20 bg-canvas/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-4 px-6 h-16">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink-900 truncate">{title}</h2>
          <p className="text-[11px] text-ink-400 -mt-0.5">{today}</p>
        </div>

        {/* Fake global search */}
        <div className="hidden md:flex items-center gap-2 ml-6 flex-1 max-w-md">
          <div className="flex items-center gap-2 w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-sm text-ink-400 shadow-soft">
            <Search size={15} />
            <span className="select-none">Search leads, reps, calls…</span>
            <kbd className="ml-auto text-[10px] font-semibold bg-slate-100 text-ink-400 px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 rounded-full pl-2 pr-3 h-9">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-xs font-semibold text-negative">Live: 3 calls active</span>
          </div>

          <button className="relative grid place-items-center w-9 h-9 rounded-xl bg-white border border-slate-200 text-ink-600 shadow-soft hover:text-ink-900">
            <Bell size={17} />
            <span className="absolute -top-1 -right-1 grid place-items-center w-4 h-4 text-[9px] font-bold text-white bg-negative rounded-full">
              2
            </span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 pl-2">
            <div className="grid place-items-center w-9 h-9 rounded-full bg-brand-700 text-white text-xs font-bold">
              RA
            </div>
            <div className="hidden lg:block leading-tight">
              <div className="text-sm font-semibold text-ink-900">Ar. Ratan Agarwal</div>
              <div className="text-[11px] text-ink-400">Founder</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
