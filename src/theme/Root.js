import React, { useRef, useEffect, useState } from 'react';
import { CitationProvider } from '../components/CitationContext';
import CitationOverlay from '../components/CitationOverlay';

// Wraps the entire app with citation context
export default function Root({ children }) {
  const portalContainerRef = useRef(null);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Create a portal container outside Docusaurus's stacking context
    const container = document.createElement('div');
    container.id = 'citation-portal';
    container.style.cssText = 'position: fixed; inset: 0; z-index: 9999; pointer-events: none;';
    document.body.appendChild(container);
    portalContainerRef.current = container;
    setPortalContainer(container);

    return () => {
      if (portalContainerRef.current) {
        document.body.removeChild(portalContainerRef.current);
      }
    };
  }, []);

  return (
    <CitationProvider>
      {children}
      <CitationOverlay portalContainer={portalContainer} />
    </CitationProvider>
  );
}
