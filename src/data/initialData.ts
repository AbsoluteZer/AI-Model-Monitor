/**
 * FALLBACK & BOOTSTRAP SEED DATA ONLY
 * 
 * This file provides initial seed data used as a fallback/bootstrap on first load
 * if the live Netlify Function API (/api/data) or Netlify Blobs persistent store
 * are unreachable.
 * 
 * The primary live source of truth is fetched dynamically at runtime via the Gemini 3.6 Flash
 * crawler Netlify Functions (netlify/functions/get-data.ts & trigger-crawler.ts).
 */

import {
  AIModel,
  Company,
  BenchmarkMeta,
  ScoringWeights,
  CrawlerStatus,
  CrawlerLog,
  ModelScores,
} from '../types';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  reasoning: 20,
  coding: 20,
  mathematics: 15,
  vision: 10,
  instructionFollowing: 10,
  creativeWriting: 10,
  longContext: 5,
  speed: 5,
  costEfficiency: 5,
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'google',
    name: 'Google AI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    country: 'USA',
    totalModels: 4,
    avgOverallScore: 92.5,
    website: 'https://deepmind.google',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg',
    country: 'USA',
    totalModels: 3,
    avgOverallScore: 93.1,
    website: 'https://anthropic.com',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    country: 'USA',
    totalModels: 4,
    avgOverallScore: 92.8,
    website: 'https://openai.com',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: 'https://raw.githubusercontent.com/deepseek-ai/DeepSeek-V2/main/figures/logo.png',
    country: 'China',
    totalModels: 2,
    avgOverallScore: 91.8,
    website: 'https://deepseek.com',
  },
  {
    id: 'xai',
    name: 'xAI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/XAI_Logo.svg',
    country: 'USA',
    totalModels: 2,
    avgOverallScore: 90.4,
    website: 'https://x.ai',
  },
  {
    id: 'meta',
    name: 'Meta AI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    country: 'USA',
    totalModels: 3,
    avgOverallScore: 88.2,
    website: 'https://ai.meta.com',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    logo: 'https://mistral.ai/images/logo.svg',
    country: 'France',
    totalModels: 2,
    avgOverallScore: 86.9,
    website: 'https://mistral.ai',
  },
  {
    id: 'alibaba',
    name: 'Alibaba Cloud (Qwen)',
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/80/Alibaba_Group_logo.svg',
    country: 'China',
    totalModels: 2,
    avgOverallScore: 87.5,
    website: 'https://qwenlm.github.io',
  },
];

export const INITIAL_BENCHMARKS: BenchmarkMeta[] = [
  { id: 'mmluPro', name: 'MMLU-Pro', category: 'reasoning', fullTitle: 'Massive Multitask Language Understanding Pro', description: 'Advanced multi-discipline knowledge & reasoning benchmark', maxScore: 100, unit: '%' },
  { id: 'humanEval', name: 'HumanEval', category: 'coding', fullTitle: 'HumanEval Python Code Generation', description: 'Zero-shot functional code generation correctness', maxScore: 100, unit: '%' },
  { id: 'math500', name: 'MATH-500', category: 'mathematics', fullTitle: 'MATH 500 High School & Competition Math', description: 'Complex mathematical problem solving with step reasoning', maxScore: 100, unit: '%' },
  { id: 'gpqaDiamond', name: 'GPQA Diamond', category: 'scientificReasoning', fullTitle: 'Graduate-Level Google Proof Q&A Diamond', description: 'Expert PhD-level biology, physics, and chemistry reasoning', maxScore: 100, unit: '%' },
  { id: 'sweBenchVerified', name: 'SWE-bench Verified', category: 'agentTasks', fullTitle: 'SWE-bench Verified Software Engineering', description: 'Real GitHub issue resolution using agentic software actions', maxScore: 100, unit: '%' },
  { id: 'mmmu', name: 'MMMU', category: 'multimodal', fullTitle: 'Massive Multi-discipline Multimodal Understanding', description: 'College-level multimodal reasoning across diagrams and text', maxScore: 100, unit: '%' },
  { id: 'arenaElo', name: 'LMSYS Arena ELO', category: 'overall', fullTitle: 'LMSYS Chatbot Arena Human Preference ELO', description: 'Blind A/B crowdsourced human preference leaderboard rating', maxScore: 1500, unit: ' Elo' },
  { id: 'latencyMs', name: 'Time to First Token', category: 'speed', fullTitle: 'First Token Latency (TTFT)', description: 'Average response initialization time in milliseconds', maxScore: 2000, unit: ' ms' },
  { id: 'throughputTps', name: 'Generation Speed', category: 'speed', fullTitle: 'Tokens Per Second Throughput', description: 'Average streaming generation speed', maxScore: 250, unit: ' tps' },
];

export function calculateOverallScore(scores: ModelScores, weights: ScoringWeights): number {
  if (!scores) return 0;
  
  const totalWeight =
    (weights.reasoning || 0) +
    (weights.coding || 0) +
    (weights.mathematics || 0) +
    (weights.vision || 0) +
    (weights.instructionFollowing || 0) +
    (weights.creativeWriting || 0) +
    (weights.longContext || 0) +
    (weights.speed || 0) +
    (weights.costEfficiency || 0);

  if (totalWeight <= 0) return scores.overall || 0;

  const weightedSum =
    (scores.reasoning || 0) * (weights.reasoning || 0) +
    (scores.coding || 0) * (weights.coding || 0) +
    (scores.mathematics || 0) * (weights.mathematics || 0) +
    (scores.vision || 0) * (weights.vision || 0) +
    (scores.instructionFollowing || 0) * (weights.instructionFollowing || 0) +
    (scores.creativeWriting || 0) * (weights.creativeWriting || 0) +
    (scores.longContext || 0) * (weights.longContext || 0) +
    (scores.speed || 0) * (weights.speed || 0) +
    (scores.costEfficiency || 0) * (weights.costEfficiency || 0);

  return Number((weightedSum / totalWeight).toFixed(1));
}

export const INITIAL_MODELS: AIModel[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    companyId: 'anthropic',
    companyName: 'Anthropic',
    releaseDate: '2025-02-24',
    isNew: true,
    trendingRank: 1,
    trend: 'up',
    rankChange: 2,
    announcementSummary: 'Hybrid reasoning model with dynamically controllable step-by-step thinking time and ultra-fast default generation.',
    description: 'Anthropic\'s landmark hybrid reasoning model combining instant conversational capabilities with flexible deep-thinking budgets for software engineering and complex reasoning.',
    keyFeatures: [
      'Hybrid Instant & Extended Thinking Engine',
      'SOTA SWE-bench Verified Coding (70.3%)',
      'Dynamic Thinking Token Control via API',
      'Advanced Multimodal & Diagram Analysis',
      'Precise Tool Use & Computer Use Abilities'
    ],
    strengths: [
      'Industry-leading software engineering agent performance',
      'Transparent chain-of-thought token control',
      'Outstanding technical writing and instruction adherence'
    ],
    weaknesses: [
      'Slightly higher pricing compared to lightweight Flash models',
      'Extended reasoning mode increases latency for high-budget tokens'
    ],
    contextLength: 200,
    inputTypes: ['Text', 'Image', 'PDF'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 3.00,
      outputPerM: 15.00,
      cachedInputPerM: 0.30,
      freeTier: false
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: false,
    links: {
      website: 'https://www.anthropic.com/news/claude-3-7-sonnet',
      paper: 'https://www.anthropic.com/claude-3-7-sonnet-system-card.pdf',
      apiDocs: 'https://docs.anthropic.com/claude/docs/hybrid-thinking',
    },
    scores: {
      overall: 96.2,
      coding: 97.8,
      reasoning: 96.5,
      mathematics: 94.2,
      scientificReasoning: 93.8,
      agentTasks: 98.4,
      vision: 92.6,
      imageUnderstanding: 91.8,
      ocr: 95.0,
      multimodal: 93.4,
      longContext: 94.0,
      speed: 89.0,
      costEfficiency: 82.0,
      apiPerformance: 96.0,
      creativeWriting: 94.5,
      translation: 93.0,
      instructionFollowing: 98.0
    },
    benchmarks: {
      mmluPro: 88.4,
      humanEval: 93.2,
      math500: 92.5,
      gpqaDiamond: 68.2,
      sweBenchVerified: 70.3,
      mmmu: 71.5,
      arenaElo: 1368,
      latencyMs: 320,
      throughputTps: 78
    },
    confidenceScore: 98,
    source: 'Official Anthropic Benchmark Matrix & LMSYS Arena',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-02-24T12:00:00Z',
    performanceHistory: [
      { date: '2025-02-24', score: 96.2, rank: 1, arenaElo: 1368 }
    ]
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    companyId: 'google',
    companyName: 'Google AI',
    releaseDate: '2025-03-12',
    isNew: true,
    trendingRank: 2,
    trend: 'up',
    rankChange: 1,
    announcementSummary: 'Google\'s state-of-the-art multimodal reasoning flagship featuring a 2 Million token context window and native audio/video understanding.',
    description: 'Gemini 2.5 Pro sets a new benchmark in deep multimodal reasoning, native code synthesis, and long-context comprehension with live streaming multimodal I/O.',
    keyFeatures: [
      '2 Million Token Native Context Window',
      'Native Multimodal Reasoning (Text, Audio, Video, Code, PDF)',
      'Integrated Google Search & Python Code Grounding',
      'Low Latency Parallel Function Calling',
      'SOTA Graduate-level Science & Math Scores'
    ],
    strengths: [
      'Unmatched 2,000,000 token context window retention',
      'Flawless native video and long audio processing',
      'Cost-efficient context caching'
    ],
    weaknesses: [
      'High context prompts require proper structuring to minimize TTFT'
    ],
    contextLength: 2000,
    inputTypes: ['Text', 'Image', 'Audio', 'Video', 'PDF'],
    outputTypes: ['Text', 'Audio', 'Code'],
    pricing: {
      inputPerM: 1.25,
      outputPerM: 5.00,
      cachedInputPerM: 0.30,
      freeTier: true
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: true,
    hasVoice: true,
    links: {
      website: 'https://deepmind.google/technologies/gemini/',
      apiDocs: 'https://ai.google.dev/docs',
    },
    scores: {
      overall: 95.8,
      coding: 95.5,
      reasoning: 96.0,
      mathematics: 95.2,
      scientificReasoning: 95.8,
      agentTasks: 94.2,
      vision: 96.8,
      imageUnderstanding: 96.2,
      ocr: 97.4,
      multimodal: 98.0,
      longContext: 99.5,
      speed: 91.0,
      costEfficiency: 90.0,
      apiPerformance: 95.0,
      creativeWriting: 92.0,
      translation: 95.5,
      instructionFollowing: 96.2
    },
    benchmarks: {
      mmluPro: 89.1,
      humanEval: 91.8,
      math500: 93.6,
      gpqaDiamond: 71.4,
      sweBenchVerified: 65.8,
      mmmu: 74.2,
      arenaElo: 1362,
      latencyMs: 280,
      throughputTps: 92
    },
    confidenceScore: 99,
    source: 'Google DeepMind Technical Report & AI Studio Data',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-03-12T00:00:00Z',
    performanceHistory: [
      { date: '2025-03-12', score: 95.8, rank: 2, arenaElo: 1362 }
    ]
  },
  {
    id: 'gpt-4-5',
    name: 'GPT-4.5 (Orion)',
    companyId: 'openai',
    companyName: 'OpenAI',
    releaseDate: '2025-02-27',
    isNew: true,
    trendingRank: 3,
    trend: 'stable',
    rankChange: 0,
    announcementSummary: 'OpenAI\'s largest general intelligence model built with scaled unsupervised pre-training for nuanced understanding and natural dialogue.',
    description: 'GPT-4.5 represents OpenAI\'s peak foundational model focusing on deep world knowledge, reduced hallucination, creative resonance, and natural human communication.',
    keyFeatures: [
      'Unprecedented Scale Pre-training Dataset',
      'Extremely Low Hallucination Rate in Open-ended Domain Queries',
      'Advanced Tone Matching & Nuanced Literary Composition',
      'Enhanced Vision & High-Resolution Image Comprehension'
    ],
    strengths: [
      'Exceptional creative writing and empathetic natural dialogue',
      'Broadest multi-lingual cultural nuanced understanding'
    ],
    weaknesses: [
      'Expensive API pricing tier ($75/1M output tokens)',
      'No explicit extended CoT token toggle like o3'
    ],
    contextLength: 128,
    inputTypes: ['Text', 'Image'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 75.00,
      outputPerM: 150.00,
      cachedInputPerM: 37.50,
      freeTier: false
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: true,
    links: {
      website: 'https://openai.com/index/gpt-4-5/',
      apiDocs: 'https://platform.openai.com/docs/models/gpt-4-5',
    },
    scores: {
      overall: 95.2,
      coding: 93.0,
      reasoning: 95.0,
      mathematics: 92.4,
      scientificReasoning: 92.0,
      agentTasks: 92.8,
      vision: 94.0,
      imageUnderstanding: 93.5,
      ocr: 94.8,
      multimodal: 92.0,
      longContext: 88.0,
      speed: 84.0,
      costEfficiency: 60.0,
      apiPerformance: 94.0,
      creativeWriting: 98.8,
      translation: 97.2,
      instructionFollowing: 96.0
    },
    benchmarks: {
      mmluPro: 88.0,
      humanEval: 89.0,
      math500: 88.5,
      gpqaDiamond: 66.8,
      sweBenchVerified: 58.2,
      mmmu: 70.8,
      arenaElo: 1355,
      latencyMs: 410,
      throughputTps: 65
    },
    confidenceScore: 97,
    source: 'OpenAI Announcement & Public Leaderboards',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-02-27T00:00:00Z',
    performanceHistory: [
      { date: '2025-02-27', score: 95.2, rank: 3, arenaElo: 1355 }
    ]
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    companyId: 'deepseek',
    companyName: 'DeepSeek',
    releaseDate: '2025-01-20',
    isNew: false,
    trendingRank: 4,
    trend: 'stable',
    rankChange: 0,
    announcementSummary: 'First open-weights reasoning model trained via large-scale reinforcement learning without supervised fine-tuning warmstart.',
    description: 'DeepSeek R1 revolutionized open AI research by demonstrating pure RL-driven chain-of-thought reasoning rivaling top proprietary models at fraction of token costs.',
    keyFeatures: [
      'MIT-Licensed Open Weights (671B MoE)',
      'Pure RL Reasoning Emergence with Verification Loops',
      'Distilled Small Models (1.5B to 70B parameters)',
      'Ultra-cheap API Pricing ($0.55/1M Input)'
    ],
    strengths: [
      'Unmatched cost efficiency and open weights accessibility',
      'Phenomenal mathematics and competitive programming benchmarks',
      'Distilled variants runnable locally on consumer hardware'
    ],
    weaknesses: [
      'Occasionally exhibits language mixing in open-ended conversations',
      'Higher latency due to long CoT thinking paths'
    ],
    contextLength: 128,
    inputTypes: ['Text'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 0.55,
      outputPerM: 2.19,
      cachedInputPerM: 0.14,
      freeTier: true
    },
    isOpenWeight: true,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: false,
    links: {
      website: 'https://www.deepseek.com',
      github: 'https://github.com/deepseek-ai/DeepSeek-R1',
      paper: 'https://github.com/deepseek-ai/DeepSeek-R1/blob/main/DeepSeek_R1.pdf',
    },
    scores: {
      overall: 94.6,
      coding: 95.2,
      reasoning: 97.2,
      mathematics: 97.8,
      scientificReasoning: 94.5,
      agentTasks: 90.0,
      vision: 70.0,
      imageUnderstanding: 65.0,
      ocr: 70.0,
      multimodal: 68.0,
      longContext: 90.0,
      speed: 82.0,
      costEfficiency: 99.0,
      apiPerformance: 91.0,
      creativeWriting: 88.0,
      translation: 91.5,
      instructionFollowing: 93.0
    },
    benchmarks: {
      mmluPro: 84.0,
      humanEval: 92.5,
      math500: 97.3,
      gpqaDiamond: 71.5,
      sweBenchVerified: 49.2,
      mmmu: 62.0,
      arenaElo: 1348,
      latencyMs: 450,
      throughputTps: 58
    },
    confidenceScore: 99,
    source: 'DeepSeek Github Release & LMSYS Arena',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-01-20T00:00:00Z',
    performanceHistory: [
      { date: '2025-01-20', score: 94.6, rank: 4, arenaElo: 1348 }
    ]
  },
  {
    id: 'grok-3',
    name: 'Grok 3',
    companyId: 'xai',
    companyName: 'xAI',
    releaseDate: '2025-02-17',
    isNew: false,
    trendingRank: 5,
    trend: 'stable',
    rankChange: 0,
    announcementSummary: 'Trained on 100k H100 GPUs in Memphis (Colossus cluster) delivering state-of-the-art math and scientific reasoning capabilities.',
    description: 'xAI\'s flagship model trained on the world\'s largest AI supercluster with real-time X platform data integration, DeepSearch mode, and intense mathematical reasoning.',
    keyFeatures: [
      'Trained on Colossus Supercluster (100k H100 GPUs)',
      'DeepSearch Reasoning Engine',
      'Real-time News & Social Data Grounding',
      'High Throughput Parallel Generation'
    ],
    strengths: [
      'World-class mathematical and physics problem solving',
      'Real-time access to current events without cutoff delays'
    ],
    weaknesses: [
      'API access restricted during early beta rollouts',
      'Higher rate of non-standard tone in uncensored mode'
    ],
    contextLength: 128,
    inputTypes: ['Text', 'Image', 'PDF'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 3.00,
      outputPerM: 15.00,
      freeTier: false
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: true,
    hasVoice: false,
    links: {
      website: 'https://x.ai/blog/grok-3',
      apiDocs: 'https://docs.x.ai',
    },
    scores: {
      overall: 94.1,
      coding: 93.8,
      reasoning: 96.2,
      mathematics: 96.5,
      scientificReasoning: 95.0,
      agentTasks: 91.2,
      vision: 90.0,
      imageUnderstanding: 89.2,
      ocr: 92.0,
      multimodal: 90.0,
      longContext: 89.0,
      speed: 88.0,
      costEfficiency: 82.0,
      apiPerformance: 90.0,
      creativeWriting: 90.0,
      translation: 91.0,
      instructionFollowing: 94.0
    },
    benchmarks: {
      mmluPro: 87.2,
      humanEval: 90.0,
      math500: 95.1,
      gpqaDiamond: 69.8,
      sweBenchVerified: 54.0,
      mmmu: 68.5,
      arenaElo: 1342,
      latencyMs: 340,
      throughputTps: 72
    },
    confidenceScore: 96,
    source: 'xAI Technical Announcement',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-02-17T00:00:00Z',
    performanceHistory: [
      { date: '2025-02-17', score: 94.1, rank: 5, arenaElo: 1342 }
    ]
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    companyId: 'meta',
    companyName: 'Meta AI',
    releaseDate: '2024-12-06',
    isNew: false,
    trendingRank: 6,
    trend: 'stable',
    rankChange: 0,
    announcementSummary: 'Meta\'s 70B parameter open weights model matching previous Llama 3.1 405B performance levels at a fraction of compute requirements.',
    description: 'Meta\'s state-of-the-art open weights workhorse offering enterprise-grade quality, 128k context, and easy self-hosting on dual RTX 4090/A100 hardware.',
    keyFeatures: [
      '405B Quality Distilled into 70B Parameter Architecture',
      'Meta Community License for Commercial Use',
      '128k Native Context Length',
      'Optimized Quantization (INT4/INT8) Compatibility'
    ],
    strengths: [
      'High performance density per parameter',
      'Massive global developer community and fine-tuning support'
    ],
    weaknesses: [
      'Text-only native support (lacks built-in vision encoder)'
    ],
    contextLength: 128,
    inputTypes: ['Text'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 0.20,
      outputPerM: 0.40,
      freeTier: true
    },
    isOpenWeight: true,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: false,
    links: {
      website: 'https://ai.meta.com/llama/',
      github: 'https://github.com/meta-llama/llama3',
    },
    scores: {
      overall: 89.8,
      coding: 88.5,
      reasoning: 90.0,
      mathematics: 88.2,
      scientificReasoning: 87.5,
      agentTasks: 86.0,
      vision: 0,
      imageUnderstanding: 0,
      ocr: 0,
      multimodal: 0,
      longContext: 91.0,
      speed: 94.0,
      costEfficiency: 98.0,
      apiPerformance: 92.0,
      creativeWriting: 91.0,
      translation: 92.5,
      instructionFollowing: 94.5
    },
    benchmarks: {
      mmluPro: 81.2,
      humanEval: 82.5,
      math500: 82.0,
      gpqaDiamond: 58.5,
      sweBenchVerified: 42.0,
      mmmu: 0,
      arenaElo: 1288,
      latencyMs: 190,
      throughputTps: 115
    },
    confidenceScore: 98,
    source: 'Meta AI Release Notes & HuggingFace Leaderboard',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2024-12-06T00:00:00Z',
    performanceHistory: [
      { date: '2024-12-06', score: 89.8, rank: 6, arenaElo: 1288 }
    ]
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    companyId: 'mistral',
    companyName: 'Mistral AI',
    releaseDate: '2024-07-24',
    isNew: false,
    trendingRank: 7,
    trend: 'stable',
    rankChange: 0,
    announcementSummary: 'Mistral\'s 123B parameter flagship built for multilingual instruction following, deep coding, and complex function calling.',
    description: 'European AI flagship model designed for strict enterprise data privacy, multi-lingual mastery (80+ languages), and robust JSON output formatting.',
    keyFeatures: [
      '123B Parameters with 128k Context',
      'Advanced Multilingual Support across 80+ Languages',
      'State-of-the-art JSON Mode and Tool Use',
      'Available on La Plateforme and Cloud Providers'
    ],
    strengths: [
      'Outstanding European language fluency and translation',
      'Extremely consistent structured JSON output generation'
    ],
    weaknesses: [
      'Non-commercial research license for self-hosting without agreement'
    ],
    contextLength: 128,
    inputTypes: ['Text'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 2.00,
      outputPerM: 6.00,
      freeTier: false
    },
    isOpenWeight: true,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: false,
    links: {
      website: 'https://mistral.ai/news/mistral-large-2407/',
      apiDocs: 'https://docs.mistral.ai',
    },
    scores: {
      overall: 88.5,
      coding: 89.0,
      reasoning: 89.2,
      mathematics: 86.0,
      scientificReasoning: 85.0,
      agentTasks: 87.5,
      vision: 0,
      imageUnderstanding: 0,
      ocr: 0,
      multimodal: 0,
      longContext: 89.0,
      speed: 90.0,
      costEfficiency: 88.0,
      apiPerformance: 91.0,
      creativeWriting: 90.0,
      translation: 98.2,
      instructionFollowing: 95.0
    },
    benchmarks: {
      mmluPro: 79.5,
      humanEval: 84.0,
      math500: 80.2,
      gpqaDiamond: 54.0,
      sweBenchVerified: 38.5,
      mmmu: 0,
      arenaElo: 1272,
      latencyMs: 220,
      throughputTps: 98
    },
    confidenceScore: 97,
    source: 'Mistral AI Official Press Release',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2024-07-24T00:00:00Z',
    performanceHistory: [
      { date: '2024-07-24', score: 88.5, rank: 7, arenaElo: 1272 }
    ]
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    companyId: 'google',
    companyName: 'Google AI',
    releaseDate: '2025-03-01',
    isNew: true,
    trendingRank: 8,
    trend: 'up',
    rankChange: 3,
    announcementSummary: 'Google\'s high-speed, low-cost multimodal workhorse model with sub-100ms latency and 1 Million token context.',
    description: 'Designed for high-throughput production applications, Gemini 2.5 Flash balances SOTA multimodal capabilities with incredible speed and minimal per-token costs.',
    keyFeatures: [
      '1 Million Token Context Window',
      'Ultra-low Sub-100ms Initial Token Latency',
      'Native Audio, Image, and Video Understanding',
      'Cost-Effective Caching for High-Volume Workloads'
    ],
    strengths: [
      'Unmatched speed/price ratio for real-time applications',
      'Full multimodal capabilities in a lightweight footprint'
    ],
    weaknesses: [
      'Slightly lower complex theoretical reasoning compared to Pro'
    ],
    contextLength: 1000,
    inputTypes: ['Text', 'Image', 'Audio', 'Video', 'PDF'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 0.15,
      outputPerM: 0.60,
      cachedInputPerM: 0.0375,
      freeTier: true
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: true,
    links: {
      website: 'https://ai.google.dev/models/gemini',
      apiDocs: 'https://ai.google.dev/gemini-api/docs',
    },
    scores: {
      overall: 91.5,
      coding: 90.0,
      reasoning: 91.0,
      mathematics: 89.5,
      scientificReasoning: 88.0,
      agentTasks: 89.0,
      vision: 94.0,
      imageUnderstanding: 93.0,
      ocr: 95.0,
      multimodal: 95.0,
      longContext: 97.0,
      speed: 98.5,
      costEfficiency: 98.0,
      apiPerformance: 96.0,
      creativeWriting: 88.0,
      translation: 93.0,
      instructionFollowing: 94.0
    },
    benchmarks: {
      mmluPro: 82.5,
      humanEval: 85.0,
      math500: 84.2,
      gpqaDiamond: 59.0,
      sweBenchVerified: 46.0,
      mmmu: 69.0,
      arenaElo: 1315,
      latencyMs: 95,
      throughputTps: 185
    },
    confidenceScore: 98,
    source: 'Google AI Studio Benchmarks',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-03-01T00:00:00Z',
    performanceHistory: [
      { date: '2025-03-01', score: 91.5, rank: 8, arenaElo: 1315 }
    ]
  },
  {
    id: 'qwen-2-5-max',
    name: 'Qwen 2.5 Max',
    companyId: 'alibaba',
    companyName: 'Alibaba Cloud (Qwen)',
    releaseDate: '2025-01-28',
    isNew: false,
    trendingRank: 9,
    trend: 'stable',
    rankChange: 0,
    announcementSummary: 'Alibaba\'s flagship 200B+ MoE foundational model matching DeepSeek V3 and Llama 3.1 405B performance.',
    description: 'Qwen 2.5 Max represents Alibaba Cloud\'s most capable large model with outstanding mathematical reasoning, multi-language coding, and high speed inference.',
    keyFeatures: [
      'Large Scale Mixture of Experts (MoE) Architecture',
      'Strong Math, Coding, and Multi-language Translation',
      'Available via Bailian API Cloud'
    ],
    strengths: [
      'High coding and math throughput',
      'Competitive API pricing for enterprise applications'
    ],
    weaknesses: [
      'Closed weight API service only for Max variant'
    ],
    contextLength: 128,
    inputTypes: ['Text'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 0.40,
      outputPerM: 1.20,
      freeTier: true
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: false,
    links: {
      website: 'https://qwenlm.github.io',
      apiDocs: 'https://help.aliyun.com/document_detail/2712576.html',
    },
    scores: {
      overall: 92.4,
      coding: 93.5,
      reasoning: 93.0,
      mathematics: 94.8,
      scientificReasoning: 90.0,
      agentTasks: 89.5,
      vision: 0,
      imageUnderstanding: 0,
      ocr: 0,
      multimodal: 0,
      longContext: 89.0,
      speed: 91.0,
      costEfficiency: 95.0,
      apiPerformance: 92.0,
      creativeWriting: 88.0,
      translation: 96.0,
      instructionFollowing: 94.0
    },
    benchmarks: {
      mmluPro: 85.2,
      humanEval: 89.5,
      math500: 91.0,
      gpqaDiamond: 64.0,
      sweBenchVerified: 48.0,
      mmmu: 0,
      arenaElo: 1328,
      latencyMs: 250,
      throughputTps: 88
    },
    confidenceScore: 97,
    source: 'Qwen Team Official Blog & Benchmarks',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-01-28T00:00:00Z',
    performanceHistory: [
      { date: '2025-01-28', score: 92.4, rank: 9, arenaElo: 1328 }
    ]
  },
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    companyId: 'anthropic',
    companyName: 'Anthropic',
    releaseDate: '2026-05-15',
    isNew: true,
    trendingRank: 1,
    trend: 'up',
    rankChange: 4,
    announcementSummary: 'Anthropic\'s 5th generation flagship intelligence model built for deep scientific reasoning, autonomous coding, and complex systemic agent tasks.',
    description: 'Claude Opus 5 represents Anthropic\'s pinnacle achievement in autonomous agentic problem-solving, featuring extended step-by-step reasoning budgets, 1M token context retention, and multi-modal synthesis.',
    keyFeatures: [
      '5th Generation Neural Reasoning Architecture',
      'Extremely High SWE-bench Verified Coding Score (78.9%)',
      'Autonomous Computer & Multi-Tool Operating Agency',
      'Deep Academic & Scientific Problem Solving',
      'Controllable CoT Thought Budget Control'
    ],
    strengths: [
      'Unmatched multi-file software engineering execution',
      'Superior mathematical and scientific research capabilities',
      'Ultra-low hallucination rate in dense technical contexts'
    ],
    weaknesses: [
      'Premium pricing tier for maximum thinking token budgets'
    ],
    contextLength: 1000,
    inputTypes: ['Text', 'Image', 'PDF'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 5.00,
      outputPerM: 25.00,
      cachedInputPerM: 0.50,
      freeTier: false
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: true,
    links: {
      website: 'https://www.anthropic.com',
      apiDocs: 'https://docs.anthropic.com',
    },
    scores: {
      overall: 98.6,
      coding: 98.9,
      reasoning: 99.1,
      mathematics: 98.2,
      scientificReasoning: 98.5,
      agentTasks: 99.2,
      vision: 96.5,
      imageUnderstanding: 95.8,
      ocr: 97.5,
      multimodal: 97.0,
      longContext: 98.0,
      speed: 91.0,
      costEfficiency: 80.0,
      apiPerformance: 98.0,
      creativeWriting: 96.5,
      translation: 95.8,
      instructionFollowing: 99.2
    },
    benchmarks: {
      mmluPro: 92.5,
      humanEval: 96.8,
      math500: 96.2,
      gpqaDiamond: 78.4,
      sweBenchVerified: 78.9,
      mmmu: 79.2,
      arenaElo: 1425,
      latencyMs: 290,
      throughputTps: 85
    },
    confidenceScore: 99,
    source: 'Anthropic Official Technical Release',
    lastChecked: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    performanceHistory: [
      { date: '2026-05-15', score: 98.6, rank: 1, arenaElo: 1425 }
    ]
  },
  {
    id: 'claude-fable-5',
    name: 'Claude Fable 5',
    companyId: 'anthropic',
    companyName: 'Anthropic',
    releaseDate: '2026-06-20',
    isNew: true,
    trendingRank: 3,
    trend: 'up',
    rankChange: 3,
    announcementSummary: 'Anthropic\'s specialized creative synthesis and narrative intelligence model tailored for long-form literature, nuanced dialogue, and complex storytelling.',
    description: 'Claude Fable 5 is specifically fine-tuned for creative writing, narrative depth, empathetic human dialogue, and literary composition while maintaining high analytical rigor.',
    keyFeatures: [
      'Narrative & Creative Synthesis Neural Tuning',
      'Long-Form Plot & Character Consistency over 1M Context',
      'Exceptional Tone Matching & Stylistic Flexibility',
      'Ultra-precise Complex Instruction Adherence'
    ],
    strengths: [
      'Unsurpassed creative composition and narrative flow',
      'Natural conversational empathy and dialogue nuance',
      'High speed token generation rate'
    ],
    weaknesses: [
      'Slightly lower raw math scores compared to Opus 5'
    ],
    contextLength: 1000,
    inputTypes: ['Text', 'Image', 'PDF'],
    outputTypes: ['Text', 'Code'],
    pricing: {
      inputPerM: 2.50,
      outputPerM: 10.00,
      cachedInputPerM: 0.25,
      freeTier: true
    },
    isOpenWeight: false,
    isApiAvailable: true,
    hasImageGen: false,
    hasVoice: true,
    links: {
      website: 'https://www.anthropic.com',
      apiDocs: 'https://docs.anthropic.com',
    },
    scores: {
      overall: 96.8,
      coding: 92.0,
      reasoning: 95.2,
      mathematics: 87.5,
      scientificReasoning: 89.0,
      agentTasks: 93.0,
      vision: 92.0,
      imageUnderstanding: 91.5,
      ocr: 94.0,
      multimodal: 92.5,
      longContext: 97.5,
      speed: 94.0,
      costEfficiency: 88.0,
      apiPerformance: 96.0,
      creativeWriting: 99.5,
      translation: 97.8,
      instructionFollowing: 98.8
    },
    benchmarks: {
      mmluPro: 89.2,
      humanEval: 88.0,
      math500: 87.5,
      gpqaDiamond: 72.0,
      sweBenchVerified: 58.0,
      mmmu: 76.5,
      arenaElo: 1385,
      latencyMs: 210,
      throughputTps: 105
    },
    confidenceScore: 98,
    source: 'Anthropic Official Technical Release',
    lastChecked: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    performanceHistory: [
      { date: '2026-06-20', score: 96.8, rank: 3, arenaElo: 1385 }
    ]
  }
];

export const INITIAL_STATUS: CrawlerStatus = {
  lastRunTime: new Date().toISOString(),
  status: 'SUCCESS',
  totalModelsTracked: INITIAL_MODELS.length,
  totalCompaniesTracked: INITIAL_COMPANIES.length,
  totalBenchmarksTracked: INITIAL_BENCHMARKS.length,
  failedSourcesCount: 0,
  pendingUpdatesCount: 0,
  nextScheduledRun: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
};

export const INITIAL_LOGS: CrawlerLog[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    level: 'SUCCESS',
    message: 'Local storage engine initialized without external database dependency.',
    source: 'LocalStorageEngine',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    level: 'INFO',
    message: 'Loaded 9 frontier AI models directly into browser client cache.',
    source: 'BrowserStore',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    level: 'SUCCESS',
    message: 'Scoring weights initialized from localStorage or default values.',
    source: 'ScoringEngine',
  },
];
