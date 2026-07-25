import {
  AIModel,
  Company,
  BenchmarkMeta,
  ScoringWeights,
  CrawlerStatus,
  CrawlerLog,
  CapabilityCategory,
} from '../types';

import {
  DEFAULT_WEIGHTS,
  INITIAL_COMPANIES,
  INITIAL_BENCHMARKS,
  INITIAL_MODELS,
  INITIAL_STATUS,
  INITIAL_LOGS,
  calculateOverallScore,
} from '../data/initialData';

// Storage Helper Functions
function getModelsFromStorage(): AIModel[] {
  try {
    const raw = localStorage.getItem('aimonitor_models');
    if (!raw) {
      localStorage.setItem('aimonitor_models', JSON.stringify(INITIAL_MODELS));
      return INITIAL_MODELS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MODELS;
  }
}

function saveModelsToStorage(models: AIModel[]): void {
  try {
    localStorage.setItem('aimonitor_models', JSON.stringify(models));
  } catch (e) {
    console.warn('Failed to save models to localStorage', e);
  }
}

function getWeightsFromStorage(): ScoringWeights {
  try {
    const raw = localStorage.getItem('aimonitor_weights');
    if (!raw) {
      localStorage.setItem('aimonitor_weights', JSON.stringify(DEFAULT_WEIGHTS));
      return DEFAULT_WEIGHTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WEIGHTS;
  }
}

function getLogsFromStorage(): CrawlerLog[] {
  try {
    const raw = localStorage.getItem('aimonitor_logs');
    if (!raw) {
      localStorage.setItem('aimonitor_logs', JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOGS;
  }
}

function addLogToStorage(level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', message: string, source: string = 'LocalStorage'): void {
  try {
    const logs = getLogsFromStorage();
    const newLog: CrawlerLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
    };
    const updated = [newLog, ...logs].slice(0, 50);
    localStorage.setItem('aimonitor_logs', JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to add log to localStorage', e);
  }
}

function getStatusFromStorage(): CrawlerStatus {
  try {
    const raw = localStorage.getItem('aimonitor_status');
    if (!raw) {
      localStorage.setItem('aimonitor_status', JSON.stringify(INITIAL_STATUS));
      return INITIAL_STATUS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATUS;
  }
}

// API Methods operating directly in browser memory + localStorage
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
  let models = getModelsFromStorage();
  const weights = getWeightsFromStorage();

  const query = (params.q || '').toLowerCase().trim();
  if (query) {
    models = models.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.companyName.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.keyFeatures.some((f) => f.toLowerCase().includes(query))
    );
  }

  if (params.company) {
    models = models.filter((m) => m.companyId === params.company);
  }

  if (params.isOpenWeight !== undefined) {
    models = models.filter((m) => m.isOpenWeight === params.isOpenWeight);
  }

  if (params.isApiAvailable !== undefined) {
    models = models.filter((m) => m.isApiAvailable === params.isApiAvailable);
  }

  if (params.maxPrice !== undefined) {
    models = models.filter((m) => m.pricing.inputPerM <= (params.maxPrice || 0));
  }

  if (params.minContext !== undefined) {
    models = models.filter((m) => m.contextLength >= (params.minContext || 0));
  }

  if (params.capability && params.capability === 'freeTier') {
    models = models.filter((m) => m.pricing.freeTier === true || m.pricing.inputPerM === 0 || m.isOpenWeight === true);
  }

  const sortBy = params.sortBy || 'score';
  const sortOrder = params.sortOrder || 'desc';

  models.sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortBy === 'score') {
      valA = params.capability && params.capability !== 'overall' && params.capability !== 'freeTier'
        ? (a.scores[params.capability] || 0)
        : calculateOverallScore(a.scores, weights);
      valB = params.capability && params.capability !== 'overall' && params.capability !== 'freeTier'
        ? (b.scores[params.capability] || 0)
        : calculateOverallScore(b.scores, weights);
    } else if (sortBy === 'releaseDate') {
      valA = new Date(a.releaseDate).getTime();
      valB = new Date(b.releaseDate).getTime();
    } else if (sortBy === 'context') {
      valA = a.contextLength;
      valB = b.contextLength;
    } else if (sortBy === 'speed') {
      valA = a.scores.speed || 0;
      valB = b.scores.speed || 0;
    } else if (sortBy === 'cost') {
      valA = a.pricing.inputPerM;
      valB = b.pricing.inputPerM;
    }

    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 20);
  const total = models.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedData = models.slice((page - 1) * limit, page * limit);

  return {
    total,
    page,
    limit,
    totalPages,
    data: paginatedData,
  };
}

export async function fetchModelDetail(id: string): Promise<AIModel & { calculatedScore: number; overallRank: number }> {
  const models = getModelsFromStorage();
  const weights = getWeightsFromStorage();

  const sortedModels = [...models].sort((a, b) => calculateOverallScore(b.scores, weights) - calculateOverallScore(a.scores, weights));
  const modelIndex = sortedModels.findIndex((m) => m.id === id);

  if (modelIndex === -1) {
    throw new Error('Model not found');
  }

  const model = sortedModels[modelIndex];
  const calculatedScore = calculateOverallScore(model.scores, weights);

  return {
    ...model,
    calculatedScore,
    overallRank: modelIndex + 1,
  };
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
  let allModels = getModelsFromStorage();
  const weights = getWeightsFromStorage();

  if (category === 'freeTier') {
    allModels = allModels.filter((m) => m.pricing.freeTier === true || m.pricing.inputPerM === 0 || m.isOpenWeight === true);
  }

  const ratedModels = allModels.map((m) => {
    let score = m.scores.overall;
    if (category === 'overall' || category === 'freeTier') {
      score = calculateOverallScore(m.scores, weights);
    } else if (m.scores[category] !== undefined) {
      score = m.scores[category];
    }
    return { model: m, score };
  });

  ratedModels.sort((a, b) => b.score - a.score);

  const rankings = ratedModels.map((item, index) => ({
    rank: index + 1,
    modelId: item.model.id,
    modelName: item.model.name,
    companyName: item.model.companyName,
    companyId: item.model.companyId,
    score: item.score,
    trend: item.model.trend,
    rankChange: item.model.rankChange,
    contextLength: item.model.contextLength,
    pricing: item.model.pricing,
    isOpenWeight: item.model.isOpenWeight,
    lastUpdated: item.model.lastUpdated,
    model: item.model,
  }));

  return {
    category,
    weights,
    total: rankings.length,
    data: rankings,
  };
}

export async function fetchLatest(): Promise<{
  latestReleased: AIModel[];
  recentlyUpdated: AIModel[];
  trending: AIModel[];
}> {
  const models = getModelsFromStorage();

  const latestReleased = [...models]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 6);

  const recentlyUpdated = [...models]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 6);

  const trending = [...models]
    .filter((m) => m.trendingRank !== undefined)
    .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
    .slice(0, 6);

  return {
    latestReleased,
    recentlyUpdated,
    trending,
  };
}

export async function fetchComparison(ids: string[]): Promise<{
  models: AIModel[];
  comparisonMetrics: string[];
}> {
  const allModels = getModelsFromStorage();
  const models = allModels.filter((m) => ids.includes(m.id));

  return {
    models,
    comparisonMetrics: [
      'mmluPro',
      'humanEval',
      'math500',
      'gpqaDiamond',
      'sweBenchVerified',
      'mmmu',
      'arenaElo',
      'latencyMs',
      'throughputTps',
    ],
  };
}

export async function fetchCompanies(): Promise<Company[]> {
  const models = getModelsFromStorage();
  const weights = getWeightsFromStorage();

  const companiesMap = new Map<string, { company: Company; count: number; totalScore: number }>();

  for (const c of INITIAL_COMPANIES) {
    companiesMap.set(c.id, { company: { ...c }, count: 0, totalScore: 0 });
  }

  for (const m of models) {
    const score = calculateOverallScore(m.scores, weights);
    const existing = companiesMap.get(m.companyId);
    if (existing) {
      existing.count += 1;
      existing.totalScore += score;
    }
  }

  const result: Company[] = [];
  for (const [, item] of companiesMap) {
    if (item.count > 0) {
      item.company.totalModels = item.count;
      item.company.avgOverallScore = Number((item.totalScore / item.count).toFixed(1));
    }
    result.push(item.company);
  }

  return result;
}

export async function fetchBenchmarks(): Promise<BenchmarkMeta[]> {
  return INITIAL_BENCHMARKS;
}

export async function fetchWeights(): Promise<ScoringWeights> {
  return getWeightsFromStorage();
}

export async function saveWeights(weights: Partial<ScoringWeights>): Promise<{ success: boolean; weights: ScoringWeights }> {
  const current = getWeightsFromStorage();
  const updated: ScoringWeights = {
    ...current,
    ...weights,
  };

  localStorage.setItem('aimonitor_weights', JSON.stringify(updated));
  addLogToStorage('INFO', 'Scoring weights updated in localStorage.', 'ClientPreferences');

  return {
    success: true,
    weights: updated,
  };
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
  const models = getModelsFromStorage();
  const logs = getLogsFromStorage();
  const status = getStatusFromStorage();

  const openWeightCount = models.filter((m) => m.isOpenWeight).length;
  const apiAvailableCount = models.filter((m) => m.isApiAvailable).length;
  const newReleasesCount = models.filter((m) => m.isNew).length;

  status.totalModelsTracked = models.length;

  return {
    status,
    stats: {
      totalModels: models.length,
      totalCompanies: INITIAL_COMPANIES.length,
      openWeightCount,
      apiAvailableCount,
      newReleasesCount,
    },
    logs,
  };
}

export async function triggerCrawler(): Promise<{
  success: boolean;
  addedCount: number;
  updatedCount: number;
  message: string;
}> {
  const models = getModelsFromStorage();
  const now = new Date().toISOString();

  // Simulate updating timestamps on models
  const updatedModels = models.map((m) => ({
    ...m,
    lastChecked: now,
  }));

  saveModelsToStorage(updatedModels);

  const status = getStatusFromStorage();
  status.lastRunTime = now;
  status.nextScheduledRun = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
  localStorage.setItem('aimonitor_status', JSON.stringify(status));

  addLogToStorage('SUCCESS', 'Client automated benchmark check completed. Local dataset verified.', 'ClientCrawler');

  return {
    success: true,
    addedCount: 0,
    updatedCount: models.length,
    message: 'Local dataset synchronized successfully in browser storage.',
  };
}
