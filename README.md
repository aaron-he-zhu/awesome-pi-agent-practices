# Awesome Pi Agent Practices [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[English](README.md) | [简体中文](README.zh-CN.md)

Reproducible operating, customization, security, and integration practices for
the Pi coding agent.

> **AI-assisted research preview.** Source review does not mean hands-on
> verification, safety certification, or endorsement. Third-party candidates
> stay outside the featured list until named human maintainers test them and
> rewrite the recommendation from direct experience.

<!-- sync:root-contents -->

## Contents

- [Start Here](#start-here)
- [Practice Areas](#practice-areas)
- [Official Building Blocks](#official-building-blocks)
- [Evidence and Research](#evidence-and-research)
- [Community Review Queue](#community-review-queue)

<!-- sync:root-start -->

## Start Here

The shortest safe path through the collection:

| Step | Practice                                                                                                                               | Observable result                                                         |
| ---: | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
|    1 | [Pin the execution envelope](docs/practice-guide.md#p01--pin-and-record-the-execution-envelope).                                       | Pi/runtime/model/resource versions can be reconstructed.                  |
|    2 | [Create a recoverable Git baseline](docs/practice-guide.md#p02--start-from-a-recoverable-version-control-state).                       | Pre-existing and agent changes are distinguishable.                       |
|    3 | [Choose the real containment boundary](docs/practice-guide.md#p03--put-untrusted-or-unattended-work-behind-an-os-boundary).            | Untrusted work cannot reach unrelated files, credentials, or network.     |
|    4 | [Separate Project Trust from context and sandboxing](docs/practice-guide.md#p04--treat-project-trust-as-a-loading-gate-not-a-sandbox). | Resource loading and OS authority are controlled independently.           |
|    5 | [Start with a testable task brief](docs/practice-guide.md#p08--begin-with-a-testable-task-brief).                                      | Goal, scope, constraints, checks, and handoff are explicit.               |
|    6 | [Reconnoiter before writing](docs/practice-guide.md#p09--reconnoiter-read-only-then-expand-capabilities).                              | The first pass maps the code without changing it.                         |
|    7 | [Choose the least powerful customization primitive](docs/practice-guide.md#p11--choose-the-least-powerful-customization-primitive).    | Prompt, skill, extension, package, JSON, RPC, or SDK has a stated reason. |
|    8 | [Use the diagnosis ladder](docs/practice-guide.md#p28--diagnose-with-an-isolation-ladder).                                             | One controlled change toggles a sanitized minimal reproducer.             |

Read the complete [thirty-practice guide](docs/practice-guide.md), then use the
[troubleshooting playbook](docs/troubleshooting.md) when a check fails.

<!-- sync:root-areas -->

## Practice Areas

| Area                      | Practices                                                              | Main decision                                                         |
| ------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Baseline and recovery     | [P01–P02](docs/practice-guide.md#baseline-and-recovery).               | Can another person reproduce and safely roll back the run?            |
| Trust and containment     | [P03–P06](docs/practice-guide.md#trust-and-containment).               | What is loaded, what can execute, and what can it reach?              |
| Task and context design   | [P07–P11](docs/practice-guide.md#task-and-context-design).             | What is the smallest context and capability set that works?           |
| Session operations        | [P12–P16](docs/practice-guide.md#during-the-task).                     | Where does durable state live, and what is lossy or shareable?        |
| Models and reliability    | [P17–P20](docs/practice-guide.md#models-providers-and-reliability).    | Which provider/model behavior, retry owner, and output bound applies? |
| Extensions and packages   | [P21–P24](docs/practice-guide.md#extensions-and-packages).             | Does runtime code justify its lifecycle, authority, and supply chain? |
| Automation and embedding  | [P25–P27](docs/practice-guide.md#automation-and-embedding).            | Which process owns policy, sessions, cancellation, and cleanup?       |
| Diagnosis and maintenance | [P28–P30](docs/practice-guide.md#diagnosis-upgrades-and-contribution). | Can the failure, upgrade, and contribution be human-verified?         |

The [architecture decision map](docs/architecture.md) distinguishes stable
release behavior, experimental source, customization layers, trust boundaries,
session semantics, and integration modes.

<!-- sync:root-official -->

## Official Building Blocks

These are primary sources and reference implementations, not third-party
endorsements.

<!-- resource:official-pi -->

- [Pi](https://github.com/earendil-works/pi) - Canonical monorepo for tagged source, tests, releases, security boundaries, and contribution policy.

<!-- resource:official-docs -->

- [Documentation](https://pi.dev/docs/latest) - Current guides for usage, providers, sessions, resources, security, terminal setup, JSON, RPC, and SDK.

<!-- resource:official-releases -->

- [Releases](https://github.com/earendil-works/pi/releases) - Versioned notes and artifacts for selecting and preserving a reproducible baseline.

<!-- resource:official-extension-examples -->

- [Extension Examples](https://github.com/earendil-works/pi/tree/v0.83.0/packages/coding-agent/examples/extensions) - Reviewable implementations of lifecycle hooks, custom tools, providers, UI, policy, and tool-routing patterns.

<!-- resource:official-package-catalog -->

- [Package Catalog](https://pi.dev/packages) - Broad package discovery surface whose entries still require source, license, authority, compatibility, and hands-on review.

<!-- resource:official-rfcs -->

- [Pi RFCs](https://rfc.earendil.com/keyword/pi/) - Design proposals with explicit states that must be cross-checked against tagged implementation and release status.

<!-- sync:root-research -->

## Evidence and Research

| Read                                                                | Use it for                                                                                          |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Documentation map](docs/README.md)                                 | Choose a reading path and understand evidence labels.                                               |
| [Official source map](docs/research/source-map.md)                  | Replace memory/search snippets with version-pinned primary sources.                                 |
| [Evidence ledger](docs/research/evidence-ledger.md)                 | Trace every P01–P30 recommendation to facts and labeled inference.                                  |
| [Research methodology](docs/research/methodology.md)                | Review source tiers, inclusion gates, scoring, AI disclosure, and update procedure.                 |
| [Exact query log](docs/research/query-log.md)                       | Re-run the dated GitHub, catalog, registry, RFC, source, and community-review queries.              |
| [Ecosystem landscape](docs/research/landscape.md)                   | Inspect the dated project, catalog, issue-cluster, directory, and opportunity snapshot.             |
| [Ecosystem directory guide](docs/research/ecosystem-directories.md) | Choose among official, curated, automated, synthesized, and historical discovery surfaces.          |
| [Extension review](docs/extension-review.md)                        | Audit identity, install scripts, dependencies, authority, lifecycle, data flow, tests, and removal. |
| [Glossary](docs/glossary.md)                                        | Disambiguate Project Trust, session operations, tool limits, RPC, SDK, and containment.             |

Stable claims were checked against **v0.83.0** at
`845d6ff1f6643aba440341cce877ce1c43ebbc39`. Post-release observations are
pinned to `main@9b50b046d328d589a81400d2e184175d0bf19734` and labeled
`main-only`.

<!-- sync:root-queue -->

## Community Review Queue

The [source-review watchlist](docs/research/watchlist.md) contains twelve
source-reviewed candidates pending hands-on verification across VM isolation,
subagents, workflows, MCP, web and browser access, human review, code analysis,
memory, tracing, alternate UI, and broad operating layers. Each entry records
why it merits a trial and the specific authority, privacy, supply-chain,
lifecycle, or compatibility boundary that must be tested.

There are intentionally **no third-party featured entries yet**. Promotion
requires a named human reviewer, immutable artifact, disclosed relationship,
isolated trial, exact environment and commands, expected/actual results,
cleanup, residual risks, bilingual fact review, and an expiration/retest
trigger.

<!-- sync:root-related -->

## Related Lists

These projects answer adjacent discovery and ecosystem questions.

<!-- resource:related-awesome-pi -->

- [awesome-pi](https://github.com/BubblePtr/awesome-pi) - Active bilingual curated directory of Pi packages and ecosystem resources under CC0.

<!-- resource:related-automated-directory -->

- [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) - Automated, frequently refreshed directory optimized for breadth and discovery.

<!-- resource:related-package-index -->

- [Pi Package Index](https://github.com/getpipher/pi-package-index) - Unofficial daily-refreshed npm package index with searchable maintenance metadata and a public JSON API.

<!-- resource:related-ecosystem-wiki -->

- [pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) - Architecture, comparison, and ecosystem synthesis whose secondary claims should be verified against primary sources.

<!-- sync:root-contributing -->

## Contributing

Read the [contribution guide](CONTRIBUTING.md) before proposing a practice or
candidate. Contributions must state why the item is unusually useful, disclose
relationships and AI assistance, distinguish source review from direct use,
include reproducible evidence, and update both languages. Submissions are
offered under CC0-1.0.

<!-- sync:root-footnotes -->

## Footnotes

This independent community repository is not maintained by or affiliated with
Earendil Works. “Pi” and linked project names belong to their respective
owners.

Research snapshot: **2026-07-31, Asia/Singapore**. Dynamic counts, package
metadata, provider behavior, and `latest` documentation may have changed.

The central Awesome project's
[list-creation guide](https://github.com/sindresorhus/awesome/blob/main/create-list.md)
and
[current pull-request template](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
reject AI-generated lists and fully AI-generated pull requests. This
transparent research preview cannot honestly claim central-list eligibility
until substantive human testing, selection, rewriting, bilingual review, and
the required period of public maintenance have occurred.
