# Feature Registry

## Purpose

Track implemented features so future agents:
- Know what exists before building something new
- Know where to look when modifying functionality
- Don't accidentally break working features

## Operating Rules

1. One file per feature
2. Each feature file must specify its entry point
3. This index must list all feature files

## Health Check

```bash
npm run check:features
```

Validates:
- All .md files in features-registry/ (except CLAUDE.md) are listed below
- Entry points in feature files reference existing files

## Feature Index

- [citation-sidebar.md](citation-sidebar.md) - Slide-out panel for source details
- [sitemap.md](sitemap.md) - Visual map of wiki content for navigation
