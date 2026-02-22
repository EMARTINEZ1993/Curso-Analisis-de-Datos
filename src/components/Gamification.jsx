import { C, LEVELS, getLevelFromXP } from '../utils/theme.js'
import { BADGES, SHOP_ITEMS, RARITY_COLORS } from '../data/gamification.js'

/* ── LEVEL CARD ── */
export function LevelCard({ xp, streak }) {
  const level    = getLevelFromXP(xp)
  const nextLevel= LEVELS[LEVELS.indexOf(level) + 1]
  const pct      = nextLevel
    ? Math.round(((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100)
    : 100

  return (
    <div className="card" style={{ marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <div style={{ fontSize:36, animation:'float 3s ease-in-out infinite' }}>{level.icon}</div>
        <div>
          <div style={{ fontSize:11, fontWeight:800, color:C.muted,
            textTransform:'uppercase', letterSpacing:1 }}>Nivel</div>
          <div style={{ fontSize:20, fontWeight:900, color:level.color }}>{level.name}</div>
        </div>
        <div style={{ marginLeft:'auto', textAlign:'right' }}>
          <div style={{ fontSize:22, fontWeight:900, color:C.yellow }}>⭐ {xp}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>XP Total</div>
        </div>
      </div>

      {nextLevel && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between',
            fontSize:11, color:C.muted, fontWeight:700, marginBottom:6 }}>
            <span>{level.name}</span>
            <span>{nextLevel.name} ({nextLevel.minXP - xp} XP más)</span>
          </div>
          <div className="progress-track" style={{ height:8 }}>
            <div className="progress-fill" style={{
              width:`${pct}%`,
              background:`linear-gradient(90deg,${level.color},${nextLevel.color})`,
              boxShadow:`0 0 8px ${level.color}66`,
            }}/>
          </div>
        </>
      )}

      <div style={{ display:'flex', gap:12, marginTop:16 }}>
        <div style={{ flex:1, background:C.surface, borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
          <div style={{ fontSize:22, marginBottom:2, animation:'streakBurn 2s infinite' }}>🔥</div>
          <div style={{ fontSize:16, fontWeight:900, color:C.orange }}>{streak}</div>
          <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>Racha días</div>
        </div>
        <div style={{ flex:1, background:C.surface, borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
          <div style={{ fontSize:22, marginBottom:2 }}>📊</div>
          <div style={{ fontSize:16, fontWeight:900, color:C.purple }}>{pct}%</div>
          <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>Al siguiente</div>
        </div>
      </div>
    </div>
  )
}

/* ── BADGES PANEL ── */
export function BadgesPanel({ unlockedBadges }) {
  const unlocked = new Set(unlockedBadges)
  return (
    <div className="card" style={{ marginBottom:16 }}>
      <div style={{ fontSize:11, fontWeight:800, color:C.muted,
        textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>
        🏅 Insignias ({unlockedBadges.length}/{BADGES.length})
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
        {BADGES.map(b => {
          const earned = unlocked.has(b.id)
          return (
            <div key={b.id} title={`${b.name}: ${b.desc}`} style={{
              aspectRatio:'1', borderRadius:10, border:`1px solid ${earned ? RARITY_COLORS[b.rarity] : C.border}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, cursor:'default', transition:'all 0.2s',
              background: earned ? `${RARITY_COLORS[b.rarity]}18` : C.surface,
              filter: earned ? 'none' : 'grayscale(1)',
              opacity: earned ? 1 : 0.35,
              animation: earned ? 'none' : 'none',
            }}
            onMouseEnter={e => { if(earned) e.currentTarget.style.transform='scale(1.15)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)' }}
            >
              {b.icon}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── SHOP ── */
export function Shop({ totalXP, shopItems, onPurchase }) {
  const [tab, setTab] = useState('avatar')
  const tabs = [
    { id:'avatar',  label:'👤 Avatares' },
    { id:'theme',   label:'🎨 Temas' },
    { id:'powerup', label:'⚡ Poderes' },
  ]
  const items = SHOP_ITEMS.filter(i => i.type === tab)

  return (
    <div>
      <div style={{ display:'flex', gap:4, marginBottom:16,
        background:C.surface, borderRadius:10, padding:4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:'8px 4px', borderRadius:8, border:'none',
            background: tab===t.id ? C.purple : 'transparent',
            color: tab===t.id ? 'white' : C.muted,
            fontFamily:'var(--font)', fontWeight:800, fontSize:12, cursor:'pointer',
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {items.map(item => {
          const owned   = shopItems.includes(item.id)
          const canBuy  = totalXP >= item.cost && !owned
          return (
            <div key={item.id} style={{
              background:C.surface, borderRadius:12, padding:14,
              border:`1px solid ${owned ? C.green : C.border}`,
              transition:'all 0.2s',
            }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{item.icon}</div>
              <div style={{ fontWeight:800, fontSize:13, color:C.text, marginBottom:2 }}>{item.name}</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>{item.desc}</div>
              <button
                onClick={() => canBuy && onPurchase(item.id, item.cost)}
                disabled={!canBuy}
                style={{
                  width:'100%', padding:'7px 0', borderRadius:8, border:'none',
                  background: owned ? `${C.green}22`
                    : canBuy ? `linear-gradient(90deg,${C.yellow},${C.orange})`
                    : C.border,
                  color: owned ? C.green : canBuy ? '#0d0f1a' : C.muted,
                  fontFamily:'var(--font)', fontWeight:900, fontSize:12, cursor: canBuy ? 'pointer' : 'not-allowed',
                }}>
                {owned ? '✅ Obtenido' : `⭐ ${item.cost} XP`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Need useState import
import { useState } from 'react'
