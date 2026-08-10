export const XP_REWARDS = {
  START_TECHNOLOGY: 10,
  VALIDATE_TECHNOLOGY: 50,
  FINISH_PROJECT: 100,
} as const;

export function calculateAssessmentXp(score: number): number {
  return score * 2;
}

export function calculateValidationXp(score: number): number {
  return XP_REWARDS.VALIDATE_TECHNOLOGY + calculateAssessmentXp(score);
}
