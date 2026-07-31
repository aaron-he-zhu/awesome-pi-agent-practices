[English](./README.md) | [简体中文](./README.zh-CN.md)

# Documentation map

<!-- sync:docs-scope -->

This repository is a practice guide, not a mirror of Pi's documentation and not
another exhaustive package directory. It answers four questions:

1. What should a careful Pi user do before, during, and after a task?
2. Which Pi primitive fits a workflow: context file, prompt template, skill,
   extension, package, SDK, JSON stream, or RPC?
3. What evidence supports each recommendation, and against which version?
4. How should a maintainer evaluate community material without turning the list
   into an unreviewed feed?

The research snapshot is **2026-07-31**. Stable behavior was checked against
**v0.83.0** (`845d6ff1…`); post-release facts from `main` are pinned to
`9b50b046…` and explicitly marked as such.

<!-- sync:docs-reading-paths -->

## Choose a reading path

| If you want to… | Start with | Then read |
| --- | --- | --- |
| Use Pi safely on a real repository | [Practice guide](practice-guide.md) | [Troubleshooting](troubleshooting.md) |
| Understand the moving parts | [Architecture](architecture.md) | [Official source map](research/source-map.md) |
| Adopt a third-party package | [Extension review](extension-review.md) | [Landscape](research/landscape.md) |
| Embed Pi in another program | [Architecture: integration modes](architecture.md#integration-modes) | [Practice guide: automation](practice-guide.md#automation-and-embedding) |
| Verify this repository's claims | [Methodology](research/methodology.md) | [Evidence ledger](research/evidence-ledger.md) |
| Reproduce dated dynamic counts | [Exact query log](research/query-log.md) | [Ecosystem landscape](research/landscape.md) |
| Propose a new practice | [Contributing](../CONTRIBUTING.md) | [Practice template](../templates/practice-proposal.md) |
| Find ecosystem directories | [Ecosystem directory guide](research/ecosystem-directories.md) | [Extension review](extension-review.md) |

<!-- sync:docs-library -->

## Practice library

- [Architecture and decision guide](architecture.md) — stable and experimental
  layers, resource loading, trust boundaries, sessions, and integration modes.
- [End-to-end practice guide](practice-guide.md) — thirty reproducible practices
  with rationale, action, verification, and primary evidence.
- [Extension and package review](extension-review.md) — source, dependency,
  permission, runtime, data, and maintenance checks before adoption.
- [Troubleshooting playbook](troubleshooting.md) — a minimal-reproduction ladder
  for provider, extension, terminal, session, and installation failures.
- [Glossary](glossary.md) — precise meanings for Pi-specific terms that are easy
  to conflate.

<!-- sync:docs-research -->

## Research library

- [Methodology and inclusion policy](research/methodology.md) — source tiers,
  search coverage, scoring, exclusions, limitations, and update procedure.
- [Ecosystem and issue landscape](research/landscape.md) — quantitative
  snapshot, recurring problem clusters, and opportunity map.
- [Ecosystem discovery directories](research/ecosystem-directories.md) —
  official, curated, automated, synthesized, and historical discovery
  surfaces, with selection and verification boundaries.
- [Exact query log](research/query-log.md) — preserved endpoints, query strings,
  immutable refs, capture limits, and re-run procedure for the dated snapshot.
- [Official source map](research/source-map.md) — version-pinned primary links
  grouped by question.
- [Evidence ledger](research/evidence-ledger.md) — claim-to-source traceability
  for every numbered practice.
- [Community watchlist](research/watchlist.md) — source-reviewed candidates that
  still require hands-on maintainer validation before recommendation.

<!-- sync:docs-status -->

## Evidence status

Every substantial statement should be distinguishable as one of:

- **Stable** — documented for v0.83.0 or verified in its tagged source.
- **Main-only** — observed after v0.83.0 at the pinned `main` commit; not promised
  by the stable release.
- **Experimental** — explicitly described upstream as unstable.
- **Community** — supported by a public third-party source, not by the Pi
  maintainers.
- **Inference** — a recommendation derived from multiple sources; the supporting
  facts are cited and the inference is labeled.

Numbers such as stars, downloads, issue counts, and catalog size belong only in
dated research snapshots. They are intentionally excluded from recommendations.

<!-- sync:docs-bilingual -->

## Bilingual maintenance

English files use `.md`; Simplified Chinese peers use `.zh-CN.md`. Hidden
`sync:` markers identify equivalent sections and practice IDs. Run:

```bash
npm ci --ignore-scripts
npm run check
```

The check fails when a required language peer is missing, sync markers diverge,
or the machine-readable resource registry and the two root lists disagree.
Translation parity means equivalent facts and scope, not sentence-for-sentence
word order.
