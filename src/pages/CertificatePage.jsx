import { C, getLevelFromXP } from '../utils/theme.js'

export default function CertificatePage({ student, totalXP, onBack, onReset }) {
  const today = new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' })
  const level = getLevelFromXP(totalXP)

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:`radial-gradient(ellipse at center,#1a1040 0%,#0d0f1a 70%)`, padding:24 }}>
      <div style={{ maxWidth:720, width:'100%', animation:'fadeUp 0.8s' }}>
        <div style={{
          background:`linear-gradient(135deg,#1a1d2e,#0d0f1a)`,
          border:`2px solid ${C.yellow}`, borderRadius:24, padding:52,
          textAlign:'center', position:'relative', overflow:'hidden',
          boxShadow:`0 0 80px ${C.yellow}22, 0 0 120px ${C.purple}18`,
        }}>
          {/* Corner decorations */}
          {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos,i) => (
            <div key={i} style={{ position:'absolute', ...pos, width:40, height:40,
              border:`2px solid ${C.yellow}55`, borderRadius:4 }}/>
          ))}

          <div style={{ fontSize:72, marginBottom:14, animation:'float 3s ease-in-out infinite' }}>🏆</div>
          <div style={{ fontSize:12, fontWeight:800, color:C.yellow, letterSpacing:4,
            textTransform:'uppercase', marginBottom:10 }}>Certificado de Finalización</div>
          <div style={{ width:60, height:2, background:C.yellow, margin:'0 auto 28px' }}/>

          <div style={{ fontSize:14, color:C.dim, marginBottom:10 }}>Este certificado se otorga a</div>
          <div style={{ fontSize:38, fontWeight:900, color:C.text, marginBottom:6 }}>{student.name}</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:28 }}>
            por haber completado satisfactoriamente el curso
          </div>

          <div style={{ background:C.purple+'22', border:`1px solid ${C.purple}44`,
            borderRadius:16, padding:'18px 28px', marginBottom:28 }}>
            <div style={{ fontSize:20, fontWeight:900, color:C.text, marginBottom:4 }}>
              Análisis de Datos en Python
            </div>
            <div style={{ fontSize:13, color:C.dim }}>Guía Interactiva Guiada • 4 Módulos Completados</div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:36 }}>
            {[
              ['📅','Fecha',today],
              ['⭐','XP Total',`${totalXP} XP`],
              [level.icon,'Nivel alcanzado',level.name],
              ['⏱️','Duración','~160 horas'],
            ].map(([icon,label,val]) => (
              <div key={label} style={{ background:C.surface, borderRadius:12, padding:'12px 6px' }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{icon}</div>
                <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>{label}</div>
                <div style={{ fontSize:12, fontWeight:800, color:C.text }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            <button onClick={() => window.print()} className="btn" style={{
              background:`linear-gradient(135deg,${C.yellow},#d97706)`,
              color:'#0d0f1a', padding:'13px 24px', fontSize:15,
            }}>
              📥 Descargar Certificado
            </button>
            <button onClick={onBack} className="btn btn-ghost">
              ↩ Volver al curso
            </button>
            <button onClick={() => { if(confirm('¿Reiniciar todo el progreso?')) onReset() }}
              className="btn btn-ghost" style={{ color:C.red, borderColor:C.red+'55' }}>
              🔁 Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
