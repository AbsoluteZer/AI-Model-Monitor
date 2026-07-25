import React, { useEffect, useState } from 'react';
import {
  Columns3,
  X,
  Plus,
  Check,
  Zap,
  DollarSign,
  Cpu,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { AIModel } from '../types.js';
import { fetchComparison, fetchModels } from '../lib/api.js';
import { useCompare } from '../context/CompareContext.js';

const COLOR_PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export const CompareModels: React.FC = () => {
  const { selectedIds, removeModelFromCompare, addModelToCompare, clearCompare } = useCompare();

  const [comparedModels, setComparedModels] = useState<AIModel[]>([]);
  const [allAvailableModels, setAllAvailableModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadComparisonData();
    loadAllModelsList();
  }, [selectedIds]);

  const loadComparisonData = async () => {
    if (selectedIds.length === 0) {
      setComparedModels([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetchComparison(selectedIds);
      setComparedModels(res.models);
    } catch (err) {
      console.error('Error fetching comparison:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllModelsList = async () => {
    try {
      const res = await fetchModels({ limit: 50 });
      setAllAvailableModels(res.data);
    } catch (err) {
      console.error('Error fetching all models list:', err);
    }
  };

  // Build Radar Chart Data
  const radarMetrics = [
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'coding', label: 'Coding' },
    { key: 'mathematics', label: 'Mathematics' },
    { key: 'vision', label: 'Vision' },
    { key: 'agentTasks', label: 'Agent Tasks' },
    { key: 'longContext', label: 'Long Context' },
  ];

  const radarData = radarMetrics.map((m) => {
    const point: any = { subject: m.label };
    comparedModels.forEach((model) => {
      point[model.name] = model.scores[m.key as keyof typeof model.scores] || 0;
    });
    return point;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Columns3 className="w-6 h-6 text-indigo-500" />
            <span>AI Model Side-by-Side Comparison</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Compare benchmark scores, architectural specs, speed, and pricing across up to 4 models
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline self-start sm:self-auto"
          >
            Clear Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Model Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          Selected Models ({selectedIds.length}/4)
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {comparedModels.map((m, idx) => (
            <span
              key={m.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE[idx % 4] }} />
              <span>{m.name}</span>
              <button
                onClick={() => removeModelFromCompare(m.id)}
                className="hover:text-rose-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {selectedIds.length < 4 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addModelToCompare(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>
                + Add Model to Compare...
              </option>
              {allAvailableModels
                .filter((m) => !selectedIds.includes(m.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.companyName})
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {comparedModels.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <Columns3 className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            No Models Selected for Comparison
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Select models from the dropdown above or click the "Compare" button on any leaderboard or model card to build a side-by-side comparison.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Radar Chart Overlay */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Multi-Capability Radar Overview</span>
            </h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#3f3f46" />
                  <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#71717a" />
                  {comparedModels.map((model, idx) => (
                    <Radar
                      key={model.id}
                      name={model.name}
                      dataKey={model.name}
                      stroke={COLOR_PALETTE[idx % 4]}
                      fill={COLOR_PALETTE[idx % 4]}
                      fillOpacity={0.25}
                    />
                  ))}
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Matrix Comparison Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                    <th className="py-4 px-6 font-bold text-xs text-zinc-500 uppercase tracking-wider w-48">
                      Feature / Metric
                    </th>
                    {comparedModels.map((model, idx) => (
                      <th key={model.id} className="py-4 px-6 min-w-[200px]">
                        <div className="space-y-1">
                          <span
                            className="w-3 h-3 rounded-full inline-block mr-2"
                            style={{ backgroundColor: COLOR_PALETTE[idx % 4] }}
                          />
                          <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                            {model.name}
                          </span>
                          <p className="text-xs text-zinc-500 font-semibold">{model.companyName}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs">
                  
                  {/* Overall Score */}
                  <tr className="bg-indigo-50/50 dark:bg-indigo-950/20">
                    <td className="py-3.5 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                      Overall Score
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-black text-sm text-indigo-600 dark:text-indigo-400">
                        {model.scores.overall} / 100
                      </td>
                    ))}
                  </tr>

                  {/* Reasoning */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Reasoning Score
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                        {model.scores.reasoning}
                      </td>
                    ))}
                  </tr>

                  {/* Coding */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Coding Score
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                        {model.scores.coding}
                      </td>
                    ))}
                  </tr>

                  {/* Mathematics */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Mathematics
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                        {model.scores.mathematics}
                      </td>
                    ))}
                  </tr>

                  {/* Vision */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Vision / Multimodal
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                        {model.scores.vision > 0 ? `${model.scores.vision} / 100` : 'Text-Only'}
                      </td>
                    ))}
                  </tr>

                  {/* Latency / Speed */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Latency & Speed
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-medium text-zinc-800 dark:text-zinc-200">
                        {model.benchmarks.latencyMs}ms TTFT | {model.benchmarks.throughputTps} TPS
                      </td>
                    ))}
                  </tr>

                  {/* Context Window */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Context Window
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                        {model.contextLength >= 1000 ? `${model.contextLength / 1000}M Tokens` : `${model.contextLength}K Tokens`}
                      </td>
                    ))}
                  </tr>

                  {/* Pricing Input / Output */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Pricing (Input / Output per 1M)
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-mono text-zinc-900 dark:text-zinc-100">
                        ${model.pricing.inputPerM.toFixed(2)} / ${model.pricing.outputPerM.toFixed(2)}
                      </td>
                    ))}
                  </tr>

                  {/* API Available */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      API Available
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6">
                        {model.isApiAvailable ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Yes
                          </span>
                        ) : (
                          <span className="text-rose-500 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> No
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Open Source / Open Weights */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Open Weights
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-bold">
                        {model.isOpenWeight ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Open Weights
                          </span>
                        ) : (
                          <span className="text-zinc-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Proprietary
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Image Gen */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Native Image Gen
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-medium">
                        {model.hasImageGen ? 'Yes' : 'No'}
                      </td>
                    ))}
                  </tr>

                  {/* Voice */}
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-zinc-600 dark:text-zinc-300">
                      Native Voice I/O
                    </td>
                    {comparedModels.map((model) => (
                      <td key={model.id} className="py-3.5 px-6 font-medium">
                        {model.hasVoice ? 'Yes' : 'No'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
