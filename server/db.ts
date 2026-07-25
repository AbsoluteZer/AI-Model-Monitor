import fs from 'fs';
import path from 'path';
import {
  AIModel,
  Company,
  ScoringWeights,
  CrawlerStatus,
  CrawlerLog,
  BenchmarkMeta,
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ai_models_db.json');

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
    contextLength: 200, // 200k
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
    contextLength: 2000, // 2M
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
    contextLength: 1000, // 1M
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
      arenaElo: 1310,
      latencyMs: 120,
      throughputTps: 180
    },
    confidenceScore: 99,
    source: 'Google AI Studio & Benchmark Benchmark Database',
    lastChecked: new Date().toISOString(),
    lastUpdated: '2025-03-01T00:00:00Z',
    performanceHistory: [
      { date: '2025-03-01', score: 91.5, rank: 8, arenaElo: 1310 }
    ]
  }
];

export interface DatabaseSchema {
  models: AIModel[];
  companies: Company[];
  benchmarks: BenchmarkMeta[];
  weights: ScoringWeights;
  status: CrawlerStatus;
  logs: CrawlerLog[];
}

export class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadFromFile();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadFromFile(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          models: parsed.models || INITIAL_MODELS,
          companies: parsed.companies || INITIAL_COMPANIES,
          benchmarks: parsed.benchmarks || INITIAL_BENCHMARKS,
          weights: parsed.weights || DEFAULT_WEIGHTS,
          status: parsed.status || {
            lastRunTime: new Date().toISOString(),
            status: 'IDLE',
            totalModelsTracked: (parsed.models || INITIAL_MODELS).length,
            totalCompaniesTracked: (parsed.companies || INITIAL_COMPANIES).length,
            totalBenchmarksTracked: (parsed.benchmarks || INITIAL_BENCHMARKS).length,
            failedSourcesCount: 0,
            pendingUpdatesCount: 0,
            nextScheduledRun: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
          },
          logs: parsed.logs || [
            {
              id: 'init-1',
              timestamp: new Date().toISOString(),
              level: 'INFO',
              message: 'Database initialized with 8 state-of-the-art AI models and benchmark matrix.',
              source: 'System'
            }
          ]
        };
      }
    } catch (err) {
      console.error('Failed to read db file, initializing default:', err);
    }

    const defaultData: DatabaseSchema = {
      models: INITIAL_MODELS,
      companies: INITIAL_COMPANIES,
      benchmarks: INITIAL_BENCHMARKS,
      weights: DEFAULT_WEIGHTS,
      status: {
        lastRunTime: new Date().toISOString(),
        status: 'IDLE',
        totalModelsTracked: INITIAL_MODELS.length,
        totalCompaniesTracked: INITIAL_COMPANIES.length,
        totalBenchmarksTracked: INITIAL_BENCHMARKS.length,
        failedSourcesCount: 0,
        pendingUpdatesCount: 0,
        nextScheduledRun: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      },
      logs: [
        {
          id: 'init-0',
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: 'Initialized new database store.',
          source: 'System'
        }
      ]
    };
    this.saveToFile(defaultData);
    return defaultData;
  }

  public saveToFile(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  // --- MODEL QUERIES ---
  public getModels(): AIModel[] {
    return this.data.models;
  }

  public getModelById(id: string): AIModel | undefined {
    return this.data.models.find((m) => m.id === id);
  }

  public addOrUpdateModel(model: AIModel): void {
    const existingIdx = this.data.models.findIndex((m) => m.id === model.id);
    if (existingIdx >= 0) {
      // Append performance history point
      const existing = this.data.models[existingIdx];
      const today = new Date().toISOString().split('T')[0];
      const history = existing.performanceHistory || [];
      if (!history.some((h) => h.date === today)) {
        history.push({
          date: today,
          score: model.scores.overall,
          rank: 0,
          arenaElo: model.benchmarks.arenaElo,
        });
      }
      this.data.models[existingIdx] = {
        ...model,
        performanceHistory: history,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      model.performanceHistory = [
        {
          date: new Date().toISOString().split('T')[0],
          score: model.scores.overall,
          rank: 0,
          arenaElo: model.benchmarks.arenaElo,
        },
      ];
      this.data.models.push(model);
    }

    this.recalculateStats();
    this.saveToFile();
  }

  // --- WEIGHTED RANKING ENGINE ---
  public calculateOverallScore(scores: AIModel['scores'], weights: ScoringWeights): number {
    const totalWeight =
      weights.reasoning +
      weights.coding +
      weights.mathematics +
      weights.vision +
      weights.instructionFollowing +
      weights.creativeWriting +
      weights.longContext +
      weights.speed +
      weights.costEfficiency;

    if (totalWeight === 0) return 0;

    const weightedSum =
      (scores.reasoning * weights.reasoning) +
      (scores.coding * weights.coding) +
      (scores.mathematics * weights.mathematics) +
      (scores.vision * weights.vision) +
      (scores.instructionFollowing * weights.instructionFollowing) +
      (scores.creativeWriting * weights.creativeWriting) +
      (scores.longContext * weights.longContext) +
      (scores.speed * weights.speed) +
      (scores.costEfficiency * weights.costEfficiency);

    return Number((weightedSum / totalWeight).toFixed(1));
  }

  public getRankedModels(customWeights?: ScoringWeights): (AIModel & { calculatedScore: number; rank: number })[] {
    const weights = customWeights || this.data.weights;
    const ranked = this.data.models.map((model) => {
      const calculatedScore = this.calculateOverallScore(model.scores, weights);
      return {
        ...model,
        calculatedScore,
        rank: 0,
      };
    });

    ranked.sort((a, b) => b.calculatedScore - a.calculatedScore);

    ranked.forEach((m, idx) => {
      m.rank = idx + 1;
    });

    return ranked;
  }

  // --- WEIGHTS ---
  public getWeights(): ScoringWeights {
    return this.data.weights;
  }

  public updateWeights(newWeights: Partial<ScoringWeights>): ScoringWeights {
    this.data.weights = {
      ...this.data.weights,
      ...newWeights,
    };
    this.saveToFile();
    return this.data.weights;
  }

  // --- COMPANIES ---
  public getCompanies(): Company[] {
    return this.data.companies;
  }

  // --- BENCHMARKS ---
  public getBenchmarks(): BenchmarkMeta[] {
    return this.data.benchmarks;
  }

  // --- CRAWLER & LOGS ---
  public getCrawlerStatus(): CrawlerStatus {
    return this.data.status;
  }

  public updateCrawlerStatus(updates: Partial<CrawlerStatus>): void {
    this.data.status = { ...this.data.status, ...updates };
    this.saveToFile();
  }

  public addLog(level: CrawlerLog['level'], message: string, source: string = 'Crawler'): void {
    const log: CrawlerLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
    };
    this.data.logs.unshift(log);
    // keep max 100 logs
    if (this.data.logs.length > 100) {
      this.data.logs = this.data.logs.slice(0, 100);
    }
    this.saveToFile();
  }

  public getLogs(): CrawlerLog[] {
    return this.data.logs;
  }

  private recalculateStats() {
    this.data.status.totalModelsTracked = this.data.models.length;
    this.data.status.totalCompaniesTracked = this.data.companies.length;
    this.data.status.totalBenchmarksTracked = this.data.benchmarks.length;

    // recalculate company model counts & avg score
    this.data.companies.forEach((comp) => {
      const compModels = this.data.models.filter((m) => m.companyId === comp.id);
      comp.totalModels = compModels.length;
      if (compModels.length > 0) {
        const sum = compModels.reduce((acc, m) => acc + m.scores.overall, 0);
        comp.avgOverallScore = Number((sum / compModels.length).toFixed(1));
      }
    });
  }
}

export const db = new DatabaseService();
