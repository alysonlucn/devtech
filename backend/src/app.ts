import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { swaggerSpec } from './config/swagger';
import { NotFoundError } from './errors/app.errors';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/v1', routes);

  app.use((_req, _res, next) => {
    next(new NotFoundError('Rota não encontrada'));
  });

  app.use(errorMiddleware);

  return app;
}
