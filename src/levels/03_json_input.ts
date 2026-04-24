import type { Level } from '../lib/types';

export const level3: Level = {
    id: '03_json_input',
    title: 'Read the Input',
    prompt: 'Allow production deploys only when the request is a POST to /deploy and the actor belongs to the deployers group.',
    difficulty: 'Beginner',
    campaign: 'first-five',
    xp: 100,
    starterPolicy: `package play

default allow = false

allow {
    input.user.name == "release-bot"
}`,
    visibleTests: [
        {
            name: 'Deploy bot can deploy',
            input: {
                "request": { "method": "POST", "path": "/deploy" },
                "actor": {
                    "name": "release-bot",
                    "groups": ["robots", "deployers"]
                },
                "environment": "prod"
            },
            expectedResult: true,
            hint: 'The actor is under input.actor, and groups is a list.'
        },
        {
            name: 'GET request is denied',
            input: {
                "request": { "method": "GET", "path": "/deploy" },
                "actor": {
                    "name": "release-bot",
                    "groups": ["deployers"]
                },
                "environment": "prod"
            },
            expectedResult: false,
            hint: 'Check the request method as well as the group.'
        }
    ],
    hiddenTests: [
        {
            name: 'Non deployer is denied',
            input: {
                "request": { "method": "POST", "path": "/deploy" },
                "actor": {
                    "name": "lee",
                    "groups": ["engineering"]
                },
                "environment": "prod"
            },
            expectedResult: false,
            hint: 'Use input.actor.groups[_] == "deployers" so at least one group must match.'
        },
        {
            name: 'Wrong path is denied',
            input: {
                "request": { "method": "POST", "path": "/restart" },
                "actor": {
                    "name": "release-bot",
                    "groups": ["deployers"]
                },
                "environment": "prod"
            },
            expectedResult: false,
            hint: 'The path must be exactly /deploy.'
        }
    ],
    hints: [
        'Nested JSON fields are reached with dots, for example input.request.method.',
        'Use [_] to ask whether any item in a list matches.',
        'You need three conditions inside allow: method, path, and deployers membership.'
    ],
    successExplanation: 'You inspected nested JSON and combined three facts into one decision. That is most day-to-day Rego work.'
};
