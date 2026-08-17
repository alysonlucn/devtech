import OpenAI from 'openai';
import { logger } from '../../utils/logger';
import { AppError } from '../../errors/app.errors';
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
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });
      const content = response.choices[0]?.message?.content ?? '';
      if (!content.trim()) {
        throw new AppError('A IA não retornou uma resposta. Tente novamente.', 502);
      }
      return content;
    } catch (error) {
      if (error instanceof AppError) throw error;
      const status = (error as { status?: number }).status;
      const message = error instanceof Error ? error.message : String(error);
      logger.error('Falha na chamada ao LLM', { status, message, model: this.model });

      if (status === 401 || status === 403) {
        throw new AppError('A chave da IA é inválida ou está sem permissão.', 502);
      }
      if (status === 404 || /does not exist or you do not have access/i.test(message)) {
        throw new AppError('O modelo de IA configurado não está mais disponível.', 502);
      }
      if (status === 429) {
        throw new AppError('A IA está temporariamente sobrecarregada. Tente novamente em instantes.', 429);
      }
      throw new AppError('Não foi possível gerar a resposta da IA. Tente novamente.', 502);
    }
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
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const source = fenced?.[1] ?? content;
    const jsonMatch = source.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error('Falha ao analisar resposta JSON do LLM', { content });
      throw new AppError('A IA retornou um formato inválido. Tente novamente.', 502);
    }
    try {
      return JSON.parse(jsonMatch[0]) as T;
    } catch {
      logger.error('JSON do LLM inválido', { content });
      throw new AppError('A IA retornou um formato inválido. Tente novamente.', 502);
    }
  }
}

/** @deprecated Use OpenAICompatibleProvider */
export class OpenAIProvider extends OpenAICompatibleProvider {}
