# Implementation Plan: Citation System Refactor

**Status**: Planning
**Decision**: B+C+D+F (Central refs + quality icons + inline author/year + research note linking)
**Score**: 120/125

---

## Problem Statement

Current citation system has:
- No single source of truth (URLs duplicated across pages)
- No link between `/research/` notes and `/docs/` content
- No automated validation (citations can drift)
- Poor reader UX (footnotes at bottom, no source quality signals)
- Not LLM-maintainable at scale

---

## Solution Architecture

```
/research/pubmed-32061920.md     ← Single source of truth
    ↑
/docs/**/*.md                    ← References by ID: (Brunton, 2020)
    ↓
Reader clicks → research note → external URL
```

### Research Note Schema (Extended)

```yaml
---
id: brunton-2020                  # NEW: citation key
pubmed: 32061920
year: 2020
type: systematic-review
journal: Developmental Medicine & Child Neurology
authors: [Brunton L, Hall S, ...]
author_short: Brunton             # NEW: for inline citation
tags: [pain, adults]
---
```

### Doc Citation Syntax

```markdown
Current:  "...70% experience chronic pain [^1]"
          [^1]: [Pain in adults...](https://pubmed...)

Proposed: "...70% experience chronic pain [(Brunton, 2020)](/research/brunton-2020)"
```

Reader experience:
1. Sees inline `(Brunton, 2020)` - human-readable
2. Clicks → lands on research note with context + quotes
3. Research note links to external source

---

## Quality Indicators

### Two-Dimensional System

| Dimension | Representation | Source |
|-----------|----------------|--------|
| Study type + method | Emoji combination (2 emoji) | Manual in markdown |
| Evidence tier | Background color (CSS) | Auto-derived from `type` field |

### Allowed Source Types

Excluded types (not allowed):
- expert-consensus (opinion, not evidence)
- case-report (n=1, not generalizable)
- narrative-review (non-systematic, bias-prone)
- editorial, letter (opinion)

Allowed types:

| Type | Icon | Tier | Color |
|------|------|------|-------|
| systematic-review | 📊🔍 | Top | Green `#d4edda` |
| meta-analysis | 📊🧮 | Top | Green `#d4edda` |
| guideline | 📋✅ | Top | Green `#d4edda` |
| scoping-review | 📊🗺️ | Top | Green `#d4edda` |
| rct | 🔬🎲 | Upper-Mid | Yellow `#fff3cd` |
| cohort-study | 🔬👥 | Upper-Mid | Yellow `#fff3cd` |
| registry-data | 🗄️📊 | Upper-Mid | Yellow `#fff3cd` |
| case-control | 🔬🔄 | Lower-Mid | Red `#f8d7da` |
| cross-sectional | 🔬📸 | Lower-Mid | Red `#f8d7da` |

### Color Implementation

- Color derived from `type` field at build time (CSS class)
- Never manually entered in YAML or markdown
- Single source of truth: `type` field
- Health check validates `type` is in allowed enum

### CSS Variables

```css
:root {
  --tier-top: #d4edda;      /* Green - systematic reviews, meta-analyses, guidelines */
  --tier-mid: #fff3cd;      /* Yellow - RCTs, cohorts, registry data */
  --tier-lower: #f8d7da;    /* Red - case-control, cross-sectional */
}

.research-note[data-type="systematic-review"],
.research-note[data-type="meta-analysis"],
.research-note[data-type="guideline"],
.research-note[data-type="scoping-review"] {
  background-color: var(--tier-top);
}

.research-note[data-type="rct"],
.research-note[data-type="cohort-study"],
.research-note[data-type="registry-data"] {
  background-color: var(--tier-mid);
}

.research-note[data-type="case-control"],
.research-note[data-type="cross-sectional"] {
  background-color: var(--tier-lower);
}
```

---

## Health Checks

### New Checks

| Check | Command | Validates |
|-------|---------|-----------|
| Citations exist | `check:citations` | Every `/research/X` link in docs has matching file |
| No orphans | `check:orphans` | Every research note is referenced by ≥1 doc |
| Source types | `check:source-types` | Research note `type` is in allowed enum |

### Existing Checks (Unchanged)

| Check | Command | Validates |
|-------|---------|-----------|
| Frontmatter | `check:frontmatter` | Research notes match schema |
| Abbreviations | `check:abbreviations` | No "CP" in docs |
| Links | `check:links` | External URLs valid |

### Combined

```bash
npm run check:all  # Runs all checks
```

---

## Implementation Steps

### Phase 1: Schema & Infrastructure

| Step | Task | Output |
|------|------|--------|
| 1.1 | Extend `research/schema.json` with `id`, `author_short` | Updated schema |
| 1.2 | Add allowed `type` enum to schema | Updated schema |
| 1.3 | Update existing 9 research notes with new fields | Updated YAML |
| 1.4 | Create `check:citations` script | New health check |
| 1.5 | Create `check:orphans` script | New health check |
| 1.6 | Create `check:source-types` script | New health check |
| 1.7 | Update `check:all` to include new checks | Updated package.json |
| 1.8 | Add CSS for tier colors | Custom CSS file |
| 1.9 | Configure Docusaurus to render `/research/` as pages | docusaurus.config.js |

### Phase 2: Proof of Concept

| Step | Task | Output |
|------|------|--------|
| 2.1 | Convert `docs/assessment/overview.md` to new citation format | Converted page |
| 2.2 | Verify health checks pass | Validation |
| 2.3 | Test reader UX (click citation → research note) | UX validation |
| 2.4 | Verify tier colors render correctly | Visual validation |
| 2.5 | Adjust if needed | Refinements |

### Phase 3: Full Conversion

| Step | Task | Output |
|------|------|--------|
| 3.1 | Create missing research notes for all cited sources | ~47 new notes |
| 3.2 | Convert all doc pages to new citation format | Updated docs |
| 3.3 | Remove old footnote references | Cleanup |
| 3.4 | Run full health check suite | Validation |

### Phase 4: Documentation

| Step | Task | Output |
|------|------|--------|
| 4.1 | Update CLAUDE.md with new citation workflow | Updated memory |
| 4.2 | Update research/CLAUDE.md with schema changes | Updated index |
| 4.3 | Delete this implementation plan | Cleanup |

---

## Research Note Template (New)

```markdown
---
id: author-year
pubmed: 12345678
year: 2024
type: systematic-review
journal: Journal Name
authors: [Last First, Last First]
author_short: Last
tags: [topic1, topic2]
---

# Paper Title

📊🔍 Systematic Review | [PubMed](https://pubmed.ncbi.nlm.nih.gov/12345678/)

## Key Findings

> "Direct quote from source"

- Extracted data point
- Another data point
```

Page renders with green background (derived from `type: systematic-review`).

---

## Validation Criteria

Phase 2 complete when:
- [ ] `check:citations` passes
- [ ] `check:orphans` passes
- [ ] `check:source-types` passes
- [ ] `check:frontmatter` passes with new schema
- [ ] Click-through from doc → research note → external works
- [ ] Tier colors render correctly
- [ ] Build passes

Phase 3 complete when:
- [ ] All doc pages converted
- [ ] All citations have research notes
- [ ] `npm run check:all` passes
- [ ] Deployed to production

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| 47 new research notes is significant work | LLM can batch-create from existing footnote URLs |
| Docusaurus may not render `/research/` as pages | Configure as second docs plugin or defined route |
| Reader confusion on new format | Research notes explain themselves with header |
| CSS not applying to research pages | Test in Phase 2, adjust plugin config |

---

## Open Questions

1. Should `/research/` notes be public pages or internal-only?
   - **Decided**: Public (enables click-through UX)

2. Citation link format?
   - **Decided**: `[(Brunton, 2020)](/research/brunton-2020)` (parentheses signal citation)

3. How to apply CSS class from frontmatter `type`?
   - **Proposed**: Docusaurus plugin or remark plugin to inject `data-type` attribute

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-11-28 | Selected B+C+D+F | Highest score (120) on weighted criteria |
| 2024-11-28 | Emoji combinations for study type | Encodes dimensions (aggregated/primary, method) |
| 2024-11-28 | CSS background color for evidence tier | Derived from `type`, no manual entry, health-checkable |
| 2024-11-28 | Research notes as public pages | Enables click-through UX |
| 2024-11-28 | Exclude case reports | n=1 not generalizable, scored 95 vs 56 |
| 2024-11-28 | Exclude expert consensus | Opinion, not evidence |
