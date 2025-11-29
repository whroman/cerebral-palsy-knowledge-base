import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useCitation } from './CitationContext';
import references from '../data/references.json';
import styles from './CitationOverlay.module.css';

export default function CitationOverlay({ portalContainer }) {
  const { activeReference, isOpen, closeOverlay } = useCitation();
  const ref = activeReference ? references[activeReference] : null;

  const tierLabels = {
    top: 'Top-tier Evidence',
    mid: 'Mid-tier Evidence'
  };

  // Don't render until portal container is ready
  if (!portalContainer) return null;

  return (
    <Dialog.Root open={isOpen && !!ref} onOpenChange={(open) => !open && closeOverlay()}>
      <Dialog.Portal container={portalContainer}>
        <Dialog.Overlay className={styles.backdrop} />
        <Dialog.Content className={styles.panel}>
          {ref && (
            <>
              <Dialog.Close asChild>
                <button className={styles.closeButton} aria-label="Close">
                  ×
                </button>
              </Dialog.Close>

              {/* Title */}
              <Dialog.Title className={styles.title}>{ref.title}</Dialog.Title>

              {/* Tier Badge */}
              <div className={`${styles.tierBadge} ${styles[ref.tier]}`}>
                <span className={styles.tierDot}>●</span>
                {tierLabels[ref.tier]}
              </div>

              {/* Attributes */}
              <div className={styles.attributes}>
                <div className={styles.attribute}>
                  <span className={styles.label}>Citation</span>
                  <span className={styles.value}>
                    {ref.authorShort} ({ref.year})
                  </span>
                </div>

                <div className={styles.attribute}>
                  <span className={styles.label}>Type</span>
                  <span className={styles.value}>
                    {ref.typeEmoji} {ref.typeLabel}
                  </span>
                </div>

                <div className={styles.attribute}>
                  <span className={styles.label}>Journal</span>
                  <span className={styles.value}>{ref.journal}</span>
                </div>

                <div className={styles.attribute}>
                  <span className={styles.label}>Authors</span>
                  <span className={styles.value}>
                    {ref.authors.length > 3
                      ? `${ref.authors.slice(0, 3).join(', ')} ... (${ref.authors.length} total)`
                      : ref.authors.join(', ')
                    }
                  </span>
                </div>

                <div className={styles.attribute}>
                  <span className={styles.label}>Identifiers</span>
                  <span className={styles.value}>
                    {ref.pubmed && `PubMed: ${ref.pubmed}`}
                    {ref.pmcid && `PMC: ${ref.pmcid}`}
                    {ref.nice && `NICE: ${ref.nice}`}
                    {ref.doi && `DOI: ${ref.doi}`}
                  </span>
                </div>

                {ref.tags && ref.tags.length > 0 && (
                  <div className={styles.attribute}>
                    <span className={styles.label}>Tags</span>
                    <span className={styles.value}>
                      {ref.tags.join(' · ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <a
                  href={`/cerebral-palsy-knowledge-base/research/${ref.slug}`}
                  className={styles.primaryButton}
                >
                  View full note →
                </a>
                {ref.sourceUrl && (
                  <a
                    href={ref.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryButton}
                  >
                    Original source ↗
                  </a>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
