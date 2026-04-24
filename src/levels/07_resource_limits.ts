import type { Level } from '../lib/types';

export const level7: Level = {
    id: '07_resource_limits',
    title: 'Resource Limits',
    prompt: 'Require every container to set CPU and memory limits. A single missing limit should deny the whole Pod.',
    difficulty: 'Advanced',
    campaign: 'cluster-baseline',
    xp: 175,
    starterPolicy: `package play

default allow = false

allow {
    input.request.object.spec.containers[0].resources.limits.cpu
    input.request.object.spec.containers[0].resources.limits.memory
}`,
    visibleTests: [
        {
            name: 'Container with limits is allowed',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                {
                                    "name": "api",
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
            hint: 'CPU and memory limits are present.'
        },
        {
            name: 'Missing memory limit is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                {
                                    "name": "api",
                                    "resources": {
                                        "limits": { "cpu": "500m" }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Create a missing_limit helper and allow only when it is absent.'
        }
    ],
    hiddenTests: [
        {
            name: 'Second container missing CPU is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                {
                                    "name": "api",
                                    "resources": {
                                        "limits": { "cpu": "500m", "memory": "256Mi" }
                                    }
                                },
                                {
                                    "name": "sidecar",
                                    "resources": {
                                        "limits": { "memory": "128Mi" }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Do not check only containers[0]. Use [_] to inspect each container.'
        }
    ],
    hints: [
        'It is often easier to define missing_limit than to prove every container directly.',
        'Bind each container with c := input.request.object.spec.containers[_].',
        'Write one missing_limit rule for missing CPU and another for missing memory.'
    ],
    successExplanation: 'You used the deny-condition pattern again: find any container missing a required limit, then allow only if none exist.'
};
