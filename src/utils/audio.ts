export type SoundProfile = 'beep' | 'chime' | 'digital' | 'custom'

let audioCtx: AudioContext | null = null
let customAudio: HTMLAudioElement | null = null
let isPlaying = false
let intervalId: number | null = null

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
}

export function playAlarm() {
  if (isPlaying) return
  isPlaying = true
  initAudio()
  
  const profile = (localStorage.getItem('alarmSound') as SoundProfile) || 'beep'
  
  if (profile === 'custom') {
    const customDataUrl = localStorage.getItem('customAlarmSound')
    if (customDataUrl) {
      if (!customAudio) {
        customAudio = new Audio(customDataUrl)
        customAudio.loop = true
      } else {
        customAudio.src = customDataUrl
      }
      customAudio.play().catch(e => console.error('Error playing custom audio:', e))
      return
    }
  }

  // Synthesizer loops
  playSynthLoop(profile)
}

function playSynthLoop(profile: SoundProfile) {
  if (!audioCtx) return
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  
  const playBeep = () => {
    if (!audioCtx) return
    const osc = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    osc.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    if (profile === 'beep') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, audioCtx.currentTime)
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5)
      osc.start(audioCtx.currentTime)
      osc.stop(audioCtx.currentTime + 0.5)
    } else if (profile === 'digital') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime)
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1)
      osc.start(audioCtx.currentTime)
      osc.stop(audioCtx.currentTime + 0.1)
    } else if (profile === 'chime') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime) // C5
      gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5)
      osc.start(audioCtx.currentTime)
      osc.stop(audioCtx.currentTime + 1.5)
    }
  }

  playBeep()
  const delay = profile === 'digital' ? 200 : (profile === 'chime' ? 2000 : 1000)
  intervalId = window.setInterval(playBeep, delay)
}

export function stopAlarm() {
  isPlaying = false
  if (customAudio) {
    customAudio.pause()
    customAudio.currentTime = 0
  }
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

export function playTestSound(profile: SoundProfile, customDataUrl?: string) {
  initAudio()
  
  if (profile === 'custom') {
    const url = customDataUrl || localStorage.getItem('customAlarmSound')
    if (url) {
      const audio = new Audio(url)
      audio.play().catch(e => console.error('Error testing custom audio:', e))
      setTimeout(() => { 
        audio.pause()
        audio.currentTime = 0
      }, 5000) // play 5s test
    }
    return
  }

  // Play a single synth note
  if (!audioCtx) return
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  
  if (profile === 'beep') {
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5)
    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + 0.5)
  } else if (profile === 'digital') {
    osc.type = 'square'
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1)
    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + 0.1)
  } else if (profile === 'chime') {
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5)
    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + 1.5)
  }
}
