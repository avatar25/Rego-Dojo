import { level1 } from './01_hello_policy';
import { level2 } from './02_deny_allow';
import { level3 } from './03_json_input';
import { level4 } from './04_privileged_containers';
import { level5 } from './05_required_labels';
import { level6 } from './06_block_latest';
import { level7 } from './07_resource_limits';
import { level8 } from './08_restrict_hostpath';
import { level9 } from './09_approved_registries';
import { level10 } from './10_pod_baseline';
import type { Level, LevelCategory } from '../lib/types';

export const levels: Level[] = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8,
    level9,
    level10
];

export const levelCategories: LevelCategory[] = [
    {
        id: 'first-five',
        title: 'First five minutes',
        description: 'A short path from hello world to reading nested input.',
        badgeTitle: 'First Decision',
        levels: [level1, level2, level3]
    },
    {
        id: 'kubernetes-basics',
        title: 'Kubernetes basics',
        description: 'Practical admission rules that feel like real cluster guardrails.',
        badgeTitle: 'Kubernetes Basics',
        levels: [level4, level5]
    },
    {
        id: 'cluster-baseline',
        title: 'Cluster baseline',
        description: 'Security scenarios that harden common Pod risks.',
        badgeTitle: 'Cluster Guard',
        levels: [level6, level7, level8, level9, level10]
    }
];
