import { getStore } from '@netlify/blobs';
import {
  AIModel,
  CrawlerStatus,
  CrawlerLog,
  ScoringWeights,
  Company,
  BenchmarkMeta,
} from '../../../src/types';

import {
  INITIAL_MODELS,
  INITIAL_STATUS,
  INITIAL_LOGS,
  DEFAULT_WEIGHTS,
  INITIAL_COMPANIES,
  INITIAL_BENCHMARKS,
} from '../../../src/data/initialData';

export interface StoredDataset {
  models: AIModel[];
  status: CrawlerStatus;
  logs: CrawlerLog[];
  weights: ScoringWeights;
  companies: Company[];
  benchmarks: BenchmarkMeta[];
  lastFetchedFromGemini?: string;
  sourceType: 'LIVE_GEMINI' | 'CACHED_STORAGE' | 'FALLBACK_BOOTSTRAP';
}

// In-memory fallback for local dev when Blobs context is unavailable
let memoryDataset: StoredDataset | null = null;

function getInitialDataset(): StoredDataset {
  return {
    models: INITIAL_MODELS,
    status: INITIAL_STATUS,
    logs: INITIAL_LOGS,
    weights: DEFAULT_WEIGHTS,
    companies: INITIAL_COMPANIES,
    benchmarks: INITIAL_BENCHMARKS,
    sourceType: 'FALLBACK_BOOTSTRAP',
  };
}

export async function getDataset(): Promise<StoredDataset> {
  try {
    const store = getStore({ name: 'aimonitor', consistency: 'strong' });
    const data = (await store.get('dataset', { type: 'json' })) as StoredDataset | null;
    if (data && data.models && Array.isArray(data.models) && data.models.length > 0) {
      memoryDataset = data;
      return data;
    }
  } catch (err: any) {
    console.warn('Netlify Blobs READ failed:', err?.name, err?.message || err);
  }

  if (memoryDataset) {
    return memoryDataset;
  }

  memoryDataset = getInitialDataset();
  return memoryDataset;
}

export async function saveDataset(dataset: StoredDataset): Promise<void> {
  memoryDataset = dataset;
  try {
    const store = getStore({ name: 'aimonitor', consistency: 'strong' });
    await store.setJSON('dataset', dataset);
  } catch (err: any) {
    console.warn('Netlify Blobs WRITE failed:', err?.name, err?.message || err);
  }
}
