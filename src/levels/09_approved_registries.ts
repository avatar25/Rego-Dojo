import type { Level } from '../lib/types';

export const level9: Level = {
    id: '09_approved_registries',
    title: 'Approved Registries',
    prompt: 'Only allow images from ghcr.io/acme/ or registry.company.io/. Every container image must use an approved registry prefix.',
    difficulty: 'Advanced',
    campaign: 'cluster-baseline',
    xp: 175,
    starterPolicy: `package play

default allow = false

allow {
    startswith(input.request.object.spec.containers[_].image, "ghcr.io/")
}`,
    visibleTests: [
        {
            name: 'Company registry is allowed',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                { "name": "api", "image": "registry.company.io/payments/api:1.4.2" }
                            ]
                        }
                    }
                }
            },
            expectedResult: true,
            hint: 'registry.company.io/ is an approved prefix too.'
        },
        {
            name: 'Docker Hub image is denied',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                { "name": "shell", "image": "busybox:1.36" }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Images without an approved prefix should be marked unapproved.'
        }
    ],
    hiddenTests: [
        {
            name: 'One unapproved sidecar denies the Pod',
            input: {
                "request": {
                    "object": {
                        "spec": {
                            "containers": [
                                { "name": "api", "image": "ghcr.io/acme/api:1.4.2" },
                                { "name": "sidecar", "image": "docker.io/library/nginx:1.25" }
                            ]
                        }
                    }
                }
            },
            expectedResult: false,
            hint: 'Do not use an existential allow. Define unapproved_image and require not unapproved_image.'
        }
    ],
    hints: [
        'Create approved_registry(image) helper rules for each accepted prefix.',
        'Create unapproved_image when a container image does not match that helper.',
        'The final allow should be true only when not unapproved_image.'
    ],
    successExplanation: 'You moved from checking one image to proving every image comes from a trusted source.'
};
