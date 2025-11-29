#!/usr/bin/env node

/**
 * Generate references.json from research note frontmatter.
 * This makes reference metadata available to React components.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const RESEARCH_DIR = path.join(__dirname, '..', 'research');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'references.json');

// Type to tier mapping
const TYPE_TIERS = {
  'systematic-review': 'top',
  'meta-analysis': 'top',
  'guideline': 'top',
  'scoping-review': 'top',
  'rct': 'mid',
  'cohort-study': 'mid',
  'registry-data': 'mid'
};

// Type to display label mapping
const TYPE_LABELS = {
  'systematic-review': 'Systematic Review',
  'meta-analysis': 'Meta-analysis',
  'guideline': 'Clinical Guideline',
  'scoping-review': 'Scoping Review',
  'rct': 'Randomized Controlled Trial',
  'cohort-study': 'Cohort Study',
  'registry-data': 'Registry Data'
};

// Type to emoji mapping
const TYPE_EMOJIS = {
  'systematic-review': '📊',
  'meta-analysis': '📈',
  'guideline': '📋',
  'scoping-review': '🔍',
  'rct': '🔬',
  'cohort-study': '👥',
  'registry-data': '🗃️'
};

const references = {};

// Get all research note files
const researchFiles = glob.sync('*.md', { cwd: RESEARCH_DIR })
  .filter(f => f !== 'CLAUDE.md');

for (const file of researchFiles) {
  const filePath = path.join(RESEARCH_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    const { data } = matter(content);

    // Build source URL
    let sourceUrl = null;
    if (data.pubmed) {
      sourceUrl = `https://pubmed.ncbi.nlm.nih.gov/${data.pubmed}/`;
    } else if (data.pmcid) {
      sourceUrl = `https://pmc.ncbi.nlm.nih.gov/articles/${data.pmcid}/`;
    } else if (data.nice) {
      sourceUrl = `https://www.nice.org.uk/guidance/${data.nice.toLowerCase()}`;
    } else if (data.doi) {
      sourceUrl = `https://doi.org/${data.doi}`;
    } else if (data.url) {
      sourceUrl = data.url;
    }

    references[data.slug] = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      year: data.year,
      type: data.type,
      typeLabel: TYPE_LABELS[data.type] || data.type,
      typeEmoji: TYPE_EMOJIS[data.type] || '📄',
      tier: TYPE_TIERS[data.type] || 'unknown',
      journal: data.journal,
      authors: data.authors,
      authorShort: data.author_short,
      tags: data.tags,
      pubmed: data.pubmed || null,
      pmcid: data.pmcid || null,
      doi: data.doi || null,
      nice: data.nice || null,
      sourceUrl
    };
  } catch (e) {
    console.error(`Error processing ${file}: ${e.message}`);
  }
}

// Write output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(references, null, 2));
console.log(`Generated ${OUTPUT_FILE} with ${Object.keys(references).length} references.`);
