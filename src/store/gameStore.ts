import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { levels } from '../levels';

interface GameState {
    currentLevelId: string;
    completedLevels: string[];

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

            completeLevel: (levelId) =>
                set((state) => {
                    if (state.completedLevels.includes(levelId)) {
                        return state;
                    }
                    return { completedLevels: [...state.completedLevels, levelId] };
                }),

            setCurrentLevel: (levelId) => set({ currentLevelId: levelId }),

            resetProgress: () => set({
                currentLevelId: levels[0].id,
                completedLevels: []
            }),
        }),
        {
            name: 'rego-dojo-storage',
        }
    )
);
