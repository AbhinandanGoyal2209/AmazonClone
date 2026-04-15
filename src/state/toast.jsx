import React, { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function push(message, { durationMs = 2500 } = {}) {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, durationMs)
  }

  const value = useMemo(() => ({ push }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          display: 'grid',
          gap: 10,
          zIndex: 100,
        }}
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="card"
            style={{
              padding: 12,
              width: 320,
              borderLeft: '4px solid var(--amazon-accent-2)',
              background: '#fff',
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 4 }}>Added to Cart</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

