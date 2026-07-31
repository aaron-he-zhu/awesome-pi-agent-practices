[English](SECURITY.md) | [简体中文](SECURITY.zh-CN.md)

# Security policy

<!-- sync:security-scope -->

This repository contains documentation, templates, JSON data, and local
validation scripts. It does not distribute Pi, models, credentials, or the
third-party extensions in the watchlist.

Security issues in Pi itself belong under Pi's current
[security policy](https://github.com/earendil-works/pi/security/policy).
Security issues in a linked third-party project belong to that project's
maintainers. Check each policy before sharing a reproduction.

## What to report here

<!-- sync:security-report -->

Report privately when possible if this repository:

- publishes a credential, private session/source fragment, personal identifier,
  signed URL, private hostname, or other sensitive research artifact;
- contains a validation script or workflow that can execute unintended code,
  expose secrets, overwrite files outside this repository, or accept unsafe
  untrusted input;
- misrepresents a dangerous control as a sandbox, access-controlled private
  store, or verified security boundary in a way that can cause immediate harm;
- links an artifact whose identity has been hijacked or whose release/source
  provenance was replaced;
- includes a reproducible vulnerability in repository-owned code.

Ordinary broken links, stale version facts, translation errors, and non-sensitive
documentation corrections can use the fact-correction issue form.

## Reporting route

<!-- sync:security-route -->

GitHub Private Vulnerability Reporting is enabled for this repository. Use
**Security → Report a vulnerability**. Include the affected file/line, impact,
minimal reproduction, and a proposed safe correction. Do not include live
credentials or more private data than necessary.

The initial maintainer and security router is
[@aaron-he-zhu](https://github.com/aaron-he-zhu), who also owns bilingual fact
review, featured-item decisions, and stale-item revalidation until ownership is
expanded. If private reporting later becomes unavailable, do **not** post an
exploitable reproduction or sensitive artifact publicly. Open a minimal public
issue stating that a private maintainer route is required, with no secret
details.

## Handling sensitive evidence

<!-- sync:security-data -->

- Reproduce with synthetic repositories, accounts, credentials, and data.
- Revoke test credentials after the experiment.
- Share the smallest excerpt, not full sessions, HTML exports, debug logs,
  environment dumps, browser profiles, databases, or packet captures.
- Replace sensitive values with stable labels so correlations remain visible.
- Strip image metadata and inspect screenshots.
- Remember that Pi's `/share` creates a secret/unlisted gist, not an
  access-controlled private document.
- Agree on deletion/retention before sending evidence to an external service.

## Response expectations

<!-- sync:security-response -->

Maintainers should:

1. acknowledge receipt without requesting unnecessary sensitive data;
2. preserve confidentiality while validating;
3. classify whether the issue belongs here, upstream Pi, or a third party;
4. remove exposed data or disable the unsafe link/workflow when urgent;
5. prepare fact-equivalent English and Chinese corrections;
6. credit the reporter if requested and safe;
7. publish a concise post-fix note without exposing exploit details prematurely.

No response-time SLA is currently promised.

## Security model of this guide

<!-- sync:security-model -->

The guide offers operational recommendations, not guarantees:

- Project Trust is a resource-loading gate, not a sandbox.
- Tool allowlists constrain registered tool names, not arbitrary extension code.
- Extensions and package lifecycle scripts execute inside the local process
  boundary.
- Skills and prompts can direct powerful actions.
- Worktrees and subprocesses do not isolate the host.
- Tool routing isolates only the routed surfaces.
- Containers/VMs still expose whatever files, credentials, sockets, and network
  the operator provides.
- Secret scanners and redaction patterns have false negatives.
- Source review and passing CI are not hands-on security certification.

Report wording that violates these boundaries as a fact correction even when it
is not an exploitable software vulnerability.
