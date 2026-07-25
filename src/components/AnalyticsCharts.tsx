import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { LineChart as LineChartIcon, Layers, Calendar, Trophy, Sparkles } from 'lucide-react';
import { AIModel, Company } from '../types.js';
import { fetchModels, fetchCompanies } from '../lib/api.js';

export const AnalyticsCharts: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [modelsRes, companiesRes] = await Promise.all([
        fetchModels({ limit: 50 }),
        fetchCompanies(),
      ]);
      setModels(modelsRes.data);
      setCompanies(companiesRes);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Performance Over Time Data
  const sortedByDate = [...models].sort(
    (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  );

  const performanceTimeData = sortedByDate.map((m) => ({
    name: m.name,
    releaseDate: m.releaseDate,
    overallScore: m.scores.overall,
    reasoning: m.scores.reasoning,
    coding: m.scores.coding,
    math: m.scores.mathematics,
  }));

  // 2. New Releases Per Month
  const monthlyReleasesMap: { [month: string]: number } = {};
  models.forEach((m) => {
    const monthKey = m.releaseDate.substring(0, 7); // YYYY-MM
    monthlyReleasesMap[monthKey] = (monthlyReleasesMap[monthKey] || 0) + 1;
  });

  const monthlyReleasesData = Object.keys(monthlyReleasesMap)
    .sort()
    .map((m) => ({
      month: m,
      releases: monthlyReleasesMap[m],
    }));

  // 3. Company Comparison Data
  const companyComparisonData = companies.map((c) => ({
    name: c.name,
    avgScore: c.avgOverallScore,
    modelsCount: c.totalModels,
  }));

  // 4. Benchmark Correlation: Reasoning vs SweBench Verified
  const benchmarkCorrelationData = models.map((m) => ({
    name: m.name,
    company: m.companyName,
    reasoningScore: m.scores.reasoning,
    sweBench: m.benchmarks.sweBenchVerified || 0,
    mmluPro: m.benchmarks.mmluPro || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <LineChartIcon className="w-6 h-6 text-indigo-500" />
          <span>Frontier AI Analytics & Trend Charts</span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Historical capability progression, release velocity, vendor benchmark averages, and correlation plots
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-72 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
            <div className="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Chart 1: Performance Over Time */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Frontier Capability Trajectory (Release Timeline)</span>
              </h2>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="releaseDate" stroke="#71717a" tick={{ fontSize: 11 }} />
                  <YAxis domain={[75, 100]} stroke="#71717a" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="overallScore" name="Overall Score" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="reasoning" name="Reasoning" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="coding" name="Coding" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 2: Company Average Benchmark Score */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
              <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Developer / Lab Average Overall Score</span>
              </h2>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 10 }} />
                    <YAxis domain={[80, 100]} stroke="#71717a" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="avgScore" name="Avg Score" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: New Releases Per Month */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
              <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Model Release Velocity (New Models / Month)</span>
              </h2>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReleasesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#71717a" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="releases" name="Releases" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 4: Benchmark Correlation Matrix */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span>SWE-bench Verified vs MMLU-Pro Comparison</span>
            </h2>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkCorrelationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#71717a" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Bar dataKey="sweBench" name="SWE-bench Verified (%)" fill="#ec4899" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="mmluPro" name="MMLU-Pro (%)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
