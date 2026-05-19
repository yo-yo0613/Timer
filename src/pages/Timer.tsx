import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const PRESETS = [
  { label: '5m', seconds: 300 },
  { label: '15m', seconds: 900 },
  { label: '30m', seconds: 1800 },
]

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [initialTime, setInitialTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, timeLeft])

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds)
    setInitialTime(seconds)
    setIsRunning(true)
    setCustomMinutes('')
  }

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
    setInitialTime(0)
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mins = parseInt(customMinutes)
    if (!isNaN(mins) && mins > 0) {
      startTimer(mins * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0
  const isFinished = initialTime > 0 && timeLeft === 0

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto space-y-8 py-4">
      
      {/* Circular Progress Display */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="45" 
            className="stroke-slate-200 dark:stroke-slate-800" 
            strokeWidth="4" fill="none" 
          />
          <motion.circle 
            cx="50" cy="50" r="45" 
            className={`${isFinished ? 'stroke-red-500' : 'stroke-blue-500'}`} 
            strokeWidth="4" fill="none" 
            strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-light tabular-nums tracking-tighter ${isFinished ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
            {formatTime(timeLeft)}
          </span>
          {isFinished && <span className="text-red-500 text-sm mt-2 font-medium">Time's up!</span>}
        </div>
      </div>

      {/* Controls */}
      {timeLeft > 0 || isFinished ? (
        <div className="flex space-x-4">
          <button 
            onClick={toggleTimer} 
            disabled={isFinished}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 ${isRunning ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'} disabled:opacity-50 disabled:active:scale-100`}
          >
            {isRunning ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </button>
          <button 
            onClick={resetTimer} 
            className="w-16 h-16 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button 
                key={p.label}
                onClick={() => startTimer(p.seconds)}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 transition-all active:scale-95 shadow-sm"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium uppercase tracking-wider">Custom (Minutes)</h3>
            <form onSubmit={handleCustomSubmit} className="flex gap-2 w-full">
              <input 
                type="number" 
                min="1"
                placeholder="e.g. 45"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="flex-1 min-w-0 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg tabular-nums"
              />
              <button 
                type="submit"
                disabled={!customMinutes}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:active:scale-100 text-white rounded-2xl px-4 md:px-6 py-3 font-medium transition-all active:scale-95 whitespace-nowrap"
              >
                Start
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
