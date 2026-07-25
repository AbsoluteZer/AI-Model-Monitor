import React, { createContext, useContext, useState } from 'react';
import { AIModel } from '../types.js';

interface CompareContextType {
  selectedIds: string[];
  addModelToCompare: (id: string) => void;
  removeModelFromCompare: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
  selectedModelDetail: AIModel | null;
  openModelDetail: (model: AIModel) => void;
  closeModelDetail: () => void;
}

const CompareContext = createContext<CompareContextType>({
  selectedIds: [],
  addModelToCompare: () => {},
  removeModelFromCompare: () => {},
  toggleCompare: () => {},
  clearCompare: () => {},
  isComparing: () => false,
  selectedModelDetail: null,
  openModelDetail: () => {},
  closeModelDetail: () => {},
});

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['claude-3-7-sonnet', 'gemini-2-5-pro', 'gpt-4-5']);
  const [selectedModelDetail, setSelectedModelDetail] = useState<AIModel | null>(null);

  const addModelToCompare = (id: string) => {
    if (selectedIds.length >= 4) {
      alert('You can compare up to 4 models at a time.');
      return;
    }
    if (!selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const removeModelFromCompare = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const toggleCompare = (id: string) => {
    if (selectedIds.includes(id)) {
      removeModelFromCompare(id);
    } else {
      addModelToCompare(id);
    }
  };

  const clearCompare = () => {
    setSelectedIds([]);
  };

  const isComparing = (id: string) => selectedIds.includes(id);

  const openModelDetail = (model: AIModel) => {
    setSelectedModelDetail(model);
  };

  const closeModelDetail = () => {
    setSelectedModelDetail(null);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        addModelToCompare,
        removeModelFromCompare,
        toggleCompare,
        clearCompare,
        isComparing,
        selectedModelDetail,
        openModelDetail,
        closeModelDetail,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
