#!/usr/bin/env node

/**
 * Check that all /research/ links in docs have matching research note files.
 *
 * Validates: Every [(Author, Year)](/research/id) link has a corresponding
 * research note file at research/{id}.md or research/{filename}.md
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const RESEARCH_DIR = path.join(__dirname, '..', 'research');

// Match markdown links like [anything](/research/something)
const RESEARCH_LINK_PATTERN = /\[([^\]]*)\]\(\/research\/([^)]+)\)/g;

// Match Cite components like <Cite slug="nice-ng119" /> or <Cite slug='pubmed-123' />
const CITE_COMPONENT_PATTERN = /<Cite\s+slug=["']([^"']+)["']\s*\/?>/g;

let errors = [];
let checkedCount = 0;

// Get all research note files (without .md extension)
const researchFiles = glob.sync('*.md', { cwd: RESEARCH_DIR })
  .filter(f => f !== 'CLAUDE.md')
  .map(f => f.replace('.md', ''));

// Get all doc files
const docFiles = glob.sync('**/*.md', { cwd: DOCS_DIR });

for (const docFile of docFiles) {
  const filePath = path.join(DOCS_DIR, docFile);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check markdown links
  let match;
  while ((match = RESEARCH_LINK_PATTERN.exec(content)) !== null) {
    checkedCount++;
    const linkText = match[1];
    const researchId = match[2];

    const matchingFile = researchFiles.find(f =>
      f === researchId ||
      f.includes(researchId)
    );

    if (!matchingFile) {
      errors.push({
        file: docFile,
        link: researchId,
        text: linkText
      });
    }
  }

  // Check Cite components
  while ((match = CITE_COMPONENT_PATTERN.exec(content)) !== null) {
    checkedCount++;
    const slug = match[1];

    const matchingFile = researchFiles.find(f => f === slug);

    if (!matchingFile) {
      errors.push({
        file: docFile,
        link: slug,
        text: `<Cite slug="${slug}">`
      });
    }
  }
}

if (errors.length > 0) {
  console.error('Citation errors found:\n');
  for (const err of errors) {
    console.error(`  ${err.file}: Missing research note for /research/${err.link}`);
    console.error(`    Link text: "${err.text}"\n`);
  }
  console.error(`\n${errors.length} missing research note(s) found.`);
  process.exit(1);
} else {
  console.log(`Checked ${checkedCount} citation(s) in ${docFiles.length} doc file(s).`);
  console.log('All citations have matching research notes.');
  process.exit(0);
}
