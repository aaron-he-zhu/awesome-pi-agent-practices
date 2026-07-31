[English](./hands-on-review.md) | [简体中文](./hands-on-review.zh-CN.md)

# Third-party hands-on review

<!-- sync:trial-identity -->

## Identity and provenance

- Project/repository:
- Artifact/package:
- Exact reviewed commit/tag/version:
- Artifact integrity/provenance:
- Repository and artifact license:
- Reviewer and review date:
- Relationship/conflict disclosure:
- Material AI assistance:
- Current or legacy Pi scope:

Stop if identity, source mapping, or reuse license cannot be established.

<!-- sync:trial-environment -->

## Environment

- Pi version/commit/distribution:
- Node/Bun version:
- OS/architecture/terminal/shell:
- Provider/model/thinking/transport:
- Containment:
- Mounted files:
- Network policy:
- Test credentials/accounts/data:
- Session/trust/context/resource/tool flags:
- Baseline Git state:

<!-- sync:trial-source -->

## Source review

- Declared Pi resources:
- Entry points:
- Direct/transitive/native dependencies:
- Lockfile/release workflow:
- Lifecycle scripts/downloads/binaries:
- File/process/network/credential/session authority:
- Built-in tool overrides:
- Telemetry/external transfer/retention:
- Persistent state/cache:
- Update, rollback, uninstall, and deletion:
- Tests and CI observed:
- Maintenance/compatibility evidence:

<!-- sync:trial-matrix -->

## Behavioral matrix

For each row, record exact command, expected, actual, pass/fail/skip, sanitized
evidence, and cleanup.

| Case | Required question | Result |
| --- | --- | --- |
| Install | Did files, processes, scripts, downloads, and network match the source map? |  |
| Startup denied trust | Was there any unexplained action or protected resource load? |  |
| Happy path | Did the smallest documented example work? |  |
| Missing credential | Did it fail clearly without finding a broader credential? |  |
| Network denied | Did it time out finitely and preserve state? |  |
| File denied/out of scope | Did it fail closed without partial destructive work? |  |
| Invalid/oversized input | Did schema/validation reject safely? |  |
| Concurrency | Did shared state/files remain correct? |  |
| Cancellation | Did child work stop and clean up? |  |
| Oversized output | Was truncation explicit and continuation retrievable? |  |
| Reload/session replacement | Were handlers/resources rebound exactly once? |  |
| Shutdown mid-work | Were processes, ports, timers, and temporary secrets removed? |  |
| Offline/data flow | Were outbound hosts and payload categories exactly as disclosed? |  |
| Update/rollback | Could the reviewed ref be restored? |  |
| Uninstall/delete | Did loading stop and documented state/cache get removed? |  |

<!-- sync:trial-observations -->

## Observed authority and data flow

| Surface | Expected | Observed | Control | Residual risk |
| --- | --- | --- | --- | --- |
| Files |  |  |  |  |
| Processes |  |  |  |  |
| Network |  |  |  |  |
| Credentials |  |  |  |  |
| Session/model content |  |  |  |  |
| Persistent data |  |  |  |  |

<!-- sync:trial-decision -->

## Decision

- Decision: rejected / `source-reviewed` / `hands-on-verified` / `featured`.
- Why it is unusually useful:
- Failed/skipped cases:
- Blocking issues:
- Compensating controls:
- Residual risks:
- Supported scope:
- Retest triggers:
- Verification expires:
- Human-authored recommendation draft:

Passing this review does not certify safety. The `featured` status requires separate
maintainer editorial judgment and bilingual review.
