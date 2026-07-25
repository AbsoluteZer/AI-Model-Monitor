import React from 'react';
import {
  X,
  Calendar,
  Layers,
  Cpu,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Check,
  Globe,
  FileText,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AIModel } from '../types.js';
import { useCompare } from '../context/CompareContext.js';

interface ModelDetailModalProps {
  model: AIModel | null;
  onClose: () => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({ model, onClose }) => {
  const { isComparing, toggleCompare } = useCompare();

  if (!model) return null;

  const comparing = isComparing(model.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-y-auto my-8 p-6 sm:p-8 space-y-8 text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-black text-sm">
              {model.scores.overall} Overall Score
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {model.companyName}
            </span>
            {model.isOpenWeight ? (
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Open Weight
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                Proprietary
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black">{model.name}</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Released on {model.releaseDate}</span>
                <span className="mx-2">•</span>
                <span>Source: {model.source}</span>
              </p>
            </div>

            <button
              onClick={() => toggleCompare(model.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors self-start sm:self-auto ${
                comparing
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {comparing ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
              <span>{comparing ? 'In Compare List' : 'Add to Compare'}</span>
            </button>
          </div>
        </div>

        {/* Overview Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
            Model Overview
          </h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            {model.description}
          </p>
        </div>

        {/* Verified Benchmark Scores Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified Public Leaderboard Benchmarks</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
            {model.benchmarks.arenaElo && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">LMSYS Arena ELO</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {model.benchmarks.arenaElo}
                </span>
              </div>
            )}
            {model.benchmarks.sweBenchVerified && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">SWE-bench Verified</span>
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {model.benchmarks.sweBenchVerified}%
                </span>
              </div>
            )}
            {model.benchmarks.humanEval && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">HumanEval Code</span>
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {model.benchmarks.humanEval}%
                </span>
              </div>
            )}
            {model.benchmarks.math500 && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">MATH-500</span>
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {model.benchmarks.math500}%
                </span>
              </div>
            )}
            {model.benchmarks.gpqaDiamond && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">GPQA Diamond</span>
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {model.benchmarks.gpqaDiamond}%
                </span>
              </div>
            )}
            {model.benchmarks.mmluPro && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">MMLU-Pro</span>
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {model.benchmarks.mmluPro}%
                </span>
              </div>
            )}
            {model.benchmarks.mmmu && model.benchmarks.mmmu > 0 && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">MMMU Multimodal</span>
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {model.benchmarks.mmmu}%
                </span>
              </div>
            )}
            {model.benchmarks.throughputTps && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 block font-medium">Throughput Speed</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {model.benchmarks.throughputTps} TPS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
            <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Key Strengths
            </h4>
            <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
              {model.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 space-y-2">
            <h4 className="font-bold text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> Trade-offs & Limitations
            </h4>
            <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
              {model.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Specifications Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
            API & Architecture Specifications
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-zinc-500 block font-medium">Context Window</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                {model.contextLength >= 1000 ? `${model.contextLength / 1000}M Tokens` : `${model.contextLength}K Tokens`}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block font-medium">Input Pricing</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                ${model.pricing.inputPerM.toFixed(2)} / 1M
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block font-medium">Output Pricing</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                ${model.pricing.outputPerM.toFixed(2)} / 1M
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block font-medium">Input / Output Modalities</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {model.inputTypes.join(', ')} &rarr; {model.outputTypes.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Historical Score Progression */}
        {model.performanceHistory && model.performanceHistory.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Historical Score Progression</span>
            </h3>

            <div className="h-40 w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={model.performanceHistory}>
                  <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 10 }} />
                  <YAxis domain={[80, 100]} stroke="#71717a" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Official External Links */}
        {model.links && (
          <div className="flex items-center gap-6 text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="font-bold text-zinc-500">Official Resources:</span>
            {model.links.website && (
              <a
                href={model.links.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
            {model.links.paper && (
              <a
                href={model.links.paper}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <FileText className="w-4 h-4" />
                <span>Paper</span>
              </a>
            )}
            {model.links.apiDocs && (
              <a
                href={model.links.apiDocs}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <BookOpen className="w-4 h-4" />
                <span>API Docs</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
