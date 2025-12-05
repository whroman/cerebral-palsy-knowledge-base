#!/usr/bin/env node

/**
 * Validates the knowledge hierarchy (graph/hierarchy.yaml)
 *
 * Checks:
 * 1. All docs referenced in hierarchy exist
 * 2. All research notes referenced in hierarchy exist
 * 3. All docs in docs/ are accounted for in hierarchy
 * 4. No orphaned research notes (optional, informational)
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const HIERARCHY_PATH = path.join(ROOT, 'graph', 'hierarchy.yaml');
const DOCS_DIR = path.join(ROOT, 'docs');
const RESEARCH_DIR = path.join(ROOT, 'research');

let errors = [];
let warnings = [];

// Load hierarchy
let hierarchy;
try {
  hierarchy = yaml.load(fs.readFileSync(HIERARCHY_PATH, 'utf8'));
} catch (e) {
  console.error('Failed to load hierarchy.yaml:', e.message);
  process.exit(1);
}

// Collect all docs and research from hierarchy
const hierarchyDocs = new Set();
const hierarchyResearch = new Set();

// Process levels
Object.values(hierarchy.levels || {}).forEach(level => {
  (level.nodes || []).forEach(node => {
    if (node.doc) hierarchyDocs.add(node.doc);
    (node.research || []).forEach(r => hierarchyResearch.add(r));
  });
});

// Process operational
(hierarchy.operational || []).forEach(node => {
  if (node.doc) hierarchyDocs.add(node.doc);
  (node.research || []).forEach(r => hierarchyResearch.add(r));
});

// Process navigation
(hierarchy.navigation || []).forEach(doc => {
  hierarchyDocs.add(doc);
});

// Check: all hierarchy docs exist
hierarchyDocs.forEach(doc => {
  const docPath = path.join(ROOT, doc);
  if (!fs.existsSync(docPath)) {
    errors.push(`Hierarchy references non-existent doc: ${doc}`);
  }
});

// Check: all hierarchy research exists
hierarchyResearch.forEach(slug => {
  const researchPath = path.join(RESEARCH_DIR, `${slug}.md`);
  if (!fs.existsSync(researchPath)) {
    errors.push(`Hierarchy references non-existent research: ${slug}`);
  }
});

// Get all actual docs (recursively)
function getDocsRecursively(dir, base = '') {
  const docs = [];
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(base, item);
    if (fs.statSync(fullPath).isDirectory()) {
      docs.push(...getDocsRecursively(fullPath, relativePath));
    } else if (item.endsWith('.md') && item !== 'CLAUDE.md') {
      docs.push(`docs/${relativePath}`);
    }
  });
  return docs;
}

const actualDocs = getDocsRecursively(DOCS_DIR);

// Check: all actual docs are in hierarchy
actualDocs.forEach(doc => {
  if (!hierarchyDocs.has(doc)) {
    errors.push(`Doc not in hierarchy: ${doc}`);
  }
});

// Get all research notes
const actualResearch = fs.readdirSync(RESEARCH_DIR)
  .filter(f => f.endsWith('.md') && f !== 'CLAUDE.md')
  .map(f => f.replace('.md', ''));

// Informational: orphaned research
const orphanedResearch = actualResearch.filter(r => !hierarchyResearch.has(r));
if (orphanedResearch.length > 0) {
  warnings.push(`${orphanedResearch.length} research notes not in hierarchy (may be used via Cite):`);
  orphanedResearch.slice(0, 10).forEach(r => warnings.push(`  - ${r}`));
  if (orphanedResearch.length > 10) {
    warnings.push(`  ... and ${orphanedResearch.length - 10} more`);
  }
}

// Report
console.log('Hierarchy Validation');
console.log('====================\n');

console.log(`Docs in hierarchy: ${hierarchyDocs.size}`);
console.log(`Research in hierarchy: ${hierarchyResearch.size}`);
console.log(`Actual docs: ${actualDocs.length}`);
console.log(`Actual research: ${actualResearch.length}\n`);

if (warnings.length > 0) {
  console.log('Warnings:');
  warnings.forEach(w => console.log(`  ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('Errors:');
  errors.forEach(e => console.log(`  ✗ ${e}`));
  console.log('');
  process.exit(1);
} else {
  console.log('✓ Hierarchy is valid');
}
