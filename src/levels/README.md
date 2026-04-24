# Level authoring

Levels are plain TypeScript objects. Keep each challenge small, practical, and testable.

```ts
import type { Level } from '../lib/types';

export const level: Level = {
  id: 'example_id',
  title: 'Example title',
  prompt: 'The mission the learner is solving.',
  difficulty: 'Beginner',
  campaign: 'kubernetes-basics',
  xp: 125,
  starterPolicy: `package play

default allow = false`,
  visibleTests: [
    {
      name: 'Allowed case',
      input: { request: { action: 'deploy' } },
      expectedResult: true,
      hint: 'Point the learner at the field they missed.'
    }
  ],
  hiddenTests: [
    {
      name: 'Edge case',
      input: { request: { action: 'delete' } },
      expectedResult: false,
      hint: 'Explain the smallest next move.'
    }
  ],
  hints: [
    'General hint shown from the footer button.'
  ],
  successExplanation: 'A short explanation of what the learner just mastered.'
};
```

`visibleTests` are shown before evaluation. `hiddenTests` are not shown up front, but any hidden failure reveals the exact input, expected decision, actual decision, and hint.
