import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Sliders,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Check,
  Zap,
  Info,
  ChevronDown,
} from 'lucide-react';
import { CapabilityCategory, AIModel } from '../types.js';
import { fetchRankings } from '../lib/api.js';
import { useCompare } from '../context/CompareContext.js';

interface RankingsProps {
  initialCategory?: CapabilityCategory;
  onOpenWeightsModal: () => void;
}

export const CATEGORY_OPTIONS: { id: CapabilityCategory; label: string; icon: string }[] = [
  { id: 'overall', label: 'Overall Score', icon: '🏆' },
  { id: 'freeTier', label: 'Free Tier Available', icon: '🎁' },
  { id: 'coding', label: 'Coding', icon: '💻' },
  { id: 'reasoning', label: 'Reasoning', icon: '🧠' },
  { id: 'mathematics', label: 'Mathematics', icon: '📐' },
  { id: 'scientificReasoning', label: 'Scientific Reasoning', icon: '🔬' },
  { id: 'agentTasks', label: 'Agent Tasks', icon: '🤖' },
  { id: 'vision', label: 'Vision', icon: '👁️' },
  { id: 'imageUnderstanding', label: 'Image Understanding', icon: '🖼️' },
  { id: 'ocr', label: 'OCR', icon: '📄' },
  { id: 'multimodal', label: 'Multimodal', icon: '🎨' },
  { id: 'longContext', label: 'Long Context', icon: '📚' },
  { id: 'speed', label: 'Speed (TTFT/TPS)', icon: '⚡' },
  { id: 'costEfficiency', label: 'Cost Efficiency', icon: '💰' },
  { id: 'apiPerformance', label: 'API Performance', icon: '🔌' },
  { id: 'creativeWriting', label: 'Creative Writing', icon: '✍️' },
  { id: 'translation', label: 'Translation', icon: '🌐' },
  { id: 'instructionFollowing', label: 'Instruction Following', icon: '🎯' },
];

export const Rankings: React.FC<RankingsProps> = ({
  initialCategory = 'overall',
  onOpenWeightsModal,
}) => {
  const { isComparing, toggleCompare, openModelDetail } = useCompare();

  const [selectedCategory, setSelectedCategory] = useState<CapabilityCategory>(initialCategory);
  const [rankedData, setRankedData] = useState<any[]>([]);
  const [weights, setWeights] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRankings(selectedCategory);
  }, [selectedCategory]);

  const loadRankings = async (category: CapabilityCategory) => {
    setIsLoading(true);
    try {
      const res = await fetchRankings(category);
      setRankedData(res.data);
      setWeights(res.weights);
    } catch (err) {
      console.error('Error fetching rankings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCategoryInfo = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>{currentCategoryInfo?.icon}</span>
              <span>{currentCategoryInfo?.label} Leaderboard</span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {selectedCategory === 'overall'
                ? 'Weighted aggregate calculated across 9 frontier benchmarks.'
                : selectedCategory === 'freeTier'
                ? 'Frontier AI models featuring a zero-cost API free tier, web playground, or open weight downloads.'
                : `Verified evaluations ranked specifically for ${currentCategoryInfo?.label.toLowerCase()}.`}
            </p>
          </div>

          {selectedCategory === 'overall' && (
            <button
              onClick={onOpenWeightsModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md transition-all self-start md:self-auto"
            >
              <Sliders className="w-4 h-4" />
              <span>Configure Formula Weights</span>
            </button>
          )}
        </div>

        {/* Category Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">AI Model</th>
                  <th className="py-3.5 px-4">Developer</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4 text-center">Trend</th>
                  <th className="py-3.5 px-4">Context</th>
                  <th className="py-3.5 px-4">Pricing (In/Out 1M)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                {rankedData.map((item) => {
                  const model: AIModel = item.model;
                  const comparing = isComparing(model.id);

                  return (
                    <tr
                      key={model.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                            item.rank === 1
                              ? 'bg-amber-500 text-zinc-950 shadow-sm'
                              : item.rank === 2
                              ? 'bg-zinc-300 dark:bg-zinc-500 text-zinc-950'
                              : item.rank === 3
                              ? 'bg-amber-700 text-amber-100'
                              : 'text-zinc-500 dark:text-zinc-400 font-semibold'
                          }`}
                        >
                          {item.rank}
                        </span>
                      </td>

                      {/* Model Name & Badges */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => openModelDetail(model)}
                              className="font-bold text-zinc-900 dark:text-zinc-100 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                            >
                              {model.name}
                            </span>
                            {model.isNew && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500 text-white">
                                NEW
                              </span>
                            )}
                            {model.pricing.freeTier && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-0.5">
                                🎁 Free Tier
                              </span>
                            )}
                            {model.isOpenWeight && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                                Open
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {model.announcementSummary}
                          </p>
                        </div>
                      </td>

                      {/* Developer */}
                      <td className="py-4 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                        {model.companyName}
                      </td>

                      {/* Score Gauge */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-black text-sm border border-indigo-200 dark:border-indigo-900">
                          {item.score}
                        </span>
                      </td>

                      {/* Trend Badge */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {model.trend === 'up' && (
                            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                              +{model.rankChange || 1}
                            </span>
                          )}
                          {model.trend === 'down' && (
                            <span className="flex items-center text-rose-500 font-bold text-xs">
                              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                              -{model.rankChange || 1}
                            </span>
                          )}
                          {(model.trend === 'stable' || model.trend === 'new') && (
                            <span className="flex items-center text-zinc-400 font-medium text-xs">
                              <Minus className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Context Window */}
                      <td className="py-4 px-4 font-medium text-zinc-600 dark:text-zinc-300">
                        {model.contextLength >= 1000
                          ? `${model.contextLength / 1000}M Tokens`
                          : `${model.contextLength}K Tokens`}
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                          ${model.pricing.inputPerM.toFixed(2)} / ${model.pricing.outputPerM.toFixed(2)}
                        </div>
                        {model.pricing.freeTier ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                            Free Tier Available
                          </span>
                        ) : model.isOpenWeight ? (
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">
                            Free Open Weight
                          </span>
                        ) : null}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModelDetail(model)}
                            className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => toggleCompare(model.id)}
                            className={`p-1.5 rounded-lg border text-[11px] font-bold ${
                              comparing
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                          >
                            {comparing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
