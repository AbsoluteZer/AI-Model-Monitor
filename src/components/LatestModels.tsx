import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Calendar,
  Layers,
  DollarSign,
  ExternalLink,
  Code2,
  CheckCircle2,
  XCircle,
  Plus,
  Check,
  Globe,
  FileText,
  BookOpen,
} from 'lucide-react';
import { AIModel } from '../types.js';
import { fetchLatest } from '../lib/api.js';
import { useCompare } from '../context/CompareContext.js';

export const LatestModels: React.FC = () => {
  const { isComparing, toggleCompare, openModelDetail } = useCompare();
  const [latestList, setLatestList] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLatestData();
  }, []);

  const loadLatestData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchLatest();
      setLatestList(res.latestReleased);
    } catch (err) {
      console.error('Error fetching latest models:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <span>Latest Released AI Models</span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Automatically monitored model releases, frontier version updates, and official announcements
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {latestList.map((model) => {
            const comparing = isComparing(model.id);

            return (
              <div
                key={model.id}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 hover:border-indigo-500/40 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2
                        onClick={() => openModelDetail(model)}
                        className="text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                      >
                        {model.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {model.companyName}
                      </span>
                      {model.isNew && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-600 text-white">
                          NEW RELEASE
                        </span>
                      )}
                      {model.isOpenWeight ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                          Open Weight
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          Proprietary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Released on {model.releaseDate}</span>
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModelDetail(model)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                      View Full Details
                    </button>
                    <button
                      onClick={() => toggleCompare(model.id)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        comparing
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {comparing ? <Check className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4" />}
                      <span>{comparing ? 'In Compare' : 'Compare'}</span>
                    </button>
                  </div>
                </div>

                {/* Announcement Summary */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Official Announcement Summary
                  </p>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    "{model.announcementSummary}"
                  </p>
                </div>

                {/* Key Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Context Window</span>
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm">
                      {model.contextLength >= 1000 ? `${model.contextLength / 1000}M Tokens` : `${model.contextLength}K Tokens`}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Input / Output Types</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {model.inputTypes.join(', ')} &rarr; {model.outputTypes.join(', ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Pricing Tier</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      ${model.pricing.inputPerM.toFixed(2)} in / ${model.pricing.outputPerM.toFixed(2)} out (1M)
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block font-medium">API Access</span>
                    <span className="font-bold flex items-center gap-1 mt-0.5">
                      {model.isApiAvailable ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Available
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1 font-bold">
                          <XCircle className="w-4 h-4" /> Waitlist
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Key Features</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {model.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Links Footer */}
                {model.links && (
                  <div className="flex items-center gap-4 text-xs pt-2">
                    <span className="font-semibold text-zinc-500">Official Links:</span>
                    {model.links.website && (
                      <a
                        href={model.links.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}
                    {model.links.paper && (
                      <a
                        href={model.links.paper}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Paper</span>
                      </a>
                    )}
                    {model.links.apiDocs && (
                      <a
                        href={model.links.apiDocs}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>API Docs</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
