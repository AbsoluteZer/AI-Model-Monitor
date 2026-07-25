import React, { useEffect, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Filter,
  RotateCcw,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AIModel, Company, CapabilityCategory } from '../types.js';
import { fetchModels, fetchCompanies } from '../lib/api.js';
import { useCompare } from '../context/CompareContext.js';
import { CATEGORY_OPTIONS } from './Rankings.js';

interface DirectorySearchProps {
  initialQuery?: string;
}

export const DirectorySearch: React.FC<DirectorySearchProps> = ({ initialQuery = '' }) => {
  const { isComparing, toggleCompare, openModelDetail } = useCompare();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [isOpenWeightOnly, setIsOpenWeightOnly] = useState(false);
  const [isApiOnly, setIsApiOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minContext, setMinContext] = useState<number | ''>('');
  const [capability, setCapability] = useState<CapabilityCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'releaseDate' | 'context' | 'speed' | 'cost'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const [models, setModels] = useState<AIModel[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadSearchResults();
  }, [
    query,
    selectedCompany,
    isOpenWeightOnly,
    isApiOnly,
    maxPrice,
    minContext,
    capability,
    sortBy,
    sortOrder,
    page,
  ]);

  const loadCompanies = async () => {
    try {
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const loadSearchResults = async () => {
    setIsLoading(true);
    try {
      const res = await fetchModels({
        q: query,
        company: selectedCompany,
        isOpenWeight: isOpenWeightOnly ? true : undefined,
        isApiAvailable: isApiOnly ? true : undefined,
        maxPrice: typeof maxPrice === 'number' ? maxPrice : undefined,
        minContext: typeof minContext === 'number' ? minContext : undefined,
        capability: capability !== 'all' ? capability : undefined,
        sortBy,
        sortOrder,
        page,
        limit: 12,
      });

      setModels(res.data);
      setTotalPages(res.totalPages);
      setTotalRecords(res.total);
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCompany('all');
    setIsOpenWeightOnly(false);
    setIsApiOnly(false);
    setMaxPrice('');
    setMinContext('');
    setCapability('all');
    setSortBy('score');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Search className="w-6 h-6 text-indigo-500" />
          <span>AI Model Directory & Search Engine</span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Filter and discover frontier AI models by vendor, context length, capability, pricing, and license type
        </p>
      </div>

      {/* Main Search Controls Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-sm">
        
        {/* Search Input Line */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by model name, vendor, or key capability (e.g. 'Claude', 'Vision', '2M Context')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 text-sm font-medium bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Filter Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Company Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Company / Lab</label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none"
            >
              <option value="all">All Companies ({companies.length})</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Capability Category */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Capability Benchmark</label>
            <select
              value={capability}
              onChange={(e) => {
                setCapability(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Sort Metric</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none"
            >
              <option value="score">Benchmark Score</option>
              <option value="releaseDate">Release Date</option>
              <option value="context">Context Window</option>
              <option value="speed">Generation Speed</option>
              <option value="cost">Pricing (Cheapest First)</option>
            </select>
          </div>

          {/* Max Input Price */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Max Input Price ($/1M Tokens)</label>
            <input
              type="number"
              placeholder="e.g. 5.00"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value ? parseFloat(e.target.value) : '');
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Toggle Badges & Reset Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={isOpenWeightOnly}
                onChange={(e) => {
                  setIsOpenWeightOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Open Weight Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={isApiOnly}
                onChange={(e) => {
                  setIsApiOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>API Available Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500 font-medium">
              Found <strong className="text-zinc-900 dark:text-zinc-100">{totalRecords}</strong> matching models
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : models.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <Search className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">No AI Models Found</h3>
          <p className="text-xs text-zinc-500">Try adjusting your search query or relaxing your filter constraints.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const comparing = isComparing(model.id);

            return (
              <div
                key={model.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        onClick={() => openModelDetail(model)}
                        className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1"
                      >
                        {model.name}
                      </h3>
                      <p className="text-xs font-semibold text-zinc-500">{model.companyName}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs shrink-0">
                      {model.scores.overall} Score
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {model.description}
                  </p>
                </div>

                <div className="space-y-2 border-t border-b border-zinc-100 dark:border-zinc-800/80 py-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Context Window:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {model.contextLength >= 1000 ? `${model.contextLength / 1000}M Tokens` : `${model.contextLength}K Tokens`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500">Pricing (In / Out):</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200">
                      ${model.pricing.inputPerM.toFixed(2)} / ${model.pricing.outputPerM.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500">License:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {model.isOpenWeight ? 'Open Weight' : 'Proprietary'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModelDetail(model)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => toggleCompare(model.id)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                      comparing
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {comparing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <p className="text-xs text-zinc-500">
            Page <strong className="text-zinc-900 dark:text-zinc-100">{page}</strong> of{' '}
            <strong className="text-zinc-900 dark:text-zinc-100">{totalPages}</strong>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
