import { level1 } from './01_basics';
import { level2 } from './02_rbac';
import { level3 } from './03_k8s_labels';
import { level4 } from './04_arrays';
import { level5 } from './05_functions';
import { level6 } from './06_approvals';
import { level7 } from './07_suspensions';
import { level8 } from './08_permission_map';
import type { Level } from '../lib/types';

export const levels: Level[] = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8
];
