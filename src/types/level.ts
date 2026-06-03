export type LessonSection = {
  heading: string;
  content: string;
};

export type Level = {
  id: string;
  pathId: string;
  orderIndex: number;
  title: string;
  concept: string;
  summary: string;
  missionText: string;
  lessonSections: LessonSection[];
  exampleCode: string;
  instructions: string[];
  starterCode: string;
  expectedOutput: string;
  hint: string;
  xpReward: number;
};
