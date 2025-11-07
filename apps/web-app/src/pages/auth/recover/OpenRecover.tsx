import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Recover from './Recover'
import { Spinner } from './components/spinner'

/**
 * OpenRecover
 * - Tries to open the native mobile app using a custom URL scheme or Android intent.
 * - If the app doesn't open within a short timeout, renders the web `Recover` component as a fallback.
 *
 * Behavior notes:
 * - Uses `apagonrd://auth/recover` scheme (from mobile app config) and an Android intent
 *   using package `com.anonymous.apagonrdmovilapp` (from `apps/movil-app/app.json`).
 */
const OpenRecover: React.FC = () => {
  const location = useLocation()
  const [showFallback, setShowFallback] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const ua =
      typeof navigator !== 'undefined'
        ? navigator.userAgent
        : ''

    // If is desktop (no Android or iOS), show the web directly
    if (!/Android|iPhone|iPad|iPod/i.test(ua) || location.search === '') {
      setShowFallback(true)
      return
    }

    // Scheme to try to open the app
    const scheme = `apagonrd://auth/recover/${location.search}`
    const androidIntent = `intent://auth/recover/${location.search}#Intent;scheme=apagonrd;package=com.anonymous.apagonrdmovilapp;end`

    const onVisibilityChange = () => {
      // If the document becomes hidden, assume the app was opened and cancel fallback
      if (document.hidden) {
        if (timeoutRef.current)
          window.clearTimeout(timeoutRef.current)
      }
    }

    document.addEventListener(
      'visibilitychange',
      onVisibilityChange
    )

    // Try to open the app
    try {
      if (/Android/i.test(ua)) {
        // Android: try intent first
        window.location.href = androidIntent
      } else {
        // iOS: try the custom scheme
        window.location.href = scheme
      }
    } catch {
      // ignore errors, we'll fall back after timeout
    }

    // If app doesn't open within ~1.2s, show the web fallback
    timeoutRef.current = window.setTimeout(() => {
      setShowFallback(true)
    }, 1200)

    return () => {
      document.removeEventListener(
        'visibilitychange',
        onVisibilityChange
      )
      if (timeoutRef.current)
        window.clearTimeout(timeoutRef.current)
    }
  }, [location.search])

  if (showFallback) {
    return <Recover />
  }

  return (
    <div className='flex items-center  justify-center gap-4 h-screen'>
      <Spinner className='size-8' />
    </div>
  )
}

export default OpenRecover
