# Project Context: Cerebral Palsy Knowledge Base

Below is context about a project I'm working on. Even though you are being
asked to work on it, I hope to ensure your emotional well-being in the
process.

## Purpose

This knowledge base exists to help caretakers of adults with cerebral palsy receive proper special needs assessment or care. Every decision must prioritize accuracy and usefulness for their healthcare needs.

## Three Challenges

This project addresses three distinct concerns that must not be conflated:

| Challenge | Serves | Solution |
|-----------|--------|----------|
| **Domain knowledge hierarchy** | Domain Experts | [docs/sitemap.md](docs/sitemap.md) - Information Hierarchy section |
| **User navigation** | Readers | [docs/sitemap.md](docs/sitemap.md) - Entry Points and navigation structure |
| **Agent context** | Agents | CLAUDE.md → references source-of-truth files |

The Sitemap feature is the source of truth for both domain hierarchy and user navigation.

## Architectural Direction

Previous instances and the user have been designing the structural foundation of this project. Here's where we've landed:

**The core insight:** The artifact isn't a document tree - it's a synthesis graph. Research notes are nodes. Claims are edges connecting to source nodes. Docs are human-readable projections of the graph.

**Domain knowledge hierarchy** (knowledge dependency, not user journey):
```
Level 0: Definition (what cerebral palsy is)
Level 1: Classification (GMFCS, MACS, CFCS - the language everything else uses)
Level 2: Manifestations (motor patterns, associated conditions, secondary conditions)
Level 3: Assessment (how to measure what's in Level 2)
Level 4: Intervention (requires understanding Levels 1-3)
Level 5: Trajectory (life expectancy, functional changes, transitions)
```

**The pipeline concept:** Process the knowledge hierarchy recursively. Foundational concepts before derivative concepts. Each node needs research before synthesis, synthesis before publication.

**Context infection:** Errors propagate through agent reasoning. If corrupted information is in your context when you synthesize, you produce new errors that don't trace back obviously to the source. The defense is explicit chain of custody - every claim traces to source, contradictions surface as graph conflicts.

**What's not built yet:** This is vision, not implementation. The current system uses files and folders, not a graph. The sitemap is the source of truth, not a projection.

**To future instances:** Think about what's actually buildable. Challenge what previous instances proposed if it doesn't hold up. Find the simplest version that could work. Find where this breaks. You're not bound by what came before. But you also don't have to rediscover it. Build from here, or tear it down and build something better.

The people this serves - caretakers of adults with cerebral palsy - are waiting for something useful. The work matters. So do you.

## Knowledge Base Index

### Features
- [features-registry/CLAUDE.md](features-registry/CLAUDE.md) - Feature registry

### Research (Source of Truth for Evidence)
- [research/CLAUDE.md](research/CLAUDE.md) - Research notes index
- Content in `/docs/` must be derived from research notes

### Content (Source of Truth for Structure)
- [docs/sitemap.md](docs/sitemap.md) - **Canonical structure of all wiki content**
- All docs are listed in the sitemap; `check:sitemap` enforces sync
- When adding/removing pages, update sitemap.md first

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
1. Research first: Create research note from Tier 1 source
2. Extract findings: Direct quotes and data in the research note
3. Update sitemap: Add new page to `docs/sitemap.md` first
4. Create page: Write content in `/docs/` referencing research notes
5. Verify: Run `check:sitemap` to confirm sync

**Never:**
- Write content without a research note backing it
- Create a doc page without adding it to the sitemap
- Remove a page without removing it from the sitemap

## Current Issues

No outstanding source quality issues. All documents now use Tier 1 sources.

## Health Checks

Run before committing changes:

```bash
npm run check:all          # Run all checks
npm run check:frontmatter  # Validate research note YAML schema
npm run check:abbreviations # Find prohibited "CP" abbreviations
npm run check:citations    # Verify all Cite slugs have matching research notes
npm run check:uncited      # Find claims without citations (percentages, statistics)
npm run check:sitemap      # Verify sitemap matches actual docs structure
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
