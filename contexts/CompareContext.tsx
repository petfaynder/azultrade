"use client"

import { createContext, useState, useContext, ReactNode } from 'react';
import type { Product } from '@/lib/database';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    setCompareList(prevList => {
      if (prevList.find(p => p.id === product.id)) {
        return prevList; // Already in list
      }
      if (prevList.length >= 4) {
        // Optional: Add a toast notification here to inform the user
        alert("You can compare a maximum of 4 products.");
        return prevList;
      }
      return [...prevList, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prevList => prevList.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};