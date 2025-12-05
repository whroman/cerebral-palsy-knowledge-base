# Graph

The knowledge hierarchy and synthesis structure.

## Purpose

This directory contains the structural definition of domain knowledge, separate from the content itself. It answers: "How do concepts depend on each other?"

## Files

### hierarchy.yaml

Defines the 6-level knowledge hierarchy:

```
Level 0: Definition (what cerebral palsy is)
Level 1: Classification (GMFCS, MACS, CFCS)
Level 2: Manifestations (motor, associated, secondary)
Level 3: Assessment (how to measure)
Level 4: Intervention (treatment)
Level 5: Trajectory (life course)
```

Plus:
- **Operational content**: Finding services, transition, late diagnosis
- **Navigation pages**: Sitemap, glossary, symptom guide

Each node maps:
- `doc`: The docs/ page
- `research`: The research/ notes that back it

## Validation

```bash
npm run check:hierarchy
```

Validates:
- All docs in hierarchy exist
- All research in hierarchy exists
- All actual docs are accounted for in hierarchy

## Context Infection Defense

The hierarchy makes dependencies explicit. If a claim in Level 4 (Intervention) cites research, that research should appear in the hierarchy. If it doesn't, the chain of custody is broken.

Future instances: when adding content, update hierarchy.yaml to declare what research backs each doc.
