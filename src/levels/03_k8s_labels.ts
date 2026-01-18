import type { Level } from '../lib/types';

export const level3: Level = {
    id: '03_k8s_labels',
    title: 'Level 3: Kubernetes Guard',
    description: 'Kubernetes admission control is a prime use case for OPA. Enforce that every Pod has a "team" label to ensure proper cost allocation.',
    difficulty: 'Intermediate',

    initialCode: `package play

default allow = false

# Allow if the input object has metadata.labels.team
allow {
    # Check if the "team" label exists
    # Hint: You can check existence directly or comparing values
    input.request.object.metadata.labels.env == "prod"
}`,

    inputData: {
        "request": {
            "kind": "Pod",
            "object": {
                "metadata": {
                    "labels": {
                        "app": "frontend",
                        "team": "payments"
                    }
                }
            }
        }
    },

    hints: [
        "Navigate deeply nested structures: `input.request.object.metadata.labels`.",
        "To just check for existence, you can just reference the key.",
        "Ensure you are checking for the 'team' label, not 'env'."
    ],

    tests: [
        {
            name: "Allow Pod with Team Label",
            input: {
                "request": {
                    "object": {
                        "metadata": {
                            "labels": { "team": "billing", "app": "api" }
                        }
                    }
                }
            },
            expectedResult: true
        },
        {
            name: "Deny Pod without Labels",
            input: {
                "request": {
                    "object": {
                        "metadata": {}
                    }
                }
            },
            expectedResult: false
        },
        {
            name: "Deny Pod missing Team Label",
            input: {
                "request": {
                    "object": {
                        "metadata": {
                            "labels": { "app": "db" }
                        }
                    }
                }
            },
            expectedResult: false
        }
    ]
};
