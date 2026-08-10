import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevPath API',
      version: '1.0.0',
      description:
        'DevPath — API da plataforma de mentoria de carreira para trilhas de aprendizagem personalizadas, acompanhamento de progresso e mentoria com IA.',
    },
    servers: [{ url: '/api/v1', description: 'API v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Endpoints de verificação de saúde' },
      { name: 'Auth', description: 'Endpoints de autenticação' },
      { name: 'Learning Paths', description: 'Gerenciamento de trilhas de aprendizagem' },
      { name: 'Technologies', description: 'Base de conhecimento de tecnologias' },
      { name: 'Progress', description: 'Acompanhamento de progresso do usuário' },
      { name: 'Dashboard', description: 'Dados do painel do usuário' },
      { name: 'AI', description: 'Recursos com inteligência artificial' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});
