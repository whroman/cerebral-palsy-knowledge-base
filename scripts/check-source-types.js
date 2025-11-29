#!/usr/bin/env node

/**
 * Check that all research notes have valid source types.
 *
 * STRICT PROHIBITION: Only top-tier and mid-tier sources are allowed.
 * Lower-tier sources (case-control, cross-sectional) will cause failure.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const RESEARCH_DIR = path.join(__dirname, '..', 'research');

// Allowed source types (top and mid tier only)
const ALLOWED_TYPES = [
  'systematic-review',
  'meta-analysis',
  'guideline',
  'scoping-review',
  'rct',
  'cohort-study',
  'registry-data'
];

// Prohibited types (will cause failure)
const PROHIBITED_TYPES = [
  'case-control',
  'cross-sectional',
  'case-report',
  'expert-consensus',
  'narrative-review',
  'editorial',
  'letter'
];

// Type tiers for informational output
const TYPE_TIERS = {
  'systematic-review': 'top',
  'meta-analysis': 'top',
  'guideline': 'top',
  'scoping-review': 'top',
  'rct': 'mid',
  'cohort-study': 'mid',
  'registry-data': 'mid'
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
    } else if (PROHIBITED_TYPES.includes(data.type)) {
      errors.push({
        file,
        error: `Prohibited type "${data.type}". Lower-tier sources are not allowed. Replace with systematic review, meta-analysis, guideline, RCT, or cohort study.`
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
  const tiers = { top: [], mid: [] };
  for (const [type, count] of Object.entries(typeCount)) {
    tiers[TYPE_TIERS[type]].push(`${type}: ${count}`);
  }

  if (tiers.top.length > 0) console.log(`  Top tier (green): ${tiers.top.join(', ')}`);
  if (tiers.mid.length > 0) console.log(`  Mid tier (yellow): ${tiers.mid.join(', ')}`);

  console.log('\nAll source types are valid (top/mid tier only).');
  process.exit(0);
}
