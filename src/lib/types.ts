export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

export type Decision = boolean;

export type LevelTest = {
  name: string;
  input: JsonObject;
  expectedResult: Decision;
  hint: string;
};

export type Level = {
  id: string;
  title: string;
  prompt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  campaign: 'first-five' | 'kubernetes-basics' | 'cluster-baseline';
  xp: number;
  starterPolicy: string;
  visibleTests: LevelTest[];
  hiddenTests: LevelTest[];
  hints: string[];
  successExplanation: string;
};

export type LevelCategory = {
  id: Level['campaign'];
  title: string;
  description: string;
  badgeTitle: string;
  levels: Level[];
};

export type LearningTrack = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'planned';
  levelIds: Level['id'][];
};

export type CapstoneProject = {
  id: string;
  title: string;
  trackId: LearningTrack['id'];
  summary: string;
  scenario: string;
  outcome: string;
  difficulty: 'Guided' | 'Independent' | 'Advanced';
  prerequisiteLevelIds: Level['id'][];
  deliverables: string[];
  acceptanceChecks: string[];
  starterPolicy: string;
};

export type EvaluationLog = {
  type: 'info' | 'success' | 'error';
  message: string;
  timestamp: string;
  details?: {
    testName: string;
    suite: 'Visible' | 'Hidden';
    input: JsonObject;
    expected: Decision;
    actual: Decision;
    hint: string;
    diagnosis?: {
      summary: string;
      inputPath: string;
      nextStep: string;
    };
    trace?: {
      label: string;
      status: 'pass' | 'fail' | 'info';
      detail: string;
    }[];
  };
};
