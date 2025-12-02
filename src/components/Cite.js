import React from 'react';
import { useCitation } from './CitationContext';
import references from '../data/references.json';
import styles from './Cite.module.css';

/**
 * Inline citation component with colored tier dot.
 *
 * Usage in MDX:
 *   <Cite slug="nice-ng119" />
 *   <Cite slug="pubmed-32061920" />
 */
export default function Cite({ slug }) {
  const { openOverlay } = useCitation();
  const ref = references[slug];

  if (!ref) {
    console.warn(`Citation not found: ${slug}`);
    return <span className={styles.error}>[Citation not found: {slug}]</span>;
  }

  const handleClick = (e) => {
    e.preventDefault();
    openOverlay(slug);
  };

  return (
    <>
      <button
        className={`${styles.citation} ${styles[ref.tier]}`}
        onClick={handleClick}
        title={`${ref.title} (${ref.typeLabel})`}
        data-cite
      >
        ({ref.authorShort}, {ref.year})
        <span className={styles.dot}>●</span>
      </button>
      <br className={styles.citeBr} />
    </>
  );
}
