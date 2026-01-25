import type { Level } from '../lib/types';

export const level4: Level = {
    id: '04_arrays',
    title: 'Level 4: Group Check',
    description: 'Sometimes you need to check if a value exists in a list (array). Allow the request only if the user is in the "admin" group.',
    difficulty: 'Intermediate',

    initialCode: `package play

default allow = false

# Allow if the user's groups list contains "admin"
allow {
    # In Rego, you can iterate/check existence with: some i; input.user.groups[i] == "..."
    # Or more simply: input.user.groups[_] == "..."
    
    # Check if "admin" is in the list input.user.groups
    false # Replace this with your rule
}`,

    inputData: {
        "user": {
            "name": "alice",
            "groups": [
                "engineering",
                "admin",
                "employee"
            ]
        }
    },

    hints: [
        "Use the `_` wildcard to iterate: `input.user.groups[_]`.",
        "The condition should look like `input.user.groups[_] == \"admin\"`."
    ],

    tests: [
        {
            name: "Allow Admin User",
            input: {
                "user": {
                    "name": "alice",
                    "groups": ["dev", "admin"]
                }
            },
            expectedResult: true
        },
        {
            name: "Deny Non-Admin User",
            input: {
                "user": {
                    "name": "bob",
                    "groups": ["dev", "marketing"]
                }
            },
            expectedResult: false
        },
        {
            name: "Deny User with No Groups",
            input: {
                "user": {
                    "name": "eve",
                    "groups": []
                }
            },
            expectedResult: false
        }
    ]
};
