import type { Level } from '../lib/types';

export const level5: Level = {
    id: '05_functions',
    title: 'Level 5: Modular Functions',
    description: 'As logic gets complex, it helps to break it down into functions. Define a function `is_admin` that checks if the user is an admin, and use it in your allow rule.',
    difficulty: 'Advanced',

    initialCode: `package play

default allow = false

# Define a function 'is_admin' that returns true if user is admin
is_admin {
    # Check if user.role is "admin"
    input.user.role == "admin"
}

# Allow if is_admin is true
allow {
    is_admin
}`,

    inputData: {
        "user": {
            "name": "charlie",
            "role": "admin"
        }
    },

    hints: [
        "Functions in Rego look like rules: `func_name { ... }`.",
        "You can just reference the function name in the body of another rule to call it (if it evaluates to true/defined)."
    ],

    tests: [
        {
            name: "Allow Admin Role",
            input: {
                "user": { "name": "alice", "role": "admin" }
            },
            expectedResult: true
        },
        {
            name: "Deny Guest Role",
            input: {
                "user": { "name": "bob", "role": "guest" }
            },
            expectedResult: false
        }
    ]
};
