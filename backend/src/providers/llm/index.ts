import { env } from '../../config/env';
import { LLMProvider } from '../../interfaces/llm/llm-provider.interface';
import { logger } from '../../utils/logger';
import { OpenAICompatibleProvider } from './openai.provider';
import { MockLLMProvider } from './mock.provider';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

export function createLLMProvider(): LLMProvider {
  if (env.LLM_PROVIDER === 'groq' && env.GROQ_API_KEY) {
    logger.info(`LLM provider: Groq (${env.GROQ_MODEL})`);
    return new OpenAICompatibleProvider({
      apiKey: env.GROQ_API_KEY,
      baseURL: GROQ_BASE_URL,
      model: env.GROQ_MODEL,
    });
  }

  if (env.LLM_PROVIDER === 'openai' && env.OPENAI_API_KEY) {
    logger.info(`LLM provider: OpenAI (${env.OPENAI_MODEL})`);
    return new OpenAICompatibleProvider({
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
    });
  }

  logger.info('LLM provider: Mock (no API key configured)');
  return new MockLLMProvider();
}
