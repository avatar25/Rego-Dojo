import { level1 } from './01_basics';
import { level2 } from './02_rbac';
import { level3 } from './03_k8s_labels';
import type { Level } from '../lib/types';

export const levels: Level[] = [
    level1,
    level2,
    level3
];
