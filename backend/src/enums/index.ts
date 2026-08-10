export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TechnologyDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum TechnologyCategory {
  FUNDAMENTALS = 'FUNDAMENTALS',
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  DEVOPS = 'DEVOPS',
  DATABASE = 'DATABASE',
  TOOLING = 'TOOLING',
}

export enum ResourceType {
  VIDEO = 'video',
  ARTICLE = 'article',
  DOCUMENTATION = 'documentation',
  BOOK = 'book',
  COURSE = 'course',
}

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_ASSESSMENT = 'READY_FOR_ASSESSMENT',
  VALIDATED = 'VALIDATED',
}

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
