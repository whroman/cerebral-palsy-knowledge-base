# Docs

Human-readable projections of the synthesis graph.

## Relationship to Graph

Each doc page is a **projection** of a graph node. The doc page:
1. Presents claims in readable prose
2. Shows the chain of custody (claim → source → quote)
3. Links to related topics in the hierarchy

Docs are generated FROM the graph, not written independently.

## Format

Doc pages are Markdown with frontmatter linking to their graph node:

```yaml
---
title: Page Title
level: 0
graph_node: node-id
---
```

## Chain of Custody

Every doc page must include a "Chain of Custody" section showing:
- Each claim made on the page
- The source it comes from
- The specific claim ID for verification

This prevents context infection by making provenance explicit.

## Current Pages

### Level 0
- [definition.md](definition.md) - What is cerebral palsy?

### Levels 1-5
Not yet built. Process recursively from Level 0.
