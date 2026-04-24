import type { Level } from '../lib/types';

export const level5: Level = {
    id: '05_required_labels',
    title: 'Required Labels',
    prompt: 'Require every Pod to carry app, owner, and env labels. Empty label values should not count.',
    difficulty: 'Intermediate',
    campaign: 'kubernetes-basics',
    xp: 125,
    starterPolicy: `package play

default allow = false

allow {
    input.request.object.metadata.labels.app != ""
}`,
    visibleTests: [
        {
            name: 'Well labeled Pod is allowed',
            input: {
                "request": {
                    "object": {
                        "metadata": {
                            "labels": {
                                "app": "checkout",
                                "owner": "payments",
                                "env": "prod"
                            }
                        }
                    }
                }
            },
            expectedResult: true,
            hint: 'The Pod has all three labels with non-empty values.'
        },
        {
            name: 'Missing owner is denied',
            input: {
                "request": {
                    "object": {
                        "metadata": {
                            "labels": {
                                "app": "checkout",
                                "env": "prod"
                            }
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Add a condition for labels.owner.'
        }
    ],
    hiddenTests: [
        {
            name: 'Empty env label is denied',
            input: {
                "request": {
                    "object": {
                        "metadata": {
                            "labels": {
                                "app": "checkout",
                                "owner": "payments",
                                "env": ""
                            }
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Checking key existence is not enough here. The value must not be an empty string.'
        }
    ],
    hints: [
        'All expressions in an allow body must be true.',
        'Use input.request.object.metadata.labels to inspect Pod labels.',
        'Add non-empty checks for app, owner, and env.'
    ],
    successExplanation: 'You turned Kubernetes metadata into an enforceable contract, which keeps ownership and environment data from drifting.'
};
