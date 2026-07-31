[English](./evaluation-record.md) | [简体中文](./evaluation-record.zh-CN.md)

# Evaluation record

<!-- sync:evaluation-warning -->

Use this record for a reproducible source review, trial, or acceptance check.
Keep `NOT RUN` and `NOT OBSERVED` explicit. Never turn a proposed command,
expected result, CI badge, or AI-generated summary into a `pass` result.

<!-- sync:evaluation-identity -->

## Identity and status

- **Record ID:**
- **Subject and claim being evaluated:**
- **Repository/artifact:**
- **Exact version/tag/commit:**
- **Artifact integrity or source mapping:**
- **Linked proposal/task brief/run manifest:**
- **Named human evaluator:**
- **Evaluation date, time, and time zone:**
- **Relationship/conflict disclosure:**
- **Material AI assistance:**
- **Execution status:** `not-run` / `partially-run` / `executed`.
- **Review stage:** `not-reviewed` / `source-reviewed` /
  `hands-on-verified`.
- **Record disposition:** `example-only` / `revise` / `accept` / `rejected`.

`featured` is not an evaluation result. It requires a separate maintainer
editorial decision and bilingual review.

`source-reviewed` requires a named human to open and inspect every cited source.
`hands-on-verified` additionally requires that human to execute the applicable
cases and observe the recorded actual results.

<!-- sync:evaluation-scope -->

## Scope and environment

- **Applies to:**
- **Does not apply to:**
- **Pi version/commit/distribution:**
- **Runtime, OS, architecture, terminal, and shell:**
- **Provider/model/thinking/transport, if relevant:**
- **Repository baseline and pre-existing changes:**
- **Containment, mounts, and network policy:**
- **Test credential/account/data category:**
- **Session/trust/context/resource/tool policy:**
- **Assumptions and how to falsify them:**

<!-- sync:evaluation-boundary -->

## Authority and data boundary

| Surface | Expected authority/data | Control or containment | Observed | Residual risk |
| --- | --- | --- | --- | --- |
| Files |  |  |  |  |
| Processes |  |  |  |  |
| Network |  |  |  |  |
| Credentials |  |  |  |  |
| Session/model content |  |  |  |  |
| Persistent data |  |  |  |  |

<!-- sync:evaluation-cases -->

## Evaluation cases

Use one row for each independently repeatable case. Record an exact working
directory and prerequisites with the command when they matter. A `skip` needs a
reason; a `pass` needs an observed result and sanitized evidence.

| Case ID | Requirement/source | Preconditions | Exact command or procedure | Expected | Actual | Result (`pass` / `fail` / `skip`) | Sanitized evidence | Cleanup / rollback |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

<!-- sync:evaluation-evidence -->

## Evidence inventory

Do not include credentials, private source/session content, signed URLs,
browser profiles, personal identifiers, or unsanitized logs.

| Evidence ID | Path or stable link | SHA-256 or immutable ref | What it proves | Sanitization/removal |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

<!-- sync:evaluation-summary -->

## Summary and decision

- **Passed cases:**
- **Failed cases:**
- **Skipped cases and reasons:**
- **Blocking issues:**
- **Supported conclusion and scope:**
- **Unsupported conclusions:**
- **Residual risks:**
- **Retest trigger:**
- **Verification expires:**
- **Review-stage decision:** `not-reviewed` / `source-reviewed` /
  `hands-on-verified`.
- **Record disposition:** `example-only` / `revise` / `accept` / `rejected`.

If no named human executed the commands and observed the results, the decision
must not be `hands-on-verified`.

<!-- sync:evaluation-delivery -->

## Delivery and rollback

- **Reader-facing outcome:**
- **Files/artifacts changed or produced:**
- **Checks passed, failed, and skipped:**
- **Exact versions/refs delivered:**
- **File/process/network/credential/session effects:**
- **Generated artifacts and cleanup remaining:**
- **Rollback command or procedure:**
- **Rollback verification:**
- **Next human decision, owner, and due date:**

<!-- sync:evaluation-attestation -->

## Human attestation

- [ ] I personally opened and inspected every source supporting the review stage.
- [ ] I am the named human who ran every case marked `pass` or `fail`.
- [ ] Actual results are observations, not copied expectations or generated text.
- [ ] Evidence is sanitized, attributable, and sufficient for the stated scope.
- [ ] Failed and skipped cases, cleanup, rollback, and residual risk are explicit.
- [ ] This record does not claim `featured`, secure, sandboxed, or certified status.
