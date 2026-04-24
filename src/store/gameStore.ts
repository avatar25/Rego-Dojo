import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { levels } from '../levels';

interface GameState {
    currentLevelId: string;
    completedLevels: string[];
    streak: number;
    bestStreak: number;

    // Actions
    completeLevel: (levelId: string) => void;
    setCurrentLevel: (levelId: string) => void;
    resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            currentLevelId: levels[0].id,
            completedLevels: [],
            streak: 0,
            bestStreak: 0,

            completeLevel: (levelId) =>
                set((state) => {
                    if (state.completedLevels.includes(levelId)) {
                        return state;
                    }
                    const streak = state.streak + 1;
                    return {
                        completedLevels: [...state.completedLevels, levelId],
                        streak,
                        bestStreak: Math.max(state.bestStreak, streak)
                    };
                }),

            setCurrentLevel: (levelId) => set({ currentLevelId: levelId }),

            resetProgress: () => set({
                currentLevelId: levels[0].id,
                completedLevels: [],
                streak: 0,
                bestStreak: 0
            }),
        }),
        {
            name: 'rego-dojo-storage',
        }
    )
);
