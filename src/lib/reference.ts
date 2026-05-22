export type ReferenceExample = {
  title: string;
  code: string;
  note: string;
};

export type ReferenceTopic = {
  id: string;
  title: string;
  summary: string;
  whenToUse: string;
  examples: ReferenceExample[];
};

export const referenceTopics: ReferenceTopic[] = [
  {
    id: 'rule-shape',
    title: 'Rule Shape',
    summary: 'A rule becomes true when every expression in its body can be proven true.',
    whenToUse: 'Use this whenever you are turning a request into a yes-or-no decision.',
    examples: [
      {
        title: 'Default closed, then prove allow',
        code: `package play

default allow = false

allow {
  input.user.role == "admin"
}`,
        note: 'The default handles every request that does not match the allow rule.'
      }
    ]
  },
  {
    id: 'input',
    title: 'Reading Input',
    summary: 'input is the JSON document being evaluated right now.',
    whenToUse: 'Use dot paths for objects and [_] when any list item may match.',
    examples: [
      {
        title: 'Nested fields and list membership',
        code: `allow {
  input.request.method == "POST"
  input.request.path == "/deploy"
  input.actor.groups[_] == "deployers"
}`,
        note: 'All three lines must be true for allow to become true.'
      }
    ]
  },
  {
    id: 'not',
    title: 'Negation',
    summary: 'not means Rego could not prove the expression on the right.',
    whenToUse: 'Use it to allow only when an unsafe helper has no matches.',
    examples: [
      {
        title: 'Allow when no violation exists',
        code: `privileged_container {
  input.request.object.spec.containers[_].securityContext.privileged == true
}

allow {
  not privileged_container
}`,
        note: 'This is clearer than trying to prove every container is safe directly.'
      }
    ]
  },
  {
    id: 'helpers',
    title: 'Helper Rules',
    summary: 'Small named rules make policies easier to read, test, and extend.',
    whenToUse: 'Use helpers for unsafe conditions, approved sources, reusable checks, and policy vocabulary.',
    examples: [
      {
        title: 'Several ways to prove one violation',
        code: `violation {
  endswith(input.image, ":latest")
}

violation {
  not contains(input.image, ":")
}`,
        note: 'Multiple rules with the same name act like OR.'
      }
    ]
  },
  {
    id: 'built-ins',
    title: 'Built-ins',
    summary: 'Built-ins are the standard tools for strings, arrays, objects, numbers, and sets.',
    whenToUse: 'Use them when policy logic depends on prefixes, tags, counts, or membership.',
    examples: [
      {
        title: 'Approved image prefix',
        code: `approved_image(image) {
  startswith(image, "ghcr.io/acme/")
}

approved_image(image) {
  startswith(image, "registry.company.io/")
}`,
        note: 'A helper with an argument keeps the final policy readable.'
      }
    ]
  },
  {
    id: 'testing',
    title: 'Testing Policies',
    summary: 'Good policy tests cover the safe case and the edge cases that should fail.',
    whenToUse: 'Use visible tests to teach the main path and hidden tests to protect against broad rules.',
    examples: [
      {
        title: 'Think in examples',
        code: `# Should allow
{"user": {"role": "admin"}}

# Should deny
{"user": {"role": "viewer"}}

# Should deny
{"user": {}}`,
        note: 'A mature policy is only as good as the cases you try against it.'
      }
    ]
  }
];
