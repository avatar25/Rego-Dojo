import type { Level } from './types';

export type LearningLesson = {
  id: Level['id'];
  conceptLabel: string;
  concept: string;
  creatureWorld: string;
  regoPattern: string;
  bridge: string;
  productionUseCase: string;
  sampleInput: string;
  samplePolicy: string;
  checkpoints: string[];
};

const defaultLesson: LearningLesson = {
  id: '01_hello_policy',
  conceptLabel: 'Rule shape',
  concept: 'A policy answers one question.',
  creatureWorld: 'Imagine a gym gate that asks one yes-or-no question: can this trainer enter right now?',
  regoPattern: 'Rego starts from facts in input, then proves an allow rule when the safe case is true.',
  bridge: 'This level keeps the world tiny so the shape is clear: default deny first, then one rule that proves allow.',
  productionUseCase: 'Any Rego system starts with a single decision, such as whether an API request, deploy, or resource should be allowed.',
  sampleInput: `{
  "trainer": {
    "name": "mira",
    "badges": ["boulder"]
  },
  "gym": {
    "required_badge": "boulder"
  }
}`,
  samplePolicy: `package play

default allow = false

allow {
  input.trainer.badges[_] == input.gym.required_badge
}`,
  checkpoints: [
    'input is the current request, like the trainer at the gym door.',
    'default allow = false means the gate starts closed.',
    'allow becomes true only when one rule body can be proven.'
  ]
};

export const learningLessons: Record<Level['id'], LearningLesson> = {
  '01_hello_policy': defaultLesson,
  '02_deny_allow': {
    id: '02_deny_allow',
    conceptLabel: 'Default deny',
    concept: 'Default deny keeps unsafe cases boring.',
    creatureWorld: 'A gym leader only lets badge inspectors into the storage room. Everyone else gets no special rule.',
    regoPattern: 'Write the narrow allowed case and let the default handle everything that does not match.',
    bridge: 'Your challenge is the same pattern with deploy deletion: admins match the rule, viewers fall through.',
    productionUseCase: 'API authorization and deployment controls usually start with default deny plus a small trusted role or group.',
    sampleInput: `{
  "trainer": { "name": "mira", "role": "gym-admin" },
  "action": "open-storage"
}`,
    samplePolicy: `package play

default allow = false

allow {
  input.trainer.role == "gym-admin"
}`,
    checkpoints: [
      'You do not need a deny rule for every unsafe role.',
      'Missing or unexpected fields simply fail to prove allow.',
      'The safest policy usually describes the trusted case, not every bad case.'
    ]
  },
  '03_json_input': {
    id: '03_json_input',
    conceptLabel: 'Nested input',
    concept: 'Nested facts combine into one decision.',
    creatureWorld: 'A trainer can enter a water arena only with the right pass, the right door, and a creature on the swim team.',
    regoPattern: 'Every line in an allow body must be true, so nested fields and list membership can stack naturally.',
    bridge: 'The deploy request works the same way: method, path, and group membership all have to match.',
    productionUseCase: 'Admission and API policies often combine request method, path, actor, group, and environment facts.',
    sampleInput: `{
  "request": { "method": "POST", "path": "/arena" },
  "trainer": {
    "name": "mira",
    "groups": ["scouts", "swim-team"]
  }
}`,
    samplePolicy: `package play

default allow = false

allow {
  input.request.method == "POST"
  input.request.path == "/arena"
  input.trainer.groups[_] == "swim-team"
}`,
    checkpoints: [
      'Dots walk through nested JSON fields.',
      '[_] means some item in the list must match.',
      'All expressions inside one rule body are AND conditions.'
    ]
  },
  '04_privileged_containers': {
    id: '04_privileged_containers',
    conceptLabel: 'Unsafe helpers',
    concept: 'Name the unsafe condition first.',
    creatureWorld: 'Before a tournament starts, the referee checks whether any creature brought banned gear.',
    regoPattern: 'Create a helper for the bad thing, then allow only when that helper is not true.',
    bridge: 'Here the banned gear is privileged container access anywhere in the Pod.',
    productionUseCase: 'Kubernetes admission policies are easier to audit when unsafe Pod capabilities are named as helper rules.',
    sampleInput: `{
  "team": {
    "creatures": [
      { "name": "ember", "gear": { "banned": false } },
      { "name": "spark", "gear": { "banned": true } }
    ]
  }
}`,
    samplePolicy: `package play

default allow = false

banned_gear {
  input.team.creatures[_].gear.banned == true
}

allow {
  not banned_gear
}`,
    checkpoints: [
      'Helpers make policy intent easier to read.',
      'not helper means no matching unsafe fact was found.',
      '[_] scans every creature or every container, not just the first.'
    ]
  },
  '05_required_labels': {
    id: '05_required_labels',
    conceptLabel: 'Required fields',
    concept: 'Required metadata is a contract.',
    creatureWorld: 'Every tournament card must list a team name, trainer, and league before a match can begin.',
    regoPattern: 'Check each required field directly and reject empty values by requiring non-empty strings.',
    bridge: 'Pod labels are the Kubernetes version of the tournament card.',
    productionUseCase: 'Platform teams use label policies to preserve ownership, cost allocation, environment, and incident routing data.',
    sampleInput: `{
  "entry": {
    "labels": {
      "team": "sparks",
      "trainer": "mira",
      "league": "indigo"
    }
  }
}`,
    samplePolicy: `package play

default allow = false

allow {
  input.entry.labels.team != ""
  input.entry.labels.trainer != ""
  input.entry.labels.league != ""
}`,
    checkpoints: [
      'A present key can still hold an empty value.',
      'Each required field gets its own expression.',
      'This pattern works well for ownership and environment labels.'
    ]
  },
  '06_block_latest': {
    id: '06_block_latest',
    conceptLabel: 'String built-ins',
    concept: 'Mutable names are risky promises.',
    creatureWorld: 'A move card that says latest technique can change between matches, so the referee requires a numbered technique card.',
    regoPattern: 'Bind a value, test string patterns, and mark any risky value as bad.',
    bridge: 'Container images need fixed tags for the same reason: the cluster should know exactly what it is running.',
    productionUseCase: 'Release and supply-chain policies block mutable artifacts so deploys are reproducible.',
    sampleInput: `{
  "team": {
    "creatures": [
      { "name": "ember", "moveCard": "flame-burst:v2" },
      { "name": "spark", "moveCard": "quick-attack:latest" }
    ]
  }
}`,
    samplePolicy: `package play

default allow = false

bad_move_card {
  card := input.team.creatures[_].moveCard
  endswith(card, ":latest")
}

allow {
  not bad_move_card
}`,
    checkpoints: [
      'Use := when naming a value you want to inspect.',
      'String helpers like endswith and contains are useful for image policies.',
      'Multiple helper rules can describe several ways something is bad.'
    ]
  },
  '07_resource_limits': {
    id: '07_resource_limits',
    conceptLabel: 'Missing fields',
    concept: 'Prove no teammate is missing a requirement.',
    creatureWorld: 'Every creature needs both stamina and focus limits before joining a long match.',
    regoPattern: 'It is often easier to find any missing field than to prove every item directly.',
    bridge: 'For containers, the missing fields are CPU and memory limits.',
    productionUseCase: 'Resource guardrails prevent one workload from consuming shared cluster capacity without an explicit limit.',
    sampleInput: `{
  "team": {
    "creatures": [
      { "name": "ember", "limits": { "stamina": 10, "focus": 8 } },
      { "name": "spark", "limits": { "stamina": 7 } }
    ]
  }
}`,
    samplePolicy: `package play

default allow = false

missing_limit {
  creature := input.team.creatures[_]
  not creature.limits.stamina
}

missing_limit {
  creature := input.team.creatures[_]
  not creature.limits.focus
}

allow {
  not missing_limit
}`,
    checkpoints: [
      'One missing field should deny the whole collection.',
      'Separate helper rules act like OR.',
      'The final allow rule can stay short even when checks grow.'
    ]
  },
  '08_restrict_hostpath': {
    id: '08_restrict_hostpath',
    conceptLabel: 'Field existence',
    concept: 'Field existence can be a violation.',
    creatureWorld: 'Arena supplies are fine, but a creature carrying a tunnel pass into the backstage area is not.',
    regoPattern: 'Some policies only need to detect that a risky field exists anywhere in a list.',
    bridge: 'hostPath is the backstage pass: ordinary volumes pass, host filesystem mounts do not.',
    productionUseCase: 'Security baselines commonly block host filesystem access because it expands the blast radius of a compromised Pod.',
    sampleInput: `{
  "arena": {
    "items": [
      { "name": "water-bucket", "safeSupply": {} },
      { "name": "tunnel-pass", "backstageAccess": { "door": "north" } }
    ]
  }
}`,
    samplePolicy: `package play

default allow = false

backstage_access {
  input.arena.items[_].backstageAccess
}

allow {
  not backstage_access
}`,
    checkpoints: [
      'A field reference can test whether that field exists.',
      'Absence of a risky field should not count as a violation.',
      'The helper name should describe the unsafe capability.'
    ]
  },
  '09_approved_registries': {
    id: '09_approved_registries',
    conceptLabel: 'Helper functions',
    concept: 'Every item must come from a trusted source.',
    creatureWorld: 'A league accepts move cards only from approved shops. One counterfeit card disqualifies the team.',
    regoPattern: 'Describe approved prefixes, then flag any item that does not match them.',
    bridge: 'Image registries are supply-chain sources, so every container image needs an approved prefix.',
    productionUseCase: 'Supply-chain policies keep workloads on trusted registries and make provenance checks possible.',
    sampleInput: `{
  "team": {
    "creatures": [
      { "name": "ember", "moveCard": "league.shop/flame:v2" },
      { "name": "spark", "moveCard": "unknown.shop/quick:v1" }
    ]
  }
}`,
    samplePolicy: `package play

default allow = false

approved_shop(card) {
  startswith(card, "league.shop/")
}

approved_shop(card) {
  startswith(card, "gym.vendor/")
}

unapproved_card {
  card := input.team.creatures[_].moveCard
  not approved_shop(card)
}

allow {
  not unapproved_card
}`,
    checkpoints: [
      'Helper rules can accept arguments.',
      'An existential allow would let one good item hide one bad item.',
      'Find the unapproved item first, then require none exist.'
    ]
  },
  '10_pod_baseline': {
    id: '10_pod_baseline',
    conceptLabel: 'Composition',
    concept: 'Small rules compose into a baseline.',
    creatureWorld: 'A tournament baseline checks banned gear, fixed move cards, and required stamina limits before any team enters.',
    regoPattern: 'Use one violation helper with multiple rules, where any matching rule blocks the request.',
    bridge: 'This final level combines the earlier Pod safety checks into one compact admission policy.',
    productionUseCase: 'Production baselines are composed from small rules so teams can review, test, and extend them safely.',
    sampleInput: `{
  "team": {
    "creatures": [
      {
        "name": "ember",
        "gear": { "banned": false },
        "moveCard": "league.shop/flame:v2",
        "limits": { "stamina": 10, "focus": 8 }
      }
    ]
  }
}`,
    samplePolicy: `package play

default allow = false

violation {
  input.team.creatures[_].gear.banned == true
}

violation {
  card := input.team.creatures[_].moveCard
  endswith(card, ":latest")
}

violation {
  creature := input.team.creatures[_]
  not creature.limits.stamina
}

allow {
  not violation
}`,
    checkpoints: [
      'Multiple rules with the same name are alternative ways to prove that name.',
      'This keeps allow readable while the baseline grows.',
      'Composition is the main advantage of small, named policy facts.'
    ]
  }
};

export const getLearningLesson = (levelId: Level['id']) => learningLessons[levelId] ?? defaultLesson;
