#!/usr/bin/env node

/**
 * Feature Registry Health Check
 *
 * Validates:
 * 1. All feature files in features/ are indexed in features/CLAUDE.md
 * 2. Entry points referenced in feature files exist
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const FEATURES_DIR = path.join(__dirname, '..', 'features-registry');
const INDEX_FILE = path.join(FEATURES_DIR, 'CLAUDE.md');

let hasErrors = false;

function error(msg) {
  console.error(`ERROR: ${msg}`);
  hasErrors = true;
}

async function main() {
  // Get all feature files (excluding CLAUDE.md)
  const featureFiles = await glob('*.md', {
    cwd: FEATURES_DIR,
    ignore: ['CLAUDE.md']
  });

  if (featureFiles.length === 0) {
    console.log('No feature files found.');
    return;
  }

  // Read the index
  const indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');

  // Check each feature file is indexed
  console.log('Checking feature index...');
  for (const file of featureFiles) {
    if (!indexContent.includes(file)) {
      error(`${file} not listed in features/CLAUDE.md`);
    }
  }

  // Check entry points exist
  console.log('Checking entry points...');
  for (const file of featureFiles) {
    const filePath = path.join(FEATURES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract paths from backticks
    const pathMatches = content.match(/`([^`]+\.(js|tsx?|css))`/g) || [];

    for (const match of pathMatches) {
      const relPath = match.replace(/`/g, '');
      const absPath = path.join(__dirname, '..', relPath);

      if (!fs.existsSync(absPath)) {
        error(`${file}: Entry point not found: ${relPath}`);
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log(`All ${featureFiles.length} feature(s) validated.`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
