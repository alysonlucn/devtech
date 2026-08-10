import { Router } from 'express';
import { learningPathController } from '../controllers/learning-path.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/rbac.middleware';
import {
  idParamSchema,
  learningPathSchema,
  learningPathTechnologySchema,
  paginationSchema,
} from '../validators/schemas';

const router = Router();

router.get('/', validate(paginationSchema, 'query'), learningPathController.list);
router.get('/:id', validate(idParamSchema, 'params'), learningPathController.getById);
router.get('/:id/technologies', validate(idParamSchema, 'params'), learningPathController.getTechnologies);

router.post('/', authMiddleware, adminOnly, validate(learningPathSchema), learningPathController.create);
router.put('/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), validate(learningPathSchema), learningPathController.update);
router.delete('/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), learningPathController.delete);

router.post(
  '/:id/technologies',
  authMiddleware,
  adminOnly,
  validate(idParamSchema, 'params'),
  validate(learningPathTechnologySchema),
  learningPathController.addTechnology,
);

router.delete(
  '/:id/technologies/:technologyId',
  authMiddleware,
  adminOnly,
  learningPathController.removeTechnology,
);

export default router;
