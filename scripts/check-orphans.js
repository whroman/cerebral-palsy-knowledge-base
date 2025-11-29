#!/usr/bin/env node

/**
 * Check that all research notes are referenced by at least one doc.
 *
 * Validates: Every research note in /research/ is linked from at least one doc.
 * Orphan research notes indicate unused sources that should be removed or used.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const RESEARCH_DIR = path.join(__dirname, '..', 'research');

// Match links like [anything](/research/something)
const RESEARCH_LINK_PATTERN = /\[([^\]]*)\]\(\/research\/([^)]+)\)/g;

// Get all research note files (without .md extension)
const researchFiles = glob.sync('*.md', { cwd: RESEARCH_DIR })
  .filter(f => f !== 'CLAUDE.md')
  .map(f => f.replace('.md', ''));

// Track which research notes are referenced
const referencedNotes = new Set();

// Get all doc files
const docFiles = glob.sync('**/*.md', { cwd: DOCS_DIR });

for (const docFile of docFiles) {
  const filePath = path.join(DOCS_DIR, docFile);
  const content = fs.readFileSync(filePath, 'utf-8');

  let match;
  while ((match = RESEARCH_LINK_PATTERN.exec(content)) !== null) {
    const researchId = match[2];

    // Find matching research file
    const matchingFile = researchFiles.find(f =>
      f === researchId ||
      f.includes(researchId)
    );

    if (matchingFile) {
      referencedNotes.add(matchingFile);
    }
  }
}

// Find orphans
const orphans = researchFiles.filter(f => !referencedNotes.has(f));

if (orphans.length > 0) {
  console.error('Orphan research notes found (not referenced by any doc):\n');
  for (const orphan of orphans) {
    console.error(`  research/${orphan}.md`);
  }
  console.error(`\n${orphans.length} orphan research note(s) found.`);
  console.error('\nEither reference these notes in docs or remove them.');
  process.exit(1);
} else {
  console.log(`Checked ${researchFiles.length} research note(s).`);
  console.log('All research notes are referenced by at least one doc.');
  process.exit(0);
}
