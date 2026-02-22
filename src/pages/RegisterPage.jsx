import { useState } from 'react'
import { C } from '../utils/theme.js'

export default function RegisterPage({ onRegister }) {
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [err,   setErr]   = useState('')

  const submit = () => {
    if (!name.trim() || name.trim().length < 3) { setErr('Ingresa tu nombre completo (mín. 3 caracteres).'); return }
    if (!email.includes('@'))                    { setErr('Ingresa un correo electrónico válido.'); return }
    onRegister({ name: name.trim(), email: email.trim() })
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:C.bg, padding:24 }}>
      <div style={{ maxWidth:460, width:'100%', animation:'fadeUp 0.6s' }}>
        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:64, marginBottom:14, animation:'float 3s ease-in-out infinite' }}>🐍</div>
          <div style={{ fontSize:30, fontWeight:900, color:C.text, marginBottom:6 }}>CodeQuest</div>
          <div style={{ fontSize:15, color:C.dim }}>Análisis de Datos en Python</div>
        </div>

        <div className="card" style={{ padding:36 }}>
          <h2 style={{ fontSize:21, fontWeight:900, marginBottom:6, color:C.text }}>¡Comienza tu viaje! 🚀</h2>
          <p style={{ color:C.muted, fontSize:13, marginBottom:28, lineHeight:1.6 }}>
            Regístrate para guardar tu progreso, ganar XP y obtener tu certificado al finalizar.
          </p>

          {[
            { label:'👤 Nombre completo', type:'text', ph:'Tu nombre completo', val:name, setter:setName },
            { label:'📧 Correo electrónico', type:'email', ph:'tu@correo.com', val:email, setter:setEmail },
          ].map(({ label, type, ph, val, setter }, i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.dim, marginBottom:5 }}>
                {label}
              </label>
              <input type={type} placeholder={ph} value={val}
                onChange={e => { setter(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ width:'100%', padding:'13px 15px', background:C.surface,
                  border:`1px solid ${C.border}`, borderRadius:11, color:C.text,
                  fontSize:14, outline:'none', fontFamily:'var(--font)',
                  transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = C.purple}
                onBlur={e  => e.target.style.borderColor = C.border}
              />
            </div>
          ))}

          {err && (
            <div style={{ color:C.red, fontSize:12, marginBottom:14, fontWeight:700 }}>⚠️ {err}</div>
          )}

          <button onClick={submit} className="btn btn-primary"
            style={{ width:'100%', justifyContent:'center', padding:15, fontSize:15, marginTop:4 }}>
            🚀 Comenzar curso gratis
          </button>

          {/* Stats */}
          <div style={{ display:'flex', gap:0, marginTop:24,
            borderTop:`1px solid ${C.border}`, paddingTop:20 }}>
            {[['4','Módulos'],['20+','Ejercicios'],['600','XP total'],['∞','Reintentos']].map(([n,l]) => (
              <div key={l} style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:20, fontWeight:900, color:C.purple }}>{n}</div>
                <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
