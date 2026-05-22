import type { Decision, Level, LevelTest } from './types';
import { formatDecision } from './progress';

type TraceStep = NonNullable<NonNullable<import('./types').EvaluationLog['details']>['trace']>[number];
type Diagnosis = NonNullable<NonNullable<import('./types').EvaluationLog['details']>['diagnosis']>;

const pass = (label: string, detail: string): TraceStep => ({ label, detail, status: 'pass' });
const fail = (label: string, detail: string): TraceStep => ({ label, detail, status: 'fail' });
const info = (label: string, detail: string): TraceStep => ({ label, detail, status: 'info' });

const baseTrace = (test: LevelTest, actual: Decision): TraceStep[] => [
  info('Input loaded', `${test.name} is evaluated as the active request.`),
  info('Default decision', 'allow starts as deny until a rule proves otherwise.'),
  actual
    ? pass('Policy result', 'The policy returned allow for this input.')
    : fail('Policy result', 'The policy returned deny for this input.')
];

const tracesByLevel: Record<string, (test: LevelTest, actual: Decision) => TraceStep[]> = {
  '01_hello_policy': (test, actual) => [
    ...baseTrace(test, actual),
    info('Rule shape', 'This level only checks whether play/allow can become true.')
  ],
  '02_deny_allow': (test, actual) => [
    ...baseTrace(test, actual),
    info('Role check', 'The important fact is input.user.role.'),
    test.expectedResult
      ? pass('Trusted case', 'This input should match the admin-only allow rule.')
      : info('Default deny', 'This input should fail to prove admin access.')
  ],
  '03_json_input': (test, actual) => [
    ...baseTrace(test, actual),
    info('Request method', 'Check input.request.method against POST.'),
    info('Request path', 'Check input.request.path against /deploy.'),
    info('Group membership', 'Use input.actor.groups[_] to find deployers.')
  ],
  '04_privileged_containers': (test, actual) => [
    ...baseTrace(test, actual),
    info('Unsafe helper', 'privileged_container should match only privileged == true.'),
    info('Negation gate', 'allow should be true only when not privileged_container is true.')
  ],
  '05_required_labels': (test, actual) => [
    ...baseTrace(test, actual),
    info('Required labels', 'app, owner, and env must all exist and be non-empty.')
  ],
  '06_block_latest': (test, actual) => [
    ...baseTrace(test, actual),
    info('Image binding', 'Bind each container image before checking its tag.'),
    info('Mutable tags', 'Treat :latest and missing tags as bad images.')
  ],
  '07_resource_limits': (test, actual) => [
    ...baseTrace(test, actual),
    info('Every container', 'Scan containers with [_], not only containers[0].'),
    info('Missing helper', 'missing_limit should match absent CPU or memory limits.')
  ],
  '08_restrict_hostpath': (test, actual) => [
    ...baseTrace(test, actual),
    info('Volume scan', 'Look for hostPath under every volume entry.'),
    info('Safe absence', 'Pods without volumes should not produce a hostPath violation.')
  ],
  '09_approved_registries': (test, actual) => [
    ...baseTrace(test, actual),
    info('Approved helper', 'approved_registry(image) should cover both allowed prefixes.'),
    info('Universal check', 'Find any unapproved image, then allow only when none exist.')
  ],
  '10_pod_baseline': (test, actual) => [
    ...baseTrace(test, actual),
    info('Composed violations', 'Each violation rule describes one unsafe baseline condition.'),
    info('Final gate', 'allow stays compact: allow only when not violation.')
  ]
};

const diagnosisByLevel: Record<string, Pick<Diagnosis, 'inputPath' | 'nextStep'>> = {
  '01_hello_policy': {
    inputPath: 'play/allow',
    nextStep: 'Create an allow rule whose body is true.'
  },
  '02_deny_allow': {
    inputPath: 'input.user.role',
    nextStep: 'Compare the role to "admin" and let every other role fall through.'
  },
  '03_json_input': {
    inputPath: 'input.request and input.actor.groups',
    nextStep: 'Check method, path, and deployers membership in the same allow body.'
  },
  '04_privileged_containers': {
    inputPath: 'input.request.object.spec.containers[_].securityContext.privileged',
    nextStep: 'Detect privileged == true in a helper, then allow only when it is absent.'
  },
  '05_required_labels': {
    inputPath: 'input.request.object.metadata.labels',
    nextStep: 'Require app, owner, and env to all be non-empty strings.'
  },
  '06_block_latest': {
    inputPath: 'input.request.object.spec.containers[_].image',
    nextStep: 'Catch both images ending in :latest and images with no tag.'
  },
  '07_resource_limits': {
    inputPath: 'input.request.object.spec.containers[_].resources.limits',
    nextStep: 'Scan every container and mark missing CPU or memory as missing_limit.'
  },
  '08_restrict_hostpath': {
    inputPath: 'input.request.object.spec.volumes[_].hostPath',
    nextStep: 'Treat hostPath field existence as the unsafe condition.'
  },
  '09_approved_registries': {
    inputPath: 'input.request.object.spec.containers[_].image',
    nextStep: 'Define approved prefixes, then deny if any image does not match them.'
  },
  '10_pod_baseline': {
    inputPath: 'input.request.object.spec.containers[_]',
    nextStep: 'Add separate violation rules for each baseline risk.'
  }
};

export const buildEvaluationTrace = (level: Level, test: LevelTest, actual: Decision) => {
  const traceBuilder = tracesByLevel[level.id] ?? baseTrace;
  return traceBuilder(test, actual);
};

export const buildFailureDiagnosis = (level: Level, test: LevelTest, actual: Decision): Diagnosis => {
  const levelDiagnosis = diagnosisByLevel[level.id] ?? {
    inputPath: 'input',
    nextStep: test.hint
  };

  const summary = actual === true && test.expectedResult === false
    ? `The policy allowed this input too broadly. Expected ${formatDecision(test.expectedResult)}, but got ${formatDecision(actual)}.`
    : `The policy did not prove the safe case. Expected ${formatDecision(test.expectedResult)}, but got ${formatDecision(actual)}.`;

  return {
    summary,
    ...levelDiagnosis
  };
};
