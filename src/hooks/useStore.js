import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      state: {
        student: null,
        totalXP: 0,
        streak: 0,
        moduleProgress: {},
        unlockedBadges: [],
        shopItems: [],
        sessionHistory: [],
        lastActive: null,
      },
      setState: (fn) => set((state) => ({ state: fn(state.state) })),
      addXP: (amount) => set((state) => ({
        state: {
          ...state.state,
          totalXP: state.state.totalXP + amount,
        }
      })),
      unlockBadge: (id) => set((state) => ({
        state: {
          ...state.state,
          unlockedBadges: [...new Set([...state.state.unlockedBadges, id])],
        }
      })),
      updateModuleProgress: (idx, prog) => set((state) => ({
        state: {
          ...state.state,
          moduleProgress: {
            ...state.state.moduleProgress,
            [idx]: { ...(state.state.moduleProgress[idx] || {}), ...prog },
          }
        }
      })),
      purchaseItem: (id, cost) => set((state) => ({
        state: {
          ...state.state,
          totalXP: state.state.totalXP - cost,
          shopItems: [...state.state.shopItems, id],
        }
      })),
      resetProgress: () => set((state) => ({
        state: {
          ...state.state,
          totalXP: 0,
          moduleProgress: {},
          unlockedBadges: [],
        }
      })),
    }),
    { name: 'codequest-storage' }
  )
)