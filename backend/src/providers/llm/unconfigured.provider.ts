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

const MESSAGE =
  'A IA não está configurada neste servidor. Defina GROQ_API_KEY no ambiente da API.';

export class UnconfiguredLLMProvider implements LLMProvider {
  async chat(_messages: ChatMessage[]): Promise<string> {
    throw new AppError(MESSAGE, 503);
  }

  async assessment(_input: AssessmentInput): Promise<AssessmentResult> {
    throw new AppError(MESSAGE, 503);
  }

  async roadmapRecommendation(_input: RoadmapInput): Promise<RoadmapRecommendation> {
    throw new AppError(MESSAGE, 503);
  }

  async jobAnalysis(_input: JobAnalysisInput): Promise<JobAnalysisResult> {
    throw new AppError(MESSAGE, 503);
  }
}
