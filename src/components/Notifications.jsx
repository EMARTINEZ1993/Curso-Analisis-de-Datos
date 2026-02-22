import { useState, useRef, useCallback, useEffect } from 'react'
import { C } from '../utils/theme.js'
import confetti from 'canvas-confetti'

/* ── TOAST HOOK ── */
export function useToast() {
  const [toasts, setToasts] = useState([])
  const timerRef = useRef({})

  const show = useCallback((icon, msg, color = C.green, duration = 3500) => {
    const id = Date.now()
    setToasts(p => [...p, { id, icon, msg, color }])
    timerRef.current[id] = setTimeout(() => {
      setToasts(p => p.filter(t => t.id !== id))
    }, duration)
  }, [])

  const dismiss = useCallback((id) => {
    clearTimeout(timerRef.current[id])
    setToasts(p => p.filter(t => t.id !== id))
  }, [])

  return { toasts, show, dismiss }
}

/* ── TOAST RENDERER ── */
export function ToastStack({ toasts, onDismiss }) {
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999,
      display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end' }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => onDismiss(t.id)} style={{
          background: C.card, border:`1px solid ${C.border}`,
          borderLeft:`4px solid ${t.color}`, borderRadius:14,
          padding:'13px 18px', display:'flex', alignItems:'center', gap:12,
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
          animation:'fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          cursor:'pointer', maxWidth:340,
        }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{t.icon}</span>
          <span style={{ fontWeight:700, fontSize:14, color:C.text, lineHeight:1.4 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

/* ── XP FLOATING TEXT ── */
export function XPFloat({ amount, x, y, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div style={{
      position:'fixed', left:x, top:y, pointerEvents:'none', zIndex:9999,
      fontFamily:'var(--font)', fontWeight:900, fontSize:20,
      color:C.yellow, textShadow:`0 0 10px ${C.yellow}88`,
      animation:'xpFloat 1.2s ease-out forwards',
    }}>
      +{amount} XP
    </div>
  )
}

/* ── CONFETTI HELPERS ── */
export function fireConfetti(type = 'default') {
  if (type === 'module') {
    confetti({ particleCount:120, spread:80, startVelocity:35, origin:{y:0.6},
      colors:['#6366f1','#3b82f6','#14b8a6','#22c55e','#f59e0b','#ec4899'] })
  } else if (type === 'badge') {
    confetti({ particleCount:60, spread:50, startVelocity:25, origin:{y:0.5},
      colors:['#f59e0b','#f97316','#ec4899'] })
  } else {
    confetti({ particleCount:80, spread:70, origin:{y:0.65} })
  }
}

/* ── LEVEL UP OVERLAY ── */
export function LevelUpOverlay({ level, onClose }) {
  useEffect(() => {
    fireConfetti('module')
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.85)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:9998, animation:'fadeIn 0.3s',
    }} onClick={onClose}>
      <div style={{
        textAlign:'center', animation:'levelUp 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        padding:40,
      }}>
        <div style={{ fontSize:90, marginBottom:16 }}>{level.icon}</div>
        <div style={{ fontSize:14, fontWeight:800, color:C.yellow,
          letterSpacing:4, textTransform:'uppercase', marginBottom:8 }}>
          ¡Nivel alcanzado!
        </div>
        <div style={{ fontSize:42, fontWeight:900, color:C.text, marginBottom:8 }}>
          {level.name}
        </div>
        <div style={{ fontSize:15, color:C.dim }}>Toca para continuar</div>
      </div>
    </div>
  )
}

/* ── BADGE UNLOCKED OVERLAY ── */
export function BadgeUnlocked({ badge, onClose }) {
  useEffect(() => {
    fireConfetti('badge')
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:9997, animation:'fadeIn 0.3s',
    }} onClick={onClose}>
      <div style={{ textAlign:'center', animation:'badgePop 0.5s ease' }}>
        <div style={{ fontSize:80, marginBottom:12 }}>{badge.icon}</div>
        <div style={{ fontSize:13, fontWeight:800, color:C.yellow,
          letterSpacing:3, textTransform:'uppercase', marginBottom:6 }}>
          ¡Insignia desbloqueada!
        </div>
        <div style={{ fontSize:28, fontWeight:900, color:C.text, marginBottom:4 }}>{badge.name}</div>
        <div style={{ fontSize:14, color:C.dim }}>{badge.desc}</div>
      </div>
    </div>
  )
}
