import {
  AssessmentInput,
  AssessmentResult,
  ChatMessage,
  JobAnalysisInput,
  JobAnalysisResult,
  LLMProvider,
  RoadmapInput,
  RoadmapRecommendation,
} from '../../interfaces/llm/llm-provider.interface';

export class MockLLMProvider implements LLMProvider {
  async chat(messages: ChatMessage[]): Promise<string> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    return `Resposta simulada para: ${lastUser?.content ?? 'vazio'}`;
  }

  async assessment(input: AssessmentInput): Promise<AssessmentResult> {
    const half = Math.ceil(input.competencies.length / 2);
    return {
      score: 78,
      feedback: `Bom trabalho em ${input.technologyName}. Continue praticando os pontos abaixo.`,
      masteredCompetencies: input.competencies.slice(0, half),
      weakCompetencies: input.competencies.slice(half),
    };
  }

  async roadmapRecommendation(input: RoadmapInput): Promise<RoadmapRecommendation> {
    const pending = input.allTechnologies.filter((t) => t.status === 'NOT_STARTED');
    return {
      nextStep: pending[0]?.name ?? 'Revisar tecnologias concluídas',
      technologiesToReview: input.inProgressTechnologies.slice(0, 2),
      recommendedProject: `Construa um projeto aplicando ${pending[0]?.name ?? 'sua habilidade mais recente'}`,
      reasoning: `Com base no seu progresso em ${input.learningPathTitle}.`,
    };
  }

  async jobAnalysis(input: JobAnalysisInput): Promise<JobAnalysisResult> {
    const keywords = ['node', 'react', 'typescript', 'docker', 'postgres', 'git', 'express'];
    const jobLower = input.jobDescription.toLowerCase();
    const matched = keywords.filter(
      (k) => jobLower.includes(k) && input.userTechnologies.some((t) => t.toLowerCase().includes(k)),
    );
    const missing = keywords.filter(
      (k) => jobLower.includes(k) && !matched.some((m) => m.includes(k)),
    );
    return {
      matchedTechnologies: matched,
      missingTechnologies: missing,
      suggestedPlan: `Foque em aprender: ${missing.join(', ') || 'nenhuma identificada'}. Continue fortalecendo: ${matched.join(', ') || 'habilidades gerais'}.`,
      matchPercentage: Math.round((matched.length / Math.max(keywords.filter((k) => jobLower.includes(k)).length, 1)) * 100),
    };
  }
}
