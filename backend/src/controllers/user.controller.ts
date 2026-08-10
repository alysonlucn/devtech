import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';
import { sendSuccess } from '../utils/response';
import { param } from '../utils/params';
import {
  progressService,
  userProjectService,
  dashboardService,
  assessmentService,
  recommendationService,
  jobAnalysisService,
  userProfileRepository,
} from '../container';

export class ProgressController {
  list = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await progressService.getUserProgress(req.user!.sub));
  });

  start = asyncHandler(async (req: Request, res: Response) => {
    const progress = await progressService.startTechnology(req.user!.sub, req.body.technologyId);
    sendSuccess(res, progress, { message: 'Tecnologia iniciada', status: 201 });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const progress = await progressService.updateProgress(
      req.user!.sub,
      param(req.params.id),
      req.body.status,
    );
    sendSuccess(res, progress, { message: 'Progresso atualizado' });
  });

  markReady = asyncHandler(async (req: Request, res: Response) => {
    const progress = await progressService.markReadyForAssessment(req.user!.sub, param(req.params.id));
    sendSuccess(res, progress, { message: 'Pronto para avaliação' });
  });

  roadmap = asyncHandler(async (req: Request, res: Response) => {
    const profile = await userProfileRepository.findByUserId(req.user!.sub);
    if (!profile?.learningPathId) {
      sendSuccess(res, [], { message: 'Selecione uma trilha de aprendizagem primeiro' });
      return;
    }
    const roadmap = await progressService.getRoadmap(req.user!.sub, profile.learningPathId);
    sendSuccess(res, roadmap);
  });
}

export class UserProjectController {
  list = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await userProjectService.findByUser(req.user!.sub));
  });

  start = asyncHandler(async (req: Request, res: Response) => {
    const project = await userProjectService.startProject(req.user!.sub, req.body.projectId);
    sendSuccess(res, project, { message: 'Projeto iniciado', status: 201 });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const project = await userProjectService.updateStatus(
      req.user!.sub,
      param(req.params.id),
      req.body.status,
    );
    sendSuccess(res, project, { message: 'Status do projeto atualizado' });
  });
}

export class DashboardController {
  get = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await dashboardService.getDashboard(req.user!.sub));
  });
}

export class AssessmentController {
  submit = asyncHandler(async (req: Request, res: Response) => {
    const assessment = await assessmentService.submitAssessment(
      req.user!.sub,
      param(req.params.technologyId),
      req.body.answers,
    );
    sendSuccess(res, assessment, { message: 'Avaliação enviada', status: 201 });
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await assessmentService.getUserAssessments(req.user!.sub));
  });
}

export class RecommendationController {
  get = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await recommendationService.getRecommendations(req.user!.sub));
  });
}

export class JobAnalysisController {
  analyze = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await jobAnalysisService.analyzeJob(req.user!.sub, req.body.jobDescription));
  });
}

export class ProfileController {
  setLearningPath = asyncHandler(async (req: Request, res: Response) => {
    await userProfileRepository.setLearningPath(req.user!.sub, req.body.learningPathId);
    sendSuccess(res, null, { message: 'Trilha de aprendizagem atualizada' });
  });
}

export const progressController = new ProgressController();
export const userProjectController = new UserProjectController();
export const dashboardController = new DashboardController();
export const assessmentController = new AssessmentController();
export const recommendationController = new RecommendationController();
export const jobAnalysisController = new JobAnalysisController();
export const profileController = new ProfileController();
