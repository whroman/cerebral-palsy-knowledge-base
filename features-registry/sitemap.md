# Sitemap

Visual map of all wiki content helping users navigate and discover pages.

## Entry Point

- `docs/sitemap.md`

## Health Check

```bash
npm run check:sitemap
```

Validates:
- All docs listed in sitemap.md exist
- All docs in /docs/ are listed in sitemap.md (no orphan pages)
- Sitemap structure matches actual file structure

## Design

The sitemap serves as:
1. **Navigation aid** - Users can see all available content at a glance
2. **Discovery tool** - Users find pages they didn't know existed
3. **IA documentation** - The declared structure is the actual structure
