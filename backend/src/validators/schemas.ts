import { z } from 'zod';
import { TechnologyDifficulty, TechnologyCategory, ResourceType, ProgressStatus, ProjectStatus } from '../enums';

const ptErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === 'email') return { message: 'E-mail inválido' };
    if (issue.validation === 'url') return { message: 'URL inválida' };
    if (issue.validation === 'uuid') return { message: 'ID inválido' };
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return { message: `Deve ter no mínimo ${issue.minimum} caracteres` };
    }
    if (issue.type === 'array') {
      return { message: `Deve ter no mínimo ${issue.minimum} item(ns)` };
    }
    if (issue.type === 'number') {
      return { message: `Deve ser no mínimo ${issue.minimum}` };
    }
  }
  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'string') {
      return { message: `Deve ter no máximo ${issue.maximum} caracteres` };
    }
    if (issue.type === 'number') {
      return { message: `Deve ser no máximo ${issue.maximum}` };
    }
  }
  if (issue.code === z.ZodIssueCode.invalid_enum_value) {
    return { message: 'Valor inválido' };
  }
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: 'Valor inválido' };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(ptErrorMap);

export { paginationSchema } from '../utils/pagination';

export const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const technologyIdParamSchema = z.object({
  technologyId: z.string().uuid(),
});

export const dependencyParamSchema = z.object({
  technologyId: z.string().uuid(),
  prerequisiteId: z.string().uuid(),
});

export const learningPathSchema = z.object({
  title: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).optional(),
  description: z.string().min(10),
});

export const technologySchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).optional(),
  description: z.string().min(10),
  whyLearn: z.string().min(10),
  whenLearn: z.string().min(10),
  estimatedTime: z.number().int().positive(),
  difficulty: z.nativeEnum(TechnologyDifficulty),
  order: z.number().int().min(0).default(0),
  category: z.nativeEnum(TechnologyCategory),
});

export const technologyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
  category: z.nativeEnum(TechnologyCategory).optional(),
});

export const resourceSchema = z.object({
  title: z.string().min(2).max(255),
  type: z.nativeEnum(ResourceType),
  url: z.string().url().max(2048),
});

export const projectSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().min(10),
  difficulty: z.nativeEnum(TechnologyDifficulty),
});

export const competencySchema = z.object({
  title: z.string().min(2).max(255),
});

export const dependencySchema = z.object({
  prerequisiteTechnologyId: z.string().uuid(),
});

export const learningPathTechnologySchema = z.object({
  technologyId: z.string().uuid(),
  order: z.number().int().min(0).default(0),
});

export const startProgressSchema = z.object({
  technologyId: z.string().uuid(),
});

export const updateProgressSchema = z.object({
  status: z.nativeEnum(ProgressStatus).optional(),
});

export const updateUserProjectSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
});

export const startProjectSchema = z.object({
  projectId: z.string().uuid(),
});

export const assessmentSchema = z.object({
  answers: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  ).min(1),
});

export const jobAnalysisSchema = z.object({
  jobDescription: z.string().min(50),
});

export const setLearningPathSchema = z.object({
  learningPathId: z.string().uuid(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
