import type { Level } from '../lib/types';

export const level6: Level = {
    id: '06_approvals',
    title: 'Level 6: The Review Board',
    description: 'Some changes need multiple approvals. Allow the request only if there are at least TWO approvals in the list.',
    difficulty: 'Intermediate',

    initialCode: `package play

default allow = false

# Allow if there are at least 2 approvals
allow {
    # count() returns the number of items in an array
    count(input.approvals) > 2
}`,

    inputData: {
        "approvals": ["alice", "bob"]
    },

    hints: [
        "Use the count() builtin to count approvals.",
        "You need to allow when there are TWO or more approvals.",
        "Change the comparison to >= 2."
    ],

    tests: [
        {
            name: "Allow Two Approvals",
            input: { "approvals": ["alice", "bob"] },
            expectedResult: true
        },
        {
            name: "Deny One Approval",
            input: { "approvals": ["alice"] },
            expectedResult: false
        },
        {
            name: "Allow Three Approvals",
            input: { "approvals": ["alice", "bob", "charlie"] },
            expectedResult: true
        }
    ]
};
