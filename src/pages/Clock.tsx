import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Clock() {
  const [time, setTime] = useState(new Date())
  const [alarm, setAlarm] = useState<string | null>(null)
  const [alarmInput, setAlarmInput] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSetAlarm = (e: React.FormEvent) => {
    e.preventDefault()
    if (alarmInput) {
      setAlarm(alarmInput)
      setAlarmInput('')
    }
  }

  const clearAlarm = () => {
    setAlarm(null)
  }

  // Check if alarm should ring (simple mock implementation)
  const currentHoursAndMinutes = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
  const isAlarmRinging = alarm === currentHoursAndMinutes && time.getSeconds() < 5 // Ring for 5 seconds

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto space-y-12 py-8">
      <div className="text-center">
        <h2 className="text-slate-500 dark:text-slate-400 font-medium mb-2 uppercase tracking-widest text-sm">Current Time</h2>
        
        <motion.div 
          className={`text-6xl md:text-7xl font-light tabular-nums tracking-tighter ${isAlarmRinging ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </motion.div>
        
        <div className="text-slate-400 dark:text-slate-500 mt-2 text-lg">
          {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Alarm
        </h3>
        
        {alarm ? (
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-xl font-medium">{alarm}</span>
            </div>
            <button 
              onClick={clearAlarm}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSetAlarm} className="flex gap-2">
            <input 
              type="time" 
              value={alarmInput}
              onChange={(e) => setAlarmInput(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg tabular-nums"
              required
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-medium transition-all active:scale-95"
            >
              Set
            </button>
          </form>
        )}
        
        {isAlarmRinging && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-center font-medium animate-bounce">
            Alarm is ringing!
          </div>
        )}
      </div>
    </div>
  )
}
