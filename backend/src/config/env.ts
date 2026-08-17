import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('devpath'),
  DB_PASSWORD: z.string().default('devpath_secret'),
  DB_DATABASE: z.string().default('devpath'),
  DB_SSL: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ASSESSMENT_PASS_SCORE: z.coerce.number().min(0).max(100).default(70),
  LLM_PROVIDER: z.enum(['groq', 'openai', 'mock']).default('mock'),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  SEED_DATABASE: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    throw new Error(`Variáveis de ambiente inválidas: ${JSON.stringify(formatted)}`);
  }
  return result.data;
}

export const env = loadEnv();
