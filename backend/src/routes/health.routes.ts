import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verificação de saúde
 *     responses:
 *       200:
 *         description: Serviço operacional
 */
router.get('/', healthController.check);

export default router;
