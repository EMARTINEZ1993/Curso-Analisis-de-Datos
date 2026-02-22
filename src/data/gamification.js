export const BADGES = [
  // Onboarding
  { id:'first_login',   icon:'🐣', name:'Primer Paso',      desc:'Te registraste en CodeQuest',           rarity:'common'   },
  { id:'first_code',    icon:'💻', name:'Primer Código',    desc:'Ejecutaste tu primer bloque de código', rarity:'common'   },
  { id:'first_module',  icon:'📘', name:'Módulo 1 ✓',      desc:'Completaste el módulo de Fundamentos',  rarity:'common'   },
  // Streaks
  { id:'streak_3',      icon:'🔥', name:'Racha de 3',       desc:'3 días seguidos estudiando',            rarity:'rare'     },
  { id:'streak_7',      icon:'🔥🔥','name':'Semana Perfecta', desc:'7 días seguidos sin faltar',           rarity:'epic'     },
  { id:'streak_30',     icon:'💫', name:'Dedicación Total', desc:'30 días estudiando sin parar',          rarity:'legendary'},
  // Performance
  { id:'perfect_quiz',  icon:'💯', name:'Quiz Perfecto',    desc:'5/5 en un quiz al primer intento',     rarity:'rare'     },
  { id:'speedrun',      icon:'⚡', name:'Speedrun',         desc:'Resolviste un ejercicio en menos de 60s',rarity:'rare'    },
  { id:'no_hints',      icon:'🧠', name:'Sin Ayuda',        desc:'Completaste un ejercicio sin usar pistas',rarity:'epic'   },
  { id:'first_try',     icon:'🎯', name:'A la Primera',     desc:'Primer intento correcto en un ejercicio',rarity:'rare'   },
  // Progress
  { id:'mod2_done',     icon:'📗', name:'EDA Master',       desc:'Completaste el módulo de EDA',          rarity:'common'  },
  { id:'mod3_done',     icon:'📙', name:'ETL Pro',          desc:'Completaste el módulo de ETL',          rarity:'common'  },
  { id:'mod4_done',     icon:'📕', name:'Viz Wizard',       desc:'Completaste el módulo de Gráficos',     rarity:'common'  },
  { id:'all_modules',   icon:'🎓', name:'Graduado',         desc:'Completaste todos los módulos',         rarity:'legendary'},
  // XP milestones
  { id:'xp_100',        icon:'⭐', name:'Primera Estrella', desc:'Alcanzaste 100 XP',                     rarity:'common'  },
  { id:'xp_500',        icon:'🌟', name:'Supernova',        desc:'Alcanzaste 500 XP',                     rarity:'rare'    },
  { id:'xp_1000',       icon:'🏅', name:'Leyenda',          desc:'Alcanzaste 1000 XP',                    rarity:'epic'    },
  // Fun
  { id:'night_owl',     icon:'🦉', name:'Búho Nocturno',   desc:'Estudiaste después de las 10pm',        rarity:'rare'    },
  { id:'early_bird',    icon:'🐦', name:'Madrugador',       desc:'Estudiaste antes de las 7am',           rarity:'rare'    },
  { id:'multi_attempt', icon:'💪', name:'Persistente',      desc:'Reintentaste un ejercicio 3+ veces',    rarity:'common'  },
]

export const RARITY_COLORS = {
  common:    '#94a3b8',
  rare:      '#3b82f6',
  epic:      '#8b5cf6',
  legendary: '#f59e0b',
}

export const SHOP_ITEMS = [
  // Avatars
  { id:'avatar_rocket',  type:'avatar', icon:'🚀', name:'Cohete',       cost:50,  desc:'Avatar espacial'     },
  { id:'avatar_dragon',  type:'avatar', icon:'🐉', name:'Dragón',        cost:80,  desc:'Avatar épico'        },
  { id:'avatar_robot',   type:'avatar', icon:'🤖', name:'Robot',         cost:60,  desc:'Avatar tecno'        },
  { id:'avatar_ninja',   type:'avatar', icon:'🥷', name:'Ninja',         cost:100, desc:'Avatar misterioso'   },
  { id:'avatar_wizard',  type:'avatar', icon:'🧙', name:'Mago',          cost:120, desc:'Avatar legendario'   },
  // Themes / editor colors
  { id:'theme_matrix',   type:'theme',  icon:'🟩', name:'Matrix',        cost:150, desc:'Tema verde Matrix'   },
  { id:'theme_sunset',   type:'theme',  icon:'🌅', name:'Sunset',        cost:150, desc:'Tema cálido naranja' },
  { id:'theme_ocean',    type:'theme',  icon:'🌊', name:'Ocean',         cost:150, desc:'Tema azul oceánico'  },
  // Power-ups
  { id:'hint_pack',      type:'powerup',icon:'💡', name:'Pack de Pistas', cost:30, desc:'3 pistas extra'      },
  { id:'xp_boost',       type:'powerup',icon:'⚡', name:'XP x2',          cost:80, desc:'Doble XP por 1 módulo'},
  { id:'skip_token',     type:'powerup',icon:'⏭️', name:'Skip Token',     cost:200,desc:'Saltar 1 ejercicio'  },
]

// Check which badges should be awarded given current state
export function evaluateBadges(state, event) {
  const toUnlock = []
  const already = state.unlockedBadges || []
  const check = (id) => !already.includes(id)

  if (event.type === 'register'    && check('first_login'))   toUnlock.push('first_login')
  if (event.type === 'run_code'    && check('first_code'))    toUnlock.push('first_code')
  if (event.type === 'module_done' && event.modIdx === 0 && check('first_module'))  toUnlock.push('first_module')
  if (event.type === 'module_done' && event.modIdx === 1 && check('mod2_done'))     toUnlock.push('mod2_done')
  if (event.type === 'module_done' && event.modIdx === 2 && check('mod3_done'))     toUnlock.push('mod3_done')
  if (event.type === 'module_done' && event.modIdx === 3 && check('mod4_done'))     toUnlock.push('mod4_done')
  if (event.type === 'all_done'    && check('all_modules'))   toUnlock.push('all_modules')
  if (event.type === 'streak'      && event.streak >= 3  && check('streak_3'))  toUnlock.push('streak_3')
  if (event.type === 'streak'      && event.streak >= 7  && check('streak_7'))  toUnlock.push('streak_7')
  if (event.type === 'streak'      && event.streak >= 30 && check('streak_30')) toUnlock.push('streak_30')
  if (event.type === 'perfect_quiz' && check('perfect_quiz')) toUnlock.push('perfect_quiz')
  if (event.type === 'first_try'    && check('first_try'))    toUnlock.push('first_try')
  if (event.type === 'no_hints'     && check('no_hints'))     toUnlock.push('no_hints')
  if (event.type === 'speedrun'     && check('speedrun'))     toUnlock.push('speedrun')
  if (event.type === 'multi_attempt'&& check('multi_attempt'))toUnlock.push('multi_attempt')
  if (event.type === 'xp' && event.total >= 100  && check('xp_100'))  toUnlock.push('xp_100')
  if (event.type === 'xp' && event.total >= 500  && check('xp_500'))  toUnlock.push('xp_500')
  if (event.type === 'xp' && event.total >= 1000 && check('xp_1000')) toUnlock.push('xp_1000')

  const hour = new Date().getHours()
  if (event.type === 'run_code' && hour >= 22 && check('night_owl'))  toUnlock.push('night_owl')
  if (event.type === 'run_code' && hour < 7   && check('early_bird')) toUnlock.push('early_bird')

  return toUnlock
}
