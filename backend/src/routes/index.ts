import { Router } from 'express';
import authRoutes from './auth.routes';
import learningPathRoutes from './learning-path.routes';
import technologyRoutes from './technology.routes';
import userRoutes from './user.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/learning-paths', learningPathRoutes);
router.use('/technologies', technologyRoutes);
router.use('/', userRoutes);

export default router;
