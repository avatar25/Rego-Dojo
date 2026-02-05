import type { Level } from '../lib/types';

export const level7: Level = {
    id: '07_suspensions',
    title: 'Level 7: The Suspension List',
    description: 'Only active team members are allowed. Allow the user if they are in the team list AND not in the suspended list.',
    difficulty: 'Advanced',

    initialCode: `package play

default allow = false

# Allow active team members only
allow {
    input.user.name == input.team.members[_]
    # This should prevent suspended users, but it currently does the opposite
    input.suspended[_] == input.user.name
}`,

    inputData: {
        "user": { "name": "alice" },
        "team": { "members": ["alice", "bob"] },
        "suspended": ["mallory"]
    },

    hints: [
        "Use `not` to ensure a condition is NOT true.",
        "The suspended list should NOT include the current user.",
        "Try: `not input.suspended[_] == input.user.name`."
    ],

    tests: [
        {
            name: "Allow Active Member",
            input: {
                "user": { "name": "alice" },
                "team": { "members": ["alice", "bob"] },
                "suspended": ["mallory"]
            },
            expectedResult: true
        },
        {
            name: "Deny Suspended Member",
            input: {
                "user": { "name": "bob" },
                "team": { "members": ["alice", "bob"] },
                "suspended": ["bob"]
            },
            expectedResult: false
        },
        {
            name: "Deny Non-Member",
            input: {
                "user": { "name": "eve" },
                "team": { "members": ["alice", "bob"] },
                "suspended": []
            },
            expectedResult: false
        }
    ]
};
