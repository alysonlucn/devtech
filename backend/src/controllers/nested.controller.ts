import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';
import { sendSuccess } from '../utils/response';
import { buildPaginationMeta } from '../utils/pagination';
import { param } from '../utils/params';
import { resourceService, projectService, competencyService, dependencyService } from '../container';

export class ResourceController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await resourceService.findByTechnology(param(req.params.technologyId), req.query as never);
    sendSuccess(res, result.items, { meta: buildPaginationMeta(result) });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await resourceService.findById(param(req.params.id)));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const resource = await resourceService.create(param(req.params.technologyId), req.body);
    sendSuccess(res, resource, { message: 'Recurso criado', status: 201 });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await resourceService.update(param(req.params.id), req.body), {
      message: 'Recurso atualizado',
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await resourceService.delete(param(req.params.id));
    sendSuccess(res, null, { message: 'Recurso excluído' });
  });
}

export class ProjectController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await projectService.findByTechnology(param(req.params.technologyId), req.query as never);
    sendSuccess(res, result.items, { meta: buildPaginationMeta(result) });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await projectService.findById(param(req.params.id)));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(param(req.params.technologyId), req.body);
    sendSuccess(res, project, { message: 'Projeto criado', status: 201 });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await projectService.update(param(req.params.id), req.body), {
      message: 'Projeto atualizado',
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await projectService.delete(param(req.params.id));
    sendSuccess(res, null, { message: 'Projeto excluído' });
  });
}

export class CompetencyController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await competencyService.findByTechnology(param(req.params.technologyId), req.query as never);
    sendSuccess(res, result.items, { meta: buildPaginationMeta(result) });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await competencyService.findById(param(req.params.id)));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const competency = await competencyService.create(param(req.params.technologyId), req.body);
    sendSuccess(res, competency, { message: 'Competência criada', status: 201 });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await competencyService.update(param(req.params.id), req.body), {
      message: 'Competência atualizada',
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await competencyService.delete(param(req.params.id));
    sendSuccess(res, null, { message: 'Competência excluída' });
  });
}

export class DependencyController {
  list = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await dependencyService.findByTechnology(param(req.params.technologyId)));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const dep = await dependencyService.create(
      param(req.params.technologyId),
      req.body.prerequisiteTechnologyId,
    );
    sendSuccess(res, dep, { message: 'Dependência criada', status: 201 });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await dependencyService.delete(param(req.params.technologyId), param(req.params.prerequisiteId));
    sendSuccess(res, null, { message: 'Dependência excluída' });
  });
}

export const resourceController = new ResourceController();
export const projectController = new ProjectController();
export const competencyController = new CompetencyController();
export const dependencyController = new DependencyController();
