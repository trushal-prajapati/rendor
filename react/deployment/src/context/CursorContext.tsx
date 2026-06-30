import React, { createContext, useContext, useState } from 'react';

export type CursorType = 'default' | 'hover' | 'click' | 'drag';
export type PageTheme = 'home' | 'registration' | 'booking' | 'consultation';

interface CursorContextType {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  pageTheme: PageTheme;
  setPageTheme: (theme: PageTheme) => void;
  cursorLabel: string | null;
  setCursorLabel: (label: string | null) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [pageTheme, setPageTheme] = useState<PageTheme>('home');
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  return (
    <CursorContext.Provider
      value={{
        cursorType,
        setCursorType,
        pageTheme,
        setPageTheme,
        cursorLabel,
        setCursorLabel,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};
