import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from '../data-source';
import { User } from '../../entities/user.entity';
import { LearningPath } from '../../entities/learning-path.entity';
import { Technology } from '../../entities/technology.entity';
import { LearningPathTechnology } from '../../entities/learning-path-technology.entity';
import { TechnologyDependency } from '../../entities/technology-dependency.entity';
import { Resource } from '../../entities/resource.entity';
import { ProjectSuggestion } from '../../entities/project-suggestion.entity';
import { Competency } from '../../entities/competency.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { UserStreak } from '../../entities/user-streak.entity';
import {
  UserRole,
  TechnologyDifficulty,
  TechnologyCategory,
  ResourceType,
} from '../../enums';
import { hashPassword } from '../../utils/password';
import { logger } from '../../utils/logger';

interface SeedTechnology {
  name: string;
  slug: string;
  description: string;
  whyLearn: string;
  whenLearn: string;
  estimatedTime: number;
  difficulty: TechnologyDifficulty;
  order: number;
  category: TechnologyCategory;
  prerequisites?: string[];
  competencies: string[];
  resources: { title: string; type: ResourceType; url: string }[];
  projects: { title: string; description: string; difficulty: TechnologyDifficulty }[];
}

const TECHNOLOGIES: SeedTechnology[] = [
  {
    name: 'Git',
    slug: 'git',
    description: 'Sistema de controle de versão essencial para desenvolvimento colaborativo.',
    whyLearn: 'Toda equipe usa controle de versão. Git é o padrão da indústria.',
    whenLearn: 'Antes de qualquer projeto colaborativo ou profissional.',
    estimatedTime: 8,
    difficulty: TechnologyDifficulty.BEGINNER,
    order: 1,
    category: TechnologyCategory.TOOLING,
    competencies: [
      'Criar e clonar repositórios',
      'Usar git init, status, add e commit',
      'Criar e trocar branches',
      'Fazer merge e resolver conflitos',
      'Usar push, pull e clone',
    ],
    resources: [
      {
        title: 'AULÃO GIT e GITHUB: Tutorial PRÁTICO para Iniciantes',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/watch?v=WzRK9ZNE19Q',
      },
      {
        title: 'Git Learn — Documentação oficial',
        type: ResourceType.DOCUMENTATION,
        url: 'https://git-scm.com/learn',
      },
      {
        title: 'Pro Git — Livro gratuito em português',
        type: ResourceType.BOOK,
        url: 'https://git-scm.com/book/pt-br/v2.html',
      },
    ],
    projects: [
      {
        title: 'Fluxo de Trabalho com Git',
        description: [
          'Simule um fluxo real de colaboração com Git e GitHub.',
          '',
          '## Objetivo',
          'Criar um repositório, trabalhar com branches, commits e merge — como em um time.',
          '',
          '## O que você deve fazer',
          '1. Crie um repositório local com `git init` (ou clone um remoto).',
          '2. Faça commits claros com `git add` e `git commit`.',
          '3. Crie uma branch de feature (ex.: `feature/readme`).',
          '4. Faça alterações nessa branch e commit.',
          '5. Volte para `main` e faça o merge da feature.',
          '6. (Opcional) Publique no GitHub com `git push` e abra um Pull Request.',
          '',
          '## Critérios de sucesso',
          '- Histórico com pelo menos 3 commits bem descritos',
          '- Pelo menos uma branch além da main',
          '- Merge concluído sem perder alterações',
          '- Você consegue explicar `status`, `add`, `commit`, `branch`, `merge`, `push` e `pull`',
        ].join('\n'),
        difficulty: TechnologyDifficulty.BEGINNER,
      },
    ],
  },
  {
    name: 'Node.js',
    slug: 'nodejs',
    description: 'Runtime JavaScript para construir aplicações escaláveis no servidor.',
    whyLearn: 'Permite desenvolvimento full-stack com JavaScript e um ecossistema enorme.',
    whenLearn: 'Após Git e fundamentos de JavaScript — segundo passo da trilha backend.',
    estimatedTime: 20,
    difficulty: TechnologyDifficulty.INTERMEDIATE,
    order: 2,
    category: TechnologyCategory.BACKEND,
    prerequisites: ['git'],
    competencies: [
      'Explicar o que é Node.js',
      'Usar npm e package.json',
      'Organizar código em módulos',
      'Criar servidor HTTP básico',
      'Usar Async/Await e programação assíncrona',
    ],
    resources: [
      {
        title: 'Curso de Node.js: Sua Primeira API com Banco de Dados',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/watch?v=K31sLgAhd9Q',
      },
      {
        title: 'Node.js — Learn',
        type: ResourceType.DOCUMENTATION,
        url: 'https://nodejs.org/learn',
      },
      {
        title: 'Node.js — Introdução e conceitos fundamentais',
        type: ResourceType.ARTICLE,
        url: 'https://nodejs.org/learn/getting-started/introduction-to-nodejs',
      },
    ],
    projects: [
      {
        title: 'Ferramenta CLI com Node.js',
        description: [
          'Construa uma ferramenta de linha de comando simples em Node.js.',
          '',
          '## Objetivo',
          'Praticar módulos, npm, leitura/escrita de arquivos e Async/Await.',
          '',
          '## O que você deve fazer',
          '1. Crie um projeto com `npm init` e um `package.json`.',
          '2. Implemente um script CLI (ex.: listar arquivos de uma pasta ou criar um arquivo de notas).',
          '3. Use módulos (`require`/`import`) para separar a lógica.',
          '4. Trate erros de forma clara no terminal.',
          '',
          '## Critérios de sucesso',
          '- Projeto roda com `node` ou script npm',
          '- Há pelo menos 2 arquivos/módulos',
          '- Operações assíncronas usam Async/Await',
          '- Você explica o papel do npm e do `package.json`',
        ].join('\n'),
        difficulty: TechnologyDifficulty.INTERMEDIATE,
      },
    ],
  },
  {
    name: 'Express',
    slug: 'express',
    description: 'Framework web minimalista e flexível para Node.js.',
    whyLearn: 'Framework mais popular para APIs REST em Node.js.',
    whenLearn: 'Após aprender o básico de Node.js.',
    estimatedTime: 16,
    difficulty: TechnologyDifficulty.INTERMEDIATE,
    order: 3,
    category: TechnologyCategory.BACKEND,
    prerequisites: ['nodejs'],
    competencies: [
      'Criar servidor Express',
      'Definir rotas e métodos HTTP',
      'Usar request, response e JSON',
      'Aplicar middleware',
      'Implementar CRUD com tratamento de erros',
    ],
    resources: [
      {
        title: 'Curso de API RESTful com Node.js',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/watch?v=bltO49407mM',
      },
      {
        title: 'Express.js — Documentação oficial em português',
        type: ResourceType.DOCUMENTATION,
        url: 'https://expressjs.com/pt-br/',
      },
      {
        title: 'Express — Hello World',
        type: ResourceType.ARTICLE,
        url: 'https://expressjs.com/pt-br/starter/hello-world.html',
      },
      {
        title: 'Express — Instalando',
        type: ResourceType.ARTICLE,
        url: 'https://expressjs.com/pt-br/5x/starter/installing/',
      },
    ],
    projects: [
      {
        title: 'API REST CRUD',
        description: [
          'Construa uma API REST com Express e armazenamento em memória.',
          '',
          '## Objetivo',
          'Criar endpoints CRUD completos com rotas, JSON, middleware e tratamento de erros.',
          '',
          '## O que você deve fazer',
          '1. Instale e configure o Express.',
          '2. Crie rotas para listar, buscar, criar, atualizar e remover um recurso (ex.: tarefas).',
          '3. Use params de rota e, se fizer sentido, query parameters.',
          '4. Organize controllers (ou handlers) e um middleware de erro.',
          '5. Retorne JSON com status HTTP corretos.',
          '',
          '## Critérios de sucesso',
          '- Endpoints GET, POST, PUT/PATCH e DELETE funcionando',
          '- Validação básica de entrada',
          '- Erros respondidos de forma consistente',
          '- Você explica middleware, request e response',
        ].join('\n'),
        difficulty: TechnologyDifficulty.INTERMEDIATE,
      },
    ],
  },
  {
    name: 'Docker',
    slug: 'docker',
    description: 'Plataforma para desenvolver, publicar e executar aplicações em containers.',
    whyLearn: 'Padrão para deploy e consistência de ambientes.',
    whenLearn: 'Após construir pelo menos uma aplicação backend com Express.',
    estimatedTime: 12,
    difficulty: TechnologyDifficulty.INTERMEDIATE,
    order: 4,
    category: TechnologyCategory.DEVOPS,
    prerequisites: ['express'],
    competencies: [
      'Explicar imagens e containers',
      'Escrever um Dockerfile',
      'Expor portas e usar volumes',
      'Usar variáveis de ambiente',
      'Orquestrar com Docker Compose',
    ],
    resources: [
      {
        title: 'Docker Completo 2026: Do Zero ao Profissional',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/watch?v=IeyO3TnHcaw',
      },
      {
        title: 'Docker — Getting Started',
        type: ResourceType.DOCUMENTATION,
        url: 'https://docs.docker.com/get-started/',
      },
      {
        title: 'Docker — Introduction',
        type: ResourceType.ARTICLE,
        url: 'https://docs.docker.com/get-started/introduction/',
      },
      {
        title: 'Docker Guides',
        type: ResourceType.DOCUMENTATION,
        url: 'https://docs.docker.com/guides/',
      },
    ],
    projects: [
      {
        title: 'Containerizar API Express',
        description: [
          'Coloque sua API Express para rodar em containers com Docker Compose.',
          '',
          '## Objetivo',
          'Criar imagem Docker da API e orquestrar com Compose (API + banco, se aplicável).',
          '',
          '## O que você deve fazer',
          '1. Escreva um `Dockerfile` para a API Node/Express.',
          '2. Exponha a porta correta e use variáveis de ambiente.',
          '3. Monte um `docker-compose.yml` (API e, se quiser, PostgreSQL).',
          '4. Suba os serviços e teste os endpoints de dentro/fora do container.',
          '',
          '## Critérios de sucesso',
          '- `docker compose up` sobe a aplicação',
          '- API responde na porta mapeada',
          '- Há volume ou env vars configurados quando fizer sentido',
          '- Você explica imagem, container, Dockerfile e Compose',
        ].join('\n'),
        difficulty: TechnologyDifficulty.INTERMEDIATE,
      },
    ],
  },
  {
    name: 'HTML',
    slug: 'html',
    description: 'Linguagem de marcação para estruturar conteúdo web.',
    whyLearn: 'Base de toda página web.',
    whenLearn: 'Primeiro passo no desenvolvimento frontend.',
    estimatedTime: 10,
    difficulty: TechnologyDifficulty.BEGINNER,
    order: 1,
    category: TechnologyCategory.FRONTEND,
    competencies: ['HTML semântico', 'Formulários', 'Noções de acessibilidade'],
    resources: [
      { title: 'MDN HTML', type: ResourceType.DOCUMENTATION, url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML' },
    ],
    projects: [
      {
        title: 'Página de Portfólio',
        description: [
          'Construa uma página de portfólio com HTML semântico.',
          '',
          '## Objetivo',
          'Estruturar uma página completa usando tags semânticas.',
          '',
          '## O que você deve fazer',
          '1. Crie seções (header, main, about, projects, contact).',
          '2. Use headings, listas e links corretamente.',
          '3. Inclua um formulário de contato simples.',
          '',
          '## Critérios de sucesso',
          '- HTML válido e semântico',
          '- Navegação clara entre seções',
          '- Formulário com labels acessíveis',
        ].join('\n'),
        difficulty: TechnologyDifficulty.BEGINNER,
      },
    ],
  },
  {
    name: 'CSS',
    slug: 'css',
    description: 'Linguagem de folhas de estilo para design de páginas web.',
    whyLearn: 'Essencial para criar interfaces visualmente atraentes.',
    whenLearn: 'Logo após HTML.',
    estimatedTime: 15,
    difficulty: TechnologyDifficulty.BEGINNER,
    order: 2,
    category: TechnologyCategory.FRONTEND,
    prerequisites: ['html'],
    competencies: ['Flexbox', 'Grid', 'Design responsivo', 'Variáveis CSS'],
    resources: [
      { title: 'MDN CSS', type: ResourceType.DOCUMENTATION, url: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS' },
    ],
    projects: [
      {
        title: 'Layout Responsivo',
        description: [
          'Estilize seu portfólio com CSS responsivo.',
          '',
          '## Objetivo',
          'Aplicar layout moderno com Flexbox/Grid e breakpoints.',
          '',
          '## O que você deve fazer',
          '1. Defina uma paleta e variáveis CSS.',
          '2. Monte o layout com Flexbox e/ou Grid.',
          '3. Adapte para mobile e desktop.',
          '',
          '## Critérios de sucesso',
          '- Visual consistente em telas pequenas e grandes',
          '- Uso claro de Flexbox ou Grid',
          '- Espaçamento e tipografia legíveis',
        ].join('\n'),
        difficulty: TechnologyDifficulty.BEGINNER,
      },
    ],
  },
  {
    name: 'React',
    slug: 'react',
    description: 'Biblioteca JavaScript para construir interfaces de usuário.',
    whyLearn: 'Biblioteca frontend mais popular com alta demanda no mercado.',
    whenLearn: 'Após HTML, CSS e fundamentos de JavaScript.',
    estimatedTime: 30,
    difficulty: TechnologyDifficulty.INTERMEDIATE,
    order: 3,
    category: TechnologyCategory.FRONTEND,
    prerequisites: ['css'],
    competencies: ['Componentes', 'Gerenciamento de estado', 'Hooks', 'Busca de dados'],
    resources: [
      { title: 'Documentação do React', type: ResourceType.DOCUMENTATION, url: 'https://react.dev/' },
    ],
    projects: [
      {
        title: 'App Gerenciador de Tarefas',
        description: [
          'Construa um gerenciador de tarefas em React com estado local.',
          '',
          '## Objetivo',
          'Praticar componentes, hooks e fluxo de dados.',
          '',
          '## O que você deve fazer',
          '1. Liste, adicione, conclua e remova tarefas.',
          '2. Separe componentes (lista, item, formulário).',
          '3. Use estado com hooks.',
          '',
          '## Critérios de sucesso',
          '- CRUD de tarefas na interface',
          '- Componentes reutilizáveis',
          '- Estado previsível e UI atualizada',
        ].join('\n'),
        difficulty: TechnologyDifficulty.INTERMEDIATE,
      },
    ],
  },
];

async function syncTechnologyContent(): Promise<void> {
  const techRepo = AppDataSource.getRepository(Technology);
  const resourceRepo = AppDataSource.getRepository(Resource);
  const projectRepo = AppDataSource.getRepository(ProjectSuggestion);
  const competencyRepo = AppDataSource.getRepository(Competency);

  for (const t of TECHNOLOGIES) {
    const tech = await techRepo.findOne({ where: { slug: t.slug } });
    if (!tech) continue;

    await techRepo.update(tech.id, {
      description: t.description,
      whyLearn: t.whyLearn,
      whenLearn: t.whenLearn,
      estimatedTime: t.estimatedTime,
      difficulty: t.difficulty,
      order: t.order,
      category: t.category,
    });

    await competencyRepo.delete({ technologyId: tech.id });
    for (const c of t.competencies) {
      await competencyRepo.save({ technologyId: tech.id, title: c });
    }

    await resourceRepo.delete({ technologyId: tech.id });
    for (const r of t.resources) {
      await resourceRepo.save({ technologyId: tech.id, ...r });
    }

    const existingProjects = await projectRepo.find({ where: { technologyId: tech.id } });
    for (let i = 0; i < t.projects.length; i++) {
      const seedProject = t.projects[i];
      if (existingProjects[i]) {
        await projectRepo.update(existingProjects[i].id, {
          title: seedProject.title,
          description: seedProject.description,
          difficulty: seedProject.difficulty,
        });
      } else {
        await projectRepo.save({ technologyId: tech.id, ...seedProject });
      }
    }
  }

  const pathRepo = AppDataSource.getRepository(LearningPath);
  const pathUpdates = [
    { slug: 'backend', title: 'Back-end', description: 'Torne-se um desenvolvedor back-end dominando Node.js, Express e fundamentos de DevOps.' },
    { slug: 'frontend', title: 'Front-end', description: 'Domine o desenvolvimento front-end com HTML, CSS e React.' },
    { slug: 'full-stack', title: 'Full Stack', description: 'Trilha completa cobrindo tecnologias de front-end e back-end.' },
  ];
  for (const p of pathUpdates) {
    await pathRepo.update({ slug: p.slug }, { title: p.title, description: p.description });
  }

  logger.info('Conteúdo das tecnologias sincronizado para português');
}

export async function runSeed(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const userRepo = AppDataSource.getRepository(User);
  const existingAdmin = await userRepo.findOne({ where: { email: 'admin@devpath.com' } });
  if (existingAdmin) {
    logger.info('Seed já aplicado, sincronizando conteúdo...');
    await syncTechnologyContent();
    return;
  }

  logger.info('Executando seed do banco de dados...');

  const adminPassword = await hashPassword('Admin@123456');
  const userPassword = await hashPassword('User@123456');

  const admin = userRepo.create({
    name: 'Admin DevPath',
    email: 'admin@devpath.com',
    password: adminPassword,
    role: UserRole.ADMIN,
  });

  const demoUser = userRepo.create({
    name: 'Usuário Demo',
    email: 'user@devpath.com',
    password: userPassword,
    role: UserRole.USER,
  });

  await userRepo.save([admin, demoUser]);

  for (const u of [admin, demoUser]) {
    await AppDataSource.getRepository(UserProfile).save({ userId: u.id, totalXp: 0 });
    await AppDataSource.getRepository(UserStreak).save({ userId: u.id });
  }

  const pathRepo = AppDataSource.getRepository(LearningPath);
  const backendPath = pathRepo.create({
    title: 'Back-end',
    slug: 'backend',
    description: 'Torne-se um desenvolvedor back-end dominando Node.js, Express e fundamentos de DevOps.',
  });
  const frontendPath = pathRepo.create({
    title: 'Front-end',
    slug: 'frontend',
    description: 'Domine o desenvolvimento front-end com HTML, CSS e React.',
  });
  const fullStackPath = pathRepo.create({
    title: 'Full Stack',
    slug: 'full-stack',
    description: 'Trilha completa cobrindo tecnologias de front-end e back-end.',
  });
  await pathRepo.save([backendPath, frontendPath, fullStackPath]);

  const techRepo = AppDataSource.getRepository(Technology);
  const techMap = new Map<string, Technology>();

  for (const t of TECHNOLOGIES) {
    const tech = techRepo.create({
      name: t.name,
      slug: t.slug,
      description: t.description,
      whyLearn: t.whyLearn,
      whenLearn: t.whenLearn,
      estimatedTime: t.estimatedTime,
      difficulty: t.difficulty,
      order: t.order,
      category: t.category,
    });
    const saved = await techRepo.save(tech);
    techMap.set(t.slug, saved);

    for (const c of t.competencies) {
      await AppDataSource.getRepository(Competency).save({ technologyId: saved.id, title: c });
    }
    for (const r of t.resources) {
      await AppDataSource.getRepository(Resource).save({ technologyId: saved.id, ...r });
    }
    for (const p of t.projects) {
      await AppDataSource.getRepository(ProjectSuggestion).save({ technologyId: saved.id, ...p });
    }
  }

  for (const t of TECHNOLOGIES) {
    if (!t.prerequisites) continue;
    const tech = techMap.get(t.slug)!;
    for (const prereq of t.prerequisites) {
      const prereqTech = techMap.get(prereq)!;
      await AppDataSource.getRepository(TechnologyDependency).save({
        technologyId: tech.id,
        prerequisiteTechnologyId: prereqTech.id,
      });
    }
  }

  const lptRepo = AppDataSource.getRepository(LearningPathTechnology);
  const backendSlugs = ['git', 'nodejs', 'express', 'docker'];
  const frontendSlugs = ['html', 'css', 'react'];
  const fullStackSlugs = [...backendSlugs, ...frontendSlugs];

  async function linkPath(path: LearningPath, slugs: string[]) {
    for (let i = 0; i < slugs.length; i++) {
      const tech = techMap.get(slugs[i])!;
      await lptRepo.save({ learningPathId: path.id, technologyId: tech.id, order: i + 1 });
    }
  }

  await linkPath(backendPath, backendSlugs);
  await linkPath(frontendPath, frontendSlugs);
  await linkPath(fullStackPath, fullStackSlugs);

  await AppDataSource.getRepository(UserProfile).update(
    { userId: demoUser.id },
    { learningPathId: backendPath.id },
  );

  logger.info('Seed concluído com sucesso');
  logger.info('Admin: admin@devpath.com / Admin@123456');
  logger.info('User:  user@devpath.com / User@123456');
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Falha no seed', { error: err.message });
      process.exit(1);
    });
}
