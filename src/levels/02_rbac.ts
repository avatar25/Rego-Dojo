import type { Level } from '../lib/types';

export const level2: Level = {
    id: '02_rbac',
    title: 'Level 2: The Gatekeeper',
    description: 'Security is about roles. In this scenario, we have a user object with a list of roles. Your policy should only allow access if the user has the "admin" role.',
    difficulty: 'Beginner',

    initialCode: `package play

default allow = false

# Check if the user has the "admin" role
allow {
    # input.user.roles is a list (array)
    # Hint: use iteration
    input.user.roles[_] == "guest"
}`,

    inputData: {
        "user": {
            "name": "bob",
            "roles": ["editor", "admin"]
        }
    },

    hints: [
        "In Rego, `_` matches any key/index.",
        "Using `input.user.roles[_] == \"admin\"` iterates through the list and checks if ANY item matches.",
        "Make sure to replace \"guest\" with \"admin\"."
    ],

    tests: [
        {
            name: "Allow Admin User",
            input: { "user": { "roles": ["viewer", "admin"] } },
            expectedResult: true
        },
        {
            name: "Deny Guest",
            input: { "user": { "roles": ["guest"] } },
            expectedResult: false
        },
        {
            name: "Deny Empty Roles",
            input: { "user": { "roles": [] } },
            expectedResult: false
        }
    ]
};
