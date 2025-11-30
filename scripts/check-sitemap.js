#!/usr/bin/env node

/**
 * Check that sitemap.md matches the actual docs structure.
 *
 * Validates:
 * - All docs in /docs/ are listed in sitemap.md (no orphan pages)
 * - All links in sitemap.md point to existing files
 * - Sitemap is kept in sync with actual structure
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const SITEMAP_PATH = path.join(DOCS_DIR, 'sitemap.md');

// Files to exclude from sitemap check (the sitemap itself)
const EXCLUDED_FILES = ['sitemap.md'];

// Match markdown links like [text](./path/to/file.md)
const LINK_PATTERN = /\[([^\]]+)\]\(\.\/([^)]+\.md)\)/g;

// Check sitemap exists
if (!fs.existsSync(SITEMAP_PATH)) {
  console.error('ERROR: docs/sitemap.md does not exist!');
  console.error('Create the sitemap page to document wiki structure.');
  process.exit(1);
}

// Get all doc files
const actualDocs = glob.sync('**/*.md', { cwd: DOCS_DIR })
  .filter(f => !EXCLUDED_FILES.includes(f))
  .sort();

// Read sitemap and extract links
const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
const sitemapLinks = new Set();

let match;
while ((match = LINK_PATTERN.exec(sitemapContent)) !== null) {
  const linkPath = match[2];
  sitemapLinks.add(linkPath);
}

// Convert sitemap links to comparable format (relative paths)
const sitemapDocs = Array.from(sitemapLinks).sort();

// Find docs not in sitemap
const docsNotInSitemap = actualDocs.filter(doc => !sitemapLinks.has(doc));

// Find sitemap links to non-existent files
const brokenLinks = sitemapDocs.filter(link => {
  const fullPath = path.join(DOCS_DIR, link);
  return !fs.existsSync(fullPath);
});

let hasErrors = false;

if (docsNotInSitemap.length > 0) {
  console.error('Docs not listed in sitemap.md:\n');
  for (const doc of docsNotInSitemap) {
    console.error(`  ${doc}`);
  }
  console.error(`\n${docsNotInSitemap.length} doc(s) missing from sitemap.`);
  hasErrors = true;
}

if (brokenLinks.length > 0) {
  if (hasErrors) console.error('\n');
  console.error('Broken links in sitemap.md:\n');
  for (const link of brokenLinks) {
    console.error(`  ./${link}`);
  }
  console.error(`\n${brokenLinks.length} broken link(s) in sitemap.`);
  hasErrors = true;
}

if (hasErrors) {
  console.error('\nSitemap must stay in sync with docs structure.');
  process.exit(1);
} else {
  console.log(`Checked ${actualDocs.length} doc(s) against sitemap.`);
  console.log(`Sitemap contains ${sitemapDocs.length} link(s).`);
  console.log('Sitemap is in sync with docs structure.');
  process.exit(0);
}
