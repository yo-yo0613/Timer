import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Clock from './pages/Clock'
import Timer from './pages/Timer'
import Stopwatch from './pages/Stopwatch'
import Settings from './pages/Settings'
import { useRegisterSW } from 'virtual:pwa-register/react'


// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
}

const pageTransition: import('framer-motion').Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="h-full">
            <Clock />
          </motion.div>
        } />
        <Route path="/timer" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="h-full">
            <Timer />
          </motion.div>
        } />
        <Route path="/stopwatch" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="h-full">
            <Stopwatch />
          </motion.div>
        } />
        <Route path="/settings" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="h-full">
            <Settings />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  // Register SW
  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() {
      if (window.confirm('有新版本可用，是否立即更新？')) {
        updateServiceWorker()
      }
    },
    onOfflineReady() {
      console.log('App ready for offline use')
    },
    immediate: false,
  })

  const [theme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <AnimatedRoutes />
        </main>

        <nav className="fixed bottom-0 w-full h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50">
          <div className="flex justify-around items-center h-16 max-w-md mx-auto">
            <NavItem to="/" icon={<ClockIcon />} label="Clock" />
            <NavItem to="/timer" icon={<TimerIcon />} label="Timer" />
            <NavItem to="/stopwatch" icon={<StopwatchIcon />} label="Stopwatch" />
            <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" />
          </div>
        </nav>
      </div>
    </BrowserRouter>
  )
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full transition-all active:scale-95 ${
          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
        }`
      }
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  )
}

// Simple SVG Icons
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 10" /></svg>
)
const StopwatchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="m22 6-3-3" /><path d="M6.38 18.7 4 21" /><path d="M17.64 18.67 20 21" /></svg>
)
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
)

export default App
