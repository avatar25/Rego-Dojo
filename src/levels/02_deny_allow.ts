import type { Level } from '../lib/types';

export const level2: Level = {
    id: '02_deny_allow',
    title: 'Deny by Default',
    prompt: 'Only admins should be allowed to delete a deployment. Everyone else should fall through to the default deny.',
    difficulty: 'Beginner',
    campaign: 'first-five',
    xp: 75,
    starterPolicy: `package play

default allow = false

allow {
    input.user.role == "viewer"
}`,
    visibleTests: [
        {
            name: 'Admin can delete',
            input: {
                "user": { "name": "mira", "role": "admin" },
                "action": "delete-deployment"
            },
            expectedResult: true,
            hint: 'The role in the passing request is admin, not viewer.'
        },
        {
            name: 'Viewer is denied',
            input: {
                "user": { "name": "cam", "role": "viewer" },
                "action": "delete-deployment"
            },
            expectedResult: false,
            hint: 'Do not add a broad allow rule. Let the default deny handle viewers.'
        }
    ],
    hiddenTests: [
        {
            name: 'Missing role is denied',
            input: {
                "user": { "name": "unknown" },
                "action": "delete-deployment"
            },
            expectedResult: false,
            hint: 'A missing field should not accidentally satisfy your allow rule.'
        }
    ],
    hints: [
        'Default deny means you only need to describe the safe case.',
        'Use input.user.role to read the role from JSON.',
        'The allow rule should compare the role to "admin".'
    ],
    successExplanation: 'That is the core security pattern: deny by default, then write the smallest allow rule for the trusted case.'
};
