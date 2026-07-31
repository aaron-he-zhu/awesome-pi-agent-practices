[English](./ecosystem-directories.md) | [简体中文](./ecosystem-directories.zh-CN.md)

# Pi ecosystem discovery directories

Reviewed **2026-07-31, Asia/Singapore**. Live directories change independently
of this repository; immutable review snapshots are linked below.

<!-- sync:directories-purpose -->

## Purpose and boundary

Pi already has several useful discovery surfaces. This guide links them
directly, explains what each one is good at, and preserves enough status
context to choose between them.

A directory entry is a lead, not an endorsement. Catalog presence, stars,
download counts, generated descriptions, and an `awesome` label do not prove
source identity, current Pi compatibility, safe runtime authority, or
hands-on quality. Use a directory to find candidates, then verify each
candidate at its canonical source.

This repository does not copy those catalogs. Its separate job is to document
reproducible operating practices, evidence, trust boundaries, verification,
and rollback.

<!-- sync:directories-chooser -->

## Quick chooser

| Goal | Open first | Why | Important limit |
| --- | --- | --- | --- |
| Browse the broad npm-published ecosystem | [Official Pi Package Catalog](https://pi.dev/packages) | First-party discovery UI with package pages, install commands, source/npm links, and resource-type filters. | Catalog presence is not this repository's source, security, compatibility, or hands-on review. |
| Start from a smaller bilingual shortlist | [BubblePtr/awesome-pi](https://github.com/BubblePtr/awesome-pi) | Human-organized Chinese and English package/resource categories. | Manual selection and descriptions still require independent verification. |
| Maximize breadth and recency | [shaftoe/awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) or its [searchable site](https://awesome-pi.site/) | Automated daily discovery, classification, and rendering. | Automated, LLM-reviewed classification can include noise, adjacent projects, and stale metadata. |
| Search or consume package metadata programmatically | [Pi Package Index](https://pi-package.rectorspace.com/) and its [JSON API](https://pi-package.rectorspace.com/api/packages) | Daily npm index enriched with GitHub and maintenance signals. | It is unofficial and automated; ranking inputs are not quality or security evidence. |
| Compare architectural approaches | [micuintus/pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) | Topic surveys, comparisons, navigation, and “how to pick” notes. | It is an LLM-oriented synthesis; verify secondary claims against primary sources. |
| Understand earlier ecosystem history | [qualisero/awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent) | Preserves an earlier list and its retirement notice. | The repository is archived and explicitly says it is outdated. |

If none of these surfaces finds a project, the
[GitHub `pi-agent` topic](https://github.com/topics/pi-agent) is a useful raw
fallback. Topic membership is self-assigned, incomplete, and not curated.

<!-- sync:directories-official -->

## Official catalog filters

The official catalog can be opened directly at the resource type you want:

- [All packages](https://pi.dev/packages)
- [Extensions](https://pi.dev/packages?type=extension)
- [Skills](https://pi.dev/packages?type=skill)
- [Themes](https://pi.dev/packages?type=theme)
- [Prompt templates](https://pi.dev/packages?type=prompt)

One package can declare more than one resource type, so the filtered views can
overlap. The catalog is the best starting point for npm-published breadth, but
Git packages, local packages, examples, and ecosystem tools may appear only in
community directories.

Use the official [Packages documentation](https://pi.dev/docs/latest/packages)
for installation, source, manifest, dependency, and authoring behavior, and the
[Extensions documentation](https://pi.dev/docs/latest/extensions) for the API
and lifecycle. Those pages teach how the mechanisms work; they are not
separate community directories. At the review date, extension discovery used
the catalog's `type=extension` filter rather than a separate top-level
extension catalog.

<!-- sync:directories-current -->

## Current community navigation

These four sources remain in the root [Related Lists](../../README.md#related-lists)
because they provide distinct, currently useful navigation models.

| Directory | Update model at review | License | Best use | Reviewed snapshot |
| --- | --- | --- | --- | --- |
| [awesome-pi](https://github.com/BubblePtr/awesome-pi) | Maintainer-curated, bilingual list with recent substantive updates. | CC0-1.0 | A compact Chinese/English shortlist grouped by use case. | [`64bc5f2…`](https://github.com/BubblePtr/awesome-pi/commit/64bc5f217272110ba9602ea735197678ede52b17) |
| [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) | Automated discovery-to-render pipeline scheduled daily. | MIT | Broad, recent package/repository discovery and site search across indexed names, descriptions, and categories. | [`ec09125…`](https://github.com/shaftoe/awesome-pi-coding-agent/commit/ec0912594a01cabea416d6186afe13d2ebb4d9ca) |
| [Pi Package Index](https://github.com/getpipher/pi-package-index) | Daily npm/GitHub metadata pipeline with searchable web UI and public API. | MIT | Package filtering, machine-readable indexing, and maintenance-signal triage. | [`115a35b…`](https://github.com/getpipher/pi-package-index/commit/115a35bf0dc467db7f30a4a3fd3de740f7dadd8f) |
| [pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) | Maintained LLM-wiki pages organized around ecosystem questions and comparisons. | MIT | Understanding categories, alternatives, architectural patterns, and selection questions. | [`8cc9e98…`](https://github.com/micuintus/pi-ecosystem-wiki/commit/8cc9e98e8c6f2574859482a9655b4d4479ab3988) |

“Current” here means suitable as an active discovery entry point at the review
date. It does not mean every linked item is maintained, compatible, safe, or
tested. A directory's listed license covers that directory's content or code,
not the independently licensed projects it links.

Package scope is not publisher identity: an unscoped npm name does not prove
that Earendil Works maintains a package. Confirm the npm publisher, repository,
manifest, and release provenance instead of inheriting an “official” label from
a community list.

<!-- sync:directories-context -->

## Historical and screened-out lists

The retired list preserves history. The other links document alternate catalog
designs that were examined but did not meet the current-navigation gate.

| Directory | Observed state on 2026-07-31 | License | Useful for | Why it is not in root navigation |
| --- | --- | --- | --- | --- |
| [qualisero/awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent) | GitHub-archived; its README says the list is retired and outdated. | MIT | Historical names, categories, and list lineage. | It is not a current compatibility source. [Reviewed snapshot `d2ffdd4…`](https://github.com/qualisero/awesome-pi-agent/commit/d2ffdd4433fc4f64a59c8ffbb9a344a32ee669a7). |
| [Traveler0014/awesome-pi-agent](https://github.com/Traveler0014/awesome-pi-agent) | Structured YAML registry and generated README, but the scheduled metadata updater was failing and content had not advanced beyond the initial June snapshot. | MIT license file; README metadata disagreed. | Studying a schema-backed, generated extension-list design. | Failed refresh, stale upstream paths, and inconsistent metadata. [Reviewed snapshot `9f62023…`](https://github.com/Traveler0014/awesome-pi-agent/commit/9f62023d73073dccb431201a06be5aee9e925aa3). |
| [afoofaa/awesome-pi-mono](https://github.com/afoofaa/awesome-pi-mono) | Seeded in May with no later substantive update at review time. | MIT | Comparing an earlier manually categorized list layout. | No continuing maintenance, old upstream paths, and a failed initial link check. [Reviewed snapshot `fa37800…`](https://github.com/afoofaa/awesome-pi-mono/commit/fa3780084c90244ac88154d087146f6e734f6117). |

Empty repositories, a single extension whose name contains `awesome`, personal
configuration repositories, and generic AI-agent lists were excluded because
they do not provide an independently useful Pi ecosystem directory.

[Leoguy77/pi-packages.nix](https://github.com/Leoguy77/pi-packages.nix) was
also screened as a specialized Nix-native generated registry. It is active and
technically interesting, but it is not a general Awesome directory. At the
[reviewed snapshot `ab97786…`](https://github.com/Leoguy77/pi-packages.nix/commit/ab977868c85409142df3c7dc1b3e98281dde5617),
its README declared MIT, while the tree had no standalone license file and
GitHub detected no SPDX license. The same README documents fallback/build paths
that can disable the Nix sandbox and TLS verification. Treat it as a
supply-chain research lead, not a general discovery recommendation.

<!-- sync:directories-workflow -->

## Turn discovery into a reviewable decision

For every candidate found through a catalog or list:

1. Open the canonical source repository and confirm the package name, owner,
   install target, and linked npm identity agree.
2. Record the Pi version, runtime, platform, provider/model, package version,
   and exact Git tag or commit you intend to use.
3. Inspect the manifest, install/lifecycle scripts, direct and transitive
   dependencies, native binaries, network destinations, data retention, and
   license.
4. Map runtime authority. Pi extensions execute in process and can use normal
   process APIs; a tool allowlist alone is not a complete sandbox.
5. Run the pinned artifact in a disposable or OS-contained environment with
   non-production credentials and representative test data.
6. Record expected and actual results, cleanup, residual files/services, and
   an expiration or retest trigger.

Use the [extension and package review](../extension-review.md) for the detailed
checklist. Source-reviewed candidates that still need a named human trial live
in the separate [community watchlist](./watchlist.md).

<!-- sync:directories-linking -->

## Linking and indexing practice

When this repository references another directory:

- link its canonical repository or official site rather than copying its
  entries;
- state whether it is official, human-curated, automated, synthesized,
  screened-out, context-only, or archived;
- preserve the upstream license and an immutable reviewed commit when making
  status claims;
- explain the directory's distinct value and its main verification limit;
- do not require a reciprocal link and do not imply affiliation or
  endorsement.

This gives maintainers useful outbound discovery links while letting search
engines and readers reach the original source, contribution rules, history,
and license.

<!-- sync:directories-method -->

## Search and maintenance notes

The review combined the official catalog, cross-references among existing
directories, GitHub repository/topic search, repository metadata, README and
license inspection, commit history, and automation status. Representative
repository queries included:

```text
"pi coding agent" awesome in:name,description,readme
"pi package" directory "pi.dev" in:readme
awesome pi coding agent
```

Search results and repository state are dynamic, so this is a bounded
inventory, not a claim that no other list exists. At each research-snapshot
refresh:

1. Re-run discovery and inspect new name collisions.
2. Re-check archive state, license, latest substantive commit, and scheduled
   automation results.
3. Keep only distinct, current, useful sources in the root Related Lists.
4. Move retired, stalled, or failed-gate directories to historical or
   screened-out status without erasing their history.
5. Update both languages and the machine-readable resource registry together.

For the broader dated evidence, see the
[ecosystem landscape](./landscape.md), [exact query log](./query-log.md), and
[research methodology](./methodology.md).
