import OpenAI from 'openai';
import { logger } from '../../utils/logger';
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

export interface OpenAICompatibleConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
}

export class OpenAICompatibleProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: OpenAICompatibleConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      ...(config.baseURL && { baseURL: config.baseURL }),
    });
    this.model = config.model;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
    });
    return response.choices[0]?.message?.content ?? '';
  }

  async assessment(input: AssessmentInput): Promise<AssessmentResult> {
    const prompt = `Você é um mentor técnico avaliando o conhecimento de um estudante sobre ${input.technologyName}.

Competências a avaliar: ${input.competencies.join(', ')}

Respostas do estudante:
${input.userAnswers.map((a) => `P: ${a.question}\nR: ${a.answer}`).join('\n\n')}

Responda APENAS com JSON válido neste formato (textos em português do Brasil):
{"score": number 0-100, "feedback": "string", "masteredCompetencies": ["string"], "weakCompetencies": ["string"]}`;

    const content = await this.chat([
      { role: 'system', content: 'Você é um avaliador de competências técnicas. Responda apenas com JSON. Use português do Brasil nos campos de texto.' },
      { role: 'user', content: prompt },
    ]);

    return this.parseJson<AssessmentResult>(content);
  }

  async roadmapRecommendation(input: RoadmapInput): Promise<RoadmapRecommendation> {
    const prompt = `Trilha de aprendizagem: ${input.learningPathTitle}
Concluídas: ${input.completedTechnologies.join(', ') || 'nenhuma'}
Em progresso: ${input.inProgressTechnologies.join(', ') || 'nenhuma'}
Todas as tecnologias: ${JSON.stringify(input.allTechnologies)}

Recomende o próximo passo de aprendizagem. Responda APENAS com JSON válido (textos em português do Brasil):
{"nextStep": "string", "technologiesToReview": ["string"], "recommendedProject": "string", "reasoning": "string"}`;

    const content = await this.chat([
      { role: 'system', content: 'Você é um mentor de carreira para desenvolvedores. Responda apenas com JSON. Use português do Brasil nos campos de texto.' },
      { role: 'user', content: prompt },
    ]);

    return this.parseJson<RoadmapRecommendation>(content);
  }

  async jobAnalysis(input: JobAnalysisInput): Promise<JobAnalysisResult> {
    const prompt = `Descrição da vaga:
${input.jobDescription}

Tecnologias validadas do usuário: ${input.userTechnologies.join(', ') || 'nenhuma'}
Trilha de aprendizagem: ${input.learningPathTitle}

Analise a compatibilidade com a vaga. Responda APENAS com JSON válido (textos em português do Brasil):
{"matchedTechnologies": ["string"], "missingTechnologies": ["string"], "suggestedPlan": "string", "matchPercentage": number}`;

    const content = await this.chat([
      { role: 'system', content: 'Você é um consultor de carreira para desenvolvedores. Responda apenas com JSON. Use português do Brasil nos campos de texto.' },
      { role: 'user', content: prompt },
    ]);

    return this.parseJson<JobAnalysisResult>(content);
  }

  private parseJson<T>(content: string): T {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error('Falha ao analisar resposta JSON do LLM', { content });
      throw new Error('Formato de resposta do LLM inválido');
    }
    return JSON.parse(jsonMatch[0]) as T;
  }
}

/** @deprecated Use OpenAICompatibleProvider */
export class OpenAIProvider extends OpenAICompatibleProvider {}
