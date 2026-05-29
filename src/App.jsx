import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Scoring from './pages/Scoring'
import Live from './pages/Live'
import Pitch from './pages/Pitch'
import Performance from './pages/Performance'
import Founder from './pages/Founder'

export default function App() {
  // Mobile drawer state — sidebar is a slide-in drawer below lg, static above.
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas text-ink-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 py-5 sm:py-6 max-w-[1500px] w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/scoring" element={<Scoring />} />
            <Route path="/live" element={<Live />} />
            <Route path="/pitch" element={<Pitch />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/founder" element={<Founder />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
