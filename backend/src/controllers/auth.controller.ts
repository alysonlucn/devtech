import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';
import { sendSuccess } from '../utils/response';
import { authService } from '../container';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, { message: 'Usuário cadastrado com sucesso', status: 201 });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result, { message: 'Login realizado com sucesso' });
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, tokens, { message: 'Token atualizado' });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const profile = await authService.getProfile(req.user!.sub);
    sendSuccess(res, profile);
  });
}

export const authController = new AuthController();
