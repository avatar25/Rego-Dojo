import { render, screen, fireEvent } from '@testing-library/react';
import { LevelSelect } from './LevelSelect';
import type { Level, LevelCategory } from '../../lib/types';
import { describe, it, expect, vi } from 'vitest';

const createLevel = (overrides: Pick<Level, 'id' | 'title' | 'difficulty' | 'campaign' | 'xp'>): Level => ({
    prompt: 'Prompt',
    starterPolicy: '',
    visibleTests: [],
    hiddenTests: [],
    hints: [],
    successExplanation: 'Done',
    ...overrides
});

const mockLevels: Level[] = [
    createLevel({
        id: '1',
        title: 'Level 1',
        difficulty: 'Beginner',
        campaign: 'first-five',
        xp: 50
    }),
    createLevel({
        id: '2',
        title: 'Level 2',
        difficulty: 'Intermediate',
        campaign: 'first-five',
        xp: 75
    }),
    createLevel({
        id: '3',
        title: 'Level 3',
        difficulty: 'Advanced',
        campaign: 'kubernetes-basics',
        xp: 100
    })
];

const mockCategories: LevelCategory[] = [
    {
        id: 'first-five',
        title: 'First five minutes',
        description: 'Start here',
        badgeTitle: 'First Decision',
        levels: [mockLevels[0], mockLevels[1]]
    },
    {
        id: 'kubernetes-basics',
        title: 'Kubernetes basics',
        description: 'Admission basics',
        badgeTitle: 'Kubernetes Basics',
        levels: [mockLevels[2]]
    }
];

describe('LevelSelect', () => {
    it('renders all levels grouped by categories', () => {
        render(
            <LevelSelect
                levels={mockLevels}
                categories={mockCategories}
                currentLevelId="1"
                completedLevelIds={[]}
                bestStreak={0}
                onSelectLevel={() => { }}
            />
        );
        expect(screen.getByText('First five minutes')).toBeInTheDocument();
        expect(screen.getByText('Kubernetes basics')).toBeInTheDocument();
        expect(screen.getByText('Concept map')).toBeInTheDocument();
        expect(screen.getByText('Level 1')).toBeInTheDocument();
        expect(screen.getByText('Level 2')).toBeInTheDocument();
        expect(screen.getByText('Level 3')).toBeInTheDocument();
    });

    it('calls onSelectLevel when an unlocked level is clicked', () => {
        const handleSelect = vi.fn();
        render(
            <LevelSelect
                levels={mockLevels}
                categories={mockCategories}
                currentLevelId="1"
                completedLevelIds={[]}
                bestStreak={0}
                onSelectLevel={handleSelect}
            />
        );

        fireEvent.click(screen.getByText('Level 1'));
        expect(handleSelect).toHaveBeenCalledWith('1', true);
    });

    it('keeps locked levels readable while reporting challenge lock state', () => {
        const handleSelect = vi.fn();
        render(
            <LevelSelect
                levels={mockLevels}
                categories={mockCategories}
                currentLevelId="1"
                completedLevelIds={[]} // Level 1 not completed, so Level 2 should be locked
                bestStreak={0}
                onSelectLevel={handleSelect}
            />
        );

        const level2Button = screen.getByText('Level 2').closest('button');
        expect(level2Button).not.toBeDisabled();
        expect(screen.getAllByText('read lesson').length).toBeGreaterThan(0);

        if (level2Button) {
            fireEvent.click(level2Button);
        }
        expect(handleSelect).toHaveBeenCalledWith('2', false);
    });

    it('enables level if previous level is completed', () => {
        const handleSelect = vi.fn();
        render(
            <LevelSelect
                levels={mockLevels}
                categories={mockCategories}
                currentLevelId="1"
                completedLevelIds={['1']} // Level 1 completed
                bestStreak={1}
                onSelectLevel={handleSelect}
            />
        );

        const level2Button = screen.getByText('Level 2').closest('button');
        expect(level2Button).not.toBeDisabled();

        if (level2Button) {
            fireEvent.click(level2Button);
        }
        expect(handleSelect).toHaveBeenCalledWith('2', true);
    });

    it('keeps lock progression across categories', () => {
        const handleSelect = vi.fn();
        render(
            <LevelSelect
                levels={mockLevels}
                categories={mockCategories}
                currentLevelId="1"
                completedLevelIds={['1']} // Level 2 not complete, so Level 3 is still locked
                bestStreak={1}
                onSelectLevel={handleSelect}
            />
        );

        const level3Button = screen.getByText('Level 3').closest('button');
        expect(level3Button).not.toBeDisabled();

        if (level3Button) {
            fireEvent.click(level3Button);
        }
        expect(handleSelect).toHaveBeenCalledWith('3', false);
    });
});
