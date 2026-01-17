import { Level } from '../lib/types';

export const level1: Level = {
    id: '01_basics',
    title: 'Level 1: The Bouncer',
    description: 'Welcome to the Rego Dojo! Your first task is simple: creating a policy that allows access based on a specific user name. Rego policies are written in a declarative language. The default evaluation starts at "allow".',
    difficulty: 'Beginner',

    initialCode: `package play

# Rule: allow is true if...?
default allow = false

allow {
    input.user == "unknown"
}`,

    inputData: {
        "user": "alice"
    },

    hints: [
        "In Rego, `allow` is a rule that assigns a value (true) if the body matches.",
        "Access the input data using `input.field`.",
        "Change the user check to match 'alice'."
    ],

    tests: [
        {
            name: "Allow Alice",
            input: { "user": "alice" },
            expectedResult: true
        },
        {
            name: "Deny Bob",
            input: { "user": "bob" },
            expectedResult: false
        }
    ]
};
