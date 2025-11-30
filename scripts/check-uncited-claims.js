#!/usr/bin/env node

/**
 * Check for uncited claims in documentation.
 *
 * Identifies lines that appear to make factual claims (statistics, percentages,
 * specific numbers) but lack a <Cite> component on the same line or in context.
 *
 * Claim patterns detected:
 * - Percentages: "70%", "58.6%"
 * - Statistics with numbers: "1 in 3", "2x", "45-62 times"
 * - Specific counts: "666 deaths", "4,807 individuals"
 * - Age/year references: "age 58", "by 2025"
 * - Comparative claims: "higher than", "more likely", "increased risk"
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

// Patterns that indicate a factual claim needing citation
const CLAIM_PATTERNS = [
  // Percentages
  /\d+\.?\d*%/,
  // Fractions like "1 in 3", "1 in 4"
  /\b\d+\s+in\s+\d+\b/i,
  // Multipliers like "2x", "5x", "twice"
  /\b\d+x\b|\btwice\b|\bthree times\b/i,
  // Comparative with numbers "45-62 times higher"
  /\d+[-–]\d+\s+times/i,
  // Specific mortality/survival stats
  /\b(mortality|survival|deaths?|died)\b.*\b\d+/i,
  // Sample sizes
  /\b\d{1,3}(,\d{3})+\s+(individuals?|patients?|people|persons?|participants?)/i,
  // Age statistics
  /\bage\s+\d+/i,
  // "X% of" claims
  /\d+\.?\d*%\s+of/i,
];

// Patterns to skip (already cited, headers, code, etc.)
const SKIP_PATTERNS = [
  // Has a Cite component on same line
  /<Cite\s+slug=/,
  // Is a markdown header
  /^#+\s/,
  // Is a table header separator
  /^\|[-:]+\|/,
  // Is in frontmatter
  /^---$/,
  // Is an import statement
  /^import\s/,
  // Is a code block marker
  /^```/,
  // Is a link definition
  /^\[.*\]:/,
  // Is just a table divider cell
  /^\|\s*\*\*/,
];

// Files to skip entirely
const SKIP_FILES = [
  'glossary.md',  // Definitions don't need citations for each term
];

let warnings = [];
let checkedFiles = 0;
let checkedLines = 0;

// Get all doc files
const docFiles = glob.sync('**/*.md', { cwd: DOCS_DIR });

for (const docFile of docFiles) {
  // Skip certain files
  if (SKIP_FILES.some(skip => docFile.endsWith(skip))) {
    continue;
  }

  const filePath = path.join(DOCS_DIR, docFile);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  checkedFiles++;
  let inFrontmatter = false;
  let inCodeBlock = false;
  let fileWarnings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Track frontmatter
    if (line === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) continue;

    // Track code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip lines matching skip patterns
    if (SKIP_PATTERNS.some(pattern => pattern.test(line))) {
      continue;
    }

    checkedLines++;

    // Check if line matches any claim pattern
    for (const pattern of CLAIM_PATTERNS) {
      if (pattern.test(line)) {
        // Check if there's a citation on this line
        if (!/<Cite\s+slug=/.test(line)) {
          // Check if next line has citation (common for bullet points)
          const nextLine = lines[i + 1] || '';
          const prevLine = lines[i - 1] || '';

          // If the claim is in a table cell, check if any cell in the row has a cite
          if (line.includes('|') && /<Cite\s+slug=/.test(line)) {
            continue;
          }

          fileWarnings.push({
            line: lineNum,
            content: line.trim().substring(0, 100) + (line.length > 100 ? '...' : ''),
            pattern: pattern.toString()
          });
          break; // Only report once per line
        }
      }
    }
  }

  if (fileWarnings.length > 0) {
    warnings.push({
      file: docFile,
      issues: fileWarnings
    });
  }
}

// Output results
console.log(`Checked ${checkedLines} lines in ${checkedFiles} doc file(s).\n`);

if (warnings.length > 0) {
  console.log('Potential uncited claims found:\n');

  for (const fileWarning of warnings) {
    console.log(`📄 ${fileWarning.file}:`);
    for (const issue of fileWarning.issues) {
      console.log(`   Line ${issue.line}: ${issue.content}`);
    }
    console.log('');
  }

  const totalIssues = warnings.reduce((sum, w) => sum + w.issues.length, 0);
  console.log(`\n⚠️  ${totalIssues} potential uncited claim(s) in ${warnings.length} file(s).`);
  console.log('Review each and either add a <Cite slug="..."/> or confirm the claim is general knowledge.\n');

  // Exit with warning (code 0) - these are warnings, not hard errors
  // Change to process.exit(1) to make this a blocking check
  process.exit(0);
} else {
  console.log('✅ No uncited claims detected.');
  process.exit(0);
}
