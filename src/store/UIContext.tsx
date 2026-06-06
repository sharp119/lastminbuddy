import React, { createContext, useContext, useState, ReactNode } from 'react';

type ActiveUnit = number | 'dashboard';

interface UIState {
  activeUnit: ActiveUnit;
  setActiveUnit: (u: ActiveUnit) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}

const UIContext = createContext<UIState | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeUnit, setActiveUnit] = useState<ActiveUnit>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <UIContext.Provider value={{ activeUnit, setActiveUnit, searchTerm, setSearchTerm }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIState => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within a UIProvider');
  return ctx;
};
