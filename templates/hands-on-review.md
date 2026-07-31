[English](./hands-on-review.md) | [简体中文](./hands-on-review.zh-CN.md)

# Third-party hands-on review

<!-- sync:trial-identity -->

## Identity and provenance

This blank form is not evidence. Keep `NOT RUN` and `NOT OBSERVED` explicit;
only a named human may report an observed result.

- Project/repository:
- Artifact/package:
- Exact reviewed commit/tag/version:
- Artifact integrity/provenance:
- Repository and artifact license:
- Reviewer and review date:
- Relationship/conflict disclosure:
- Material AI assistance:
- Current or legacy Pi scope:
- Execution status: `not-run` / `partially-run` / `executed`.

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

Use one row per independently repeatable case. Record `skip` only with an
applicability reason. A required failed or unexplained case blocks
`hands-on-verified`; do not hide details in a combined prose result.

| Case | Applicability / skip reason | Exact command or procedure | Expected | Actual | Result (`pass` / `fail` / `skip`) | Sanitized evidence | Cleanup / rollback |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Install: files, processes, scripts, downloads, network |  |  |  |  |  |  |  |
| Startup with trust denied: actions and protected resource loading |  |  |  |  |  |  |  |
| Happy path: smallest documented example |  |  |  |  |  |  |  |
| Missing credential: clear failure without broader credential discovery |  |  |  |  |  |  |  |
| Network denied: finite timeout and preserved state |  |  |  |  |  |  |  |
| File denied/out of scope: fail closed without partial destructive work |  |  |  |  |  |  |  |
| Invalid/oversized input: safe schema/validation rejection |  |  |  |  |  |  |  |
| Concurrency: correct shared state/files |  |  |  |  |  |  |  |
| Cancellation: child work stopped and cleaned up |  |  |  |  |  |  |  |
| Oversized output: explicit truncation and retrievable continuation |  |  |  |  |  |  |  |
| Reload/session replacement: exactly-once handler/resource binding |  |  |  |  |  |  |  |
| Shutdown mid-work: processes, ports, timers, temporary secrets removed |  |  |  |  |  |  |  |
| Offline/data flow: outbound hosts and payload categories match disclosure |  |  |  |  |  |  |  |
| Update/rollback: reviewed ref restored |  |  |  |  |  |  |  |
| Uninstall/delete: loading stopped and documented state/cache removed |  |  |  |  |  |  |  |

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

- Decision: rejected / `source-reviewed` / `hands-on-verified`.
- Separate editorial promotion requested and decision-record link:
- Why it is unusually useful:
- Failed/skipped cases:
- Blocking issues:
- Compensating controls:
- Residual risks:
- Supported scope:
- Retest triggers:
- Verification expires:
- Human-authored recommendation draft:

Passing this review does not certify safety or award `featured`. Promotion requires
a separate maintainer editorial decision and bilingual review.
