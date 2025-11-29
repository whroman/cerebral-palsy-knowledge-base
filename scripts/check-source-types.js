#!/usr/bin/env node

/**
 * Check that all research notes have valid source types.
 *
 * Validates: Every research note's `type` field is in the allowed enum.
 * This ensures only evidence-based source types are used (no opinions, case reports, etc.)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const RESEARCH_DIR = path.join(__dirname, '..', 'research');

// Allowed source types (evidence-based only)
const ALLOWED_TYPES = [
  'systematic-review',
  'meta-analysis',
  'guideline',
  'scoping-review',
  'rct',
  'cohort-study',
  'registry-data',
  'case-control',
  'cross-sectional'
];

// Type tiers for informational output
const TYPE_TIERS = {
  'systematic-review': 'top',
  'meta-analysis': 'top',
  'guideline': 'top',
  'scoping-review': 'top',
  'rct': 'mid',
  'cohort-study': 'mid',
  'registry-data': 'mid',
  'case-control': 'lower',
  'cross-sectional': 'lower'
};

let errors = [];
let typeCount = {};

// Get all research note files
const researchFiles = glob.sync('*.md', { cwd: RESEARCH_DIR })
  .filter(f => f !== 'CLAUDE.md');

for (const file of researchFiles) {
  const filePath = path.join(RESEARCH_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    const { data } = matter(content);

    if (!data.type) {
      errors.push({
        file,
        error: 'Missing `type` field in frontmatter'
      });
    } else if (!ALLOWED_TYPES.includes(data.type)) {
      errors.push({
        file,
        error: `Invalid type "${data.type}". Allowed: ${ALLOWED_TYPES.join(', ')}`
      });
    } else {
      // Count types for summary
      typeCount[data.type] = (typeCount[data.type] || 0) + 1;
    }
  } catch (e) {
    errors.push({
      file,
      error: `Failed to parse frontmatter: ${e.message}`
    });
  }
}

if (errors.length > 0) {
  console.error('Source type errors found:\n');
  for (const err of errors) {
    console.error(`  research/${err.file}: ${err.error}`);
  }
  console.error(`\n${errors.length} error(s) found.`);
  process.exit(1);
} else {
  console.log(`Checked ${researchFiles.length} research note(s).\n`);
  console.log('Source type distribution:');

  // Group by tier
  const tiers = { top: [], mid: [], lower: [] };
  for (const [type, count] of Object.entries(typeCount)) {
    tiers[TYPE_TIERS[type]].push(`${type}: ${count}`);
  }

  if (tiers.top.length > 0) console.log(`  Top tier (green): ${tiers.top.join(', ')}`);
  if (tiers.mid.length > 0) console.log(`  Mid tier (yellow): ${tiers.mid.join(', ')}`);
  if (tiers.lower.length > 0) console.log(`  Lower tier (red): ${tiers.lower.join(', ')}`);

  console.log('\nAll source types are valid.');
  process.exit(0);
}
