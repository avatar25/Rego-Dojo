import type { Level } from '../lib/types';

export const level1: Level = {
    id: '01_hello_policy',
    title: 'Hello Policy',
    prompt: 'Make your first policy return allow. There is no trick yet: prove you can create a true decision at the play/allow entrypoint.',
    difficulty: 'Beginner',
    campaign: 'first-five',
    xp: 50,
    starterPolicy: `package play

default allow = false

# Make this policy say yes.
# Add an allow rule below.`,
    visibleTests: [
        {
            name: 'First decision is allowed',
            input: { "message": "hello" },
            expectedResult: true,
            hint: 'Create an allow rule whose body is true, such as allow { true }.'
        }
    ],
    hiddenTests: [
        {
            name: 'Still allows with different input',
            input: { "message": "dojo", "attempt": 2 },
            expectedResult: true,
            hint: 'This level is about the rule shape, not the contents of input yet.'
        }
    ],
    hints: [
        'Every level evaluates the boolean rule at play/allow.',
        'The default sets allow to false until another allow rule proves it true.',
        'Try: allow { true }'
    ],
    successExplanation: 'You created a complete OPA decision: default deny, then an allow rule that proves the request is accepted.'
};
