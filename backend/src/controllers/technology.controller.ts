import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';
import { sendSuccess } from '../utils/response';
import { buildPaginationMeta } from '../utils/pagination';
import { param } from '../utils/params';
import { technologyService } from '../container';

export class TechnologyController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await technologyService.findAll(req.query as never);
    sendSuccess(res, result.items, { meta: buildPaginationMeta(result) });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const tech = await technologyService.findById(param(req.params.id));
    sendSuccess(res, tech);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const tech = await technologyService.create(req.body);
    sendSuccess(res, tech, { message: 'Tecnologia criada', status: 201 });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const tech = await technologyService.update(param(req.params.id), req.body);
    sendSuccess(res, tech, { message: 'Tecnologia atualizada' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await technologyService.delete(param(req.params.id));
    sendSuccess(res, null, { message: 'Tecnologia excluída' });
  });
}

export const technologyController = new TechnologyController();
