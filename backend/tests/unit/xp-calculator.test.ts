import { describe, it, expect } from 'vitest';
import { calculateAssessmentXp, calculateValidationXp, XP_REWARDS } from '../../src/utils/xp-calculator';

describe('XP Calculator', () => {
  it('calculates assessment XP as score * 2', () => {
    expect(calculateAssessmentXp(80)).toBe(160);
  });

  it('calculates validation XP with base reward', () => {
    expect(calculateValidationXp(80)).toBe(XP_REWARDS.VALIDATE_TECHNOLOGY + 160);
  });
});
