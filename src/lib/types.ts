// src/lib/types.ts

export type Level = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  
  // The starting state for the user
  initialCode: string; // The "broken" policy
  inputData: object;   // The JSON input visible to the user
  
  // The challenge logic
  hints: string[];
  
  // How we verify success (Hidden from user UI)
  tests: {
    name: string;
    input: object; // Different inputs to test edge cases
    expectedResult: boolean; // Should this input be Allowed or Denied?
  }[];
};
