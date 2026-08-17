import { env } from '../../config/env';
import { LLMProvider } from '../../interfaces/llm/llm-provider.interface';
import { logger } from '../../utils/logger';
import { OpenAICompatibleProvider } from './openai.provider';
import { MockLLMProvider } from './mock.provider';
import { UnconfiguredLLMProvider } from './unconfigured.provider';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

export const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b';

export type LLMProviderName = 'groq' | 'openai' | 'mock' | 'unconfigured';

let activeProviderName: LLMProviderName = 'unconfigured';

export function getActiveLLMProviderName(): LLMProviderName {
  return activeProviderName;
}

/** Groq retirou estes IDs; pedidos a eles passam a usar o substituto oficial. */
const DEPRECATED_GROQ_MODELS: Record<string, string> = {
  'llama-3.3-70b-versatile': DEFAULT_GROQ_MODEL,
  'llama-3.1-8b-instant': 'openai/gpt-oss-20b',
  'llama-3.1-70b-versatile': DEFAULT_GROQ_MODEL,
  'llama3-70b-8192': DEFAULT_GROQ_MODEL,
  'llama3-8b-8192': 'openai/gpt-oss-20b',
  'mixtral-8x7b-32768': DEFAULT_GROQ_MODEL,
  'gemma2-9b-it': 'openai/gpt-oss-20b',
  'qwen/qwen3-32b': DEFAULT_GROQ_MODEL,
  'meta-llama/llama-4-scout-17b-16e-instruct': DEFAULT_GROQ_MODEL,
};

export function resolveGroqModel(model: string): string {
  return DEPRECATED_GROQ_MODELS[model] ?? model;
}

export function createLLMProvider(): LLMProvider {
  if (env.LLM_PROVIDER === 'groq' && env.GROQ_API_KEY) {
    const model = resolveGroqModel(env.GROQ_MODEL);
    if (model !== env.GROQ_MODEL) {
      logger.warn(`Modelo Groq "${env.GROQ_MODEL}" foi descontinuado. Usando ${model}.`);
    }
    logger.info(`LLM provider: Groq (${model})`);
    activeProviderName = 'groq';
    return new OpenAICompatibleProvider({
      apiKey: env.GROQ_API_KEY,
      baseURL: GROQ_BASE_URL,
      model,
    });
  }

  if (env.LLM_PROVIDER === 'openai' && env.OPENAI_API_KEY) {
    logger.info(`LLM provider: OpenAI (${env.OPENAI_MODEL})`);
    activeProviderName = 'openai';
    return new OpenAICompatibleProvider({
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
    });
  }

  if (env.LLM_PROVIDER !== 'mock' && env.NODE_ENV === 'production') {
    logger.error(
      `LLM_PROVIDER=${env.LLM_PROVIDER}, mas a chave da API não está definida. Defina GROQ_API_KEY no ambiente.`,
    );
    activeProviderName = 'unconfigured';
    return new UnconfiguredLLMProvider();
  }

  logger.info('LLM provider: Mock (no API key configured)');
  activeProviderName = 'mock';
  return new MockLLMProvider();
}
