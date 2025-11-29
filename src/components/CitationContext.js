import React, { createContext, useContext, useState } from 'react';

const CitationContext = createContext(null);

export function CitationProvider({ children }) {
  const [activeReference, setActiveReference] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openOverlay = (slug) => {
    setActiveReference(slug);
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
    // Delay clearing reference to allow animation
    setTimeout(() => setActiveReference(null), 300);
  };

  return (
    <CitationContext.Provider value={{ activeReference, isOpen, openOverlay, closeOverlay }}>
      {children}
    </CitationContext.Provider>
  );
}

export function useCitation() {
  const context = useContext(CitationContext);
  if (!context) {
    throw new Error('useCitation must be used within CitationProvider');
  }
  return context;
}

export default CitationContext;
