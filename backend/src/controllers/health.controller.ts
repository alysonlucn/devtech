import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';
import { sendSuccess } from '../utils/response';
import { getActiveLLMProviderName } from '../providers/llm';

export class HealthController {
  check = asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      llm: { provider: getActiveLLMProviderName() },
    });
  });
}

export const healthController = new HealthController();
