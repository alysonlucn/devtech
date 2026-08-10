import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';
import { sendSuccess } from '../utils/response';
import { buildPaginationMeta } from '../utils/pagination';
import { param } from '../utils/params';
import { learningPathService } from '../container';

export class LearningPathController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await learningPathService.findAll(req.query as never);
    sendSuccess(res, result.items, { meta: buildPaginationMeta(result) });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const path = await learningPathService.findById(param(req.params.id));
    sendSuccess(res, path);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const path = await learningPathService.create(req.body);
    sendSuccess(res, path, { message: 'Trilha de aprendizagem criada', status: 201 });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const path = await learningPathService.update(param(req.params.id), req.body);
    sendSuccess(res, path, { message: 'Trilha de aprendizagem atualizada' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await learningPathService.delete(param(req.params.id));
    sendSuccess(res, null, { message: 'Trilha de aprendizagem excluída' });
  });

  addTechnology = asyncHandler(async (req: Request, res: Response) => {
    const entry = await learningPathService.addTechnology(
      param(req.params.id),
      req.body.technologyId,
      req.body.order,
    );
    sendSuccess(res, entry, { message: 'Tecnologia adicionada à trilha', status: 201 });
  });

  removeTechnology = asyncHandler(async (req: Request, res: Response) => {
    await learningPathService.removeTechnology(param(req.params.id), param(req.params.technologyId));
    sendSuccess(res, null, { message: 'Tecnologia removida da trilha' });
  });

  getTechnologies = asyncHandler(async (req: Request, res: Response) => {
    const technologies = await learningPathService.getTechnologies(param(req.params.id));
    sendSuccess(res, technologies);
  });
}

export const learningPathController = new LearningPathController();
