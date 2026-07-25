import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Sparkles,
  Flame,
  Activity,
  Layers,
  Clock,
  ChevronRight,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  Check,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { AIModel, Company } from '../types.js';
import { fetchLatest, fetchRankings, fetchAdminCrawler, fetchCompanies } from '../lib/api.js';
import { useCompare } from '../context/CompareContext.js';

interface DashboardProps {
  onNavigateTab: (tab: string, category?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  const { isComparing, toggleCompare, openModelDetail } = useCompare();

  const [topModels, setTopModels] = useState<AIModel[]>([]);
  const [latestReleased, setLatestReleased] = useState<AIModel[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<AIModel[]>([]);
  const [trendingModels, setTrendingModels] = useState<AIModel[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState({
    totalModels: 8,
    totalCompanies: 8,
    lastUpdated: 'Just now',
    totalBenchmarks: 9,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [rankingsRes, latestRes, adminRes, companiesRes] = await Promise.all([
        fetchRankings('overall'),
        fetchLatest(),
        fetchAdminCrawler(),
        fetchCompanies(),
      ]);

      const top5 = rankingsRes.data.slice(0, 5).map((r) => r.model);
      setTopModels(top5);
      setLatestReleased(latestRes.latestReleased);
      setRecentlyUpdated(latestRes.recentlyUpdated);
      setTrendingModels(latestRes.trending);
      setCompanies(companiesRes);

      const lastRun = adminRes.status.lastRunTime
        ? new Date(adminRes.status.lastRunTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now';

      setStats({
        totalModels: adminRes.stats.totalModels,
        totalCompanies: adminRes.stats.totalCompanies,
        lastUpdated: lastRun,
        totalBenchmarks: 9,
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30';
    if (rank === 2) return 'bg-zinc-300 dark:bg-zinc-400 text-zinc-950 font-black shadow-md';
    if (rank === 3) return 'bg-amber-700 text-amber-100 font-bold';
    return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-24 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl md:col-span-2" />
          <div className="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Quick Statistics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total AI Models Tracked
            </p>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.totalModels}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              AI Companies & Labs
            </p>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.totalCompanies}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Public Benchmarks
            </p>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.totalBenchmarks}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Last Crawler Audit
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.lastUpdated}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TOP 5 AI MODELS OVERALL SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Top 5 AI Models Overall
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Dynamically calculated using weighted multi-criterion benchmark evaluation
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('rankings')}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View Full Leaderboards</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topModels.map((model, idx) => {
            const rank = idx + 1;
            const comparing = isComparing(model.id);
            return (
              <div
                key={model.id}
                className="relative group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center ${getRankBadge(rank)}`}>
                    #{rank}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                    {model.scores.overall} Score
                  </span>
                </div>

                {/* Model Title & Company */}
                <div className="space-y-1 mb-3">
                  <h3
                    onClick={() => openModelDetail(model)}
                    className="font-bold text-zinc-900 dark:text-zinc-100 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1"
                  >
                    {model.name}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {model.companyName}
                  </p>
                </div>

                {/* Micro Stats */}
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 mb-4 border-t border-b border-zinc-100 dark:border-zinc-800/60 py-2">
                  <div className="flex justify-between">
                    <span>Reasoning:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{model.scores.reasoning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coding:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{model.scores.coding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Context:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {model.contextLength >= 1000 ? `${model.contextLength / 1000}M` : `${model.contextLength}K`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModelDetail(model)}
                    className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => toggleCompare(model.id)}
                    className={`p-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                      comparing
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                    title={comparing ? 'Remove from Compare' : 'Add to Compare'}
                  >
                    {comparing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LATEST & TRENDING SECTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Latest Released AI Models (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Latest Released AI Models
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Automatically indexed frontier announcements and model versions
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('latest')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>All Releases</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {latestReleased.slice(0, 4).map((model) => (
              <div
                key={model.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                      {model.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-600 dark:text-zinc-300">
                      {model.companyName}
                    </span>
                    {model.isOpenWeight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                        Open Weight
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 font-medium">
                      Released {model.releaseDate}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {model.announcementSummary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openModelDetail(model)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Explore Model
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Models Sidebar (1 Column) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Trending AI Models
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Most searched and benchmarked this week
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            {trendingModels.slice(0, 5).map((model, idx) => (
              <div
                key={model.id}
                onClick={() => openModelDetail(model)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-zinc-400 dark:text-zinc-500 w-4">
                    0{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 hover:text-indigo-600">
                      {model.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {model.companyName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {model.scores.overall}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK CATEGORY LEADERBOARD PREVIEWS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Capability Benchmark Quick-View
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Jump directly to specific domain leaderboards
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'coding', name: 'Coding & Engineering', icon: '💻' },
            { id: 'reasoning', name: 'Logic & Reasoning', icon: '🧠' },
            { id: 'mathematics', name: 'Mathematics', icon: '📐' },
            { id: 'vision', name: 'Vision & OCR', icon: '👁️' },
            { id: 'speed', name: 'Generation Speed', icon: '⚡' },
            { id: 'costEfficiency', name: 'Cost Efficiency', icon: '💰' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigateTab('rankings', cat.id)}
              className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left space-y-2 group"
            >
              <div className="text-2xl">{cat.icon}</div>
              <div>
                <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </p>
                <p className="text-[10px] text-zinc-400">View Rankings &rarr;</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
