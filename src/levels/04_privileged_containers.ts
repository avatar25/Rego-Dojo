import type { Level } from '../lib/types';

export const level4: Level = {
    id: '04_privileged_containers',
    title: 'Privileged Pods',
    prompt: 'Admission controllers should reject Pods that ask for privileged containers. Allow the Pod only when no container sets securityContext.privileged to true.',
    difficulty: 'Intermediate',
    campaign: 'kubernetes-basics',
    xp: 125,
    starterPolicy: `package play

default allow = false

privileged_container {
    input.request.object.spec.containers[_].securityContext.privileged == false
}

allow {
    not privileged_container
}`,
    visibleTests: [
        {
            name: 'Safe Pod is allowed',
            input: {
                "request": {
                    "kind": { "group": "", "version": "v1", "kind": "Pod" },
                    "object": {
                        "kind": "Pod",
                        "metadata": { "name": "api" },
                        "spec": {
                            "containers": [
                                {
                                    "name": "api",
                                    "image": "ghcr.io/acme/api:1.4.2",
                                    "securityContext": { "privileged": false }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: true,
            hint: 'privileged_container should be true only for privileged == true.'
        },
        {
            name: 'Privileged Pod is denied',
            input: {
                "request": {
                    "kind": { "group": "", "version": "v1", "kind": "Pod" },
                    "object": {
                        "kind": "Pod",
                        "metadata": { "name": "debug-shell" },
                        "spec": {
                            "containers": [
                                {
                                    "name": "debug",
                                    "image": "busybox:1.36",
                                    "securityContext": { "privileged": true }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Build a helper that detects privileged == true, then allow when that helper is not true.'
        }
    ],
    hiddenTests: [
        {
            name: 'One bad container denies the whole Pod',
            input: {
                "request": {
                    "object": {
                        "kind": "Pod",
                        "metadata": { "name": "mixed" },
                        "spec": {
                            "containers": [
                                {
                                    "name": "web",
                                    "image": "ghcr.io/acme/web:2.0.0",
                                    "securityContext": { "privileged": false }
                                },
                                {
                                    "name": "debug",
                                    "image": "busybox:1.36",
                                    "securityContext": { "privileged": true }
                                }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'The [_] iterator should scan every container, not just the first.'
        }
    ],
    hints: [
        'First define the unsafe condition: a container has privileged == true.',
        'Then make allow true only when that unsafe condition is not present.',
        'The helper can be: privileged_container { input.request.object.spec.containers[_].securityContext.privileged == true }'
    ],
    successExplanation: 'You wrote a realistic admission rule: detect the bad condition anywhere in the Pod, then allow only when it is absent.'
};
