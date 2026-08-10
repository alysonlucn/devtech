import { Router } from 'express';
import { technologyController } from '../controllers/technology.controller';
import {
  resourceController,
  projectController,
  competencyController,
  dependencyController,
} from '../controllers/nested.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/rbac.middleware';
import {
  idParamSchema,
  technologyIdParamSchema,
  technologySchema,
  technologyQuerySchema,
  resourceSchema,
  projectSchema,
  competencySchema,
  dependencySchema,
  dependencyParamSchema,
  paginationSchema,
} from '../validators/schemas';

const router = Router();

router.get('/', validate(technologyQuerySchema, 'query'), technologyController.list);
router.get('/:id', validate(idParamSchema, 'params'), technologyController.getById);
router.post('/', authMiddleware, adminOnly, validate(technologySchema), technologyController.create);
router.put('/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), validate(technologySchema), technologyController.update);
router.delete('/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), technologyController.delete);

router.get('/projects/:id', validate(idParamSchema, 'params'), projectController.getById);

// Nested routes
const nestedRouter = Router({ mergeParams: true });

nestedRouter.get('/resources', validate(paginationSchema, 'query'), resourceController.list);
nestedRouter.post('/resources', authMiddleware, adminOnly, validate(resourceSchema), resourceController.create);

nestedRouter.get('/projects', validate(paginationSchema, 'query'), projectController.list);
nestedRouter.post('/projects', authMiddleware, adminOnly, validate(projectSchema), projectController.create);

nestedRouter.get('/competencies', validate(paginationSchema, 'query'), competencyController.list);
nestedRouter.post('/competencies', authMiddleware, adminOnly, validate(competencySchema), competencyController.create);

nestedRouter.get('/dependencies', dependencyController.list);
nestedRouter.post('/dependencies', authMiddleware, adminOnly, validate(dependencySchema), dependencyController.create);
nestedRouter.delete(
  '/dependencies/:prerequisiteId',
  authMiddleware,
  adminOnly,
  validate(dependencyParamSchema, 'params'),
  dependencyController.delete,
);

router.use('/:technologyId', validate(technologyIdParamSchema, 'params'), nestedRouter);

// Standalone nested resource routes by id
router.put('/resources/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), validate(resourceSchema), resourceController.update);
router.delete('/resources/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), resourceController.delete);

router.put('/projects/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), validate(projectSchema), projectController.update);
router.delete('/projects/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), projectController.delete);

router.put('/competencies/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), validate(competencySchema), competencyController.update);
router.delete('/competencies/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), competencyController.delete);

export default router;
