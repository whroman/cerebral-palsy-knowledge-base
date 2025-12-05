# Sources

Source nodes in the synthesis graph. Each file represents one Tier 1 source.

## Format

Sources are YAML files containing:
- **Metadata**: pubmed ID, year, authors, journal, type
- **Claims**: Verbatim quotes with unique IDs

```yaml
id: author-year-journal
pubmed: 12345678
url: https://...
year: 2025
type: systematic-review
journal: Journal Name
authors: [...]

claims:
  - id: claim-identifier
    quote: "Exact verbatim quote from source"
```

## Chain of Custody

The `claims` array is the chain of custody. Every quote is:
1. Verbatim from the source
2. Identified by a unique ID
3. Traceable from doc pages back to this file

## Current Sources

- [novak-2025-lancet.yaml](novak-2025-lancet.yaml) - Lancet Seminar 2025 (comprehensive overview)
