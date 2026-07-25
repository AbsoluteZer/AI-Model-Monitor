export type CapabilityCategory =
  | 'overall'
  | 'freeTier'
  | 'coding'
  | 'reasoning'
  | 'mathematics'
  | 'scientificReasoning'
  | 'agentTasks'
  | 'vision'
  | 'imageUnderstanding'
  | 'ocr'
  | 'multimodal'
  | 'longContext'
  | 'speed'
  | 'costEfficiency'
  | 'apiPerformance'
  | 'creativeWriting'
  | 'translation'
  | 'instructionFollowing';

export interface CategoryInfo {
  id: CapabilityCategory;
  name: string;
  description: string;
  iconName: string;
}

export interface ModelScores {
  overall: number;
  coding: number;
  reasoning: number;
  mathematics: number;
  scientificReasoning: number;
  agentTasks: number;
  vision: number;
  imageUnderstanding: number;
  ocr: number;
  multimodal: number;
  longContext: number;
  speed: number;
  costEfficiency: number;
  apiPerformance: number;
  creativeWriting: number;
  translation: number;
  instructionFollowing: number;
}

export interface ModelBenchmarks {
  mmluPro?: number;
  humanEval?: number;
  math500?: number;
  gpqaDiamond?: number;
  sweBenchVerified?: number;
  mmmu?: number;
  arenaElo?: number;
  latencyMs?: number; // ms for first token
  throughputTps?: number; // tokens per sec
}

export interface PricingInfo {
  inputPerM: number; // $ per 1M input tokens
  outputPerM: number; // $ per 1M output tokens
  cachedInputPerM?: number;
  freeTier: boolean;
}

export interface OfficialLinks {
  website?: string;
  paper?: string;
  apiDocs?: string;
  github?: string;
  announcement?: string;
}

export interface ModelHistoryPoint {
  date: string;
  score: number;
  rank: number;
  arenaElo?: number;
}

export interface AIModel {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  releaseDate: string; // YYYY-MM-DD
  isNew: boolean;
  trendingRank?: number;
  trend: 'up' | 'down' | 'stable' | 'new';
  rankChange: number; // e.g. +2, -1, 0
  announcementSummary: string;
  description: string;
  keyFeatures: string[];
  strengths: string[];
  weaknesses: string[];
  contextLength: number; // in K tokens (e.g., 2000 for 2M)
  inputTypes: ('Text' | 'Image' | 'Audio' | 'Video' | 'PDF')[];
  outputTypes: ('Text' | 'Image' | 'Audio' | 'Code')[];
  pricing: PricingInfo;
  isOpenWeight: boolean;
  isApiAvailable: boolean;
  hasImageGen: boolean;
  hasVoice: boolean;
  links: OfficialLinks;
  scores: ModelScores;
  benchmarks: ModelBenchmarks;
  confidenceScore: number; // 0-100%
  source: string;
  lastChecked: string; // ISO date string
  lastUpdated: string; // ISO date string
  performanceHistory: ModelHistoryPoint[];
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  country: string;
  totalModels: number;
  avgOverallScore: number;
  website: string;
}

export interface ScoringWeights {
  reasoning: number;
  coding: number;
  mathematics: number;
  vision: number;
  instructionFollowing: number;
  creativeWriting: number;
  longContext: number;
  speed: number;
  costEfficiency: number;
}

export interface CrawlerLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  source?: string;
}

export interface CrawlerStatus {
  lastRunTime: string;
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  totalModelsTracked: number;
  totalCompaniesTracked: number;
  totalBenchmarksTracked: number;
  failedSourcesCount: number;
  pendingUpdatesCount: number;
  nextScheduledRun: string;
}

export interface BenchmarkMeta {
  id: string;
  name: string;
  category: CapabilityCategory;
  fullTitle: string;
  description: string;
  maxScore: number;
  unit: string;
}

export interface FilterParams {
  query?: string;
  companyId?: string;
  isOpenWeight?: boolean;
  isApiAvailable?: boolean;
  maxPriceInput?: number;
  minContext?: number;
  capability?: CapabilityCategory;
  sortBy?: 'score' | 'releaseDate' | 'context' | 'speed' | 'cost';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
