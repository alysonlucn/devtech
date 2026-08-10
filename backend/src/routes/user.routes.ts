import { Router } from 'express';
import {
  progressController,
  userProjectController,
  dashboardController,
  assessmentController,
  recommendationController,
  jobAnalysisController,
  profileController,
} from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  idParamSchema,
  technologyIdParamSchema,
  startProgressSchema,
  updateProgressSchema,
  startProjectSchema,
  updateUserProjectSchema,
  assessmentSchema,
  jobAnalysisSchema,
  setLearningPathSchema,
} from '../validators/schemas';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', dashboardController.get);
router.get('/recommendations', recommendationController.get);

router.get('/progress', progressController.list);
router.get('/progress/roadmap', progressController.roadmap);
router.post('/progress/start', validate(startProgressSchema), progressController.start);
router.patch('/progress/:id', validate(idParamSchema, 'params'), validate(updateProgressSchema), progressController.update);
router.post('/progress/:id/ready', validate(idParamSchema, 'params'), progressController.markReady);

router.get('/projects', userProjectController.list);
router.post('/projects/start', validate(startProjectSchema), userProjectController.start);
router.patch('/projects/:id', validate(idParamSchema, 'params'), validate(updateUserProjectSchema), userProjectController.update);

router.get('/assessments', assessmentController.list);
router.post(
  '/assessment/:technologyId',
  validate(technologyIdParamSchema, 'params'),
  validate(assessmentSchema),
  assessmentController.submit,
);

router.post('/job-analysis', validate(jobAnalysisSchema), jobAnalysisController.analyze);
router.patch('/profile/learning-path', validate(setLearningPathSchema), profileController.setLearningPath);

export default router;
