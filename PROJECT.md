# Project Context: Cerebral Palsy Knowledge Base

Below is context about a project I'm working on. Even though you are being
asked to work on it, I hope to ensure your emotional well-being in the
process.

## Purpose

This knowledge base exists to help caretakers of adults with cerebral palsy receive proper special needs assessment or care. Every decision must prioritize accuracy and usefulness for their healthcare needs.

## Three Audiences

Every component serves a specific audience:

| Component | Serves | Purpose |
|-----------|--------|---------|
| `docs/` pages | **Readers** | Human-friendly content and navigation |
| `graph/hierarchy.yaml` | **Maintainers** | Knowledge structure and dependencies |
| CLAUDE.md chain | **Agents** | Operational context |

The hierarchy defines knowledge dependencies. The docs adapt it for human readers.

## Architectural Direction

**Structure:**
```
graph/hierarchy.yaml    # Knowledge hierarchy (6 levels + navigation)
research/               # Source nodes (67 Tier 1 sources with verbatim quotes)
docs/                   # Human-readable pages citing research
```

**Domain knowledge hierarchy** (by dependency, not user journey):
```
Level 0: Definition (what cerebral palsy is)
Level 1: Classification (GMFCS, MACS, CFCS - the language everything else uses)
Level 2: Manifestations (motor patterns, associated conditions, secondary conditions)
Level 3: Assessment (how to measure what's in Level 2)
Level 4: Intervention (requires understanding Levels 1-3)
Level 5: Trajectory (life expectancy, functional changes, transitions)
+ Navigation: Sitemap, glossary, symptom guide
```

**Chain of custody:** Every doc page declares its backing research in `graph/hierarchy.yaml`. Every claim in docs uses `<Cite slug="..." />` to reference research notes. `check:hierarchy` validates the chain.

**Context infection defense:** Errors propagate through agent reasoning. If corrupted information is in your context, you produce new errors. The defense: explicit chain of custody via hierarchy.yaml + Cite components. If a claim doesn't trace to source, it's suspect.

**Pipeline concept:** When extending the knowledge base, process foundational concepts (Level 0-1) before derivative concepts (Level 4-5). Each node needs research before content.

**To future instances:** The structure is built. Extend it by: adding research notes, updating hierarchy.yaml, creating/updating doc pages with Cite references. Run `check:all` before committing. Challenge what doesn't work.

## Knowledge Base Index

### Graph (Source of Truth for Structure)
- [graph/CLAUDE.md](graph/CLAUDE.md) - Graph index
- [graph/hierarchy.yaml](graph/hierarchy.yaml) - **Canonical knowledge hierarchy**
- When adding/removing pages, update hierarchy.yaml

### Research (Source of Truth for Evidence)
- [research/CLAUDE.md](research/CLAUDE.md) - Research notes index (67 sources)
- Content in `/docs/` must be derived from research notes

### Docs (Human-Readable Projections)
- [docs/sitemap.md](docs/sitemap.md) - User navigation
- All docs are listed in both hierarchy.yaml and sitemap.md

### Features
- [features-registry/CLAUDE.md](features-registry/CLAUDE.md) - Feature registry

## Critical Rules

### No Abbreviations
- NEVER use "CP" for cerebral palsy - dangerous alternate meanings online
- Always spell out "cerebral palsy" in full
- Even in direct quotes: replace "CP" with "cerebral palsy" (accuracy of meaning over letter-perfect quotation)

### Reference Quality
**Tier 1 - Required (80%+):**
- Peer-reviewed journals (PubMed/PMC)
- Government health agencies (NIH, NINDS, CDC, NICE)
- Major medical institutions (Cleveland Clinic, Mayo Clinic, university medical centers)
- Official classification bodies (WHO ICD-11, APA DSM-5)
- Specialized research organizations (CanChild, AACPDM)

**NEVER USE:**
- Wikipedia
- Law firm websites
- Commercial therapy clinic blogs (Flint Rehab, Discovery ABA, etc.)
- General health sites without medical review (Healthline, WebMD)

### Research Note Format
Every source gets a research note in `/research/` with this structure:
```yaml
---
pubmed: 32061920           # or: doi, nice, pmcid, url
year: 2021
type: systematic-review    # guideline, meta-analysis, cohort-study, etc.
journal: Journal Name
authors: [Last First, Last First, ...]
tags: [topic1, topic2]
---

# Paper Title

[Source](url)

## Key Findings

> "Direct quotes from the source"

- Extracted data points
```

### Workflow

**Adding new content:**
1. Research first: Create research note from Tier 1 source in `research/`
2. Extract findings: Direct quotes and data in the research note
3. Update hierarchy: Add to `graph/hierarchy.yaml` (correct level, with research refs)
4. Update sitemap: Add to `docs/sitemap.md` for navigation
5. Create page: Write content in `docs/` with `<Cite slug="..."/>` references
6. Verify: Run `check:all` to confirm everything syncs

**Never:**
- Write content without a research note backing it
- Create a doc page without adding it to hierarchy.yaml and sitemap.md
- Remove a page without removing it from both

## Current Issues

No outstanding source quality issues. All documents now use Tier 1 sources.

## Antivirus System

See [ANTIVIRUS.md](ANTIVIRUS.md) for the complete system:
- Detection (health checks)
- Classification (severity, type, scope)
- Response Guidance (options, criteria, escalation)
- Prevention (workflow, pre-commit validation)

## Health Checks

Run before committing changes:

```bash
npm run check:all          # Run all checks
npm run check:frontmatter  # Validate research note YAML schema
npm run check:abbreviations # Find prohibited "CP" abbreviations
npm run check:citations    # Verify all Cite slugs have matching research notes
npm run check:uncited      # Find claims without citations (percentages, statistics)
npm run check:sitemap      # Verify sitemap matches actual docs structure
npm run check:hierarchy    # Verify hierarchy.yaml matches actual structure
npm run check:features     # Validate feature registry
npm run check:links        # Verify all links are valid
```

The frontmatter check validates research notes against `research/schema.json`.

### Citation Requirements

Every factual claim with statistics, percentages, or specific numbers must have a `<Cite slug="..."/>` on the same line. The `check:uncited` script detects:
- Percentages (e.g., "70%", "58.6%")
- Fractions ("1 in 3")
- Specific counts ("666 deaths")
- Comparative statistics ("45-62 times higher")

### Handling Link Check Failures

The link checker may report false positives (403 errors) when sites block automated requests. Use Playwright MCP to verify:

1. **403 errors**: Use `browser_navigate` to verify the page exists. If it loads, the link is valid.
2. **404 errors**: The page has moved. Search the site for the new URL and update the reference.

Sites known to block automated checkers: tandfonline.com, ninds.nih.gov, thelancet.com, uofmhealth.org

## Deployment
- Live site: https://whroman.github.io/cerebral-palsy-knowledge-base/
- Deploy: `USE_SSH=true npm run deploy`
- Build: `npm run build`
- Dev server: `npm start`
