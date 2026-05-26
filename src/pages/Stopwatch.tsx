import { useState, useEffect, useRef } from 'react'

export default function Stopwatch() {
  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem('stopwatchIsRunning') === 'true'
  })
  
  const [accumulated, setAccumulated] = useState(() => {
    return parseInt(localStorage.getItem('stopwatchAccumulated') || '0', 10)
  })

  const [startTime, setStartTime] = useState(() => {
    return parseInt(localStorage.getItem('stopwatchStartTime') || '0', 10)
  })

  const [laps, setLaps] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('stopwatchLaps') || '[]')
    } catch {
      return []
    }
  })

  // Display time (derived)
  const [displayTime, setDisplayTime] = useState(() => {
    if (localStorage.getItem('stopwatchIsRunning') === 'true') {
      const st = parseInt(localStorage.getItem('stopwatchStartTime') || '0', 10)
      const acc = parseInt(localStorage.getItem('stopwatchAccumulated') || '0', 10)
      return Date.now() - st + acc
    }
    return parseInt(localStorage.getItem('stopwatchAccumulated') || '0', 10)
  })
  
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        const currentDiff = Date.now() - startTime + accumulated
        setDisplayTime(currentDiff)
      }, 10) // Update every 10ms for smooth centisecond display
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setDisplayTime(accumulated)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, startTime, accumulated])

  const startStop = () => {
    const newIsRunning = !isRunning
    setIsRunning(newIsRunning)
    localStorage.setItem('stopwatchIsRunning', newIsRunning.toString())
    
    if (newIsRunning) {
      // Start
      const now = Date.now()
      setStartTime(now)
      localStorage.setItem('stopwatchStartTime', now.toString())
    } else {
      // Stop
      const newAccumulated = Date.now() - startTime + accumulated
      setAccumulated(newAccumulated)
      setDisplayTime(newAccumulated)
      localStorage.setItem('stopwatchAccumulated', newAccumulated.toString())
    }
  }

  const lapReset = () => {
    if (isRunning) {
      const currentLapTime = Date.now() - startTime + accumulated
      const newLaps = [currentLapTime, ...laps]
      setLaps(newLaps)
      localStorage.setItem('stopwatchLaps', JSON.stringify(newLaps))
    } else {
      setAccumulated(0)
      setDisplayTime(0)
      setLaps([])
      localStorage.removeItem('stopwatchAccumulated')
      localStorage.removeItem('stopwatchStartTime')
      localStorage.removeItem('stopwatchLaps')
    }
  }

  const formatTime = (ms: number) => {
    const totalCentiSeconds = Math.floor(ms / 10)
    const minutes = Math.floor(totalCentiSeconds / 6000)
    const seconds = Math.floor((totalCentiSeconds % 6000) / 100)
    const centiseconds = totalCentiSeconds % 100

    return {
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0'),
      cs: centiseconds.toString().padStart(2, '0')
    }
  }

  const currentFormatted = formatTime(displayTime)

  return (
    <div className="flex flex-col h-full max-w-md mx-auto py-6">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-6xl md:text-7xl font-light tabular-nums tracking-tighter text-slate-900 dark:text-white mb-8 flex items-baseline">
          <span>{currentFormatted.m}</span>
          <span className="opacity-50 mx-1">:</span>
          <span>{currentFormatted.s}</span>
          <span className="opacity-50 mx-1">.</span>
          <span className="text-4xl md:text-5xl">{currentFormatted.cs}</span>
        </div>

        <div className="flex w-full px-8 justify-between">
          <button 
            onClick={lapReset} 
            className="w-20 h-20 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
          >
            {isRunning ? 'Lap' : 'Reset'}
          </button>
          
          <button 
            onClick={startStop} 
            className={`w-20 h-20 rounded-full font-medium transition-all active:scale-95 shadow-sm ${
              isRunning 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50' 
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-6 px-4">
        {laps.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-sm border border-slate-100 dark:border-slate-800">
            {laps.map((lapTime, index) => {
              const lapFormatted = formatTime(lapTime)
              
              // Calculate lap difference
              let lapDiff = lapTime
              if (index < laps.length - 1) {
                lapDiff = lapTime - laps[index + 1]
              }
              const diffFormatted = formatTime(lapDiff)

              return (
                <div key={index} className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Lap {laps.length - index}</span>
                  <div className="flex gap-4">
                    <span className="text-slate-400 dark:text-slate-500 font-mono text-sm flex items-center">
                      +{diffFormatted.m}:{diffFormatted.s}.{diffFormatted.cs}
                    </span>
                    <span className="text-slate-900 dark:text-white font-mono tabular-nums text-lg">
                      {lapFormatted.m}:{lapFormatted.s}.{lapFormatted.cs}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
