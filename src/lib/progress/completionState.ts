export type CompletionStateInput = {
  currentLevelId: string;
  levelId: string;
  nextLevelId: string | null;
  xpAward: number;
  xpGranted: boolean;
  xpTotal: number;
};

export type CompletionState = {
  currentLevelId: string;
  xpTotal: number;
};

export function buildCompletionState(input: CompletionStateInput): CompletionState {
  const currentLevelId =
    input.xpGranted && input.nextLevelId && input.currentLevelId === input.levelId
      ? input.nextLevelId
      : input.currentLevelId;

  return {
    currentLevelId,
    xpTotal: input.xpTotal + (input.xpGranted ? input.xpAward : 0),
  };
}
