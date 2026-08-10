import { describe, it, expect } from 'vitest';
import { MockLLMProvider } from '../../src/providers/llm/mock.provider';

describe('MockLLMProvider', () => {
  const provider = new MockLLMProvider();

  it('returns assessment result', async () => {
    const result = await provider.assessment({
      technologyName: 'Git',
      competencies: ['Branches', 'Commits', 'PRs'],
      userAnswers: [{ question: 'What is git?', answer: 'VCS' }],
    });

    expect(result.score).toBeGreaterThan(0);
    expect(result.feedback).toBeTruthy();
    expect(result.masteredCompetencies.length).toBeGreaterThan(0);
  });

  it('returns roadmap recommendation', async () => {
    const result = await provider.roadmapRecommendation({
      learningPathTitle: 'Backend',
      completedTechnologies: ['Git'],
      inProgressTechnologies: ['Node.js'],
      allTechnologies: [
        { name: 'Git', status: 'VALIDATED' },
        { name: 'Node.js', status: 'IN_PROGRESS' },
        { name: 'Express', status: 'NOT_STARTED' },
      ],
    });

    expect(result.nextStep).toBeTruthy();
  });

  it('returns job analysis', async () => {
    const result = await provider.jobAnalysis({
      jobDescription: 'We need a developer with node, react, and docker experience.',
      userTechnologies: ['Git', 'Node.js'],
      learningPathTitle: 'Backend',
    });

    expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    expect(result.suggestedPlan).toBeTruthy();
  });
});
