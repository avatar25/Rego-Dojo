import type { Level } from '../lib/types';

export const level6: Level = {
    id: '06_block_latest',
    title: 'Pinned Images',
    prompt: 'Block containers that use the latest tag or omit a tag entirely. Release images should be pinned.',
    difficulty: 'Intermediate',
    campaign: 'cluster-baseline',
    xp: 150,
    starterPolicy: `package play

default allow = false

bad_image {
    image := input.request.object.spec.containers[_].image
    endswith(image, ":latest")
}

allow {
    not bad_image
}`,
    visibleTests: [
        {
            name: 'Pinned version is allowed',
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
            hint: 'Versioned tags such as :1.4.2 should pass.'
        },
        {
            name: 'Latest tag is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                { "name": "worker", "image": "ghcr.io/acme/worker:latest" }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'endswith(image, ":latest") should mark the image as bad.'
        }
    ],
    hiddenTests: [
        {
            name: 'Untagged image is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                { "name": "cache", "image": "redis" }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Also treat images without any colon as bad: not contains(image, ":").'
        },
        {
            name: 'One latest sidecar denies the Pod',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                { "name": "api", "image": "ghcr.io/acme/api:1.4.2" },
                                { "name": "metrics", "image": "ghcr.io/acme/metrics:latest" }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'bad_image should scan every container with [_].'
        }
    ],
    hints: [
        'A policy can have multiple bad_image rules. If any one matches, bad_image is true.',
        'Keep the latest check and add a second rule for untagged images.',
        'For this exercise, not contains(image, ":") is enough to catch untagged images.'
    ],
    successExplanation: 'You caught mutable and unpinned image references before they reach the cluster.'
};
