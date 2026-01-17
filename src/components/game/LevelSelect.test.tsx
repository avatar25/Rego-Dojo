import { render, screen, fireEvent } from '@testing-library/react';
import { LevelSelect } from './LevelSelect';
import { Level } from '../../lib/types';
import { describe, it, expect, vi } from 'vitest';

const mockLevels: Level[] = [
    {
        id: '1',
        title: 'Level 1',
        description: 'Desc 1',
        difficulty: 'Beginner',
        initialCode: '',
        inputData: {},
        hints: [],
        tests: []
    },
    {
        id: '2',
        title: 'Level 2',
        description: 'Desc 2',
        difficulty: 'Intermediate',
        initialCode: '',
        inputData: {},
        hints: [],
        tests: []
    }
];

describe('LevelSelect', () => {
    it('renders all levels', () => {
        render(
            <LevelSelect
                levels={mockLevels}
                currentLevelId="1"
                completedLevelIds={[]}
                onSelectLevel={() => { }}
            />
        );
        expect(screen.getByText('Level 1')).toBeInTheDocument();
        expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    it('calls onSelectLevel when an unlocked level is clicked', () => {
        const handleSelect = vi.fn();
        render(
            <LevelSelect
                levels={mockLevels}
                currentLevelId="1"
                completedLevelIds={[]}
                onSelectLevel={handleSelect}
            />
        );

        fireEvent.click(screen.getByText('Level 1'));
        expect(handleSelect).toHaveBeenCalledWith('1');
    });

    it('disables locked levels', () => {
        const handleSelect = vi.fn();
        render(
            <LevelSelect
                levels={mockLevels}
                currentLevelId="1"
                completedLevelIds={[]} // Level 1 not completed, so Level 2 should be locked
                onSelectLevel={handleSelect}
            />
        );

        const level2Button = screen.getByText('Level 2').closest('button');
        expect(level2Button).toBeDisabled();

        if (level2Button) {
            fireEvent.click(level2Button);
        }
        expect(handleSelect).not.toHaveBeenCalled();
    });

    it('enables level if previous level is completed', () => {
        const handleSelect = vi.fn();
        render(
            <LevelSelect
                levels={mockLevels}
                currentLevelId="1"
                completedLevelIds={['1']} // Level 1 completed
                onSelectLevel={handleSelect}
            />
        );

        const level2Button = screen.getByText('Level 2').closest('button');
        expect(level2Button).not.toBeDisabled();

        if (level2Button) {
            fireEvent.click(level2Button);
        }
        expect(handleSelect).toHaveBeenCalledWith('2');
    });
});
