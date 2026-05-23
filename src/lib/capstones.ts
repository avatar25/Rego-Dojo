import type { CapstoneProject } from './types';

export const capstoneProjects: CapstoneProject[] = [
  {
    id: 'pod-security-baseline',
    title: 'Write a Pod Security baseline',
    trackId: 'kubernetes-admission',
    summary: 'Compose privileged, image, resource, and hostPath checks into one admission policy.',
    scenario: 'Your platform team wants a compact baseline for application namespaces before teams can self-serve Kubernetes deploys.',
    outcome: 'A readable admission policy that blocks common Pod risks while keeping ordinary workloads deployable.',
    difficulty: 'Advanced',
    prerequisiteLevelIds: [
      '04_privileged_containers',
      '06_block_latest',
      '07_resource_limits',
      '08_restrict_hostpath',
      '10_pod_baseline'
    ],
    deliverables: [
      'One violation helper with separate rules for each unsafe condition.',
      'An allow rule that only passes when no violation exists.',
      'A small comment above each violation explaining the operational risk.'
    ],
    acceptanceChecks: [
      'Deny any privileged container.',
      'Deny latest or untagged images.',
      'Deny containers missing CPU or memory limits.',
      'Deny hostPath volumes.',
      'Allow a Pod that satisfies every baseline condition.'
    ],
    starterPolicy: `package play

default allow = false

violation {
  # privileged container
}

violation {
  # mutable or untagged image
}

violation {
  # missing resource limit
}

violation {
  # hostPath volume
}

allow {
  not violation
}`
  },
  {
    id: 'approved-image-registry',
    title: 'Create an image registry policy',
    trackId: 'supply-chain',
    summary: 'Require every workload image to come from approved registries with pinned tags.',
    scenario: 'Security wants deploys restricted to trusted registries so image provenance and vulnerability scanning stay enforceable.',
    outcome: 'A supply-chain policy that treats one unapproved or mutable image as a reason to reject the whole workload.',
    difficulty: 'Independent',
    prerequisiteLevelIds: ['06_block_latest', '09_approved_registries'],
    deliverables: [
      'approved_registry(image) helper rules for each trusted source.',
      'unapproved_image and mutable_image helpers that scan every container.',
      'A final allow rule that requires both helpers to be absent.'
    ],
    acceptanceChecks: [
      'Allow images from ghcr.io/acme/ and registry.company.io/.',
      'Deny Docker Hub or unqualified images.',
      'Deny :latest.',
      'Deny images without a tag.',
      'Deny a Pod when only one sidecar violates the rule.'
    ],
    starterPolicy: `package play

default allow = false

approved_registry(image) {
  startswith(image, "ghcr.io/acme/")
}

approved_registry(image) {
  startswith(image, "registry.company.io/")
}

unapproved_image {
  image := input.request.object.spec.containers[_].image
  not approved_registry(image)
}

mutable_image {
  # latest or missing tag
}

allow {
  not unapproved_image
  not mutable_image
}`
  },
  {
    id: 'rbac-admin-action',
    title: 'Build an RBAC action policy',
    trackId: 'api-authorization',
    summary: 'Authorize sensitive API actions with roles, groups, request paths, and methods.',
    scenario: 'An internal control plane needs a policy for destructive actions such as deleting deployments or rotating credentials.',
    outcome: 'A default-deny authorization policy that grants narrow access to admins and deploy automation.',
    difficulty: 'Guided',
    prerequisiteLevelIds: ['02_deny_allow', '03_json_input'],
    deliverables: [
      'A default-deny allow decision.',
      'One rule for human admins.',
      'One rule for deploy automation scoped to POST /deploy.',
      'Explicit checks for method, path, group membership, and environment.'
    ],
    acceptanceChecks: [
      'Allow admin users to delete deployments.',
      'Allow deploy automation only for POST /deploy.',
      'Deny viewers.',
      'Deny the deploy bot on the wrong path or method.',
      'Deny missing role or missing group data.'
    ],
    starterPolicy: `package play

default allow = false

allow {
  # human admin path
}

allow {
  # deploy automation path
}`
  }
];

export const getCapstoneReadiness = (project: CapstoneProject, completedLevelIds: string[]) => {
  const completedPrerequisites = project.prerequisiteLevelIds.filter((levelId) => completedLevelIds.includes(levelId));

  return {
    completedPrerequisites,
    remainingPrerequisites: project.prerequisiteLevelIds.filter((levelId) => !completedLevelIds.includes(levelId)),
    percent: Math.round((completedPrerequisites.length / project.prerequisiteLevelIds.length) * 100),
    ready: completedPrerequisites.length === project.prerequisiteLevelIds.length
  };
};
