export const C = {
  bg:          '#0d0f1a',
  surface:     '#13162a',
  card:        '#1a1d2e',
  card2:       '#1e2235',
  border:      '#252840',
  border2:     '#2e3250',
  purple:      '#6366f1',
  purpleLight: '#818cf8',
  blue:        '#3b82f6',
  teal:        '#14b8a6',
  green:       '#22c55e',
  yellow:      '#f59e0b',
  orange:      '#f97316',
  red:         '#ef4444',
  pink:        '#ec4899',
  text:        '#e8eaf6',
  dim:         '#94a3b8',
  muted:       '#64748b',
}

export const LEVELS = [
  { name: 'Aprendiz',   minXP: 0,    maxXP: 200,  icon: '🌱', color: C.teal   },
  { name: 'Analista',   minXP: 200,  maxXP: 450,  icon: '📊', color: C.blue   },
  { name: 'Explorador', minXP: 450,  maxXP: 750,  icon: '🔭', color: C.purple },
  { name: 'Senior',     minXP: 750,  maxXP: 1100, icon: '🧑‍💻', color: C.orange },
  { name: 'Experto',    minXP: 1100, maxXP: 9999, icon: '🏆', color: C.yellow },
]

export function getLevelFromXP(xp) {
  return LEVELS.findLast(l => xp >= l.minXP) || LEVELS[0]
}

export const MODULE_COLORS = [C.purple, C.teal, C.yellow, C.orange, C.pink, C.blue]
