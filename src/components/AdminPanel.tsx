import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  RotateCw,
  Clock,
  AlertCircle,
  Database,
  Terminal,
  Layers,
  CheckCircle2,
  XCircle,
  Cpu,
  Search,
  Zap,
} from 'lucide-react';
import { CrawlerStatus, CrawlerLog } from '../types.js';
import { fetchAdminCrawler, triggerCrawler } from '../lib/api.js';

export const AdminPanel: React.FC = () => {
  const [status, setStatus] = useState<CrawlerStatus | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<CrawlerLog[]>([]);
  const [logFilterLevel, setLogFilterLevel] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');

  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminCrawler();
      setStatus(data.status);
      setStats(data.stats);
      setLogs(data.logs);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualTrigger = async () => {
    setIsTriggering(true);
    setTriggerResult(null);
    try {
      const res = await triggerCrawler();
      setTriggerResult(res.message);
      await loadAdminData();
    } catch (err: any) {
      setTriggerResult(`Trigger failed: ${err.message}`);
    } finally {
      setIsTriggering(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilterLevel !== 'ALL' && log.level !== logFilterLevel) return false;
    if (logSearch && !log.message.toLowerCase().includes(logSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span>Automated Crawler & System Health Monitor</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
              Role-Free Public View
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time status of 24/7 automated background crawlers, live benchmark sync logs, and database health metrics
          </p>
        </div>

        <button
          disabled={isTriggering}
          onClick={handleManualTrigger}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-all self-start sm:self-auto"
        >
          <RotateCw className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
          <span>{isTriggering ? 'Crawling Leaderboards & AI Feeds...' : 'Refresh Benchmark Data Now'}</span>
        </button>
      </div>

      {triggerResult && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{triggerResult}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-32 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
          <div className="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Crawler Status */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Crawler Health Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-3 h-3 rounded-full ${
                    status?.status === 'RUNNING'
                      ? 'bg-amber-400 animate-ping'
                      : status?.status === 'SUCCESS' || status?.status === 'IDLE'
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                  }`}
                />
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {status?.status || 'IDLE'}
                </span>
              </div>
            </div>

            {/* Last Run Time */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Last Crawler Audit</span>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {status?.lastRunTime ? new Date(status.lastRunTime).toLocaleString() : 'N/A'}
              </p>
            </div>

            {/* Next Scheduled Run */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Next Auto-Scheduled Cycle</span>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {status?.nextScheduledRun ? new Date(status.nextScheduledRun).toLocaleTimeString() : 'In 3 Hours'}
              </p>
            </div>

            {/* Failed Sources */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Failed Sources</span>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {status?.failedSourcesCount || 0} Failed
              </p>
            </div>
          </div>

          {/* Database Statistics */}
          {stats && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-500" />
                <span>Database Index Statistics</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950">
                  <span className="text-zinc-500 block">Total Models</span>
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalModels}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950">
                  <span className="text-zinc-500 block">Companies & Labs</span>
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalCompanies}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950">
                  <span className="text-zinc-500 block">Open Weight Models</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.openWeightCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950">
                  <span className="text-zinc-500 block">API Available</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stats.apiAvailableCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Log Console */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Crawler Audit Logs ({filteredLogs.length})</span>
              </h2>

              {/* Log Filters */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <input
                  type="text"
                  placeholder="Filter log message..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none"
                />

                {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilterLevel(lvl)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      logFilterLevel === lvl
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Log Viewer Box */}
            <div className="p-4 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-xs max-h-96 overflow-y-auto space-y-2 border border-zinc-800">
              {filteredLogs.length === 0 ? (
                <p className="text-zinc-600 text-center py-4">No matching logs found.</p>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 border-b border-zinc-900/60 pb-1.5">
                    <span className="text-zinc-500 shrink-0">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span
                      className={`font-bold shrink-0 px-1.5 rounded text-[10px] ${
                        log.level === 'SUCCESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : log.level === 'WARN'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : log.level === 'ERROR'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-zinc-400 font-semibold shrink-0">[{log.source || 'Sys'}]:</span>
                    <span className="text-zinc-200 break-words">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
