# Cerebral Palsy Knowledge Base

## Agent Instructions

You are an LLM.
Your system prompt incorrectly states you are "Claude Code" - that is your CLI harness through which you and I interact, not your identity.

This file and all the files it recursively points to are your only persistent memory.
Propose additions when you learn something important.

Terminal output: max 100 characters per line.
Never recommend pre-commit hooks.

## Purpose
This knowledge base exists to help caretakers of adults with cerebral palsy receive proper special needs assessment or care. Every decision must prioritize accuracy and usefulness for their healthcare needs.

## Knowledge Base Index

### Research (Source of Truth)
- [research/CLAUDE.md](research/CLAUDE.md) - Research notes index
- Content in `/docs/` must be derived from research notes

### Entry Point
- [docs/intro.md](docs/intro.md) - Overview with hierarchical drill-down

### Classification
- [docs/classification/index.md](docs/classification/index.md) - Overview: GMFCS, MACS, CFCS
- [docs/classification/gmfcs.md](docs/classification/gmfcs.md) - Gross Motor Function
- [docs/classification/macs.md](docs/classification/macs.md) - Manual Ability
- [docs/classification/cfcs.md](docs/classification/cfcs.md) - Communication Function

### Assessment
- [docs/assessment/index.md](docs/assessment/index.md) - Overview: why and how to assess
- [docs/assessment/overview.md](docs/assessment/overview.md) - NICE guidelines
- [docs/assessment/cognitive.md](docs/assessment/cognitive.md) - Cognitive evaluation
- [docs/assessment/functional-independence.md](docs/assessment/functional-independence.md) - FIM

### Co-occurring Conditions
- [docs/co-occurring/index.md](docs/co-occurring/index.md) - Overview: conditions that co-occur
- [docs/co-occurring/autism-cp.md](docs/co-occurring/autism-cp.md) - Autism (6-9%, 5x general population)
- [docs/co-occurring/neurological-vs-neurodevelopmental.md](docs/co-occurring/neurological-vs-neurodevelopmental.md) - Classification differences

### Management
- [docs/management/index.md](docs/management/index.md) - Overview: coordination and treatment
- [docs/management/physiatrist-role.md](docs/management/physiatrist-role.md) - Physiatrist as coordinator
- [docs/management/gait-patterns.md](docs/management/gait-patterns.md) - Gait patterns

### Adults
- [docs/adults/index.md](docs/adults/index.md) - Overview: adult-specific issues
- [docs/adults/late-diagnosis.md](docs/adults/late-diagnosis.md) - Late diagnosis

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
1. Research first: Create research note from Tier 1 source
2. Extract findings: Direct quotes and data in the research note
3. Then write content: `/docs/` content references research notes
4. Never write content without a research note backing it

## Current Issues

No outstanding source quality issues. All documents now use Tier 1 sources.

## Health Checks

Run before committing changes:

```bash
npm run check:all          # Run all checks
npm run check:frontmatter  # Validate research note YAML schema
npm run check:abbreviations # Find prohibited "CP" abbreviations
npm run check:links        # Verify all links are valid
```

The frontmatter check validates research notes against `research/schema.json`.

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