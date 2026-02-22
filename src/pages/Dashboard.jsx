import { C, getLevelFromXP } from '../utils/theme.js'
import { BADGES } from '../data/gamification.js'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`,
      borderRadius:10, padding:'10px 14px', fontSize:13 }}>
      <div style={{ color:C.dim, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color, fontWeight:800 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ state, modules }) {
  const { totalXP, streak, moduleProgress, unlockedBadges, sessionHistory } = state
  const level = getLevelFromXP(totalXP)

  // Build per-module stats
  const modStats = modules.map((m, i) => {
    const prog = moduleProgress[i] || {}
    const exCount = m.sections.filter(s => s.type === 'exercise').length
    const exDone  = Object.values(prog.exercises || {}).filter(Boolean).length
    return {
      name:     `M${i+1}`,
      fullName: m.title.split('–')[0].trim(),
      ejercicios: exDone,
      total:    exCount,
      xp:       prog.complete ? m.xp : Math.round((exDone / (exCount||1)) * m.xp * 0.6),
      complete: prog.complete || false,
      quiz:     prog.quiz || false,
    }
  })

  // Radar data (skills)
  const radarData = [
    { skill:'Fundamentos', val: modStats[0]?.complete ? 100 : modStats[0]?.ejercicios > 0 ? 50 : 0 },
    { skill:'EDA',         val: modStats[1]?.complete ? 100 : modStats[1]?.ejercicios > 0 ? 50 : 0 },
    { skill:'ETL',         val: modStats[2]?.complete ? 100 : modStats[2]?.ejercicios > 0 ? 50 : 0 },
    { skill:'Visualización',val:modStats[3]?.complete ? 100 : modStats[3]?.ejercicios > 0 ? 50 : 0 },
    { skill:'Quizzes',     val: Math.round((modules.filter((_,i)=>moduleProgress[i]?.quiz).length/modules.length)*100) },
  ]

  // Session XP area chart (last 7 sessions or mock)
  const sessions = sessionHistory.length > 0
    ? sessionHistory.slice(-7)
    : Array.from({length:5},(_,i) => ({ date:`Día ${i+1}`, xpEarned: Math.floor(Math.random()*80+20) }))

  // Overall stats
  const completedMods = modStats.filter(m => m.complete).length
  const totalExDone   = modStats.reduce((a,m) => a + m.ejercicios, 0)
  const totalExAll    = modStats.reduce((a,m) => a + m.total, 0)
  const quizzesDone   = modStats.filter(m => m.quiz).length

  const statCards = [
    { icon:'⭐', label:'XP Total',      value:totalXP,                color:C.yellow  },
    { icon:'📘', label:'Módulos',       value:`${completedMods}/4`,   color:C.purple  },
    { icon:'💻', label:'Ejercicios',    value:`${totalExDone}/${totalExAll}`, color:C.teal },
    { icon:'🧠', label:'Quizzes',       value:`${quizzesDone}/4`,     color:C.blue    },
    { icon:'🏅', label:'Insignias',     value:`${unlockedBadges.length}/${BADGES.length}`, color:C.orange },
    { icon:'🔥', label:'Racha actual',  value:`${streak} días`,       color:C.red     },
  ]

  return (
    <div style={{ padding:'0 0 32px' }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>📊 Mi Dashboard</h2>
        <p style={{ color:C.dim, fontSize:14 }}>Tu progreso y estadísticas en tiempo real</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{
            borderColor: `${s.color}33`,
            background: `linear-gradient(135deg,${s.color}0a,${C.card})`,
            textAlign:'center', padding:'16px 12px',
          }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── XP OVER TIME ── */}
      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ fontWeight:800, color:C.dim, fontSize:12,
          textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
          📈 XP por Sesión
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={sessions}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.purple} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="date" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>}/>
            <Area type="monotone" dataKey="xpEarned" name="XP"
              stroke={C.purple} fill="url(#xpGrad)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── MODULE PROGRESS BARS ── */}
      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ fontWeight:800, color:C.dim, fontSize:12,
          textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
          📘 Avance por Módulo
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={modStats} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
            <XAxis type="number" domain={[0,100]} tick={{fill:C.muted,fontSize:10}}
              axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="name" tick={{fill:C.dim,fontSize:11}}
              axisLine={false} tickLine={false} width={28}/>
            <Tooltip content={<Tip/>}/>
            <Bar dataKey="ejercicios" name="Ejercicios hechos" fill={C.teal} radius={[0,4,4,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── SKILLS RADAR ── */}
      <div className="card">
        <div style={{ fontWeight:800, color:C.dim, fontSize:12,
          textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>
          🕸 Mapa de Habilidades
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={C.border}/>
            <PolarAngleAxis dataKey="skill" tick={{fill:C.muted,fontSize:10}}/>
            <Radar dataKey="val" name="Dominio (%)"
              stroke={C.purple} fill={C.purple} fillOpacity={0.25} strokeWidth={2}/>
            <Tooltip content={<Tip/>}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
