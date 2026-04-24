import type { Level } from '../lib/types';

export const level10: Level = {
    id: '10_pod_baseline',
    title: 'Pod Baseline',
    prompt: 'Combine the baseline: deny privileged containers, latest or untagged images, and containers missing CPU or memory limits.',
    difficulty: 'Advanced',
    campaign: 'cluster-baseline',
    xp: 250,
    starterPolicy: `package play

default allow = false

violation {
    input.request.object.spec.containers[_].securityContext.privileged == true
}

allow {
    not violation
}`,
    visibleTests: [
        {
            name: 'Baseline Pod is allowed',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                {
                                    "name": "api",
                                    "image": "ghcr.io/acme/api:1.4.2",
                                    "securityContext": { "privileged": false },
                                    "resources": {
                                        "limits": { "cpu": "500m", "memory": "256Mi" }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: true,
            hint: 'The clean Pod should have no violation.'
        },
        {
            name: 'Privileged Pod is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                {
                                    "name": "debug",
                                    "image": "ghcr.io/acme/debug:1.0.0",
                                    "securityContext": { "privileged": true },
                                    "resources": {
                                        "limits": { "cpu": "250m", "memory": "128Mi" }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Keep the existing privileged violation.'
        }
    ],
    hiddenTests: [
        {
            name: 'Latest image is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                {
                                    "name": "api",
                                    "image": "ghcr.io/acme/api:latest",
                                    "securityContext": { "privileged": false },
                                    "resources": {
                                        "limits": { "cpu": "500m", "memory": "256Mi" }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Add a violation rule for images ending in :latest.'
        },
        {
            name: 'Missing CPU limit is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                {
                                    "name": "api",
                                    "image": "ghcr.io/acme/api:1.4.2",
                                    "securityContext": { "privileged": false },
                                    "resources": {
                                        "limits": { "memory": "256Mi" }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Add violation rules for missing CPU and missing memory limits.'
        }
    ],
    hints: [
        'Multiple violation rules act like OR: if any one rule matches, violation is true.',
        'Reuse the patterns from the previous Kubernetes levels.',
        'The final allow rule can stay simple: allow { not violation }.'
    ],
    successExplanation: 'You built a compact Pod Security baseline by composing small unsafe-condition rules.'
};
