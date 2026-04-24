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
  };
};
