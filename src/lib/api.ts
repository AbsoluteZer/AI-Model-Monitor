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

export interface StoredDataset {
  models: AIModel[];
  status: CrawlerStatus;
  logs: CrawlerLog[];
  weights: ScoringWeights;
  companies: Company[];
  benchmarks: BenchmarkMeta[];
  lastFetchedFromGemini?: string;
  sourceType?: 'LIVE_GEMINI' | 'CACHED_STORAGE' | 'FALLBACK_BOOTSTRAP';
}

// Client-side cache memory & helpers
let cachedDatasetMemory: StoredDataset | null = null;

function saveDatasetToLocalStorage(dataset: StoredDataset): void {
  try {
    localStorage.setItem('aimonitor_dataset_v2', JSON.stringify(dataset));
    localStorage.setItem('aimonitor_models', JSON.stringify(dataset.models));
    localStorage.setItem('aimonitor_status', JSON.stringify(dataset.status));
    localStorage.setItem('aimonitor_logs', JSON.stringify(dataset.logs));
    localStorage.setItem('aimonitor_weights', JSON.stringify(dataset.weights));
  } catch (e) {
    console.warn('Failed to save dataset to localStorage', e);
  }
}

function loadDatasetFromLocalStorage(): StoredDataset | null {
  try {
    const raw = localStorage.getItem('aimonitor_dataset_v2');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse aimonitor_dataset_v2 from localStorage', e);
  }
  return null;
}

function getFallbackDataset(): StoredDataset {
  return {
    models: INITIAL_MODELS,
    status: INITIAL_STATUS,
    logs: [
      {
        id: 'fallback-log-' + Date.now(),
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message: 'Live API server unreachable. Displaying fallback dataset.',
        source: 'ClientFallback',
      },
      ...INITIAL_LOGS,
    ],
    weights: DEFAULT_WEIGHTS,
    companies: INITIAL_COMPANIES,
    benchmarks: INITIAL_BENCHMARKS,
    sourceType: 'FALLBACK_BOOTSTRAP',
  };
}

/**
 * Source of truth fetcher: Queries the live Netlify Function / API endpoint first,
 * updating client localStorage cache. Falls back to localStorage or static initialData.
 */
export async function fetchLiveData(): Promise<StoredDataset> {
  try {
    const res = await fetch('/api/data', { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const liveData: StoredDataset = await res.json();
      if (liveData && liveData.models && Array.isArray(liveData.models)) {
        cachedDatasetMemory = liveData;
        saveDatasetToLocalStorage(liveData);
        return liveData;
      }
    }
  } catch (err) {
    console.warn('/api/data unreachable, checking localStorage cache...', err);
  }

  // Check localStorage cache
  const localCache = loadDatasetFromLocalStorage();
  if (localCache) {
    cachedDatasetMemory = localCache;
    return localCache;
  }

  // Bootstrap fallback
  const fallback = getFallbackDataset();
  cachedDatasetMemory = fallback;
  return fallback;
}

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
  const dataset = await fetchLiveData();
  let models = [...dataset.models];
  const weights = dataset.weights || DEFAULT_WEIGHTS;

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
      valA =
        params.capability && params.capability !== 'overall' && params.capability !== 'freeTier'
          ? a.scores[params.capability] || 0
          : calculateOverallScore(a.scores, weights);
      valB =
        params.capability && params.capability !== 'overall' && params.capability !== 'freeTier'
          ? b.scores[params.capability] || 0
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
  const dataset = await fetchLiveData();
  const weights = dataset.weights || DEFAULT_WEIGHTS;

  const sortedModels = [...dataset.models].sort(
    (a, b) => calculateOverallScore(b.scores, weights) - calculateOverallScore(a.scores, weights)
  );
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
  const dataset = await fetchLiveData();
  let allModels = [...dataset.models];
  const weights = dataset.weights || DEFAULT_WEIGHTS;

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
  const dataset = await fetchLiveData();
  const models = dataset.models;

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
  const dataset = await fetchLiveData();
  const models = dataset.models.filter((m) => ids.includes(m.id));

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
  const dataset = await fetchLiveData();
  const models = dataset.models;
  const weights = dataset.weights || DEFAULT_WEIGHTS;

  const companiesMap = new Map<string, { company: Company; count: number; totalScore: number }>();

  const baseCompanies = dataset.companies && dataset.companies.length > 0 ? dataset.companies : INITIAL_COMPANIES;
  for (const c of baseCompanies) {
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
  const dataset = await fetchLiveData();
  return dataset.benchmarks && dataset.benchmarks.length > 0 ? dataset.benchmarks : INITIAL_BENCHMARKS;
}

export async function fetchWeights(): Promise<ScoringWeights> {
  const dataset = await fetchLiveData();
  return dataset.weights || DEFAULT_WEIGHTS;
}

export async function saveWeights(weights: Partial<ScoringWeights>): Promise<{ success: boolean; weights: ScoringWeights }> {
  try {
    const res = await fetch('/api/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weights),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.weights) {
        if (cachedDatasetMemory) {
          cachedDatasetMemory.weights = data.weights;
          saveDatasetToLocalStorage(cachedDatasetMemory);
        }
        return { success: true, weights: data.weights };
      }
    }
  } catch (err) {
    console.warn('/api/weights update failed, applying locally:', err);
  }

  const currentDataset = await fetchLiveData();
  const updatedWeights: ScoringWeights = {
    ...currentDataset.weights,
    ...weights,
  };

  currentDataset.weights = updatedWeights;
  saveDatasetToLocalStorage(currentDataset);

  return {
    success: true,
    weights: updatedWeights,
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
  const dataset = await fetchLiveData();
  const models = dataset.models;
  const logs = dataset.logs || [];
  const status = dataset.status || INITIAL_STATUS;

  const openWeightCount = models.filter((m) => m.isOpenWeight).length;
  const apiAvailableCount = models.filter((m) => m.isApiAvailable).length;
  const newReleasesCount = models.filter((m) => m.isNew).length;

  status.totalModelsTracked = models.length;

  return {
    status,
    stats: {
      totalModels: models.length,
      totalCompanies: dataset.companies?.length || INITIAL_COMPANIES.length,
      openWeightCount,
      apiAvailableCount,
      newReleasesCount,
    },
    logs,
  };
}

/**
 * Trigger real crawler execution on Netlify Function / Backend server,
 * updating Netlify Blobs and syncing fresh Gemini benchmark data to client.
 */
export async function triggerCrawler(): Promise<{
  success: boolean;
  addedCount: number;
  updatedCount: number;
  message: string;
}> {
  try {
    const res = await fetch('/api/trigger?source=AdminUI', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      if (data.dataset) {
        cachedDatasetMemory = data.dataset;
        saveDatasetToLocalStorage(data.dataset);
      } else {
        await fetchLiveData();
      }
      return {
        success: data.success ?? true,
        addedCount: data.addedCount ?? 0,
        updatedCount: data.updatedCount ?? 0,
        message: data.message || 'Crawl completed successfully via Netlify Function.',
      };
    }
  } catch (err: any) {
    console.warn('Real crawler trigger call failed, falling back:', err);
  }

  // Local fallback if API is unreachable
  const current = await fetchLiveData();
  const now = new Date().toISOString();
  current.status.lastRunTime = now;
  current.status.status = 'SUCCESS';
  current.logs.unshift({
    id: 'log-' + Date.now(),
    timestamp: now,
    level: 'WARN',
    message: 'Triggered offline crawler fallback.',
    source: 'ClientLocal',
  });
  saveDatasetToLocalStorage(current);

  return {
    success: true,
    addedCount: 0,
    updatedCount: current.models.length,
    message: 'Local dataset refreshed.',
  };
}
