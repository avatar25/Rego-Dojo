import type { LearningTrack } from './types';

export const learningTracks: LearningTrack[] = [
  {
    id: 'kubernetes-admission',
    title: 'Kubernetes admission',
    description: 'Pod guardrails, labels, images, volumes, and baseline controls.',
    status: 'active',
    levelIds: [
      '04_privileged_containers',
      '05_required_labels',
      '06_block_latest',
      '07_resource_limits',
      '08_restrict_hostpath',
      '09_approved_registries',
      '10_pod_baseline'
    ]
  },
  {
    id: 'api-authorization',
    title: 'API authorization',
    description: 'Roles, groups, request methods, paths, and least-privilege decisions.',
    status: 'active',
    levelIds: ['02_deny_allow', '03_json_input']
  },
  {
    id: 'terraform-ci',
    title: 'Terraform and CI',
    description: 'Plan checks, deploy approvals, environment gates, and policy-as-code review.',
    status: 'planned',
    levelIds: []
  },
  {
    id: 'supply-chain',
    title: 'Supply chain policy',
    description: 'Trusted registries, pinned artifacts, provenance, and release constraints.',
    status: 'planned',
    levelIds: ['06_block_latest', '09_approved_registries']
  },
  {
    id: 'opa-operations',
    title: 'OPA operations',
    description: 'Testing, bundles, data documents, decision logs, and rollout patterns.',
    status: 'planned',
    levelIds: []
  }
];

export const getTracksForLevel = (levelId: string) =>
  learningTracks.filter((track) => track.levelIds.includes(levelId));
