import type { Level } from '../lib/types';

export const level8: Level = {
    id: '08_permission_map',
    title: 'Level 8: The Permission Map',
    description: 'Permissions are stored in a role-to-path map. Look up the user\'s role in the permissions object and allow access if the requested path is in that list.',
    difficulty: 'Advanced',

    initialCode: `package play

default allow = false

# Allow if the path exists in the permissions for the user's role
allow {
    # This is hard-coded to admin and should be dynamic
    input.permissions.admin[_] == input.request.path
}`,

    inputData: {
        "user": { "role": "editor" },
        "request": { "path": "/edit" },
        "permissions": {
            "admin": ["/admin", "/edit", "/read"],
            "editor": ["/edit", "/read"],
            "viewer": ["/read"]
        }
    },

    hints: [
        "Objects can be indexed with a dynamic key: `input.permissions[input.user.role]`.",
        "Check if the requested path is in that list.",
        "Your condition should look like: `input.permissions[input.user.role][_] == input.request.path`."
    ],

    tests: [
        {
            name: "Allow Editor Path",
            input: {
                "user": { "role": "editor" },
                "request": { "path": "/edit" },
                "permissions": {
                    "admin": ["/admin", "/edit", "/read"],
                    "editor": ["/edit", "/read"],
                    "viewer": ["/read"]
                }
            },
            expectedResult: true
        },
        {
            name: "Deny Editor Admin Path",
            input: {
                "user": { "role": "editor" },
                "request": { "path": "/admin" },
                "permissions": {
                    "admin": ["/admin", "/edit", "/read"],
                    "editor": ["/edit", "/read"],
                    "viewer": ["/read"]
                }
            },
            expectedResult: false
        },
        {
            name: "Allow Admin Path",
            input: {
                "user": { "role": "admin" },
                "request": { "path": "/admin" },
                "permissions": {
                    "admin": ["/admin", "/edit", "/read"],
                    "editor": ["/edit", "/read"],
                    "viewer": ["/read"]
                }
            },
            expectedResult: true
        }
    ]
};
