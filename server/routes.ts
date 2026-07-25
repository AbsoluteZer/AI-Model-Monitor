import { Router, Request, Response } from 'express';
import { db } from './db.js';
import { crawler } from './crawler.js';
import { CapabilityCategory, ScoringWeights } from '../src/types.js';

export const apiRouter = Router();

// GET /api/models - Search, filter, sort, paginate
apiRouter.get('/models', (req: Request, res: Response) => {
  try {
    let models = db.getModels();
    const query = (req.query.q as string || '').toLowerCase().trim();
    const companyId = req.query.company as string;
    const isOpenWeight = req.query.isOpenWeight === 'true';
    const isApiAvailable = req.query.isApiAvailable === 'true';
    const maxPriceInput = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : null;
    const minContext = req.query.minContext ? parseInt(req.query.minContext as string) : null;
    const capability = req.query.capability as CapabilityCategory;
    const sortBy = (req.query.sortBy as string) || 'score';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Filter by Search Query
    if (query) {
      models = models.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.companyName.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.keyFeatures.some((f) => f.toLowerCase().includes(query))
      );
    }

    // Filter by Company
    if (companyId && companyId !== 'all') {
      models = models.filter((m) => m.companyId === companyId);
    }

    // Filter by Open Weight
    if (req.query.isOpenWeight !== undefined) {
      models = models.filter((m) => m.isOpenWeight === isOpenWeight);
    }

    // Filter by API Available
    if (req.query.isApiAvailable !== undefined) {
      models = models.filter((m) => m.isApiAvailable === isApiAvailable);
    }

    // Filter by Price
    if (maxPriceInput !== null && !isNaN(maxPriceInput)) {
      models = models.filter((m) => m.pricing.inputPerM <= maxPriceInput);
    }

    // Filter by Context
    if (minContext !== null && !isNaN(minContext)) {
      models = models.filter((m) => m.contextLength >= minContext);
    }

    // Filter by Capability or Free Tier
    if (capability && capability === 'freeTier') {
      models = models.filter((m) => m.pricing.freeTier === true || m.pricing.inputPerM === 0 || m.isOpenWeight === true);
    }

    // Sort
    const customWeights = db.getWeights();
    models.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortBy === 'score') {
        valA = capability && capability !== 'overall' && capability !== 'freeTier' ? (a.scores[capability] || 0) : db.calculateOverallScore(a.scores, customWeights);
        valB = capability && capability !== 'overall' && capability !== 'freeTier' ? (b.scores[capability] || 0) : db.calculateOverallScore(b.scores, customWeights);
      } else if (sortBy === 'releaseDate') {
        valA = new Date(a.releaseDate).getTime();
        valB = new Date(b.releaseDate).getTime();
      } else if (sortBy === 'context') {
        valA = a.contextLength;
        valB = b.contextLength;
      } else if (sortBy === 'speed') {
        valA = a.benchmarks.throughputTps || 0;
        valB = b.benchmarks.throughputTps || 0;
      } else if (sortBy === 'cost') {
        valA = a.pricing.inputPerM;
        valB = b.pricing.inputPerM;
        // for cost, lower is better when asc
      }

      if (sortOrder === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    const total = models.length;
    const startIndex = (page - 1) * limit;
    const paginatedModels = models.slice(startIndex, startIndex + limit);

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: paginatedModels,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/models/:id - Get single model detail
apiRouter.get('/models/:id', (req: Request, res: Response) => {
  try {
    const model = db.getModelById(req.params.id);
    if (!model) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }
    const weights = db.getWeights();
    const ranked = db.getRankedModels(weights);
    const rankedMatch = ranked.find((r) => r.id === model.id);

    res.json({
      ...model,
      calculatedScore: rankedMatch ? rankedMatch.calculatedScore : model.scores.overall,
      overallRank: rankedMatch ? rankedMatch.rank : 1,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rankings - Get category or overall rankings
apiRouter.get('/rankings', (req: Request, res: Response) => {
  try {
    const category = (req.query.category as CapabilityCategory) || 'overall';
    const weights = db.getWeights();

    let allModels = db.getModels();
    if (category === 'freeTier') {
      allModels = allModels.filter((m) => m.pricing.freeTier === true || m.pricing.inputPerM === 0 || m.isOpenWeight === true);
    }

    let models = allModels.map((m) => {
      let score = m.scores.overall;
      if (category === 'overall' || category === 'freeTier') {
        score = db.calculateOverallScore(m.scores, weights);
      } else if (m.scores[category] !== undefined) {
        score = m.scores[category];
      }
      return {
        ...m,
        categoryScore: score,
      };
    });

    models.sort((a, b) => b.categoryScore - a.categoryScore);

    const ranked = models.map((m, idx) => ({
      rank: idx + 1,
      modelId: m.id,
      modelName: m.name,
      companyName: m.companyName,
      companyId: m.companyId,
      score: m.categoryScore,
      trend: m.trend,
      rankChange: m.rankChange,
      contextLength: m.contextLength,
      pricing: m.pricing,
      isOpenWeight: m.isOpenWeight,
      lastUpdated: m.lastUpdated,
      model: m,
    }));

    res.json({
      category,
      weights,
      total: ranked.length,
      data: ranked,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/latest - Get newly released or recently updated models
apiRouter.get('/latest', (req: Request, res: Response) => {
  try {
    const models = db.getModels();
    const latest = [...models].sort(
      (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );

    const recentlyUpdated = [...models].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );

    res.json({
      latestReleased: latest.slice(0, 6),
      recentlyUpdated: recentlyUpdated.slice(0, 6),
      trending: models.filter((m) => m.trendingRank).sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99)),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/compare - Compare multiple models by IDs
apiRouter.get('/compare', (req: Request, res: Response) => {
  try {
    const idsParam = req.query.ids as string;
    if (!idsParam) {
      res.json({ models: [] });
      return;
    }
    const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean);
    const models = ids.map((id) => db.getModelById(id)).filter(Boolean);

    res.json({
      models,
      comparisonMetrics: [
        'reasoning',
        'coding',
        'mathematics',
        'vision',
        'latencyMs',
        'throughputTps',
        'pricingInput',
        'pricingOutput',
        'contextWindow',
        'apiAvailable',
        'imageGeneration',
        'voice',
        'openSource',
      ],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/companies - Get company statistics
apiRouter.get('/companies', (req: Request, res: Response) => {
  try {
    const companies = db.getCompanies();
    res.json(companies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/benchmarks - Get benchmark definitions
apiRouter.get('/benchmarks', (req: Request, res: Response) => {
  try {
    const benchmarks = db.getBenchmarks();
    res.json(benchmarks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET & POST /api/weights - Custom weight scoring parameters
apiRouter.get('/weights', (req: Request, res: Response) => {
  res.json(db.getWeights());
});

apiRouter.post('/weights', (req: Request, res: Response) => {
  try {
    const newWeights = req.body as Partial<ScoringWeights>;
    const updated = db.updateWeights(newWeights);
    db.addLog('INFO', 'Scoring weights configuration updated by user.', 'Admin');
    res.json({ success: true, weights: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/admin/crawler - Get crawler status, stats, and logs
apiRouter.get('/admin/crawler', (req: Request, res: Response) => {
  try {
    const status = db.getCrawlerStatus();
    const logs = db.getLogs();
    const models = db.getModels();
    const companies = db.getCompanies();

    res.json({
      status,
      stats: {
        totalModels: models.length,
        totalCompanies: companies.length,
        openWeightCount: models.filter((m) => m.isOpenWeight).length,
        apiAvailableCount: models.filter((m) => m.isApiAvailable).length,
        newReleasesCount: models.filter((m) => m.isNew).length,
      },
      logs,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/crawler/trigger - Trigger manual run
apiRouter.post('/admin/crawler/trigger', async (req: Request, res: Response) => {
  try {
    const result = await crawler.runCrawler('Manual Admin Trigger');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
