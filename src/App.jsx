import { useState, useRef } from "react";

// �""? ESTILOS GLOBALES �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap";
document.head.appendChild(fontLink);

const styleEl = document.createElement("style");
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0d0f1a; color: #e8eaf6; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #1a1d2e; }
  ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 3px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }
  @keyframes shake { 0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)} }
  @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)}50%{box-shadow:0 0 40px rgba(99,102,241,0.7)} }
  @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
  @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
  @keyframes xpFloat { 0%{opacity:0;transform:translateY(0) scale(0.5)} 20%{opacity:1;transform:translateY(-20px) scale(1.2)} 100%{opacity:0;transform:translateY(-80px) scale(1)} }
  @keyframes levelUp { 0%{transform:scale(0.3);opacity:0} 50%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
  @keyframes badgePop { 0%{transform:scale(0) rotate(-180deg)} 70%{transform:scale(1.2) rotate(10deg)} 100%{transform:scale(1) rotate(0)} }
  .progress-track { background: #252840; border-radius: 999px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 999px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
  .card { background: #1a1d2e; border: 1px solid #252840; border-radius: 16px; transition: all 0.2s; }
  .btn { padding: 10px 20px; border-radius: 10px; border: none; font-weight: 900; font-size: 14px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
  .btn-primary { background: linear-gradient(135deg, #6366f1, #3b82f6); color: white; }
  .btn-ghost { background: transparent; border: 1px solid #252840; color: #94a3b8; }
`;
document.head.appendChild(styleEl);

// �""? COLORES �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
const C = {
  bg: "#0d0f1a", surface: "#13162a", card: "#1a1d2e", border: "#252840",
  purple: "#6366f1", purpleLight: "#818cf8", blue: "#3b82f6", teal: "#14b8a6",
  green: "#22c55e", yellow: "#f59e0b", orange: "#f97316", red: "#ef4444",
  pink: "#ec4899", text: "#e8eaf6", muted: "#64748b", dim: "#94a3b8",
};
// Temas disponibles para la tienda
const THEMES = {
  default: { purple: C.purple, blue: C.blue, teal: C.teal },
  theme_matrix: { purple: '#00ff00', blue: '#00cc00', teal: '#00aa00' },
  theme_sunset: { purple: '#ff6b6b', blue: '#ff8e8e', teal: '#ffb347' },
};

// Función para obtener colores activos
const getActiveColors = () => {
  if (activeTheme && THEMES[activeTheme]) {
    return THEMES[activeTheme];
  }
  return { purple: C.purple, blue: C.blue, teal: C.teal };
};

// �""? NIVELES Y XP (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
const LEVELS = [
  { level: 1, name: 'Novato', minXP: 0, icon: '', color: C.teal },
  { level: 2, name: 'Aprendiz', minXP: 200, icon: '', color: C.blue },
  { level: 3, name: 'Analista', minXP: 500, icon: '', color: C.purple },
  { level: 4, name: 'Explorador', minXP: 900, icon: '', color: C.orange },
  { level: 5, name: 'Científico', minXP: 1400, icon: '', color: C.yellow },
  { level: 6, name: 'Maestro', minXP: 2000, icon: '', color: C.pink },
];

const getLevelFromXP = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
};

// �""? INSIGNIAS (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
const BADGES = [
  { id: 'first_login', icon: '', name: 'Primer Paso', desc: 'Te registraste', rarity: 'common' },
  { id: 'first_code', icon: '', name: 'Primer Código', desc: 'Ejecutaste tu primer código', rarity: 'common' },
  { id: 'first_module', icon: '', name: 'Módulo 1', desc: 'Completaste Fundamentos', rarity: 'common' },
  { id: 'streak_3', icon: '', name: 'Racha de 3', desc: '3 días seguidos', rarity: 'rare' },
  { id: 'streak_7', icon: '', name: 'Semana Perfecta', desc: '7 días seguidos', rarity: 'epic' },
  { id: 'perfect_quiz', icon: '', name: 'Quiz Perfecto', desc: '5/5 en un quiz', rarity: 'rare' },
  { id: 'first_try', icon: '', name: 'A la Primera', desc: 'Primer intento correcto', rarity: 'rare' },
  { id: 'mod2_done', icon: '', name: 'EDA Master', desc: 'Completaste EDA', rarity: 'common' },
  { id: 'mod3_done', icon: '', name: 'ETL Pro', desc: 'Completaste ETL', rarity: 'common' },
  { id: 'mod4_done', icon: '', name: 'Viz Wizard', desc: 'Completaste Gráficos', rarity: 'common' },
  { id: 'all_modules', icon: '', name: 'Graduado', desc: 'Completaste todos los módulos', rarity: 'legendary' },
  { id: 'xp_100', icon: '⭐', name: 'Primera Estrella', desc: '100 XP', rarity: 'common' },
  { id: 'xp_500', icon: '', name: 'Supernova', desc: '500 XP', rarity: 'rare' },
  { id: 'xp_1000', icon: '', name: 'Leyenda', desc: '1000 XP', rarity: 'epic' },
];

const RARITY_COLORS = { common: '#94a3b8', rare: '#3b82f6', epic: '#8b5cf6', legendary: '#f59e0b' };

// �""? TIENDA (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
const SHOP_ITEMS = [
  { id: 'avatar_rocket', type: 'avatar', icon: '', name: 'Cohete', cost: 50, desc: 'Avatar espacial' },
  { id: 'avatar_dragon', type: 'avatar', icon: '', name: 'Dragón', cost: 80, desc: 'Avatar épico' },
  { id: 'avatar_robot', type: 'avatar', icon: '', name: 'Robot', cost: 60, desc: 'Avatar tecno' },
  { id: 'theme_matrix', type: 'theme', icon: '', name: 'Matrix', cost: 150, desc: 'Tema verde' },
  { id: 'theme_sunset', type: 'theme', icon: '', name: 'Sunset', cost: 150, desc: 'Tema cálido' },
  { id: 'hint_pack', type: 'powerup', icon: '', name: 'Pack de Pistas', cost: 30, desc: '3 pistas extra' },
  { id: 'xp_boost', type: 'powerup', icon: '', name: 'XP x2', cost: 80, desc: 'Doble XP por 1 módulo' },
];

// �""? CONFETTI (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function Confetti({ active }) {
  if (!active) return null;
  const colors = [C.purple, C.blue, C.teal, C.green, C.yellow, C.orange, C.pink];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {Array.from({ length: 100 }, (_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 8 + Math.random() * 8;
        return <div key={i} style={{
          position: "absolute", left: Math.random() * 100 + "vw", top: -20,
          width: size, height: size, background: color,
          borderRadius: Math.random() > .5 ? "50%" : 3,
          animation: `confettiFall ${1.5 + Math.random() * 1.5}s ease-out ${Math.random()}s forwards`,
        }} />;
      })}
    </div>
  );
}

// �""? TOAST (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
function Toast({ toast }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 1000, background: C.card,
      border: `1px solid ${C.border}`, borderLeft: `4px solid ${toast.color || C.green}`,
      borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1)", maxWidth: 340
    }}>
      <span style={{ fontSize: 22 }}>{toast.icon}</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.4 }}>{toast.msg}</span>
    </div>
  );
}

// �""? XP FLOAT (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function XPFloat({ amount, x, y, onDone }) {
  setTimeout(onDone, 1200);
  return (
    <div style={{
      position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999,
      fontWeight: 900, fontSize: 20, color: C.yellow, textShadow: `0 0 10px ${C.yellow}88`,
      animation: 'xpFloat 1.2s ease-out forwards',
    }}>
      +{amount} XP
    </div>
  );
}

// �""? LEVEL UP OVERLAY (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function LevelUpOverlay({ level, onClose }) {
  setTimeout(onClose, 4000);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9998, animation: 'fadeIn 0.3s',
    }} onClick={onClose}>
      <div style={{ textAlign: 'center', animation: 'levelUp 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ fontSize: 90, marginBottom: 16 }}>{level.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.yellow, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>
          ¡Nivel alcanzado!
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, color: C.text, marginBottom: 8 }}>{level.name}</div>
        <div style={{ fontSize: 15, color: C.dim }}>Toca para continuar</div>
      </div>
    </div>
  );
}

// �""? BADGE UNLOCKED (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function BadgeUnlocked({ badge, onClose }) {
  setTimeout(onClose, 3500);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9997, animation: 'fadeIn 0.3s',
    }} onClick={onClose}>
      <div style={{ textAlign: 'center', animation: 'badgePop 0.5s ease' }}>
        <div style={{ fontSize: 80, marginBottom: 12 }}>{badge.icon}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.yellow, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
          ¡Insignia desbloqueada!
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 4 }}>{badge.name}</div>
        <div style={{ fontSize: 14, color: C.dim }}>{badge.desc}</div>
      </div>
    </div>
  );
}

// �""? PROGRESS BAR (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function ProgressBar({ value, color = C.purple, height = 8, label }) {
  return (
    <div>
      {label && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{value}%</span>
      </div>}
      <div className="progress-track" style={{ height }}>
        <div className="progress-fill" style={{
          width: `${value}%`, background: `linear-gradient(90deg,${color},${color}cc)`,
          boxShadow: `0 0 10px ${color}66`
        }} />
      </div>
    </div>
  );
}

// �""? LEVEL CARD (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function LevelCard({ xp, streak }) {
  const level = getLevelFromXP(xp);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const pct = nextLevel ? Math.round(((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100) : 100;

  return (
    <div className="card" style={{ marginBottom: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 36, animation: 'float 3s ease-in-out infinite' }}>{level.icon}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase' }}>Nivel</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: level.color }}>{level.name}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.yellow }}>⭐ {xp}</div>
          <div style={{ fontSize: 11, color: C.muted }}>XP Total</div>
        </div>
      </div>
      {nextLevel && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.muted, marginBottom: 6 }}>
            <span>{level.name}</span>
            <span>{nextLevel.name} ({nextLevel.minXP - xp} XP más)</span>
          </div>
          <ProgressBar value={pct} color={level.color} height={8} />
        </>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <div style={{ flex: 1, background: C.surface, borderRadius: 10, padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 2 }}>🔥</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.orange }}>{streak}</div>
          <div style={{ fontSize: 10, color: C.muted }}>Racha</div>
        </div>
        <div style={{ flex: 1, background: C.surface, borderRadius: 10, padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 2 }}>📊</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.purple }}>{pct}%</div>
          <div style={{ fontSize: 10, color: C.muted }}>Al siguiente</div>
        </div>
      </div>
    </div>
  );
}

// �""? BADGES PANEL (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function BadgesPanel({ unlockedBadges }) {
  const unlocked = new Set(unlockedBadges);
  return (
    <div className="card" style={{ marginBottom: 16, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: 12 }}>
        Insignias ({unlockedBadges.length}/{BADGES.length})
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {BADGES.map(b => {
          const earned = unlocked.has(b.id);
          return (
            <div key={b.id} title={`${b.name}: ${b.desc}`} style={{
              aspectRatio: '1', borderRadius: 10, border: `1px solid ${earned ? RARITY_COLORS[b.rarity] : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, cursor: 'default', transition: 'all 0.2s',
              background: earned ? `${RARITY_COLORS[b.rarity]}18` : C.surface,
              filter: earned ? 'none' : 'grayscale(1)',
              opacity: earned ? 1 : 0.35,
            }}
            onMouseEnter={e => { if (earned) e.currentTarget.style.transform = 'scale(1.15)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}>
              {b.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// �""? SHOP (del P2) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
// Reemplaza la sección del Shop con esta versión mejorada
function Shop({ totalXP, shopItems, onPurchase, onEquip, activeAvatar, activeTheme, activePowerups }) {
  const [tab, setTab] = useState('avatar');
  const tabs = [
    { id: 'avatar', label: 'Avatares' },
    { id: 'theme', label: 'Temas' },
    { id: 'powerup', label: 'Poderes' },
  ];
  const items = SHOP_ITEMS.filter(i => i.type === tab);

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: 12 }}>
        Tienda - {totalXP} XP disponibles
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: C.surface, borderRadius: 10, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none',
            background: tab === t.id ? C.purple : 'transparent',
            color: tab === t.id ? 'white' : C.muted,
            fontWeight: 800, fontSize: 12, cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Items grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map(item => {
          const owned = shopItems.includes(item.id);
          const canBuy = totalXP >= item.cost && !owned;
          const isActive = 
            (item.type === 'avatar' && activeAvatar === item.id) ||
            (item.type === 'theme' && activeTheme === item.id) ||
            (item.type === 'powerup' && activePowerups.includes(item.id));

          return (
            <div key={item.id} style={{
              background: C.surface, borderRadius: 12, padding: 14,
              border: `2px solid ${isActive ? C.green : (owned ? C.purple + '66' : C.border)}`,
              position: 'relative',
              transition: 'all 0.2s',
            }}>
              {isActive && (
                <div style={{
                  position: 'absolute', top: -8, right: -8,
                  background: C.green, borderRadius: '50%',
                  width: 20, height: 20, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: 'white',
                }}>✓</div>
              )}
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.text }}>{item.name}</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{item.desc}</div>
              
              {owned ? (
                <button
                  onClick={() => onEquip(item.id)}
                  style={{
                    width: '100%', padding: '7px 0', borderRadius: 8, border: 'none',
                    background: isActive ? C.green + '22' : C.purple + '22',
                    color: isActive ? C.green : C.purple,
                    fontWeight: 900, fontSize: 12, cursor: 'pointer',
                  }}>
                  {isActive ? 'Equipado' : 'Equipar'}
                </button>
              ) : (
                <button
                  onClick={() => onPurchase(item.id, item.cost)}
                  disabled={!canBuy}
                  style={{
                    width: '100%', padding: '7px 0', borderRadius: 8, border: 'none',
                    background: canBuy ? `linear-gradient(90deg,${C.yellow},${C.orange})` : C.border,
                    color: canBuy ? '#0d0f1a' : C.muted,
                    fontWeight: 900, fontSize: 12, cursor: canBuy ? 'pointer' : 'not-allowed',
                  }}>
                  {`⭐ ${item.cost} XP`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// �""? DASHBOARD (del P2 simplificado) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function Dashboard({ state, modules }) {
  const { totalXP, streak, moduleProgress, unlockedBadges } = state;
  const level = getLevelFromXP(totalXP);

  const modStats = modules.map((m, i) => {
    const prog = moduleProgress[i] || {};
    const exCount = m.sections.filter(s => s.type === 'exercise').length;
    const exDone = Object.values(prog.exercises || {}).filter(Boolean).length;
    return {
      name: `M${i + 1}`,
      ejercicios: exDone,
      total: exCount,
      complete: prog.complete || false,
      quiz: prog.quiz || false,
    };
  });

  const completedMods = modStats.filter(m => m.complete).length;
  const totalExDone = modStats.reduce((a, m) => a + m.ejercicios, 0);
  const totalExAll = modStats.reduce((a, m) => a + m.total, 0);
  const quizzesDone = modStats.filter(m => m.quiz).length;

  const statCards = [
    { icon: '⭐', label: 'XP Total', value: totalXP, color: C.yellow },
    { icon: '', label: 'Módulos', value: `${completedMods}/4`, color: C.purple },
    { icon: '', label: 'Ejercicios', value: `${totalExDone}/${totalExAll}`, color: C.teal },
    { icon: '', label: 'Quizzes', value: `${quizzesDone}/4`, color: C.blue },
    { icon: '', label: 'Insignias', value: `${unlockedBadges.length}/${BADGES.length}`, color: C.orange },
    { icon: '', label: 'Racha', value: `${streak} días`, color: C.red },
  ];

  return (
    <div style={{ padding: '0 0 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900 }}>Mi Dashboard</h2>
        <p style={{ color: C.dim, fontSize: 14 }}>Tu progreso en tiempo real</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{
            borderColor: `${s.color}33`, background: `linear-gradient(135deg,${s.color}0a,${C.card})`,
            textAlign: 'center', padding: '16px 12px',
          }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, color: C.muted, fontSize: 12, textTransform: 'uppercase', marginBottom: 16 }}>
          Progreso por Módulo
        </div>
        {modStats.map((m, i) => {
          const pct = m.total > 0 ? Math.round((m.ejercicios / m.total) * 100) : 0;
          return (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: C.text }}>Módulo {i + 1}</span>
                <span style={{ color: m.complete ? C.green : C.dim }}>
                  {m.ejercicios}/{m.total} ejerc. {m.quiz ? 'Quiz' : ''}
                </span>
              </div>
              <ProgressBar value={pct} color={[C.purple, C.teal, C.yellow, C.orange][i]} height={6} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// �""? CODE BLOCK (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function CodeBlock({ code, language = "python" }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", margin: "16px 0", border: `1px solid ${C.border}` }}>
      <div style={{ background: "#0a0b14", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: "'JetBrains Mono',monospace" }}>{language}</span>
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{
              background: copied ? C.green + "22" : C.border, border: `1px solid ${C.border}`, borderRadius: 6,
              padding: "3px 10px", color: copied ? C.green : C.dim, fontSize: 11, cursor: "pointer", fontWeight: 700
            }}>
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
      <pre style={{
        background: "#090b13", padding: 16, overflowX: "auto", margin: 0,
        fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.7, color: "#c4b5fd"
      }}>
        {code}
      </pre>
    </div>
  );
}

// �""? RUNNABLE BLOCK (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function RunnableBlock({ code, simulatedOutput, language = "python" }) {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const run = async () => {
    setRunning(true);
    setOutput(null);
    await new Promise(r => setTimeout(r, 700));
    setOutput(simulatedOutput);
    setRunning(false);
  };
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", margin: "16px 0", border: `1px solid ${C.border}` }}>
      <div style={{ background: "#0a0b14", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace" }}>demo.py</span>
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{
              background: copied ? C.green + "22" : C.border, border: `1px solid ${C.border}`, borderRadius: 6,
              padding: "3px 10px", color: copied ? C.green : C.dim, fontSize: 11, cursor: "pointer", fontWeight: 700
            }}>
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
      <pre style={{
        background: "#090b13", padding: 16, overflowX: "auto", margin: 0,
        fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.7, color: "#c4b5fd", borderBottom: `1px solid ${C.border}`
      }}>
        {code}
      </pre>
      <button onClick={run} disabled={running} style={{
        width: "100%", padding: 11, background: running ? C.border : `linear-gradient(90deg,${C.teal},#0d9488)`,
        border: "none", color: "white", cursor: running ? "not-allowed" : "pointer",
        fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}>
        {running ? <><span style={{ animation: "spin 0.8s linear infinite" }}>⏳</span> Ejecutando...</> : "Ejecutar y ver resultado"}
      </button>
      {output && (
        <div style={{ background: "#070910", padding: 16, borderTop: `1px solid ${C.border}`, animation: "fadeIn 0.3s" }}>
          <div style={{ fontSize: 11, color: C.teal, fontWeight: 800, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace" }}>// OUTPUT</div>
          <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#86efac", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// �""? CHART GALLERY (del P1 COMPLETO) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function ChartGallery() {
  const [selectedChart, setSelectedChart] = useState(null);

  const charts = [
    {
      name: "Barras",
      fn: "plt.bar() / sns.barplot()",
      uso: "Comparar categorías",
      implementacion: "Agrupa con pandas, pasa labels y valores, y personaliza color/etiquetas para lectura rápida.",
      ejemplo:
`import matplotlib.pyplot as plt
resumen = df.groupby("categoria")["ventas"].sum()
plt.bar(resumen.index, resumen.values, color="#6366f1")
plt.title("Ventas por categoría")`,
      color: "#6366f1",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          {[{ x: 8, h: 50, c: "#6366f1" }, { x: 26, h: 35, c: "#818cf8" }, { x: 44, h: 55, c: "#6366f1" },
            { x: 62, h: 28, c: "#818cf8" }, { x: 80, h: 42, c: "#6366f1" }].map((b, i) => (
              <rect key={i} x={b.x} y={65 - b.h} width={14} height={b.h} fill={b.c} rx={2} />
            ))}
          <line x1={4} y1={65} x2={98} y2={65} stroke="#334155" strokeWidth={1} />
        </svg>
      ),
    },
    {
      name: "Línea",
      fn: "plt.plot() / sns.lineplot()",
      uso: "Tendencias en el tiempo",
      implementacion: "Ordena por fecha, define eje X temporal y agrega marcadores para destacar cambios.",
      ejemplo:
`serie = df.sort_values("fecha")
plt.plot(serie["fecha"], serie["ventas"], marker="o", color="#14b8a6")
plt.title("Tendencia de ventas")`,
      color: "#14b8a6",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          <polyline points="8,55 25,35 42,45 59,20 76,30 93,15"
            fill="none" stroke="#14b8a6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="8,55 25,35 42,45 59,20 76,30 93,15 93,65 8,65"
            fill="#14b8a611" stroke="none" />
          {[[8, 55], [25, 35], [42, 45], [59, 20], [76, 30], [93, 15]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3} fill="#14b8a6" />
          ))}
          <line x1={4} y1={65} x2={98} y2={65} stroke="#334155" strokeWidth={1} />
        </svg>
      ),
    },
    {
      name: "Dispersión",
      fn: "plt.scatter() / sns.scatterplot()",
      uso: "Relación entre 2 variables",
      implementacion: "Selecciona dos variables numéricas y usa color/tamaño para una tercera variable opcional.",
      ejemplo:
`plt.scatter(df["edad"], df["ingreso"], alpha=0.7, c=df["segmento_id"])
plt.xlabel("Edad")
plt.ylabel("Ingreso")`,
      color: "#f97316",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          {[[15, 55], [25, 42], [35, 50], [45, 30], [55, 38], [65, 22], [75, 28], [85, 15], [30, 58], [70, 35]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill={i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#fb923c" : "#fdba74"} opacity={0.85} />
          ))}
          <line x1={4} y1={65} x2={98} y2={65} stroke="#334155" strokeWidth={1} />
          <line x1={4} y1={65} x2={4} y2={5} stroke="#334155" strokeWidth={1} />
        </svg>
      ),
    },
    {
      name: "Histograma",
      fn: "plt.hist() / sns.histplot()",
      uso: "Distribución de una variable",
      implementacion: "Define bins adecuados para ver frecuencia y, si necesitas, agrega curva KDE para densidad.",
      ejemplo:
`plt.hist(df["edad"], bins=12, color="#22c55e", edgecolor="white")
plt.title("Distribución de edades")`,
      color: "#22c55e",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          {[{ x: 5, h: 15, w: 16 }, { x: 22, h: 35, w: 16 }, { x: 39, h: 50, w: 16 }, { x: 56, h: 38, w: 16 }, { x: 73, h: 20, w: 16 }].map((b, i) => (
            <rect key={i} x={b.x} y={65 - b.h} width={b.w} height={b.h} fill="#22c55e" rx={1} opacity={0.85} />
          ))}
          <polyline points="13,50 30,30 47,15 64,27 81,45" fill="none" stroke="#86efac" strokeWidth={1.5} strokeDasharray="3,2" />
          <line x1={4} y1={65} x2={98} y2={65} stroke="#334155" strokeWidth={1} />
        </svg>
      ),
    },
    {
      name: "Boxplot",
      fn: "sns.boxplot() / plt.boxplot()",
      uso: "Distribución + outliers",
      implementacion: "Compara grupos categóricos observando mediana, rango intercuartílico y posibles outliers.",
      ejemplo:
`import seaborn as sns
sns.boxplot(data=df, x="segmento", y="ticket_promedio", color="#ec4899")`,
      color: "#ec4899",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          <line x1={50} y1={10} x2={50} y2={20} stroke="#ec4899" strokeWidth={1.5} />
          <rect x={30} y={20} width={40} height={28} fill="#ec489922" stroke="#ec4899" strokeWidth={2} rx={2} />
          <line x1={30} y1={36} x2={70} y2={36} stroke="#f9a8d4" strokeWidth={2} />
          <line x1={50} y1={48} x2={50} y2={58} stroke="#ec4899" strokeWidth={1.5} />
          <line x1={38} y1={10} x2={62} y2={10} stroke="#ec4899" strokeWidth={1.5} />
          <line x1={38} y1={58} x2={62} y2={58} stroke="#ec4899" strokeWidth={1.5} />
          <circle cx={18} cy={25} r={3} fill="#f9a8d4" />
          <line x1={4} y1={65} x2={98} y2={65} stroke="#334155" strokeWidth={1} />
        </svg>
      ),
    },
    {
      name: "Pastel",
      fn: "plt.pie()",
      uso: "Proporciones de un total",
      implementacion: "Úsalo con pocas categorías y etiquetas claras; conviene mostrar porcentajes (%1.1f).",
      ejemplo:
`sizes = df["categoria"].value_counts()
plt.pie(sizes.values, labels=sizes.index, autopct="%1.1f%%")
plt.title("Participación por categoría")`,
      color: "#f59e0b",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          <g transform="translate(50,35)">
            <path d="M0,0 L0,-28 A28,28 0 0,1 24.2,-14 Z" fill="#6366f1" />
            <path d="M0,0 L24.2,-14 A28,28 0 0,1 24.2,14 Z" fill="#14b8a6" />
            <path d="M0,0 L24.2,14 A28,28 0 0,1 -14,24.2 Z" fill="#f59e0b" />
            <path d="M0,0 L-14,24.2 A28,28 0 0,1 -28,0 Z" fill="#f97316" />
            <path d="M0,0 L-28,0 A28,28 0 0,1 0,-28 Z" fill="#ec4899" />
          </g>
        </svg>
      ),
    },
    {
      name: "Mapa de calor",
      fn: "sns.heatmap()",
      uso: "Correlación entre variables",
      implementacion: "Calcula matriz de y anota valores para detectar relaciones fuertes.",
      ejemplo:
`corr = df[["ventas","costo","clientes","margen"]].corr()
sns.heatmap(corr, annot=True, cmap="Blues", fmt=".2f")`,
      color: "#3b82f6",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          {[0, 1, 2, 3].map(row => [0, 1, 2, 3].map(col => {
            const vals = [[1, .8, .3, .1], [.8, 1, .5, .2], [.3, .5, 1, .7], [.1, .2, .7, 1]];
            const v = vals[row][col];
            const colors = ["#1e3a8a", "#2563eb", "#60a5fa", "#93c5fd", "#dbeafe"];
            const ci = Math.floor(v * 4);
            return <rect key={`${row}-${col}`} x={8 + col * 22} y={5 + row * 16} width={20} height={14}
              fill={colors[ci]} rx={2} />;
          }))}
        </svg>
      ),
    },
    {
      name: "Violín",
      fn: "sns.violinplot()",
      uso: "Distribución por categoría",
      implementacion: "Ideal para comparar forma de entre grupos (no solo mediana y cuartiles).",
      ejemplo:
`sns.violinplot(data=df, x="segmento", y="ingreso", inner="quartile", color="#8b5cf6")`,
      color: "#8b5cf6",
      svg: (
        <svg viewBox="0 0 100 70" width="100%" height="70">
          {[20, 50, 80].map((cx, i) => (
            <g key={i}>
              <ellipse cx={cx} cy={30} rx={i === 1 ? 12 : 8} ry={22} fill="#8b5cf622" stroke="#8b5cf6" strokeWidth={1.5} />
              <ellipse cx={cx} cy={30} rx={i === 1 ? 7 : 4} ry={12} fill="#8b5cf655" />
              <line x1={cx} y1={18} x2={cx} y2={52} stroke="#a78bfa" strokeWidth={1} />
              <line x1={cx - 6} y1={30} x2={cx + 6} y2={30} stroke="#c4b5fd" strokeWidth={2} />
            </g>
          ))}
          <line x1={4} y1={65} x2={98} y2={65} stroke="#334155" strokeWidth={1} />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.dim, marginBottom: 16 }}>
        📊 Galería de tipos de gráficos - haz clic en uno para ver el ejemplo de código
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
        {charts.map((ch, i) => {
          const active = selectedChart?.name === ch.name;
          return (
            <button
              key={i}
              onClick={() => setSelectedChart(active ? null : ch)}
              style={{
                background: active ? ch.color + "18" : C.surface,
                border: `1px solid ${active ? ch.color : C.border}`,
                borderRadius: 14,
                padding: "14px 14px 12px",
                cursor: "pointer",
                transition: "all 0.25s",
                textAlign: "left",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                width: "100%",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${ch.color}`;
                e.currentTarget.style.background = ch.color + "18";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `1px solid ${active ? ch.color : C.border}`;
                e.currentTarget.style.background = active ? ch.color + "18" : C.surface;
              }}
            >
              <div style={{ marginBottom: 8 }}>{ch.svg}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: C.text, marginBottom: 3 }}>{ch.name}</div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: ch.color, marginBottom: 4 }}>{ch.fn}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{ch.uso}</div>
            </button>
          );
        })}
      </div>

      {selectedChart && (
        <div style={{
          marginTop: 14,
          background: C.surface,
          border: `1px solid ${selectedChart.color}`,
          borderRadius: 14,
          padding: 16,
          animation: "fadeIn 0.25s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{selectedChart.name}</div>
              <div style={{ fontSize: 11, color: selectedChart.color, fontFamily: "'JetBrains Mono',monospace" }}>
                {selectedChart.fn}
              </div>
            </div>
            <button
              onClick={() => setSelectedChart(null)}
              style={{
                border: `1px solid ${C.border}`,
                background: "transparent",
                color: C.dim,
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Cerrar
            </button>
          </div>

          <div style={{ background: "#0b1020", border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ maxWidth: 360, margin: "0 auto" }}>{selectedChart.svg}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>
                Para qué se usa
              </div>
              <div style={{ fontSize: 13, color: C.text }}>{selectedChart.uso}</div>
            </div>

            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>
                Cómo se implementa
              </div>
              <div style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>{selectedChart.implementacion}</div>
              <pre style={{
                margin: 0,
                background: "#090b13",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: 10,
                overflowX: "auto",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
                color: "#c4b5fd",
                lineHeight: 1.6,
              }}>
                {selectedChart.ejemplo}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// �""? CHART DEMO BLOCK (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function ChartDemoBlock({ code, chartSvg, chartTitle, description }) {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const run = async () => {
    setRunning(true);
    setOutput(null);
    await new Promise(r => setTimeout(r, 900));
    setOutput(true);
    setRunning(false);
  };
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20, border: `1px solid ${C.border}` }}>
      <div style={{ background: "#0a0b14", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#fb923c", fontFamily: "'JetBrains Mono',monospace" }}>grafico.py</span>
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{
              background: copied ? C.green + "22" : C.border, border: `1px solid ${C.border}`, borderRadius: 6,
              padding: "3px 10px", color: copied ? C.green : C.dim, fontSize: 11, cursor: "pointer", fontWeight: 700
            }}>
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
      <pre style={{
        background: "#090b13", padding: 16, overflowX: "auto", margin: 0,
        fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.7, color: "#c4b5fd", borderBottom: `1px solid ${C.border}`
      }}>
        {code}
      </pre>
      <button onClick={run} disabled={running} style={{
        width: "100%", padding: 11, background: running ? C.border : `linear-gradient(90deg,${C.orange},#c2410c)`,
        border: "none", color: "white", cursor: running ? "not-allowed" : "pointer",
        fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {running ? <><span style={{ animation: "spin 0.8s linear infinite" }}>⏳</span> Renderizando gráfico...</> : "Ejecutar y visualizar gráfico"}
      </button>
      {output && (
        <div style={{ background: "#07090f", padding: 20, borderTop: `1px solid ${C.border}`, animation: "fadeIn 0.4s" }}>
          <div style={{ fontSize: 11, color: C.orange, fontWeight: 800, marginBottom: 12, fontFamily: "'JetBrains Mono',monospace" }}>
            // GRÁFICO GENERADO - {chartTitle}
          </div>
          <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
            {chartSvg}
            {description && <div style={{ fontSize: 12, color: C.muted, marginTop: 12, textAlign: "center" }}>{description}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// �""? CHART SVGs (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
const BarChartSVG = (
  <svg viewBox="0 0 400 220" width="100%" style={{ maxHeight: 220 }}>
    <rect width="400" height="220" fill="#070910" rx="8" />
    <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="'Plus Jakarta Sans',sans-serif">Ventas por Mes</text>
    {[{ m: "Ene", v: 45, x: 40 }, { m: "Feb", v: 52, x: 95 }, { m: "Mar", v: 48, x: 150 }, { m: "Abr", v: 61, x: 205 }, { m: "May", v: 58, x: 260 }, { m: "Jun", v: 72, x: 315 }].map((d, i) => {
      const h = (d.v / 80) * 160;
      return (<g key={i}>
        <rect x={d.x} y={190 - h} width={40} height={h} fill="#6366f1" rx="3" opacity="0.9" />
        <text x={d.x + 20} y={205} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">{d.m}</text>
        <text x={d.x + 20} y={190 - h - 5} textAnchor="middle" fill="#818cf8" fontSize="9" fontFamily="sans-serif">{d.v}k</text>
      </g>);
    })}
    <line x1="30" y1="190" x2="370" y2="190" stroke="#252840" strokeWidth="1" />
  </svg>
);

const LineChartSVG = (
  <svg viewBox="0 0 400 220" width="100%" style={{ maxHeight: 220 }}>
    <rect width="400" height="220" fill="#070910" rx="8" />
    <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="'Plus Jakarta Sans',sans-serif">Ventas vs Costos</text>
    {[{ v: 45, c: 30, x: 50 }, { v: 52, c: 35, x: 105 }, { v: 48, c: 32, x: 160 }, { v: 61, c: 40, x: 215 }, { v: 58, c: 38, x: 270 }, { v: 72, c: 45, x: 325 }].map((d, i, arr) => {
      if (i === arr.length - 1) return null;
      const n = arr[i + 1];
      const y1 = 190 - (d.v / 80) * 160, y2 = 190 - (n.v / 80) * 160;
      const c1 = 190 - (d.c / 80) * 160, c2 = 190 - (n.c / 80) * 160;
      return (<g key={i}>
        <line x1={d.x + 20} y1={y1} x2={n.x + 20} y2={y2} stroke="#14b8a6" strokeWidth="2.5" />
        <line x1={d.x + 20} y1={c1} x2={n.x + 20} y2={c2} stroke="#f97316" strokeWidth="2" strokeDasharray="5,3" />
      </g>);
    })}
    {[{ v: 45, c: 30, x: 50 }, { v: 52, c: 35, x: 105 }, { v: 48, c: 32, x: 160 }, { v: 61, c: 40, x: 215 }, { v: 58, c: 38, x: 270 }, { v: 72, c: 45, x: 325 }].map((d, i) => (
      <g key={i}>
        <circle cx={d.x + 20} cy={190 - (d.v / 80) * 160} r="4" fill="#14b8a6" />
        <circle cx={d.x + 20} cy={190 - (d.c / 80) * 160} r="3" fill="#f97316" />
      </g>
    ))}
    <g transform="translate(30,205)">
      <line x1="0" y1="0" x2="14" y2="0" stroke="#14b8a6" strokeWidth="2" /><text x="18" y="4" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">Ventas</text>
      <line x1="60" y1="0" x2="74" y2="0" stroke="#f97316" strokeWidth="2" strokeDasharray="4,2" /><text x="78" y="4" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">Costos</text>
    </g>
    <line x1="30" y1="190" x2="370" y2="190" stroke="#252840" strokeWidth="1" />
  </svg>
);

const BoxPlotSVG = (
  <svg viewBox="0 0 400 220" width="100%" style={{ maxHeight: 220 }}>
    <rect width="400" height="220" fill="#070910" rx="8" />
    <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="'Plus Jakarta Sans',sans-serif">Distribución de Ventas por Región</text>
    {[{ label: "Norte", x: 110, q1: 70, med: 100, q3: 140, min: 45, max: 165, color: "#6366f1" }, { label: "Sur", x: 270, q1: 90, med: 120, q3: 155, min: 60, max: 180, color: "#14b8a6" }].map((d, i) => {
      const sc = (v) => 190 - (v / 200) * 160;
      return (<g key={i}>
        <line x1={d.x} y1={sc(d.min)} x2={d.x} y2={sc(d.max)} stroke={d.color} strokeWidth="1.5" />
        <line x1={d.x - 12} y1={sc(d.min)} x2={d.x + 12} y2={sc(d.min)} stroke={d.color} strokeWidth="1.5" />
        <line x1={d.x - 12} y1={sc(d.max)} x2={d.x + 12} y2={sc(d.max)} stroke={d.color} strokeWidth="1.5" />
        <rect x={d.x - 20} y={sc(d.q3)} width={40} height={sc(d.q1) - sc(d.q3)} fill={d.color + "33"} stroke={d.color} strokeWidth="2" rx="2" />
        <line x1={d.x - 20} y1={sc(d.med)} x2={d.x + 20} y2={sc(d.med)} stroke={d.color} strokeWidth="2.5" />
        <text x={d.x} y={205} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">{d.label}</text>
      </g>);
    })}
    <line x1="30" y1="190" x2="370" y2="190" stroke="#252840" strokeWidth="1" />
  </svg>
);

const HistSVG = (
  <svg viewBox="0 0 400 220" width="100%" style={{ maxHeight: 220 }}>
    <rect width="400" height="220" fill="#070910" rx="8" />
    <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="'Plus Jakarta Sans',sans-serif">Distribución de Ventas</text>
    {[{ x: 40, h: 25 }, { x: 96, h: 58 }, { x: 152, h: 110 }, { x: 208, h: 140 }, { x: 264, h: 95 }, { x: 320, h: 42 }].map((b, i) => (
      <rect key={i} x={b.x} y={190 - b.h} width={50} height={b.h} fill="#6366f1" rx="2" opacity="0.85" />
    ))}
    <polyline points="65,165 121,132 177,80 233,50 289,95 345,148"
      fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="4,3" />
    <line x1="30" y1="190" x2="370" y2="190" stroke="#252840" strokeWidth="1" />
  </svg>
);

// �""? CODE EDITOR (del P1 mejorado) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function CodeEditor({ defaultCode, onRun, hint }) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const prevDefault = useRef(defaultCode);

  if (prevDefault.current !== defaultCode) {
    prevDefault.current = defaultCode;
    setCode(defaultCode);
    setOutput(null);
    setAttempts(0);
    setShowHint(false);
  }

  const handleRun = async () => {
    setRunning(true);
    setAttempts(a => a + 1);
    await new Promise(r => setTimeout(r, 600));
    const result = onRun(code);
    setOutput(result);
    setRunning(false);
  };

  return (
    <div>
      <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 12 }}>
        <div style={{ background: "#0a0b14", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace" }}>editor.py</span>
            {attempts > 0 && (
              <span style={{ fontSize: 11, color: attempts >= 3 ? C.red : C.muted, background: C.border, borderRadius: 6, padding: '2px 8px' }}>
                Intento {attempts}
              </span>
            )}
          </div>
        </div>
        <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
          style={{
            width: "100%", minHeight: 160, background: "#090b13", color: "#c4b5fd",
            border: "none", outline: "none", padding: 16, fontFamily: "'JetBrains Mono',monospace",
            fontSize: 13, lineHeight: 1.7, resize: "vertical", tabSize: 4
          }}
          onKeyDown={e => {
            if (e.key === "Tab") {
              e.preventDefault();
              const s = e.target.selectionStart;
              const nc = code.substring(0, s) + "" + code.substring(e.target.selectionEnd);
              setCode(nc);
              setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
            }
          }} />
        <button onClick={handleRun} disabled={running} style={{
          width: "100%", padding: 13,
          background: running ? C.border : `linear-gradient(90deg,${C.green},#15803d)`,
          border: "none", color: "white", cursor: running ? "not-allowed" : "pointer",
          fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          {running ? <><span style={{ animation: "spin 0.8s linear infinite" }}>⏳</span> Ejecutando...</> : "Ejecutar código"}
        </button>
      </div>

      {hint && !output?.ok && !showHint && (
        <button onClick={() => setShowHint(true)} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 14px', marginBottom: 10 }}>
          Ver pista
        </button>
      )}

      {hint && showHint && (
        <div style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: C.dim, marginBottom: 10 }}>
          <div style={{ fontWeight: 800, color: C.yellow, marginBottom: 4 }}>Pista</div>
          {hint}
        </div>
      )}

      {output && (
        <div style={{
          borderRadius: 12, padding: 16,
          background: output.ok ? C.green + "11" : C.red + "11",
          border: `2px solid ${output.ok ? C.green : C.red}`,
          animation: output.ok ? "fadeIn 0.3s" : "shake 0.4s"
        }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: output.ok ? C.green : C.red }}>
            {output.ok ? "¡Correcto!" : "Revisa tu código"}
          </div>
          <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.dim, whiteSpace: "pre-wrap" }}>
            {output.msg}
          </pre>
        </div>
      )}
    </div>
  );
}

// �""? QUIZ (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function Quiz({ questions, onComplete, alreadyPassed }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const score = answers.filter(Boolean).length;

  if (alreadyPassed && !done) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🏆</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: C.green }}>¡Quiz completado!</div>
      </div>
    );
  }

  if (done) {
    const passed = score >= Math.ceil(questions.length * .6);
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', animation: 'fadeUp 0.4s' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{passed ? '' : ''}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: passed ? C.green : C.yellow }}>
          {passed ? '¡Quiz superado!' : 'Sigue estudiando'}
        </div>
        <div style={{ fontSize: 15, color: C.dim, marginBottom: 20 }}>
          Obtuviste <strong style={{ color: C.text }}>{score}/{questions.length}</strong> correctas
        </div>
        {!passed && (
          <button className="btn btn-primary" onClick={() => {
            setCurrent(0);
            setSelected(null);
            setAnswers([]);
            setDone(false);
          }}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  const q = questions[current];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>
          Pregunta {current + 1} de {questions.length}
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i < current ? C.green : i === current ? C.purple : C.border
            }} />
          ))}
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 18, color: C.text }}>{q.q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {q.options.map((opt, idx) => {
          let bg = C.card, border = C.border, color = C.dim;
          if (selected !== null) {
            if (idx === q.correct) { bg = C.green + '22'; border = C.green; color = C.green; }
            else if (idx === selected) { bg = C.red + '22'; border = C.red; color = C.red; }
          }
          return (
            <button key={idx} onClick={() => {
              if (selected !== null) return;
              setSelected(idx);
              const correct = idx === q.correct;
              setTimeout(() => {
                const na = [...answers, correct];
                setAnswers(na);
                if (current + 1 < questions.length) {
                  setCurrent(current + 1);
                  setSelected(null);
                } else {
                  setDone(true);
                  if (na.filter(Boolean).length >= Math.ceil(questions.length * .6)) onComplete(na);
                }
              }, 1100);
            }} style={{
              padding: '13px 16px', borderRadius: 11, border: `2px solid ${border}`,
              background: bg, color, cursor: selected !== null ? 'default' : 'pointer',
              fontWeight: 700, fontSize: 14, textAlign: 'left', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (!selected) {
                e.currentTarget.style.borderColor = C.purple;
                e.currentTarget.style.background = C.purple + '22';
                e.currentTarget.style.color = C.purpleLight;
              }
            }}
            onMouseLeave={e => {
              if (!selected) {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.card;
                e.currentTarget.style.color = C.dim;
              }
            }}>
              <span style={{ opacity: .4, marginRight: 8 }}>{['A', 'B', 'C', 'D'][idx]}.</span>{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// �""? EXERCISE SECTION (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function ExerciseSection({ section, onExercisePassed, passed }) {
  return (
    <div style={{ animation: "fadeUp 0.4s" }}>
      {passed && (
        <div style={{
          background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: 12,
          padding: "12px 16px", marginBottom: 20, color: C.green, fontWeight: 700, fontSize: 14
        }}>
          Ejercicio completado. ¡Buen trabajo!
        </div>
      )}
      <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>{section.instruction}</p>
      <CodeEditor
        key={section.title}
        defaultCode={section.defaultCode}
        hint={section.hints ? (Array.isArray(section.hints) ? section.hints[0] : section.hints) : null}
        onRun={(code) => {
          const result = section.validate(code);
          if (result.ok) onExercisePassed();
          return result;
        }}
      />
    </div>
  );
}

// �""? SECTION CONTENT (del P1 COMPLETO) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
function SectionContent({ section, modProg, onExercisePassed, onQuizPassed, currentExIdx }) {
  const renderText = (text) => ({ __html: text.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.text}">$1</strong>`) });

  if (section.type === "theory") {
    return (
      <div style={{ animation: "fadeUp 0.4s" }}>
        {section.content.map((block, i) => {
          if (block.type === "text") return (
            <p key={i} style={{ color: C.dim, lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}
              dangerouslySetInnerHTML={renderText(block.text)} />
          );
          if (block.type === "info") return (
            <div key={i} style={{
              background: C.purple + "18", border: `1px solid ${C.purple}44`,
              borderRadius: 14, padding: "16px 20px", marginBottom: 20
            }}>
              <div style={{ fontWeight: 800, color: C.purpleLight, marginBottom: 8, fontSize: 14 }}>{block.title}</div>
              <p style={{ color: C.dim, fontSize: 14, lineHeight: 1.7, margin: 0 }}
                dangerouslySetInnerHTML={renderText(block.text)} />
            </div>
          );
          if (block.type === "code") return <CodeBlock key={i} code={block.code} />;
          if (block.type === "runnable") return (
            <RunnableBlock key={i} code={block.code} simulatedOutput={block.output} />
          );
          if (block.type === "chartGallery") return <ChartGallery key={i} />;
          if (block.type === "chartDemo") return (
            <ChartDemoBlock key={i} code={block.code} chartSvg={block.chartSvg}
              chartTitle={block.title} description={block.description} />
          );
          if (block.type === "list") return (
            <ul key={i} style={{ margin: "0 0 20px 4px", padding: 0, listStyle: "none" }}>
              {block.items.map((item, j) => (
                <li key={j} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 14, color: C.dim, alignItems: "flex-start" }}>
                  <span style={{ color: C.purple, marginTop: 2, flexShrink: 0 }}>•</span>
                  <span dangerouslySetInnerHTML={renderText(item)} />
                </li>
              ))}
            </ul>
          );
          return null;
        })}
      </div>
    );
  }

  if (section.type === "exercise") {
    return (
      <ExerciseSection
        key={section.title}
        section={section}
        passed={modProg.exercises[currentExIdx]}
        onExercisePassed={onExercisePassed}
      />
    );
  }

  if (section.type === "quiz") {
    return (
      <div style={{ animation: "fadeUp 0.4s" }}>
        {modProg.quiz && (
          <div style={{
            background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: 12,
            padding: "12px 16px", marginBottom: 20, color: C.green, fontWeight: 700, fontSize: 14
          }}>
            Quiz completado. ¡Excelente!
          </div>
        )}
        <Quiz key={section.title} questions={section.questions} onComplete={onQuizPassed} alreadyPassed={modProg.quiz} />
      </div>
    );
  }
  return null;
}

// �""? REGISTER FORM (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!name.trim() || name.trim().length < 3) {
      setErr("Ingresa tu nombre completo (mín. 3 caracteres).");
      return;
    }
    if (!email.includes("@")) {
      setErr("Ingresa un correo electrónico válido.");
      return;
    }
    onRegister({ name: name.trim(), email: email.trim() });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%", animation: "fadeUp 0.6s" }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 56, fontSize: 28, fontWeight: 900, color: C.text, animation: "float 3s ease-in-out infinite" }}>
                    🐍  Elidev
          </div>

          <div style={{ fontSize: 15, color: C.dim }}>Análisis de Datos en Python</div>
        </div>
        <div style={{ background: C.card, borderRadius: 20, padding: 40, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, color: C.text }}>¡Comienza tu viaje! </h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Regístrate para guardar tu progreso y recibir tu certificado.</p>
          {[
            ["Nombre completo", "text", "Tu nombre completo", name, setName],
            ["Correo electrónico", "email", "Tu correo electrónico", email, setEmail]
          ].map(([label, type, ph, val, setter], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 6 }}>{label}</label>
              <input type={type} placeholder={ph} value={val}
                onChange={e => { setter(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
                style={{
                  width: "100%", padding: "14px 16px", background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 15,
                  outline: "none"
                }}
                onFocus={e => e.target.style.borderColor = C.purple}
                onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
          {err && <div style={{ color: C.red, fontSize: 13, marginBottom: 16 }}>{err}</div>}
          <button onClick={submit} style={{
            width: "100%", padding: 16, background: `linear-gradient(135deg,${C.purple},${C.blue})`,
            border: "none", borderRadius: 12, color: "white", fontWeight: 900, fontSize: 16,
            cursor: "pointer", boxShadow: `0 4px 20px ${C.purple}44`
          }}>
            Comenzar curso gratis
          </button>
          <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center" }}>
            {[["4", "Módulos"], ["15+", "Ejercicios"], ["600", "XP"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.purple }}>{n}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// �""? CERTIFICATE (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
function Certificate({ studentName, onBack }) {
  const today = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at center,#1a1040 0%,#0d0f1a 70%)", padding: 24
    }}>
      <div style={{ animation: "fadeUp 0.8s" }}>
        <div style={{
          background: "linear-gradient(135deg,#1a1d2e 0%,#0d0f1a 100%)",
          border: `2px solid ${C.yellow}`, borderRadius: 24, padding: 56,
          maxWidth: 720, width: "100%", textAlign: "center",
          boxShadow: `0 0 60px ${C.yellow}33,0 0 120px ${C.purple}22`, position: "relative", overflow: "hidden"
        }}>
          {[{ top: 16, left: 16 }, { top: 16, right: 16 }, { bottom: 16, left: 16 }, { bottom: 16, right: 16 }].map((pos, i) => (
            <div key={i} style={{ position: "absolute", ...pos, width: 40, height: 40, border: `2px solid ${C.yellow}66`, borderRadius: 4 }} />
          ))}
          <div style={{ fontSize: 64, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🏆</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.yellow, letterSpacing: 4, marginBottom: 8, textTransform: "uppercase" }}>
            Certificado de Finalización
          </div>
          <div style={{ width: 60, height: 2, background: C.yellow, margin: "0 auto 32px" }} />
          <div style={{ fontSize: 15, color: C.dim, marginBottom: 12 }}>Este certificado se otorga a</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: C.text, marginBottom: 8 }}>{studentName}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>por haber completado satisfactoriamente el curso</div>
          <div style={{ background: C.purple + "22", border: `1px solid ${C.purple}55`, borderRadius: 16, padding: "20px 32px", marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 4 }}>Análisis de Datos en Python</div>
            <div style={{ fontSize: 14, color: C.dim }}>Guía Interactiva Guiada • 4 Módulos</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
            {[["", "Fecha", today], ["⏱️", "Duración", "160 horas"], ["⭐", "XP Ganados", "600 XP"]].map(([icon, label, val]) => (
              <div key={label} style={{ background: C.surface, borderRadius: 12, padding: "12px 8px" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => window.print()} style={{
              background: `linear-gradient(135deg,${C.yellow},#d97706)`, border: "none",
              color: "#0d0f1a", padding: "14px 28px", borderRadius: 12, fontWeight: 900, fontSize: 15,
              cursor: "pointer"
            }}>
              Descargar Certificado
            </button>
            <button onClick={onBack} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              color: C.dim, padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14,
              cursor: "pointer"
            }}>
              • Volver al curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// �""? MODULOS (CONTENIDO COMPLETO DEL PROYECTO 1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
const MODULES = [
  {
    id: 1, emoji: "📘", colorKey: "purple",
    title: "Fundamentos del Análisis de Datos",
    subtitle: "Conceptos esenciales, librerías y herramientas",
    duration: "30 min", xp: 100, lessons: 3,
    sections: [
      {
        type: "theory", title: "¿Qué es el Análisis de Datos?",
        content: [
          { type: "text", text: "El **análisis de datos** es el proceso de inspeccionar, limpiar, transformar y modelar datos con el objetivo de descubrir información útil, sacar conclusiones y apoyar la toma de decisiones." },
          { type: "text", text: "En el mundo actual, los datos son el recurso más valioso. Empresas como Netflix, Amazon y Spotify usan análisis de datos para recomendarte contenido, optimizar precios y mejorar la experiencia del usuario." },
          { type: "info", title: "¿Para qué sirve?", text: "Tomar decisiones basadas en evidencia • Descubrir patrones ocultos • Predecir comportamientos futuros • Optimizar procesos y recursos" },
          { type: "text", text: "**Conceptos clave:**" },
          { type: "list", items: [
            "**Dato**: Valor individual sin contexto (ej: 25, 'Colombia', true)",
            "**Variable**: Característica que se mide (ej: edad, país, activo)",
            "**Dataset**: Colección organizada de datos en filas y columnas",
            "**Tipos de datos**: Numérico (int, float), Texto (string), Booleano (bool), Fecha (datetime)",
          ]},
        ],
      },
      {
        type: "theory", title: "Python para Análisis de Datos",
        content: [
          { type: "text", text: "Python es el lenguaje más popular para análisis de datos por su sintaxis simple, su enorme ecosistema de librerías y su comunidad activa. A continuación puedes ejecutar cada bloque para ver el resultado real:" },
          { type: "info", title: "Librerías principales", text:"pandas: manipulación de datos • numpy: cálculos numéricos • matplotlib: gráficos básicos • seaborn: gráficos estadísticos avanzados" },
          { type: "runnable",
            code: `# 1. Importar librerías y verificar versiones\nimport pandas as pd\nimport numpy as np\n\nprint("Librerías importadas correctamente")\nprint(f"Pandas versión: {pd.__version__}")\nprint(f"NumPy versión: {np.__version__}")`,
            output: ` Librerías importadas correctamente\nPandas versión: 2.1.4\nNumPy versión: 1.26.3` },
          { type: "runnable",
            code: `# 2. Tipos de datos en Python para análisis\nentero = 42          # int\ndecimal = 3.14       # float\ntexto = "Colombia"   # str\nbooleano = True      # bool\nlista = [1, 2, 3]   # list\n\nprint(f"int: {entero} {type(entero).__name__}")\nprint(f"float: {decimal}' type: {type(decimal).__name__}")\nprint(f"str: {texto} {type(texto).__name__}")\nprint(f"bool: {booleano}' type: {type(booleano).__name__}")\nprint(f"list: {lista} type: {type(lista).__name__}")`,
            output: `int:   42  -type: int\nfloat: 3.14' type: float\nstr:   Colombia   -type: str\nbool: True' type: bool\nlist:  [1, 2, 3]   - type: list` },
          { type: "runnable",
            code: `# 3. Crear tu primer DataFrame con pandas\nimport pandas as pd\n\ndatos = {\n    'país': ['Colombia', 'México', 'Argentina', 'Chile'],\n    'población_M': [52, 128, 46, 19],\n    'pib_usd_B': [314, 1272, 632, 317]\n}\n\ndf = pd.DataFrame(datos)\nprint("Mi primer DataFrame:")\nprint(df)\nprint(f"\\nDimensiones: {df.shape[0]} filas �- {df.shape[1]} columnas")`,
            output: ` Mi primer DataFrame:\n       país  población_M  pib_usd_B\n0  Colombia           52        314\n1    México          128       1272\n2 Argentina           46        632\n3     Chile           19        317\n\nDimensiones: 4 filas �- 3 columnas` },
          { type: "text", text: "**Herramientas de trabajo:**" },
          { type: "list", items: [
            "**Jupyter Notebook**: Entorno interactivo, ideal para exploración y presentación",
            "**Google Colab**: Jupyter en la nube, gratis y con GPU/TPU disponibles",
            "**VS Code**: Editor profesional con extensión Python",
          ]},
          { type: "info", title: "Dónde conseguir datasets", text: "Kaggle.com • UCI ML Repository • datos.gov.co • data.un.org • Google Dataset Search" },
        ],
      },
      {
        type: "exercise", title: "Ejercicio: Tu primer script",
        instruction: "Crea una lista de 5 países latinoamericanos, imprime cuántos hay con len() y el primero con índice [0].",
        defaultCode: `# Lista de países latinoamericanos\npaises = ["Colombia", "México", "Argentina", "Chile", "Perú"]\n\n# Imprime el número de países (usa len())\nprint("Número de países:", ___(paises))\n\n# Imprime el primer país\nprint("Primer país:", paises[___])`,
        hints: ["Reemplaza ___ con: len y 0"],
        validate: (code) => {
          const ok = code.includes("len(paises)") && (code.includes("paises[0]") || code.includes("paises[ 0]"));
          return ok
            ? { ok: true, msg: "Output:\nNúmero de países: 5\nPrimer país: Colombia" }
            : { ok: false, msg: code.includes("len") ? "Falta completar paises[0] para el primer elemento." : "Usa len(paises) para contar." };
        },
      },
      {
        type: "quiz", title: "Quiz Módulo 1",
        questions: [
          { q: "¿Cuál librería de Python se usa para manipulación de datos tabulares?", options: ["NumPy", "Pandas", "Matplotlib", "Seaborn"], correct: 1 },
          { q: "¿Qué es un dataset?", options: ["Un tipo de variable", "Un lenguaje de programación", "Una colección organizada de datos en filas y columnas", "Una función de Python"], correct: 2 },
          { q: "¿Qué tipo de dato es: True?", options: ["String", "Integer", "Float", "Boolean"], correct: 3 },
          { q: "¿Cuál herramienta permite ejecutar Python en la nube de forma gratuita?", options: ["VS Code", "PyCharm", "Google Colab", "Jupyter Desktop"], correct: 2 },
          { q: "¿Para qué sirve Seaborn?", options: ["Manipulación de datos", "Cálculos numéricos", "Conexión a bases de datos", "Visualización estadística avanzada"], correct: 3 },
        ],
      },
    ],
  },
  {
    id: 2, emoji: "📗", colorKey: "teal",
    title: "EDA - Análisis Exploratorio",
    subtitle: "Explorar y entender datos con pandas",
    duration: "45 min", xp: 150, lessons: 5,
    sections: [
      {
        type: "theory", title: "Cargue de Datos con Pandas",
        content: [
          { type: "text", text: "Pandas permite cargar datos desde múltiples formatos. Los más comunes son CSV, Excel y JSON." },
          { type: "code", code: `import pandas as pd\n\n# Cargar CSV (más común)\ndf = pd.read_csv("datos.csv")\n\n# Cargar Excel\ndf = pd.read_excel("datos.xlsx", sheet_name="Hoja1")\n\n# Cargar JSON\ndf = pd.read_json("datos.json")\n\n# Desde Google Drive (en Colab)\nfrom google.colab import drive\ndrive.mount('/content/drive')\ndf = pd.read_csv('/content/drive/MyDrive/datos.csv')\n\nprint(df.head())` },
          { type: "info", title: "Tip de rutas", text:"En Colab usa rutas absolutas (/content/...). En Jupyter local usa rutas relativas (./datos/archivo.csv). Si obtienes FileNotFoundError, verifica que el archivo existe en esa ruta." },
        ],
      },
      {
        type: "theory", title: "Funciones Esenciales de EDA",
        content: [
          { type: "text", text: "Estas funciones son tu **kit de exploración inicial**. Úsalas siempre al recibir un dataset nuevo. Ejecuta cada bloque para ver exactamente qué retorna cada función:" },
          { type: "info", title: "Dataset de práctica", text:"Todos los bloques usan el mismo DataFrame de empleados con 5 registros, 4 columnas y un valor nulo intencional en 'nombre'." },
          { type: "runnable",
            code: `# PASO 0 -Crear el DataFrame de trabajo\nimport pandas as pd\n\ndatos = {\n 'nombre': ['Ana', 'Luis', 'María', 'Carlos', None],\n 'edad': [25, 30, 28, 35, 22],\n 'ciudad': ['Bogotá', 'Medellín', 'Cali', 'Bogotá', 'Cali'],\n 'salario': [4500000, 6000000, 5200000, 8000000, 3800000]\n}\ndf = pd.DataFrame(datos)\nprint(" DataFrame creado con", df.shape[0],"filas y", df.shape[1],"columnas")\nprint(df)`,
            output: ` DataFrame creado con 5 filas y 4 columnas\n   nombre  edad    ciudad   salario\n0     Ana    25    Bogotá   4500000\n1    Luis    30  Medellín   6000000\n2   María    28      Cali   5200000\n3  Carlos    35    Bogotá   8000000\n4    None    22      Cali   3800000` },
          { type: "runnable",
            code: `# head() y tail() -Ver las primeras y últimas filas\nimport pandas as pd\ndatos = {'nombre':['Ana','Luis','María','Carlos',None],'edad':[25,30,28,35,22],\n 'ciudad':['Bogotá','Medellín','Cali','Bogotá','Cali'],'salario':[4500000,6000000,5200000,8000000,3800000]}\ndf = pd.DataFrame(datos)\n\nprint("=== head(3) -Primeras 3 filas ===")\nprint(df.head(3))\n\nprint("\\n=== tail(2)" últimas 2 filas ===")\nprint(df.tail(2))`,
            output: `=== head(3) -Primeras 3 filas ===\n nombre edad ciudad salario\n0 Ana 25 Bogotá 4500000\n1 Luis 30 Medellín 6000000\n2 María 28 Cali 5200000\n\n=== tail(2)" últimas 2 filas ===\n   nombre  edad  ciudad   salario\n3  Carlos    35  Bogotá   8000000\n4    None    22    Cali   3800000` },
          { type: "runnable",
            code: `# info() y shape -Estructura del DataFrame\nimport pandas as pd\ndatos = {'nombre':['Ana','Luis','María','Carlos',None],'edad':[25,30,28,35,22],\n 'ciudad':['Bogotá','Medellín','Cali','Bogotá','Cali'],'salario':[4500000,6000000,5200000,8000000,3800000]}\ndf = pd.DataFrame(datos)\n\nprint("=== df.info() -Tipos de datos, nulos y memoria ===")\ndf.info()\n\nprint("\\n=== df.shape" (filas, columnas) ===")\nprint("Filas:", df.shape[0],"| Columnas:", df.shape[1])\n\nprint("\\n=== df.columns -Nombres de columnas ===")\nprint(df.columns.tolist())`,
            output: `=== df.info() -Tipos de datos, nulos y memoria ===\n<class 'pandas.core.frame.DataFrame'>\nRangeIndex: 5 entries, 0 to 4\nData columns (total 4 columns):\n # Column Non-Null Count Dtype \n--- ------ -------------- ----- \n 0 nombre 4 non-null object\n 1 edad 5 non-null int64 \n 2 ciudad 5 non-null object\n 3 salario 5 non-null int64 \ndtypes: int64(2), object(2)\nmemory usage: 288.0+ bytes\n\n=== df.shape" (filas, columnas) ===\nFilas: 5 | Columnas: 4\n\n=== df.columns - Nombres de columnas ===\n['nombre', 'edad', 'ciudad', 'salario']` },
          { type: "runnable",
            code: `# describe() -Estadísticas descriptivas de columnas numéricas\nimport pandas as pd\ndatos = {'nombre':['Ana','Luis','María','Carlos',None],'edad':[25,30,28,35,22],\n 'ciudad':['Bogotá','Medellín','Cali','Bogotá','Cali'],'salario':[4500000,6000000,5200000,8000000,3800000]}\ndf = pd.DataFrame(datos)\n\nprint("=== df.describe() -Resumen estadístico ===")\nprint(df.describe())\nprint()\nprint("de cada fila:")\nprint("count' nº de valores no nulos")\nprint("mean")\nprint("std' desviación estándar")\nprint("min mínimo")\nprint("25%' primer cuartil (Q1)")\nprint("50% (Q2)")\nprint("75%' tercer cuartil (Q3)")\nprint("max valor máximo")`,
            output: `=== df.describe() - Resumen estadístico ===\n             edad       salario\ncount    5.000000      5.000000\nmean    28.000000   5900000.000\nstd      4.847680   1673320.053\nmin     22.000000   3800000.000\n25%     25.000000   4500000.000\n50%     28.000000   5200000.000\n75%     30.000000   6000000.000\nmax     35.000000   8000000.000\n\n�Y'Significado de cada fila:\n count' nº de valores no nulos\n  mean  -promedio\n std' desviación estándar\n  min   -valor mínimo\n 25%' primer cuartil (Q1)\n  50%   -mediana (Q2)\n 75%' tercer cuartil (Q3)\n  max   - valor máximo` },
          { type: "runnable",
            code: `# isnull() -Detectar valores nulos\nimport pandas as pd\ndatos = {'nombre':['Ana','Luis','María','Carlos',None],'edad':[25,30,28,35,22],\n 'ciudad':['Bogotá','Medellín','Cali','Bogotá','Cali'],'salario':[4500000,6000000,5200000,8000000,3800000]}\ndf = pd.DataFrame(datos)\n\nprint("=== df.isnull() -Mapa de nulos (True = nulo) ===")\nprint(df.isnull())\n\nprint("\\n=== df.isnull().sum()" Nulos por columna ===")\nprint(df.isnull().sum())\n\nprint("\\n=== % de nulos por columna ===")\nprint((df.isnull().sum() / len(df) * 100).round(1))`,
            output: `=== df.isnull() -Mapa de nulos (True = nulo) ===\n nombre edad ciudad salario\n0 False False False False\n1 False False False False\n2 False False False False\n3 False False False False\n4 True False False False\n\n=== df.isnull().sum()" Nulos por columna ===\nnombre     1\nedad       0\nciudad     0\nsalario    0\ndtype: int64\n\n=== % de nulos por columna ===\nnombre     20.0\nedad        0.0\nciudad      0.0\nsalario     0.0\ndtype: float64` },
          { type: "runnable",
            code: `# unique(), nunique(), value_counts() -Explorar categorías\nimport pandas as pd\ndatos = {'nombre':['Ana','Luis','María','Carlos',None],'edad':[25,30,28,35,22],\n 'ciudad':['Bogotá','Medellín','Cali','Bogotá','Cali'],'salario':[4500000,6000000,5200000,8000000,3800000]}\ndf = pd.DataFrame(datos)\n\nprint("=== unique() -¿Qué valores distintos existen? ===")\nprint(df['ciudad'].unique())\n\nprint("\\n=== nunique()" ¿Cuántos valores únicos hay? ===")\nprint("Ciudades únicas:", df['ciudad'].nunique())\n\nprint("\\n=== value_counts() -Frecuencia de cada valor ===")\nprint(df['ciudad'].value_counts())\n\nprint("\\n=== value_counts(normalize=True)" En porcentaje ===")\nprint(df['ciudad'].value_counts(normalize=True).round(2))`,
            output: `=== unique() -¿Qué valores distintos existen? ===\n['Bogotá' 'Medellín' 'Cali']\n\n=== nunique()" ¿Cuántos valores únicos hay? ===\nCiudades únicas: 3\n\n=== value_counts() -Frecuencia de cada valor ===\nciudad\nBogotá 2\nCali 2\nMedellín 1\nName: count, dtype: int64\n\n=== value_counts(normalize=True)" En porcentaje ===\nciudad\nBogotá      0.40\nCali        0.40\nMedellín    0.20\nName: proportion, dtype: float64` },
          { type: "runnable",
            code: `# sum(), min(), max(), mean() -Estadísticas de columnas numéricas\nimport pandas as pd\ndatos = {'nombre':['Ana','Luis','María','Carlos',None],'edad':[25,30,28,35,22],\n 'ciudad':['Bogotá','Medellín','Cali','Bogotá','Cali'],'salario':[4500000,6000000,5200000,8000000,3800000]}\ndf = pd.DataFrame(datos)\n\nprint("=== Estadísticas del salario ===")\nprint(f"Suma total:  \${df['salario'].sum():,.0f}")\nprint(f"Mínimo:      \${df['salario'].min():,.0f}")\nprint(f"Máximo:      \${df['salario'].max():,.0f}")\nprint(f"Promedio:    \${df['salario'].mean():,.0f}")\nprint(f"Mediana:     \${df['salario'].median():,.0f}")\n\nprint("\\n=== Estadísticas de la edad ===")\nprint(f"Mínima: {df['edad'].min()} años")\nprint(f"Máxima: {df['edad'].max()} años")\nprint(f"Promedio: {df['edad'].mean():.1f} años")`,
            output: `=== Estadísticas del salario ===\nSuma total:  \$29,500,000\nMínimo:      \$3,800,000\nMáximo:      \$8,000,000\nPromedio:    \$5,900,000\nMediana:     \$5,200,000\n\n=== Estadísticas de la edad ===\nMínima: 22 años\nMáxima: 35 años\nPromedio: 28.0 años` },
        ],
      },
      {
        type: "exercise", title: "Ejercicio 1: Exploración básica",
        instruction: "Dado el DataFrame de estudiantes: (1) Muestra los primeros 3 registros con head(), (2) Cuenta valores nulos con isnull(), (3) Muestra la frecuencia de 'carrera' con value_counts().",
        defaultCode: `import pandas as pd\n\ndatos = {\n    'nombre': ['Ana', 'Luis', 'María', 'Carlos', 'Sofía'],\n    'edad': [20, 22, 21, None, 23],\n    'carrera': ['Sistemas','Economía','Sistemas','Derecho','Economía'],\n    'promedio': [4.2, 3.8, 4.5, 3.2, 4.1]\n}\ndf = pd.DataFrame(datos)\n\n# 1. Primeros 3 registros\nprint("=== PRIMEROS 3 ===")\nprint(df.___(___))\n\n# 2. Valores nulos por columna\nprint("\\n=== VALORES NULOS ===")\nprint(df.___().sum())\n\n# 3. Frecuencia de carrera\nprint("\\n=== FRECUENCIA CARRERA ===")\nprint(df['carrera'].___())`,
        hints: ["Usa: head(3), isnull(), value_counts()"],
        validate: (code) => {
          const ok = code.includes("head(3)") && code.includes("isnull()") && code.includes("value_counts()");
          return ok
            ? { ok: true, msg: "Output:\n=== PRIMEROS 3 ===\n nombre edad carrera promedio\n0 Ana 20.0 Sistemas 4.2\n1 Luis 22.0 Economía 3.8\n2 María 21.0 Sistemas 4.5\n\n=== VALORES NULOS ===\nedad 1\n\n=== FRECUENCIA CARRERA ===\nSistemas 2\nEconomía 2\nDerecho 1" }
            : { ok: false, msg: `Faltan: ${!code.includes("head(3)") ? "head(3)" : ""}${!code.includes("isnull()") ? "isnull()" : ""}${!code.includes("value_counts()") ? "value_counts()" : ""}` };
        },
      },
      {
        type: "exercise", title: "Ejercicio 2: Estadísticas básicas",
        instruction: "Calcula el promedio (mean()), mínimo (min()) y máximo (max()) del salario. Luego cuenta cuántos valores únicos hay en 'departamento' con nunique().",
        defaultCode: `import pandas as pd\n\ndatos = {\n    'empleado': ['Ana','Luis','María','Carlos','Sofía'],\n    'salario': [4500000, 6000000, 5200000, 8000000, 3800000],\n    'departamento': ['TI','Finanzas','TI','Gerencia','Finanzas']\n}\ndf = pd.DataFrame(datos)\n\n# Promedio del salario\nprint("Promedio:", df['salario'].___())\n\n# Mínimo y máximo\nprint("Mínimo:", df['salario'].___())\nprint("Máximo:", df['salario'].___())\n\n# Valores únicos en departamento\nprint("Departamentos únicos:", df['departamento'].___())`,
        hints: ["Usa en orden: mean(), min(), max(), nunique()"],
        validate: (code) => {
          const ok = code.includes("mean()") && code.includes("min()") && code.includes("max()") && code.includes("nunique()");
          return ok
            ? { ok: true, msg: "Output:\nPromedio: 5500000.0\nMínimo: 3800000\nMáximo: 8000000\nDepartamentos únicos: 3" }
            : { ok: false, msg: `Revisa: ${!code.includes("mean()") ? "mean()" : ""}${!code.includes("min()") ? "min()" : ""}${!code.includes("max()") ? "max()" : ""}${!code.includes("nunique()") ? "nunique()" : ""}` };
        },
      },
      {
        type: "quiz", title: "Quiz Módulo 2",
        questions: [
          { q: "¿Qué función muestra la estructura del DataFrame (tipos, nulos, memoria)?", options: ["describe()", "info()", "head()", "shape"], correct: 1 },
          { q: "¿Qué retorna df['col'].value_counts()?", options: ["Lista de valores únicos", "Número de valores únicos", "Frecuencia de cada valor", "Suma de todos los valores"], correct: 2 },
          { q: "¿Cómo se detectan los valores nulos por columna?", options: ["df.nulls()", "df.isna().count()", "df.isnull().sum()", "df.nan()"], correct: 2 },
          { q: "¿Qué función retorna estadísticas como media, std, min, max?", options: ["info()", "stats()", "describe()", "summary()"], correct: 2 },
          { q: "¿Qué retorna df.shape?", options: ["Tipos de datos", "Nombres de columnas", "Tupla (filas, columnas)", "Número de nulos"], correct: 2 },
        ],
      },
    ],
  },
  {
    id: 3, emoji: "🧪", colorKey:"yellow",
    title: "ETL - Limpieza y Transformación",
    subtitle: "Preparar datos para el análisis",
    duration: "40 min", xp: 150, lessons: 4,
    sections: [
      {
        type: "theory", title: "¿Qué es ETL?",
        content: [
          { type: "text", text: "**ETL** (Extract, Transform, Load) es el proceso de extraer datos de una fuente, transformarlos para limpiarlos y normalizarlos, y cargarlos en un destino final." },
          { type: "info", title: "Las 3 fases del ETL", text: "**E**xtract: Obtener datos desde CSV, BD, APIs • **T**ransform: Limpiar, normalizar, convertir tipos • **L**oad: Guardar el resultado limpio para análisis" },
          { type: "text", text: "Los datos reales raramente son perfectos. Problemas comunes:" },
          { type: "list", items: [
            "**Valores nulos**: Celdas vacías o NaN",
            "**Duplicados**: Filas repetidas",
            "**Formatos inconsistentes**: 'colombia', 'COLOMBIA', 'Colombia'",
            "**Tipos incorrectos**: Números almacenados como texto",
            "**Outliers**: Valores extremos que distorsionan el análisis",
          ]},
        ],
      },
      {
        type: "theory", title: "Operaciones de Limpieza y Transformación",
        content: [
          { type: "text", text: "El proceso ETL se divide en pasos. Ejecuta cada bloque para ver qué hace cada operación:" },
          { type: "runnable",
            code: `# PASO 1 -Crear el DataFrame con datos sucios (realistas)\nimport pandas as pd\n\ndatos = {\n 'nombre': ['ana GOMEZ','LUIS perez','María López','carlos RUIZ'],\n 'edad': ['25','30', None,'35'],\n 'ciudad': ['bogotá','MEDELLÍN','cali','bogotá'],\n 'salario': ['4500000','6000000','5200000','8000000'],\n 'activo': ['true','false','true','true']\n}\ndf = pd.DataFrame(datos)\nprint(" Dataset ORIGINAL (con problemas):")\nprint(df)\nprint("\\nTipos de datos:")\nprint(df.dtypes)`,
            output: ` Dataset ORIGINAL (con problemas):\n       nombre  edad    ciudad   salario activo\n0   ana GOMEZ    25    bogotá   4500000   true\n1  LUIS perez    30  MEDELLÍN   6000000  false\n2 María López  None      cali   5200000   true\n3  carlos RUIZ    35    bogotá   8000000   true\n\nTipos de datos:\nnombre     object\nedad       object\nciudad     object\nsalario    object\nactivo     object` },
          { type: "runnable",
            code: `# PASO 2 -Normalizar texto (mayúsculas / minúsculas / título)\ndf['nombre'] = df['nombre'].str.title() # Formato Título\ndf['ciudad'] = df['ciudad'].str.upper() # MAYÚSCULAS\ndf['activo'] = df['activo'].str.lower() # minúsculas\n\nprint(" Texto normalizado:")\nprint(df[['nombre','ciudad','activo']])`,
            output: ` Texto normalizado:\n        nombre    ciudad activo\n0    Ana Gomez    BOGOTÁ   true\n1   Luis Perez  MEDELLÍN  false\n2  María López      CALI   true\n3  Carlos Ruiz    BOGOTÁ   true` },
          { type: "runnable",
            code: `# PASO 3 -Convertir tipos de datos\ndf['salario'] = df['salario'].astype(float) # str = pd.to_numeric(df['edad'], errors='coerce') # str' número (None convertidos:")\nprint(df[['nombre','edad','salario']].dtypes)\nprint()\nprint(df[['nombre','edad','salario']])`,
            output: ` Tipos convertidos:\nnombre     object\nedad      float64\nsalario   float64\ndtype: object\n\n        nombre  edad   salario\n0    Ana Gomez  25.0  4500000.0\n1   Luis Perez  30.0  6000000.0\n2  María López   NaN  5200000.0\n3  Carlos Ruiz  35.0  8000000.0` },
          { type: "runnable",
            code: `# PASO 4 -Manejar nulos y duplicados\nprint("Nulos antes:")\nprint(df.isnull().sum())\n\n# Rellenar nulos con la mediana\ndf['edad'] = df['edad'].fillna(df['edad'].median())\n\n# Eliminar duplicados (si los hubiera)\ndf.drop_duplicates(inplace=True)\n\nprint("\\nNulos después:")\nprint(df.isnull().sum())\nprint("\\nDataset limpio:")\nprint(df)`,
            output: `Nulos antes:\nnombre    0\nedad      1\nciudad    0\nsalario   0\nactivo    0\n\nNulos después:\nnombre    0\nedad      0\nciudad    0\nsalario   0\nactivo    0\n\nDataset limpio:\n        nombre  edad    ciudad   salario activo\n0    Ana Gomez  25.0    BOGOTÁ  4500000.0   true\n1   Luis Perez  30.0  MEDELLÍN  6000000.0  false\n2  María López  30.0      CALI  5200000.0   true\n3  Carlos Ruiz  35.0    BOGOTÁ  8000000.0   true` },
          { type: "runnable",
            code: `# PASO 5 -Agregar columna calculada y exportar\ndf['salario_dolares'] = (df['salario'] / 4000).round(2)\ndf['ciudad'] = df['ciudad'].replace({'BOGOTÁ': 'Bogotá D.C.'})\n\nprint(" Dataset final enriquecido:")\nprint(df)\n\n# Guardar (descomentar para uso real):\n# df.to_csv("datos_limpios.csv", index=False)\n# df.to_excel("datos_limpios.xlsx", index=False)\nprint("\\n�Y'Listo para guardar con df.to_csv('datos_limpios.csv', index=False)")`,
            output: ` Dataset final enriquecido:\n        nombre  edad       ciudad   salario activo  salario_dolares\n0    Ana Gomez  25.0  Bogotá D.C.  4500000.0   true          1125.0\n1   Luis Perez  30.0     MEDELLÍN  6000000.0  false          1500.0\n2  María López  30.0         CALI  5200000.0   true          1300.0\n3  Carlos Ruiz  35.0  Bogotá D.C.  8000000.0   true          2000.0\n\n�Y'Listo para guardar con df.to_csv('datos_limpios.csv', index=False)` },
        ],
      },
      {
        type: "exercise", title: "Ejercicio 1: Transformación de texto y tipos",
        instruction: "Transforma el DataFrame: (1) Convierte 'nombre' a formato título con str.title(), (2) Convierte 'precio' de string a float con astype(float), (3) Convierte 'categoria' a minúsculas con str.lower().",
        defaultCode: `import pandas as pd\n\ndatos = {\n    'nombre': ['laptop LENOVO','mouse LOGITECH','TECLADO RAZER'],\n    'precio': ['2500000','150000','800000'],\n    'categoria': ['ELECTRÓNICA','PERIFÉRICO','PERIFÉRICO']\n}\ndf = pd.DataFrame(datos)\n\n# 1. Nombre a formato título\ndf['nombre'] = df['nombre'].str.___()\n\n# 2. Precio de string a float\ndf['precio'] = df['precio'].___(___)\n\n# 3. Categoría a minúsculas\ndf['categoria'] = df['categoria'].str.___()\n\nprint(df)\nprint("\\nTipos:")\nprint(df.dtypes)`,
        hints: ["Usa: str.title(), astype(float), str.lower()"],
        validate: (code) => {
          const ok = code.includes("str.title()") && code.includes("astype(float)") && code.includes("str.lower()");
          return ok
            ? { ok: true, msg: "Output:\n nombre precio categoria\n0 Laptop Lenovo 2500000.0 electrónica\n1 Mouse Logitech 150000.0 periférico\n2 Teclado Razer 800000.0 periférico\n\nTipos:\nnombre object\nprecio float64\ncategoria object" }
            : { ok: false, msg: `Revisa: ${!code.includes("str.title()") ? "str.title()" : ""}${!code.includes("astype(float)") ? "astype(float)" : ""}${!code.includes("str.lower()") ? "str.lower()" : ""}` };
        },
      },
      {
        type: "exercise", title: "Ejercicio 2: Limpieza completa + exportar",
        instruction: "Completa el proceso ETL: (1) Rellena nulos de 'edad' con la mediana, (2) Elimina duplicados con inplace=True, (3) Guarda el CSV con index=False.",
        defaultCode: `import pandas as pd\n\ndatos = {\n    'id': [1, 2, 3, 2, 4],\n    'nombre': ['Ana','Luis','María','Luis','Carlos'],\n    'edad': [25, None, 28, None, 35]\n}\ndf = pd.DataFrame(datos)\n\n# 1. Rellenar nulos de 'edad' con la mediana\ndf['edad'] = df['edad'].fillna(df['edad'].___())\n\n# 2. Eliminar filas duplicadas\ndf.drop_duplicates(inplace=___)\n\n# 3. Guardar como CSV sin índice\ndf.to_csv('datos_limpios.csv', ___=False)\n\nprint("Datos limpios:")\nprint(df)\nprint("\\nFilas finales:", len(df))`,
        hints: ["Usa: median(), True, index"],
        validate: (code) => {
          const ok = code.includes("median()") && code.includes("inplace=True") && code.includes("index=False");
          return ok
            ? { ok: true, msg: "Output:\nDatos limpios:\n id nombre edad\n0 1 Ana 25.0\n1 2 Luis 27.0\n2 3 María 28.0\n4 4 Carlos 35.0\n\nFilas finales: guardado" }
            : { ok: false, msg: `Verifica: ${!code.includes("median()") ? "median()" : ""}${!code.includes("inplace=True") ? "inplace=True" : ""}${!code.includes("index=False") ? "index=False" : ""}` };
        },
      },
      {
        type: "quiz", title: "Quiz Módulo 3",
        questions: [
          { q: "¿Qué hace df.drop_duplicates(inplace=True)?", options: ["Elimina columnas duplicadas", "Elimina filas duplicadas modificando el DataFrame original", "Crea una copia sin duplicados", "Marca los duplicados con True"], correct: 1 },
          { q: "¿Cómo se convierte una columna de string a float?", options: ["df['col'].to_float()", "df['col'].astype(float)", "float(df['col'])", "df['col'].convert('float')"], correct: 1 },
          { q: "¿Qué hace fillna(df['col'].median())?", options: ["Elimina los nulos", "Reemplaza nulos con la mediana de la columna", "Calcula la mediana sin modificar", "Rellena con 0"], correct: 1 },
          { q: "¿Qué significa ETL?", options: ["Execute Transform Load", "Extract Table Logic", "Extract Transform Load", "Explore Test Load"], correct: 2 },
          { q: "¿Qué parámetro evita guardar el índice al exportar CSV?", options: ["save_index=False", "index=False", "no_index=True", "skip_index=True"], correct: 1 },
        ],
      },
    ],
  },
  {
    id: 4, emoji: "📙", colorKey: "orange",
    title: "Gráficos y Visualización",
    subtitle: "Comunicar datos de forma visual",
    duration: "45 min", xp: 200, lessons: 5,
    sections: [
      {
        type: "theory", title: "Librerías y Tipos de Gráficos",
        content: [
          { type: "text", text: "La visualización de datos convierte números en historias visuales. Permite identificar patrones, tendencias y anomalías que serían difíciles de detectar en tablas." },
          { type: "info", title: "¿Cuándo usar cada librería?", text:"**Matplotlib**: Gráficos personalizados, control total • **Seaborn**: Gráficos estadísticos hermosos, integración con pandas • **Plotly**: Gráficos interactivos para dashboards" },
          { type: "chartGallery" },
        ],
      },
      {
        type: "theory", title: "Gráficos con Matplotlib y Seaborn",
        content: [
          { type: "text", text: "Ejecuta cada bloque para visualizar el gráfico generado:" },
          { type: "chartDemo",
            title: "Gráfico de Barras - plt.bar()",
            description: "Ideal para comparar valores entre categorías. Cada barra representa un mes.",
            chartSvg: BarChartSVG,
            code: `import matplotlib.pyplot as plt\nimport pandas as pd\n\ndatos = {\n    'mes': ['Ene','Feb','Mar','Abr','May','Jun'],\n    'ventas': [45000, 52000, 48000, 61000, 58000, 72000]\n}\ndf = pd.DataFrame(datos)\n\nplt.figure(figsize=(8, 5))\nplt.bar(df['mes'], df['ventas'], color='#6366f1', edgecolor='white', linewidth=0.5)\nplt.title('Ventas por Mes', fontsize=16, fontweight='bold')\nplt.xlabel('Mes')\nplt.ylabel('Ventas ($)')\nplt.tight_layout()\nplt.show()` },
          { type: "chartDemo",
            title: "Gráfico de Línea - plt.plot()",
            description: "Perfecto para mostrar tendencias a lo largo del tiempo. Las líneas sólidas son ventas, las punteadas costos.",
            chartSvg: LineChartSVG,
            code: `import matplotlib.pyplot as plt\nimport pandas as pd\n\ndatos = {\n    'mes': ['Ene','Feb','Mar','Abr','May','Jun'],\n    'ventas': [45000, 52000, 48000, 61000, 58000, 72000],\n    'costos': [30000, 35000, 32000, 40000, 38000, 45000]\n}\ndf = pd.DataFrame(datos)\n\nplt.figure(figsize=(8, 5))\nplt.plot(df['mes'], df['ventas'], marker='o', color='#14b8a6',\n         linewidth=2.5, label='Ventas')\nplt.plot(df['mes'], df['costos'], marker='s', color='#f97316',\n         linewidth=2, linestyle='--', label='Costos')\nplt.title('Ventas vs Costos', fontsize=16, fontweight='bold')\nplt.legend()\nplt.tight_layout()\nplt.show()` },
          { type: "chartDemo",
            title: "Boxplot - sns.boxplot()",
            description: "Muestra la distribución de los datos: caja=50% central, línea=mediana, bigotes=rango, puntos=outliers.",
            chartSvg: BoxPlotSVG,
            code: `import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\ndatos = {\n    'mes': ['Ene','Feb','Mar','Abr','May','Jun'],\n    'ventas': [45000, 52000, 48000, 61000, 58000, 72000],\n    'region': ['Norte','Sur','Norte','Sur','Norte','Sur']\n}\ndf = pd.DataFrame(datos)\n\nplt.figure(figsize=(6, 5))\nsns.boxplot(x='region', y='ventas', data=df, palette='cool')\nplt.title('Distribución de Ventas por Región')\nplt.tight_layout()\nplt.show()` },
          { type: "chartDemo",
            title: "Histograma - sns.histplot()",
            description: "Muestra cómo se distribuyen los valores de una variable continua. La curva KDE es la densidad suavizada.",
            chartSvg: HistSVG,
            code: `import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\nventas = [42,45,47,48,50,51,52,53,55,58,60,61,65,68,72]\n\nplt.figure(figsize=(7, 5))\nsns.histplot(ventas, kde=True, color='#6366f1', bins=6)\nplt.title('Distribución de Ventas')\nplt.xlabel('Ventas (miles $)')\nplt.ylabel('Frecuencia')\nplt.tight_layout()\nplt.show()` },
        ],
      },
      {
        type: "exercise", title: "Ejercicio 1: Gráfico de barras correcto",
        instruction: "Completa el código para crear un gráfico de barras de 'categoria' vs 'total_ventas' con plt.bar(), título 'Ventas por Categoría' y etiqueta Y 'Total Ventas ($)'.",
        defaultCode: `import matplotlib.pyplot as plt\nimport pandas as pd\n\ndatos = {\n    'categoria': ['Tecnología','Ropa','Alimentos','Hogar'],\n    'total_ventas': [450000, 280000, 190000, 320000]\n}\ndf = pd.DataFrame(datos)\n\nplt.figure(figsize=(8, 5))\nplt.___( df['categoria'], df['total_ventas'], color='#6366f1' )\n\nplt.title(___)\nplt.xlabel('Categoría')\nplt.ylabel(___)\n\nplt.tight_layout()\nplt.show()`,
        hints: ["Usa: bar(), 'Ventas por Categoría', 'Total Ventas ($)'"],
        validate: (code) => {
          const ok = code.includes("plt.bar(") && code.includes("plt.title(") && code.includes("plt.ylabel(");
          return ok
            ? { ok: true, msg: "Gráfico correcto:\n- Eje X: Tecnología, Ropa, Alimentos, Hogar\n- Eje Y: valores de ventas\n- Título y etiquetas correctas\n- Color morado #6366f1" }
            : { ok: false, msg: `Verifica: ${!code.includes("plt.bar(") ? "plt.bar()" : ""}${!code.includes("plt.title(") ? "plt.title()" : ""}${!code.includes("plt.ylabel(") ? "plt.ylabel()" : ""}` };
        },
      },
      {
        type: "exercise", title: "Ejercicio 2: Gráfico de dispersión con Seaborn",
        instruction: "Usa Seaborn para crear un scatterplot entre 'experiencia_años' y 'salario', coloreado por 'nivel' con el parámetro hue='nivel'.",
        defaultCode: `import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\ndatos = {\n    'experiencia_años': [1,2,3,5,7,8,10,12,15,3],\n    'salario': [2800000,3200000,4000000,5500000,7000000,\n                7500000,9000000,11000000,14000000,3800000],\n    'nivel': ['Junior','Junior','Junior','Mid','Mid',\n              'Mid','Senior','Senior','Senior','Junior']\n}\ndf = pd.DataFrame(datos)\n\nplt.figure(figsize=(8, 5))\n\n# Scatterplot con seaborn (x, y, hue, data, s=tamaño punto)\nsns.___(x='experiencia_años', y='salario', hue='nivel', data=df, s=100)\n\nplt.title('Salario vs Experiencia')\nplt.xlabel('Años de experiencia')\nplt.ylabel('Salario mensual ($)')\nplt.tight_layout()\nplt.show()`,
        hints: ["La función de dispersión en seaborn es scatterplot()"],
        validate: (code) => {
          const ok = code.includes("sns.scatterplot(") && code.includes("hue='nivel'");
          return ok
            ? { ok: true, msg: "Scatterplot correcto:\n- Eje X: Años de experiencia (1-15)\n- Eje Y: Salario mensual\n- Colores: Azul=Junior, Verde=Mid, Naranja=Senior\n- Correlación positiva visible entre experiencia y salario" }
            : { ok: false, msg: `Verifica: ${!code.includes("sns.scatterplot(") ? "sns.scatterplot()" : ""}${!code.includes("hue='nivel'") ? "hue='nivel'" : ""}` };
        },
      },
      {
        type: "quiz", title: "Quiz Módulo 4",
        questions: [
          { q: "¿Qué tipo de gráfico es mejor para mostrar la distribución de una variable numérica?", options: ["Gráfico de barras", "Gráfico de línea", "Histograma", "Gráfico de pastel"], correct: 2 },
          { q: "¿Cuál función de Seaborn crea un diagrama de caja?", options: ["sns.barplot()", "sns.boxplot()", "sns.lineplot()", "sns.scatterplot()"], correct: 1 },
          { q: "¿Para qué sirve el parámetro hue en Seaborn?", options: ["Cambiar el color del fondo", "Colorear por una tercera variable categórica", "Ajustar el tamaño", "Rotar las etiquetas"], correct: 1 },
          { q: "¿Qué gráfico usarías para tendencias en 12 meses?", options: ["Gráfico de barras", "Histograma", "Gráfico de línea", "Boxplot"], correct: 2 },
          { q: "¿Qué hace plt.tight_layout()?", options: ["Guarda el gráfico", "Ajusta automáticamente el espaciado", "Cambia el tamaño de la figura", "Agrega una leyenda"], correct: 1 },
        ],
      },
    ],
  },
];

// �""? COLOR MAP (del P1) �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
const MOD_COLOR = { purple: C.purple, teal: C.teal, yellow: C.yellow, orange: C.orange };
const MOD_ALT = { purple: '#818cf8', teal: '#5eead4', yellow: '#fcd34d', orange: '#fb923c' };

// �""? MAIN APP �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
export default function App() {
  const [student, setStudent] = useState(null);
  const [moduleProgress, setModuleProgress] = useState({ 0: { exercises: {}, quiz: false, complete: false } });
  const [activeModule, setActiveModule] = useState(0);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [toast, setToast] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [streak] = useState(7);
  const [xpFloats, setXpFloats] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);
  const [badgeData, setBadgeData] = useState(null);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [page, setPage] = useState('course');
  const [sidebarTab, setSidebarTab] = useState('progress');
  const toastTimer = useRef(null);
  // Estados para items activos de la tienda
  const [activeAvatar, setActiveAvatar] = useState(null);
  const [activeTheme, setActiveTheme] = useState('default');
  const [activePowerups, setActivePowerups] = useState([]);

  // �""? HELPERS �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
  const showToast = (icon, msg, color, duration = 3500) => {
    clearTimeout(toastTimer.current);
    setToast({ icon, msg, color });
    toastTimer.current = setTimeout(() => setToast(null), duration);
  };

  const getModProg = (idx) => moduleProgress[idx] || { exercises: {}, quiz: false, complete: false };

  const mod = MODULES[activeModule];
  const modProg = getModProg(activeModule);
  const modColor = MOD_COLOR[mod.colorKey] || C.purple;

  const exerciseSections = mod.sections.filter(s => s.type === "exercise");
  let exerciseCounter = -1;
  const sectionExerciseIdx = mod.sections.map(s => {
    if (s.type === "exercise") { exerciseCounter++; return exerciseCounter; }
    return -1;
  });

  const allExercisesPassed = exerciseSections.every((_, i) => modProg.exercises[i]);
  const canComplete = allExercisesPassed && modProg.quiz && !modProg.complete;

  const updateMod = (idx, updates) => {
    setModuleProgress(prev => ({ ...prev, [idx]: { ...getModProg(idx), ...updates } }));
  };

  const section = mod.sections[activeSectionIdx];
  const currentExIdx = sectionExerciseIdx[activeSectionIdx];

  const isModuleUnlocked = (idx) => idx === 0 || getModProg(idx - 1).complete;
  const overallProgress = Math.round((MODULES.filter((_, i) => getModProg(i).complete).length / MODULES.length) * 100);

  // �""? XP Y BADGES �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?
  const awardXP = (amount, e) => {
    const prevLevel = getLevelFromXP(totalXP);
    const newXP = totalXP + amount;
    const newLevel = getLevelFromXP(newXP);
    setTotalXP(newXP);

    if (e) {
      const rect = e.currentTarget?.getBoundingClientRect?.();
      if (rect) {
        const id = Date.now();
        setXpFloats(p => [...p, { id, amount, x: rect.left + rect.width / 2 - 30, y: rect.top - 10 }]);
        setTimeout(() => setXpFloats(p => p.filter(f => f.id !== id)), 1200);
      }
    }

    if (newLevel !== prevLevel) {
      setTimeout(() => setLevelUpData(newLevel), 500);
    }

    // Check XP badges
    const xpBadges = [
      { id: 'xp_100', threshold: 100 },
      { id: 'xp_500', threshold: 500 },
      { id: 'xp_1000', threshold: 1000 },
    ];
    xpBadges.forEach(({ id, threshold }) => {
      if (newXP >= threshold && !unlockedBadges.includes(id)) {
        setUnlockedBadges(prev => [...prev, id]);
        const badge = BADGES.find(b => b.id === id);
        if (badge) setTimeout(() => setBadgeData(badge), 800);
      }
    });
  };

  const triggerBadge = (id) => {
    if (!unlockedBadges.includes(id)) {
      setUnlockedBadges(prev => [...prev, id]);
      const badge = BADGES.find(b => b.id === id);
      if (badge) setTimeout(() => setBadgeData(badge), 800);
    }
  };

  // �""? HANDLERS �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
  const handleExercisePassed = (e) => {
    if (currentExIdx >= 0 && !modProg.exercises[currentExIdx]) {
      updateMod(activeModule, { exercises: { ...modProg.exercises, [currentExIdx]: true } });
      awardXP(30, e);
      showToast("", "+30 XP ¡Ejercicio completado!", C.yellow);

      // First try badge
      if (!unlockedBadges.includes('first_try')) {
        triggerBadge('first_try');
      }
    }
  };

  const handleQuizPassed = (answers) => {
    if (!modProg.quiz) {
      updateMod(activeModule, { quiz: true });
      awardXP(50);
      showToast("", "+50 XP ¡Quiz superado!", C.teal);

      // Perfect quiz badge
      if (answers.every(Boolean) && !unlockedBadges.includes('perfect_quiz')) {
        triggerBadge('perfect_quiz');
      }
    }
  };

  const handleCompleteModule = () => {
    updateMod(activeModule, { complete: true });
    const nextIdx = activeModule + 1;
    if (nextIdx < MODULES.length) {
      setModuleProgress(prev => ({ ...prev, [nextIdx]: prev[nextIdx] || { exercises: {}, quiz: false, complete: false } }));
    }
    awardXP(mod.xp);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    showToast("", `Módulo ${mod.id} completado! +${mod.xp} XP`, C.yellow, 4000);

    // Module badges
    const moduleBadges = ['first_module', 'mod2_done', 'mod3_done', 'mod4_done'];
    if (!unlockedBadges.includes(moduleBadges[activeModule])) {
      triggerBadge(moduleBadges[activeModule]);
    }

    if (activeModule === MODULES.length - 1) {
      // All modules badge
      if (!unlockedBadges.includes('all_modules')) {
        triggerBadge('all_modules');
      }
      setTimeout(() => setShowCert(true), 2000);
    }
  };

  const handleRegister = (studentData) => {
    setStudent(studentData);
    if (!unlockedBadges.includes('first_login')) {
      triggerBadge('first_login');
    }
    showToast("", `¡Bienvenido/a ${studentData.name}! `, C.purple);
  };

  const handlePurchase = (id, cost) => {
    if (totalXP >= cost && !shopItems.includes(id)) {
      setTotalXP(prev => prev - cost);
      setShopItems(prev => [...prev, id]);
      
      // Buscar el item comprado
      const item = SHOP_ITEMS.find(i => i.id === id);
      
      // Activar automáticamente según el tipo
      if (item.type === 'avatar') {
        setActiveAvatar(id);
        showToast("", `¡${item.name} equipado!`, C.purple);
      } 
      else if (item.type === 'theme') {
        setActiveTheme(id);
        showToast("", `Tema ${item.name} activado`, C.teal);
      }
      else if (item.type === 'powerup') {
        setActivePowerups(prev => [...prev, id]);
        showToast("", `¡${item.name} disponible!`, C.yellow);
      } else {
        showToast("", "¡Ítem adquirido!", C.purple);
      }
    }
  };
  const handleEquip = (id) => {
  const item = SHOP_ITEMS.find(i => i.id === id);
  
  if (item.type === 'avatar') {
    setActiveAvatar(id);
    showToast("", `Avatar cambiado a ${item.name}`, C.purple);
  }
  else if (item.type === 'theme') {
    setActiveTheme(id);
    showToast("", `Tema ${item.name} activado`, C.teal);
  }
  else if (item.type === 'powerup') {
    if (activePowerups.includes(id)) {
      setActivePowerups(prev => prev.filter(p => p !== id));
      showToast("", `${item.name} desactivado`, C.dim);
    } else {
      setActivePowerups(prev => [...prev, id]);
      showToast("", `${item.name} activado`, C.yellow);
    }
  }
};

  // �""? RENDER �""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�""?�"?
  if (!student) return <RegisterForm onRegister={handleRegister} />;
  if (showCert) return <Certificate studentName={student.name} onBack={() => setShowCert(false)} />;

  const level = getLevelFromXP(totalXP);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {/* Overlays */}
      {showConfetti && <Confetti active={showConfetti} />}
      {toast && <Toast toast={toast} />}
      {levelUpData && <LevelUpOverlay level={levelUpData} onClose={() => setLevelUpData(null)} />}
      {badgeData && <BadgeUnlocked badge={badgeData} onClose={() => setBadgeData(null)} />}
      {xpFloats.map(f => (
        <XPFloat key={f.id} amount={f.amount} x={f.x} y={f.y} onDone={() => setXpFloats(p => p.filter(x => x.id !== f.id))} />
      ))}

      {/* Header */}
      <header style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "0 24px", height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}></span>
          <span style={{ fontWeight: 900, fontSize: 18, color: C.text }}>🐍Elidev </span>
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Análisis de Datos</span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: 'course', label: 'Curso' },
            { id: 'dashboard', label: 'Progreso' },
          ].map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none',
              background: page === n.id ? C.purple + '33' : 'transparent',
              color: page === n.id ? C.purpleLight : C.muted,
              fontWeight: 800, fontSize: 13, cursor: 'pointer',
            }}>{n.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: C.yellow + "22", color: C.yellow, padding: "5px 14px", borderRadius: 999, fontWeight: 800, fontSize: 13 }}>
            {level.icon} {totalXP} XP
          </div>
          <div style={{ background: "#ff6b3522", color: "#fb923c", padding: "5px 14px", borderRadius: 999, fontWeight: 800, fontSize: 13 }}>
            🔥 {streak} días
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", cursor: 'pointer',
            background: `linear-gradient(135deg,${C.purple},${C.blue})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 13, color: "white"
          }}>
            {activeAvatar ? (
              <span style={{ fontSize: 20 }}>
                {SHOP_ITEMS.find(i => i.id === activeAvatar)?.icon || student.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              student.name.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </header>

      {/* Dashboard Page */}
      {page === 'dashboard' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>
          <Dashboard state={{ totalXP, streak, moduleProgress, unlockedBadges, shopItems }} modules={MODULES} />
        </div>
      )}

      {/* Course Page */}
      {page === 'course' && (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", maxWidth: 1200, margin: "0 auto", padding: 24, gap: 24, minHeight: "calc(100vh - 60px)" }}>

          {/* Sidebar */}
          <aside>
            {/* Sidebar tabs */}
            <div style={{ display: 'flex', gap: 3, background: C.surface, borderRadius: 10, padding: 4, marginBottom: 16, border: `1px solid ${C.border}` }}>
              {[
                { id: 'progress', label: 'Progreso' },
                { id: 'badges', label: 'Insignias' },
                { id: 'shop', label: 'Tienda' },
              ].map(t => (
                <button key={t.id} onClick={() => setSidebarTab(t.id)} style={{
                  flex: 1, padding: '7px 0', borderRadius: 7, border: 'none',
                  background: sidebarTab === t.id ? C.purple : 'transparent',
                  color: sidebarTab === t.id ? 'white' : C.muted,
                  fontWeight: 800, fontSize: 16, cursor: 'pointer',
                }}>{t.label}</button>
              ))}
            </div>

            {sidebarTab === 'progress' && (
              <>
                <LevelCard xp={totalXP} streak={streak} />

                {/* Overall progress */}
                <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>
                    Progreso General
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 8 }}>{overallProgress}%</div>
                  <ProgressBar value={overallProgress} />
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 8, fontWeight: 600 }}>
                    {MODULES.filter((_, i) => getModProg(i).complete).length} de {MODULES.length} módulos
                  </div>
                </div>

                {/* Module nav */}
                <div className="card" style={{ padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>
                    Módulos
                  </div>
                  {MODULES.map((m, i) => {
                    const unlocked = isModuleUnlocked(i);
                    const complete = getModProg(i).complete;
                    const isActive = activeModule === i;
                    const mc = MOD_COLOR[m.colorKey] || C.purple;
                    return (
                      <div key={i} onClick={() => {
                        if (unlocked) { setActiveModule(i); setActiveSectionIdx(0); }
                        else showToast("", "Completa el módulo anterior para desbloquear", C.muted);
                      }} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        borderRadius: 12, marginBottom: 4, cursor: unlocked ? "pointer" : "not-allowed",
                        background: isActive ? mc + "22" : "transparent",
                        border: `2px solid ${isActive ? mc : "transparent"}`,
                        opacity: unlocked ? 1 : 0.5, transition: "all 0.2s"
                      }}>
                        <span style={{ fontSize: 18 }}>{unlocked ? (complete ? "✓" : m.emoji) : "🔒"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 800,
                            color: isActive ? mc : (unlocked ? C.text : C.muted),
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                          }}>
                            M{m.id}: {m.title.split(" - ")[0].trim()}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{m.duration} • {m.xp} XP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Module checklist */}
                <div className="card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>
                    Módulo actual
                  </div>
                  {(() => {
                    const done = exerciseSections.filter((_, i) => modProg.exercises[i]).length + (modProg.quiz ? 1 : 0);
                    const total = exerciseSections.length + 1;
                    return (
                      <>
                        <ProgressBar value={Math.round((done / total) * 100)} color={modColor} label={`${done}/${total} actividades`} />
                        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                          {exerciseSections.map((_, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: modProg.exercises[i] ? C.green : C.muted, fontWeight: 600 }}>
                              <span>{modProg.exercises[i] ? "✓" : "○"}</span> Ejercicio {i + 1}
                            </div>
                          ))}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: modProg.quiz ? C.green : C.muted, fontWeight: 600 }}>
                            <span>{modProg.quiz ? "✓" : "○"}</span> Quiz
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </>
            )}

            {sidebarTab === 'badges' && <BadgesPanel unlockedBadges={unlockedBadges} />}

           {sidebarTab === 'shop' && (
          <Shop 
            totalXP={totalXP} 
            shopItems={shopItems} 
            onPurchase={handlePurchase}
            onEquip={handleEquip}
            activeAvatar={activeAvatar}
            activeTheme={activeTheme}
            activePowerups={activePowerups}
          />
        )}
          </aside>

          {/* Main */}
          <main style={{ minWidth: 0 }}>
            {/* Module header */}
            <div style={{
              background: `linear-gradient(135deg,${modColor}33 0%,${C.card} 100%)`,
              border: `1px solid ${modColor}44`, borderRadius: 20, padding: "28px 32px",
              marginBottom: 20, position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", right: -30, top: -30, width: 180, height: 180, borderRadius: "50%", background: modColor + "11" }} />
              <div style={{ fontSize: 11, fontWeight: 800, color: modColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                Módulo {mod.id} • {mod.emoji}
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 6 }}>{mod.title}</h1>
              <p style={{ color: C.dim, fontSize: 14, marginBottom: 16 }}>{mod.subtitle}</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[["⏱", mod.duration], ["", `${mod.lessons} lecciones`], ["⭐", `+${mod.xp} XP`]].map(([icon, val]) => (
                  <div key={val} style={{ background: C.bg + "88", padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, color: C.dim, display: "flex", gap: 6, alignItems: "center" }}>
                    <span>{icon}</span><span>{val}</span>
                  </div>
                ))}
              </div>
              {modProg.complete && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.green + "22", border: `1px solid ${C.green}`, borderRadius: 999, padding: "4px 14px", color: C.green, fontWeight: 800, fontSize: 13 }}>
                  Completado
                </div>
              )}
            </div>

            {/* Section tabs */}
            <div style={{ display: "flex", gap: 4, background: C.card, borderRadius: 14, padding: 6, marginBottom: 20, border: `1px solid ${C.border}`, overflowX: "auto" }}>
              {mod.sections.map((s, i) => {
                const isActive = activeSectionIdx === i;
                const exI = sectionExerciseIdx[i];
                const isDone = s.type === "exercise" ? modProg.exercises[exI] : s.type === "quiz" ? modProg.quiz : true;
                return (
                  <button key={i} onClick={() => setActiveSectionIdx(i)} style={{
                    flex: "1 0 auto", padding: "9px 14px", borderRadius: 10, border: "none",
                    background: isActive ? modColor : "transparent",
                    color: isActive ? "white" : (isDone ? modColor : C.muted),
                    cursor: "pointer", fontWeight: 800, fontSize: 12, transition: "all 0.2s", whiteSpace: "nowrap",
                    boxShadow: isActive ? `0 2px 10px ${modColor}44` : "none"
                  }}>
                    {s.type === "exercise" ? "💻" : s.type === "quiz" ? "🧠" : "📖"} {s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title}
                  </button>
                );
              })}
            </div>

            {/* Section content */}
            <div className="card" style={{ padding: 32, marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, color: C.text, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                {section.title}
              </h2>
              <SectionContent
                key={`${activeModule}-${activeSectionIdx}`}
                section={section}
                modProg={modProg}
                currentExIdx={currentExIdx}
                onExercisePassed={handleExercisePassed}
                onQuizPassed={handleQuizPassed}
              />

              {/* Nav buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setActiveSectionIdx(Math.max(0, activeSectionIdx - 1))}
                  disabled={activeSectionIdx === 0}
                  style={{
                    padding: "10px 20px", borderRadius: 10, border: `1px solid ${C.border}`,
                    background: "transparent", color: activeSectionIdx === 0 ? C.muted : C.dim,
                    cursor: activeSectionIdx === 0 ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14
                  }}>
                  • Anterior
                </button>
                {activeSectionIdx < mod.sections.length - 1 ? (
                  <button onClick={() => setActiveSectionIdx(activeSectionIdx + 1)} style={{
                    padding: "10px 24px", borderRadius: 10, border: "none",
                    background: `linear-gradient(135deg,${modColor},${MOD_ALT[mod.colorKey] || '#818cf8'})`,
                    color: "#0d0f1a", cursor: "pointer", fontWeight: 900, fontSize: 14,
                    boxShadow: `0 4px 12px ${modColor}44`
                  }}>
                    Siguiente
                  </button>
                ) : (
                  <button onClick={handleCompleteModule} disabled={!canComplete || modProg.complete} style={{
                    padding: "12px 28px", borderRadius: 10, border: "none",
                    background: canComplete && !modProg.complete ? `linear-gradient(135deg,${C.green},#15803d)` : C.border,
                    color: canComplete && !modProg.complete ? "white" : C.muted,
                    cursor: canComplete && !modProg.complete ? "pointer" : "not-allowed",
                    fontWeight: 900, fontSize: 14,
                    boxShadow: canComplete && !modProg.complete ? `0 4px 16px ${C.green}44` : "none",
                    animation: canComplete && !modProg.complete ? "glow 2s infinite" : "none"
                  }}>
                    {modProg.complete ? "Módulo completado" : canComplete ? "Completar módulo" : "Completa ejercicios y quiz"}
                  </button>
                )}
              </div>
            </div>

            {/* Requirements panel */}
            {activeSectionIdx === mod.sections.length - 1 && !modProg.complete && (
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.dim, marginBottom: 14 }}>Requisitos para completar el módulo</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {exerciseSections.map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                      <span style={{ color: modProg.exercises[i] ? C.green : C.muted }}>{modProg.exercises[i] ? "✓" : "⬜"}</span>
                      <span style={{ color: modProg.exercises[i] ? C.text : C.muted, fontWeight: 600 }}>Ejercicio {i + 1} completado</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                    <span style={{ color: modProg.quiz ? C.green : C.muted }}>{modProg.quiz ? "✓" : "⬜"}</span>
                    <span style={{ color: modProg.quiz ? C.text : C.muted, fontWeight: 600 }}>Quiz completado (60% mínimo)</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      <footer>
        <div style={{ textAlign: "center", color: C.muted, fontSize: 12, padding: 12 }}>
          &copy; 2026 Todos los derechos reservados. | Hecho con ❤️ por Luz Eliana Martínez. | <a href="https://github.com/EMARTINEZ1993" target="_blank" style={{ color: C.muted, textDecoration: "underline" }}>GitHub</a>
        </div>
      </footer>
    </div>
  );
}










