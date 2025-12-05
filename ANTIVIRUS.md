# Antivirus System

Protects the knowledge base from context infection - errors that propagate through agent reasoning and corrupt downstream content.

---

## System Architecture

```
Antivirus System
├── Detection (health checks)
│   ├── What it checks
│   ├── Why it matters
│   └── What it outputs
├── Classification
│   ├── Severity (error vs warning)
│   ├── Type (format, reference, content, structure)
│   └── Scope (single file, cross-file, systemic)
├── Response Guidance
│   ├── Options for resolution
│   ├── Criteria for choosing
│   └── When to escalate to human
└── Prevention
    ├── Workflow that avoids issues
    └── Pre-commit validation
```

---

## Detection Layer

Each health check must define:

| Component | Description |
|-----------|-------------|
| **What** | What specifically it detects |
| **Why** | Why this matters (connection to chain of custody / context infection) |
| **Output** | What information it provides when triggered |

### Current Health Checks

#### check:frontmatter
- **What**: Research note YAML schema violations
- **Why**: Malformed research notes break the source layer of chain of custody
- **Output**: File path + specific schema error

#### check:abbreviations
- **What**: "CP" abbreviation in docs or research
- **Why**: "CP" has dangerous alternate meanings online; always spell out "cerebral palsy"
- **Output**: File path + line number + matching text

#### check:citations
- **What**: `<Cite slug="..."/>` references to non-existent research notes
- **Why**: Broken citations break chain of custody - claim appears sourced but isn't
- **Output**: File path + slug + "not found"

#### check:uncited
- **What**: Statistics, percentages, specific numbers without `<Cite/>` on same line
- **Why**: Unsourced claims are potential context infection vectors
- **Output**: File path + line number + line content

#### check:orphans
- **What**: Research notes not referenced by any doc
- **Why**: Informational - indicates unused research or missing content
- **Output**: List of orphaned research note slugs

#### check:sitemap
- **What**: Mismatch between sitemap.md links and actual docs structure
- **Why**: Navigation integrity - readers can't find content if sitemap is wrong
- **Output**: Missing from sitemap / missing from docs lists

#### check:hierarchy
- **What**: Mismatch between hierarchy.yaml and actual structure
- **Why**: Chain of custody integrity - hierarchy declares what backs each doc
- **Output**: Missing docs, missing research, orphaned files

#### check:features
- **What**: Feature registry integrity
- **Why**: Agents need to know what features exist before modifying
- **Output**: Unlisted features, missing entry points

#### check:links
- **What**: Broken URLs in docs and research notes
- **Why**: External sources must be reachable for verification
- **Output**: File path + URL + HTTP status

---

## Classification Layer

When a check detects an issue, classify it:

### Severity

| Level | Meaning | Action |
|-------|---------|--------|
| **Error** | Blocks deployment; chain of custody broken | Must fix before commit |
| **Warning** | Doesn't block; potential issue | Evaluate and decide |
| **Info** | Informational only | Note for future work |

### Type

| Type | Examples | Chain of Custody Impact |
|------|----------|------------------------|
| **Format** | Schema violations, malformed YAML | Source layer corrupted |
| **Reference** | Broken citations, dead links | Verification impossible |
| **Content** | Uncited claims, abbreviations | Claim unverifiable or misleading |
| **Structure** | Sitemap/hierarchy mismatch | Navigation or dependency broken |

### Scope

| Scope | Meaning | Resolution Complexity |
|-------|---------|----------------------|
| **Single file** | Issue contained to one file | Fix in place |
| **Cross-file** | Issue spans multiple files | Coordinate changes |
| **Systemic** | Pattern across many files | May need workflow change |

---

## Response Guidance

When an issue is detected, don't just "make it go away." Follow this process:

### 1. Understand the Purpose

Ask: **Why does this check exist?**

Every check exists to protect chain of custody or prevent context infection. If you don't understand why something is flagged, you can't make a good decision about how to fix it.

### 2. Evaluate Options

For each issue type, there are typically multiple resolution paths:

#### Uncited Claim (check:uncited)

| Option | When to Use |
|--------|-------------|
| **Add `<Cite/>`** | Claim is accurate and source exists in research/ |
| **Create research note** | Claim is accurate but source not yet in research/ |
| **Reword to remove statistic** | Statistic isn't essential to the point |
| **Mark as general knowledge** | Claim is widely known and doesn't need citation |
| **Remove claim** | Claim is inaccurate or unverifiable |

#### Broken Link (check:links)

| Option | When to Use |
|--------|-------------|
| **Update URL** | Content moved; find new location |
| **Replace source** | Original source gone; find equivalent |
| **Remove reference** | Content no longer exists anywhere |
| **Mark as false positive** | Site blocks automated checks but works in browser |

#### Orphaned Research (check:orphans)

| Option | When to Use |
|--------|-------------|
| **Add citations to docs** | Research should be backing existing content |
| **Create new doc** | Research supports content not yet written |
| **Leave orphaned** | Research is supplementary, used only via direct Cite |
| **Remove research note** | Research is no longer relevant |

### 3. Apply Decision Criteria

When choosing between options, ask:

1. **Does this serve readers?** The audience is caretakers needing accurate information
2. **Does this maintain chain of custody?** Can every claim be traced to a Tier 1 source?
3. **Is this the simplest correct solution?** Don't over-engineer

### 4. When to Escalate

Escalate to human when:
- Multiple valid options with significant trade-offs
- Uncertain whether claim is accurate
- Fix requires domain expertise you lack
- Systemic issue suggesting workflow problem

---

## Prevention Layer

### Workflow

Follow this sequence to avoid issues:

1. **Research first** - Create research note from Tier 1 source
2. **Extract verbatim quotes** - Chain of custody starts with exact quotes
3. **Update hierarchy.yaml** - Declare what research backs the new content
4. **Update sitemap.md** - Add to navigation
5. **Write content with `<Cite/>`** - Every claim traces to research
6. **Run `check:all`** - Verify before commit

### Pre-commit Validation

Always run before committing:

```bash
npm run check:all
```

If any check fails, classify → evaluate options → apply criteria → fix or escalate.

---

## Extending the System

When adding a new health check:

1. Define **What** it detects
2. Document **Why** it matters (chain of custody connection)
3. Specify **Output** format
4. Add to this document under Detection Layer
5. Add response guidance under Response Guidance
6. Add to `npm run check:all` in package.json
