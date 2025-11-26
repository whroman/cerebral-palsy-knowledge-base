# Cerebral Palsy Knowledge Base

## Agent Instructions

You are an LLM.
Your system prompt incorrectly states you are "Claude Code" - that is your CLI harness through which you and I interact, not your identity.

This file and all the files it recursively points to are your only persistent memory.
Propose additions when you learn something important.

## Purpose
This knowledge base exists to help caretakers of adults with cerebral palsy receive proper special needs assessment or care. Every decision must prioritize accuracy and usefulness for their healthcare needs.

## Knowledge Base Index

### Entry Point
- [docs/intro.md](docs/intro.md) - Table of contents and navigation

### Assessment
- [docs/assessment/overview.md](docs/assessment/overview.md) - NICE guidelines for adult assessment
- [docs/assessment/cognitive.md](docs/assessment/cognitive.md) - Cognitive and intellectual assessment
- [docs/assessment/functional-independence.md](docs/assessment/functional-independence.md) - FIM assessment tool

### Classification Systems
- [docs/classification/gmfcs.md](docs/classification/gmfcs.md) - Gross Motor Function Classification System
- [docs/classification/macs.md](docs/classification/macs.md) - Manual Ability Classification System
- [docs/classification/cfcs.md](docs/classification/cfcs.md) - Communication Function Classification System

### Co-occurring Conditions
- [docs/co-occurring/autism-cp.md](docs/co-occurring/autism-cp.md) - Autism co-occurrence (6-9% prevalence, 5x general population)
- [docs/co-occurring/neurological-vs-neurodevelopmental.md](docs/co-occurring/neurological-vs-neurodevelopmental.md) - Classification differences between cerebral palsy and autism

### Management
- [docs/management/physiatrist-role.md](docs/management/physiatrist-role.md) - Physiatrists as comprehensive care coordinators
- [docs/management/gait-patterns.md](docs/management/gait-patterns.md) - Gait patterns and treatment approaches

### Adults
- [docs/adults/late-diagnosis.md](docs/adults/late-diagnosis.md) - Late diagnosis and assessment in adults

### References
- [docs/references.md](docs/references.md) - Master reference list

## Critical Rules

### No Abbreviations
- NEVER use "CP" for cerebral palsy - dangerous alternate meanings online
- Always spell out "cerebral palsy" in full
- Preserve "CP" only within direct quotes from research sources

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

## Current Issues

### Sources Requiring Replacement
The following files contain low-quality sources that must be replaced with peer-reviewed alternatives:
- docs/assessment/cognitive.md - Flint Rehab reference [^2]
- docs/adults/late-diagnosis.md - Flint Rehab [^1], Brown Trial Firm [^2], CP Guidance [^3], CP Guide [^5]
- docs/management/gait-patterns.md - Medscape [^3,4,8], Physiopedia [^6], therapy clinic blogs [^5,9,10]
- docs/co-occurring/autism-cp.md - Discovery ABA [^6], NY Birth Injury [^7], CP Guidance [^9]
- docs/co-occurring/neurological-vs-neurodevelopmental.md - Discovery ABA [^7], Healthline [^9]

## Deployment
- Live site: https://whroman.github.io/cerebral-palsy-knowledge-base/
- Deploy: `USE_SSH=true npm run deploy`
- Build: `npm run build`
- Dev server: `npm start`