import {
  AIModel,
  Company,
  BenchmarkMeta,
  ScoringWeights,
  CrawlerStatus,
  CrawlerLog,
  CapabilityCategory,
} from '../types.js';

export async function fetchModels(params: {
  q?: string;
  company?: string;
  isOpenWeight?: boolean;
  isApiAvailable?: boolean;
  maxPrice?: number;
  minContext?: number;
  capability?: CapabilityCategory;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}): Promise<{
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AIModel[];
}> {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.company) query.append('company', params.company);
  if (params.isOpenWeight !== undefined) query.append('isOpenWeight', String(params.isOpenWeight));
  if (params.isApiAvailable !== undefined) query.append('isApiAvailable', String(params.isApiAvailable));
  if (params.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
  if (params.minContext !== undefined) query.append('minContext', String(params.minContext));
  if (params.capability) query.append('capability', params.capability);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const res = await fetch(`/api/models?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
}

export async function fetchModelDetail(id: string): Promise<AIModel & { calculatedScore: number; overallRank: number }> {
  const res = await fetch(`/api/models/${id}`);
  if (!res.ok) throw new Error('Failed to fetch model detail');
  return res.json();
}

export async function fetchRankings(category: CapabilityCategory = 'overall'): Promise<{
  category: CapabilityCategory;
  weights: ScoringWeights;
  total: number;
  data: Array<{
    rank: number;
    modelId: string;
    modelName: string;
    companyName: string;
    companyId: string;
    score: number;
    trend: string;
    rankChange: number;
    contextLength: number;
    pricing: any;
    isOpenWeight: boolean;
    lastUpdated: string;
    model: AIModel;
  }>;
}> {
  const res = await fetch(`/api/rankings?category=${category}`);
  if (!res.ok) throw new Error('Failed to fetch rankings');
  return res.json();
}

export async function fetchLatest(): Promise<{
  latestReleased: AIModel[];
  recentlyUpdated: AIModel[];
  trending: AIModel[];
}> {
  const res = await fetch('/api/latest');
  if (!res.ok) throw new Error('Failed to fetch latest models');
  return res.json();
}

export async function fetchComparison(ids: string[]): Promise<{
  models: AIModel[];
  comparisonMetrics: string[];
}> {
  const res = await fetch(`/api/compare?ids=${ids.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch comparison');
  return res.json();
}

export async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch('/api/companies');
  if (!res.ok) throw new Error('Failed to fetch companies');
  return res.json();
}

export async function fetchBenchmarks(): Promise<BenchmarkMeta[]> {
  const res = await fetch('/api/benchmarks');
  if (!res.ok) throw new Error('Failed to fetch benchmarks');
  return res.json();
}

export async function fetchWeights(): Promise<ScoringWeights> {
  const res = await fetch('/api/weights');
  if (!res.ok) throw new Error('Failed to fetch weights');
  return res.json();
}

export async function saveWeights(weights: Partial<ScoringWeights>): Promise<{ success: boolean; weights: ScoringWeights }> {
  const res = await fetch('/api/weights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(weights),
  });
  if (!res.ok) throw new Error('Failed to save weights');
  return res.json();
}

export async function fetchAdminCrawler(): Promise<{
  status: CrawlerStatus;
  stats: {
    totalModels: number;
    totalCompanies: number;
    openWeightCount: number;
    apiAvailableCount: number;
    newReleasesCount: number;
  };
  logs: CrawlerLog[];
}> {
  const res = await fetch('/api/admin/crawler');
  if (!res.ok) throw new Error('Failed to fetch admin crawler status');
  return res.json();
}

export async function triggerCrawler(): Promise<{
  success: boolean;
  addedCount: number;
  updatedCount: number;
  message: string;
}> {
  const res = await fetch('/api/admin/crawler/trigger', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger crawler');
  return res.json();
}
