import type { Level } from '../lib/types';

export const level8: Level = {
    id: '08_restrict_hostpath',
    title: 'No hostPath',
    prompt: 'Block Pods that mount hostPath volumes. EmptyDir, configMap, and secret volumes are allowed.',
    difficulty: 'Intermediate',
    campaign: 'cluster-baseline',
    xp: 150,
    starterPolicy: `package play

default allow = false

allow {
    not input.request.object.spec.hostNetwork
}`,
    visibleTests: [
        {
            name: 'EmptyDir volume is allowed',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "volumes": [
                                { "name": "scratch", "emptyDir": {} }
                            ]
                        }
                    }
                }
            },
            expectedResult: true,
            hint: 'The policy should allow safe volume types.'
        },
        {
            name: 'hostPath volume is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "volumes": [
                                { "name": "docker", "hostPath": { "path": "/var/run/docker.sock" } }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Look under input.request.object.spec.volumes[_].hostPath.'
        }
    ],
    hiddenTests: [
        {
            name: 'Pod with no volumes is allowed',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                { "name": "api", "image": "ghcr.io/acme/api:1.4.2" }
                            ]
                        }
                    }
                }
            },
            expectedResult: true,
            hint: 'Absence of volumes should not be treated as a hostPath violation.'
        }
    ],
    hints: [
        'Define a uses_host_path helper for the unsafe volume type.',
        'A field reference can be enough to test existence: input.request.object.spec.volumes[_].hostPath.',
        'Allow when not uses_host_path.'
    ],
    successExplanation: 'You blocked one of the highest-risk Pod escape paths without blocking ordinary volumes.'
};
