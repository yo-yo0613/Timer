import { useEffect, useState, useRef } from 'react'
import { playTestSound, type SoundProfile } from '../utils/audio'
import { requestNotificationPermission } from '../utils/notifications'

export default function Settings() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  })

  const [alarmSound, setAlarmSound] = useState<SoundProfile>(() => {
    return (localStorage.getItem('alarmSound') as SoundProfile) || 'beep'
  })
  
  const [customSoundName, setCustomSoundName] = useState<string | null>(() => {
    return localStorage.getItem('customAlarmSoundName') || null
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync global theme
  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const handleSoundChange = (profile: SoundProfile) => {
    setAlarmSound(profile)
    localStorage.setItem('alarmSound', profile)
    if (profile !== 'custom' || localStorage.getItem('customAlarmSound')) {
      playTestSound(profile)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large! Please choose an MP3/audio file smaller than 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      localStorage.setItem('customAlarmSound', dataUrl)
      localStorage.setItem('customAlarmSoundName', file.name)
      setCustomSoundName(file.name)
      handleSoundChange('custom')
    }
    reader.readAsDataURL(file)
  }

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      alert('Notifications enabled successfully! You will be notified when time is up.')
    } else {
      alert('Permission denied. Please enable notifications in your browser settings to use this feature.')
    }
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto py-8 space-y-8 overflow-y-auto px-1">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 px-1">Settings</h2>
        
        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Appearance</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred theme</p>
              </div>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => toggleTheme('light')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 whitespace-nowrap ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Light
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 whitespace-nowrap ${theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Alarm Sound */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex flex-col p-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Alarm Sound</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sound to play when time is up</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => handleSoundChange('beep')} className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-95 border ${alarmSound === 'beep' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 border-transparent text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>Classic Beep</button>
              <button onClick={() => handleSoundChange('chime')} className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-95 border ${alarmSound === 'chime' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 border-transparent text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>Soft Chime</button>
              <button onClick={() => handleSoundChange('digital')} className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-95 border ${alarmSound === 'digital' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 border-transparent text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>Digital Alarm</button>
              
              <button onClick={() => { if (localStorage.getItem('customAlarmSound')) handleSoundChange('custom'); else fileInputRef.current?.click(); }} className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-95 border flex flex-col items-center justify-center ${alarmSound === 'custom' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 border-transparent text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                <span>{customSoundName ? 'Custom MP3' : '+ Add MP3'}</span>
                {customSoundName && <span className="text-xs opacity-70 truncate max-w-[100px]">{customSoundName}</span>}
              </button>
            </div>
            
            <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            
            {customSoundName && (
              <button onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-500 mt-1 self-end underline">Change custom MP3...</button>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Push Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when time is up</p>
              </div>
            </div>
            
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-medium transition-all active:scale-95"
            >
              Enable
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider px-2 text-center">About</h3>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-lg">Timer & Clock</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Version 1.1.0</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-4 max-w-[200px] mx-auto">
            A beautiful, offline-capable time management app.
          </p>
        </div>
      </div>
    </div>
  )
}
