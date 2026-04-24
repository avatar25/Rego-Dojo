import { levelCategories, levels } from '../levels';
import type { Level } from './types';

export type Badge = {
    id: string;
    title: string;
    description: string;
    earned: boolean;
};

export type SharedCompletion = {
    badge: string;
    completed: number;
    xp: number;
};

export const formatDecision = (decision: boolean) => decision ? 'allow' : 'deny';

export const getTotalXp = (completedLevelIds: string[], levelList: Level[] = levels) =>
    levelList.reduce((total, level) => total + (completedLevelIds.includes(level.id) ? level.xp : 0), 0);

export const isCampaignComplete = (campaignId: Level['campaign'], completedLevelIds: string[]) => {
    const category = levelCategories.find((candidate) => candidate.id === campaignId);
    return Boolean(category && category.levels.every((level) => completedLevelIds.includes(level.id)));
};

export const isLevelUnlocked = (levelId: string, completedLevelIds: string[], levelList: Level[] = levels) => {
    const orderIndex = levelList.findIndex((level) => level.id === levelId);
    if (orderIndex <= 0) {
        return true;
    }

    return completedLevelIds.includes(levelList[orderIndex - 1].id);
};

export const getEarnedBadges = (completedLevelIds: string[], bestStreak: number): Badge[] => [
    {
        id: 'first-decision',
        title: 'First Decision',
        description: 'Cleared the hello policy.',
        earned: completedLevelIds.length > 0
    },
    {
        id: 'kubernetes-basics',
        title: 'Kubernetes Basics',
        description: 'Finished the first admission control path.',
        earned: isCampaignComplete('kubernetes-basics', completedLevelIds)
    },
    {
        id: 'streak-three',
        title: 'Clean Streak',
        description: 'Cleared three new levels in one run.',
        earned: bestStreak >= 3
    },
    {
        id: 'cluster-guard',
        title: 'Cluster Guard',
        description: 'Completed the full Pod security baseline.',
        earned: isCampaignComplete('cluster-baseline', completedLevelIds)
    }
];

export const getNextLevelId = (currentLevelId: string) => {
    const currentIndex = levels.findIndex((level) => level.id === currentLevelId);
    return currentIndex >= 0 && currentIndex < levels.length - 1
        ? levels[currentIndex + 1].id
        : null;
};

export const buildShareUrl = (completedLevelIds: string[], bestStreak: number) => {
    const earnedBadges = getEarnedBadges(completedLevelIds, bestStreak).filter((badge) => badge.earned);
    const featuredBadge = earnedBadges.find((badge) => badge.id === 'kubernetes-basics') ?? earnedBadges.at(-1);
    const params = new URLSearchParams({
        demo: 'rego-dojo',
        badge: featuredBadge?.title ?? 'Rego Dojo',
        completed: String(completedLevelIds.length),
        xp: String(getTotalXp(completedLevelIds))
    });

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

export const readSharedCompletion = (): SharedCompletion | null => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') !== 'rego-dojo') {
        return null;
    }

    return {
        badge: params.get('badge') ?? 'Rego Dojo',
        completed: Number(params.get('completed') ?? 0),
        xp: Number(params.get('xp') ?? 0)
    };
};
