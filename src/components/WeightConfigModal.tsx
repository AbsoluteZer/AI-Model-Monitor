import React, { useEffect, useState } from 'react';
import { X, Sliders, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ScoringWeights } from '../types.js';
import { fetchWeights, saveWeights } from '../lib/api.js';

interface WeightConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeightsUpdated: () => void;
}

const PRESETS: { [key: string]: { label: string; weights: ScoringWeights } } = {
  balanced: {
    label: 'Balanced Default',
    weights: {
      reasoning: 20,
      coding: 20,
      mathematics: 15,
      vision: 10,
      instructionFollowing: 10,
      creativeWriting: 10,
      longContext: 5,
      speed: 5,
      costEfficiency: 5,
    },
  },
  codingHeavy: {
    label: 'Software Engineering Focus',
    weights: {
      reasoning: 15,
      coding: 40,
      mathematics: 10,
      vision: 5,
      instructionFollowing: 15,
      creativeWriting: 0,
      longContext: 5,
      speed: 5,
      costEfficiency: 5,
    },
  },
  mathResearch: {
    label: 'Math & PhD Science Focus',
    weights: {
      reasoning: 30,
      coding: 10,
      mathematics: 35,
      vision: 5,
      instructionFollowing: 5,
      creativeWriting: 0,
      longContext: 5,
      speed: 5,
      costEfficiency: 5,
    },
  },
  fastCost: {
    label: 'High Throughput & Budget Focus',
    weights: {
      reasoning: 10,
      coding: 10,
      mathematics: 5,
      vision: 5,
      instructionFollowing: 10,
      creativeWriting: 5,
      longContext: 10,
      speed: 25,
      costEfficiency: 20,
    },
  },
};

export const WeightConfigModal: React.FC<WeightConfigModalProps> = ({
  isOpen,
  onClose,
  onWeightsUpdated,
}) => {
  const [weights, setWeights] = useState<ScoringWeights>({
    reasoning: 20,
    coding: 20,
    mathematics: 15,
    vision: 10,
    instructionFollowing: 10,
    creativeWriting: 10,
    longContext: 5,
    speed: 5,
    costEfficiency: 5,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadWeights();
    }
  }, [isOpen]);

  const loadWeights = async () => {
    try {
      const data = await fetchWeights();
      setWeights(data);
    } catch (err) {
      console.error('Error loading weights:', err);
    }
  };

  if (!isOpen) return null;

  const totalWeight = Object.values(weights).reduce((acc: number, curr: number) => acc + curr, 0);

  const handleSliderChange = (key: keyof ScoringWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const applyPreset = (presetKey: string) => {
    if (PRESETS[presetKey]) {
      setWeights(PRESETS[presetKey].weights);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveWeights(weights);
      onWeightsUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving weights:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const weightKeys: { key: keyof ScoringWeights; label: string; icon: string }[] = [
    { key: 'reasoning', label: 'Reasoning & Logic', icon: '🧠' },
    { key: 'coding', label: 'Coding & Engineering', icon: '💻' },
    { key: 'mathematics', label: 'Mathematics', icon: '📐' },
    { key: 'vision', label: 'Vision & Multimodal', icon: '👁️' },
    { key: 'instructionFollowing', label: 'Instruction Following', icon: '🎯' },
    { key: 'creativeWriting', label: 'Creative Writing', icon: '✍️' },
    { key: 'longContext', label: 'Long Context Comprehension', icon: '📚' },
    { key: 'speed', label: 'Generation Speed (TTFT/TPS)', icon: '⚡' },
    { key: 'costEfficiency', label: 'Cost Efficiency', icon: '💰' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Configure Scoring Formula Weights</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Adjust relative criteria importances to recalculate Overall Rankings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
            Quick Presets
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors whitespace-nowrap"
              >
                {PRESETS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Sliders */}
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {weightKeys.map(({ key, label, icon }) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                  <span>{icon}</span>
                  <span>{label}</span>
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold font-mono">
                  {weights[key]}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={weights[key]}
                onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          ))}
        </div>

        {/* Total Weight Bar */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-zinc-700 dark:text-zinc-300 block">Total Active Weight Sum</span>
            <span className="text-zinc-500 text-[11px]">Normalized dynamically during evaluation</span>
          </div>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {totalWeight}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Recalculating...' : 'Apply Scoring Weights'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
