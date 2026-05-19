export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) return

  if (Notification.permission === 'granted') {
    // If Service Worker is available, use it to show notification (better mobile support)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: '/pwa-192x192.svg',
          badge: '/pwa-192x192.svg',
          // @ts-ignore: vibrate is supported in service worker but may not be in DOM types
          vibrate: [200, 100, 200, 100, 200],
          ...options
        }).catch(e => {
          console.error('Service worker notification failed, falling back to window.Notification', e)
          new Notification(title, { icon: '/pwa-192x192.svg', ...options })
        })
      })
    } else {
      // Fallback to normal Notification
      new Notification(title, { icon: '/pwa-192x192.svg', ...options })
    }
  }
}
