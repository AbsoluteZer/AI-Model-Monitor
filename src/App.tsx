import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.js';
import { CompareProvider, useCompare } from './context/CompareContext.js';
import { Header } from './components/Header.js';
import { Dashboard } from './components/Dashboard.js';
import { Rankings } from './components/Rankings.js';
import { LatestModels } from './components/LatestModels.js';
import { CompareModels } from './components/CompareModels.js';
import { DirectorySearch } from './components/DirectorySearch.js';
import { AnalyticsCharts } from './components/AnalyticsCharts.js';
import { AdminPanel } from './components/AdminPanel.js';
import { ModelDetailModal } from './components/ModelDetailModal.js';
import { WeightConfigModal } from './components/WeightConfigModal.js';
import { CapabilityCategory } from './types.js';

function AppContent() {
  const { selectedModelDetail, closeModelDetail } = useCompare();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [initialCategory, setInitialCategory] = useState<CapabilityCategory>('overall');
  const [quickQuery, setQuickQuery] = useState<string>('');
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);
  const [rankingsKey, setRankingsKey] = useState(Date.now());

  const handleNavigateTab = (tab: string, category?: string) => {
    setActiveTab(tab);
    if (category) {
      setInitialCategory(category as CapabilityCategory);
    }
  };

  const handleQuickSearch = (query: string) => {
    setQuickQuery(query);
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      
      {/* Sticky App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
        onQuickSearch={handleQuickSearch}
      />

      {/* Main View Container */}
      <main className="pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigateTab={handleNavigateTab} />
        )}

        {activeTab === 'rankings' && (
          <Rankings
            key={rankingsKey}
            initialCategory={initialCategory}
            onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
          />
        )}

        {activeTab === 'latest' && <LatestModels />}

        {activeTab === 'compare' && <CompareModels />}

        {activeTab === 'search' && <DirectorySearch initialQuery={quickQuery} />}

        {activeTab === 'analytics' && <AnalyticsCharts />}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* App Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-8 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AI Model Monitor. Automated Leaderboard & Benchmark Intelligence.</p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Powered by Gemini AI Studio Engine</span>
            <span>•</span>
            <button onClick={() => setActiveTab('admin')} className="hover:underline">
              Crawler Admin Panel
            </button>
          </div>
        </div>
      </footer>

      {/* Model Detail Modal Overlay */}
      <ModelDetailModal model={selectedModelDetail} onClose={closeModelDetail} />

      {/* Weight Scoring Configuration Modal */}
      <WeightConfigModal
        isOpen={isWeightsModalOpen}
        onClose={() => setIsWeightsModalOpen(false)}
        onWeightsUpdated={() => setRankingsKey(Date.now())}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CompareProvider>
        <AppContent />
      </CompareProvider>
    </ThemeProvider>
  );
}
