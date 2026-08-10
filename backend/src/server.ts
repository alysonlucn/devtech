import 'reflect-metadata';
import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { initializeDatabase, AppDataSource } from './database/data-source';
import { logger } from './utils/logger';
import { runSeed } from './database/seed/index';

async function bootstrap(): Promise<void> {
  await initializeDatabase();
  logger.info('Banco de dados conectado');

  await AppDataSource.runMigrations();
  logger.info('Migrations executadas');

  const app = createApp();

  // Sobe a porta antes do seed para o health check do Render não falhar no deploy
  app.listen(env.PORT, () => {
    logger.info(`DevPath API rodando na porta ${env.PORT}`);
    logger.info(`Documentação Swagger: http://localhost:${env.PORT}/api/docs`);
  });

  if (env.SEED_DATABASE) {
    await runSeed();
    logger.info('Banco de dados populado');
  }
}

bootstrap().catch((error) => {
  logger.error('Falha ao iniciar o servidor', { error: error.message, stack: error.stack });
  process.exit(1);
});
