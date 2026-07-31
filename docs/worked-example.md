[English](./worked-example.md) | [简体中文](./worked-example.zh-CN.md)

# Worked evaluation example

<!-- sync:worked-warning -->

> **Example only — no hands-on verification occurred.** The repository, commit,
> commands, outputs, and dates below are fictional teaching data. Every case is
> marked `skip` and every actual result says `NOT RUN`. Do not cite this page as
> evidence about a real artifact.

This page shows how to fill the
[evaluation record template](../templates/evaluation-record.md) without turning
an expected result into an observed result.

<!-- sync:worked-identity -->

## Identity and status

- **Record ID:** `EXAMPLE-DOC-001`.
- **Subject and claim:** a fictional documentation-only change is claimed to fix
  one broken local link without changing runtime behavior.
- **Repository/artifact:** `https://example.invalid/acme/pi-demo` (reserved,
  non-resolving example domain); no published artifact.
- **Exact commit:** `1111111111111111111111111111111111111111` (fictional).
- **Artifact integrity/source mapping:** not applicable; documentation-only
  example.
- **Linked record:** this page demonstrates
  [the reusable template](../templates/evaluation-record.md).
- **Named human evaluator:** none — example author is not an evaluator.
- **Evaluation date/time:** `NOT OBSERVED`; illustrative date `2026-07-31`.
- **Relationship/conflict disclosure:** none; the subject does not exist.
- **Material AI assistance:** example text may be AI-assisted; no result is
  represented as human-observed.
- **Execution status:** `not-run`.
- **Review stage:** `not-reviewed`; not `source-reviewed` or
  `hands-on-verified`.
- **Record disposition:** `example-only`; not `featured`.

<!-- sync:worked-scope -->

## Scope and proposed environment

- **Applies to:** the fictional `docs/guide.md` link change only.
- **Does not apply to:** Pi runtime behavior, packages, providers, security, or
  compatibility.
- **Proposed runtime:** Node.js `22.23.1` on macOS arm64 with npm `10.9.8`.
- **Proposed repository baseline:** fictional clean commit
  `1111111111111111111111111111111111111111`.
- **Containment/network:** local documentation checks; package installation
  would require registry access, but no command was run.
- **Credentials/data:** none expected; not observed.
- **Assumption:** the target file exists. Falsify by running the local-link
  checker in the fictional repository.

<!-- sync:worked-boundary -->

## Authority and data boundary

| Surface | Expected authority/data | Control | Actual | Residual risk |
| --- | --- | --- | --- | --- |
| Files | Read repository Markdown and installed tooling | Run in a clean disposable clone | `NOT OBSERVED` | An implementation could read unrelated files |
| Processes | Node/npm child processes | Use exact commands and finite CI timeout | `NOT OBSERVED` | Dependency tooling was not assessed |
| Network | npm registry during install; none for local-link check | Use `npm ci --ignore-scripts` | `NOT OBSERVED` | Transitive packages still download |
| Credentials | None | Empty test environment | `NOT OBSERVED` | Environment inheritance was not tested |
| Session/model content | None | Do not export a Pi session | `NOT OBSERVED` | No runtime trial occurred |
| Persistent data | `node_modules` and npm cache if installed | Disposable clone and documented cleanup | `NOT OBSERVED` | Cleanup was not verified |

<!-- sync:worked-cases -->

## Evaluation cases

| Case ID | Requirement/source | Preconditions | Exact command or procedure | Expected | Actual | Result | Evidence | Cleanup / rollback |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DOC-01` | Local link resolves | Fictional commit checked out; dependencies present | From repository root: `node scripts/check-local-links.mjs` | Exit `0`; output names zero missing files/anchors | `NOT RUN — teaching example` | `skip`: no human execution | None | No cleanup expected; restore the fictional patch if the check fails |
| `DOC-02` | Full repository checks remain green | Same baseline; exact lockfile | From repository root: `npm ci --ignore-scripts && npm run check` | Both commands exit `0`; no generated tracked changes | `NOT RUN — teaching example` | `skip`: no human execution | None | Delete disposable clone; do not treat expected output as evidence |
| `DOC-03` | Change can be reversed | A reviewed change commit exists | Review the inverse diff, then run `git revert --no-edit <fictional-change-commit>` | Link returns to the baseline target and checks still pass | `NOT RUN — teaching example` | `skip`: no change commit exists | None | Rollback itself requires review; no rollback was performed |

<!-- sync:worked-summary -->

## Summary and decision

- **Passed:** none.
- **Failed:** none.
- **Skipped:** `DOC-01`, `DOC-02`, and `DOC-03`; this is intentionally not an
  executed review.
- **Supported conclusion:** the record format keeps command, expected, actual,
  result, evidence, and rollback distinct.
- **Unsupported conclusions:** the fictional link is fixed; commands pass; the
  change is safe; any artifact is verified or featured.
- **Residual risk:** all behavior remains unknown until a named human runs the
  cases in a real pinned repository.
- **Review-stage decision:** `not-reviewed`.
- **Record disposition:** `revise` / `example-only`; not eligible for
  recommendation.
- **Retest trigger:** replace all fictional identity/environment values and run
  every applicable case.
- **Verification expires:** not applicable because no verification exists.

<!-- sync:worked-delivery -->

## Delivery and rollback

- **Reader-facing outcome:** one worked example of honest `NOT RUN` reporting.
- **Files/artifacts:** this documentation page only; no logs or runtime output.
- **Checks:** zero passed, zero failed, three skipped.
- **Exact versions/refs delivered:** none; all subject refs are fictional.
- **Data/network/credential effects:** none observed because nothing was run.
- **Generated artifacts/cleanup:** none.
- **Rollback:** remove the example page if it is no longer useful; a real change
  should use a reviewed inverse patch or revert commit.
- **Rollback verification:** `NOT RUN`.
- **Next human decision:** decide whether to copy the template for a real,
  separately identified evaluation.

<!-- sync:worked-attestation -->

## Attestation state

- [ ] A named human ran the cases. *(Intentionally unchecked.)*
- [x] Actual results are explicitly `NOT RUN` / `NOT OBSERVED`.
- [x] The example makes no `source-reviewed`, `hands-on-verified`, `featured`,
  secure, sandboxed, or certified claim.
