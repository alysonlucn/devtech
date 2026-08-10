export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AssessmentInput {
  technologyName: string;
  competencies: string[];
  userAnswers: { question: string; answer: string }[];
}

export interface AssessmentResult {
  score: number;
  feedback: string;
  masteredCompetencies: string[];
  weakCompetencies: string[];
}

export interface RoadmapInput {
  learningPathTitle: string;
  completedTechnologies: string[];
  inProgressTechnologies: string[];
  allTechnologies: { name: string; status: string }[];
}

export interface RoadmapRecommendation {
  nextStep: string;
  technologiesToReview: string[];
  recommendedProject: string;
  reasoning: string;
}

export interface JobAnalysisInput {
  jobDescription: string;
  userTechnologies: string[];
  learningPathTitle: string;
}

export interface JobAnalysisResult {
  matchedTechnologies: string[];
  missingTechnologies: string[];
  suggestedPlan: string;
  matchPercentage: number;
}

export interface LLMProvider {
  chat(messages: ChatMessage[]): Promise<string>;
  assessment(input: AssessmentInput): Promise<AssessmentResult>;
  roadmapRecommendation(input: RoadmapInput): Promise<RoadmapRecommendation>;
  jobAnalysis(input: JobAnalysisInput): Promise<JobAnalysisResult>;
}
