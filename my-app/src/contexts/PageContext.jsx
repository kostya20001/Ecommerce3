import React, { useState, useMemo } from 'react';
import { PageContext } from './PageContext';  // ← из .js файла (без расширения)

export const PageProvider = ({ children }) => {
  const [pageType, setPageType] = useState('techstore');

  const value = useMemo(() => ({
    pageType,
    setPageType,
  }), [pageType]);

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
};