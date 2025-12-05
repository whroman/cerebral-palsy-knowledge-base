# Graph

Synthesis nodes that compose claims from sources into coherent topics.

## Structure

Each graph node represents a topic in the knowledge hierarchy:

```
Level 0: Definition (what cerebral palsy is)
Level 1: Classification (GMFCS, MACS, CFCS)
Level 2: Manifestations (motor, associated, secondary)
Level 3: Assessment (how to measure)
Level 4: Intervention (treatment)
Level 5: Trajectory (life course)
```

## Format

Graph nodes are YAML files containing:
- **Metadata**: level, title, description
- **Synthesis**: claims grouped by section, each tracing to source
- **Dependencies**: what this node requires understanding of
- **Enables**: what nodes build on this one

```yaml
id: topic-name
level: 0
title: Human-readable title

synthesis:
  - section: Section Name
    claims:
      - source: source-file-id
        claim_id: claim-id-in-source
        summary: Plain language synthesis

depends_on: []
enables: [downstream-nodes]
```

## Current Nodes

### Level 0
- [level-0-definition.yaml](level-0-definition.yaml) - What is cerebral palsy?

### Levels 1-5
Not yet built. Process recursively from Level 0.
