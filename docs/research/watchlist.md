[English](./watchlist.md) | [简体中文](./watchlist.zh-CN.md)

# Community source-review watchlist

<!-- sync:watchlist-warning -->

**This is not a recommendation list.** The artifacts below passed a bounded
source/metadata review on **2026-07-31**. They were not installed or executed by
this repository's maintainer. Every item is `source-reviewed` and still pending
hands-on verification; several have intentionally high authority or external
data transfer.

Use the [extension review](../extension-review.md) in an OS-contained disposable
environment before adoption. The machine-readable facts live in
[`data/resources.json`](../../data/resources.json).

## Isolation and orchestration

<!-- sync:watchlist-isolation -->

<!-- resource:watch-gondolin -->

### Gondolin

[Repository](https://github.com/earendil-works/gondolin) ·
[reviewed snapshot](https://github.com/earendil-works/gondolin/tree/29fa74d802112f29c720990aced26165e0d57d84) ·
Apache-2.0 · source-reviewed

- **Why trial it:** official-adjacent Linux micro-VM project with substantial
  security/limitation documentation, tests, and a Pi tool-routing example.
- **What to verify:** Node/runtime prerequisites, supported hosts, filesystem
  mounts, network policy, secrets, VM reset, cancellation, and cleanup.
- **Critical boundary:** the example is not an installable Pi extension and
  mounts the project read-write at `/workspace`. A micro-VM can contain guest
  execution while still allowing intentional damage to mounted project files.
  Gondolin also documents QEMU, same-user host processes, and denial of service
  among its non-goals.

<!-- resource:watch-pi-subagents -->

### pi-subagents

[Repository](https://github.com/nicobailon/pi-subagents) ·
[reviewed snapshot](https://github.com/nicobailon/pi-subagents/tree/89de10e4bc8895e7948704c38620a5b35ddcd17e) ·
MIT · source-reviewed

- **Why trial it:** focused subagent, parallel, chained, background, lifecycle,
  and worktree patterns with unit/integration/end-to-end CI.
- **What to verify:** exact child model/tools, environment inheritance, maximum
  concurrency/cost, background cancellation, result aggregation, file conflict,
  memory/session retention, and removal.
- **Critical boundary:** subprocesses, worktrees, and tool restrictions are not
  OS isolation. A child without an explicit tool set may inherit broader
  defaults, and parallel writers need repository-level coordination.

<!-- resource:watch-pi-crew -->

### pi-crew

[Repository](https://github.com/baphuongna/pi-crew) ·
[reviewed snapshot](https://github.com/baphuongna/pi-crew/tree/c694ebfd5d0f49d9479870d6919be4bbf9738291) ·
MIT · source-reviewed, high-risk trial

- **Why trial it:** durable multi-agent workflows, parallelism, orchestration,
  and optional worktree isolation in a current-scope package.
- **What to verify:** every workflow's code/ref, broker exposure, execution
  confirmation semantics, worktree merge/conflict path, state retention, and
  cleanup after partial failure.
- **Critical boundary:** dynamic `.dwf.ts` workflows are unsandboxed
  JavaScript/TypeScript; a configuration flag named confirmation is not
  necessarily a human approval prompt; the Unix broker can be enabled by
  default. A weekly smoke job was failing at the review snapshot despite broader
  CI coverage.

## Interoperability and external access

<!-- sync:watchlist-connectivity -->

<!-- resource:watch-mcp-adapter -->

### pi-mcp-adapter

[Repository](https://github.com/nicobailon/pi-mcp-adapter) ·
[reviewed snapshot](https://github.com/nicobailon/pi-mcp-adapter/tree/6a3e840219a49f9ae5350542b7a707aa1e83fedf) ·
MIT · source-reviewed

- **Why trial it:** mature-looking lazy-proxy/direct MCP integration with
  protocol, OAuth, packaging, and conformance tests.
- **What to verify:** one pinned server at a time, exact exposed tools,
  transport, consent, timeout, cancellation, credentials, shared multiplexer
  state, and removal.
- **Critical boundary:** Pi deliberately does not ship built-in MCP. Adapter
  server commands, arguments, environments, and secret resolver commands run
  with local authority. Consent UI does not replace server review or OS
  containment; avoid unpinned `@latest` server examples.

<!-- resource:watch-web-access -->

### pi-web-access

[Repository](https://github.com/nicobailon/pi-web-access) ·
[reviewed snapshot](https://github.com/nicobailon/pi-web-access/tree/c702b3be11bfbc832489eb7cfe31d9bbbbb2cc27) ·
MIT · source-reviewed, external-data-transfer

- **Why trial it:** one package covers search, fetch, GitHub repositories, PDF,
  YouTube, and local-video workflows.
- **What to verify:** the exact provider/fallback chosen per request, outbound
  hosts, query/page/video payloads, redirect/SSRF behavior, maximum download/
  upload size, cookie access, retention, timeout, and offline failure.
- **Critical boundary:** “zero configuration” search still uses an external
  service. Fallbacks can send queries, URLs, page content, or video to Exa,
  OpenAI, Gemini, Perplexity, Jina, Firecrawl, and others. Browser-cookie access
  is especially sensitive. Tests exist, but no project-owned default-branch CI
  was observed at the snapshot.

<!-- resource:watch-browser-native -->

### pi-agent-browser-native

[Repository](https://github.com/fitchmultz/pi-agent-browser-native) ·
[reviewed snapshot](https://github.com/fitchmultz/pi-agent-browser-native/tree/211a012c9b199d758768e8ba729f35e11e661f65) ·
MIT · source-reviewed, sensitive-local-data

- **Why trial it:** exposes the separate `agent-browser` CLI through a structured
  Pi tool, including browser/Electron/profile/download workflows.
- **What to verify:** CLI/version pairing, project-trust behavior, dedicated
  test profile, cookie/login isolation, clipboard, download path, screenshot
  content, cleanup, and no-production-account policy.
- **Critical boundary:** a real browser can access authenticated sessions and
  private content. Project-level package configuration is trust-sensitive.
  Extensive tests are present, but repository-owned GitHub Actions were not
  observed at the snapshot.

## Human review and analysis

<!-- sync:watchlist-review -->

<!-- resource:watch-plannotator -->

### Plannotator

[Repository](https://github.com/backnotprop/plannotator) ·
[reviewed snapshot](https://github.com/backnotprop/plannotator/tree/80065c84624e80bf60dc1ad862c17c3ea3f2bd80) ·
Apache-2.0 at the root; Pi extension MIT OR Apache-2.0 · source-reviewed

- **Why trial it:** creates a concrete human-in-the-loop review surface for
  plans, Markdown/HTML, and code diffs, with Pi runtime smoke tests.
- **What to verify:** local-only path, rejection/approval semantics, large diff,
  malformed content, browser lifecycle, cancellation, and sharing disabled.
- **Critical boundary:** optional sharing uploads encrypted ciphertext and uses
  a shareable URL. Encryption reduces content exposure but does not eliminate
  URL-fragment, browser-history, metadata, endpoint, and retention risks.
  Sensitive organizations should trial with `PLANNOTATOR_SHARE=disabled`.

<!-- resource:watch-pi-lens -->

### pi-lens

[Repository](https://github.com/apmantza/pi-lens) ·
[reviewed snapshot](https://github.com/apmantza/pi-lens/tree/a4baa3a94ecaf71f8af9f48ab27c8d7f6da8fdb2) ·
MIT · source-reviewed

- **Why trial it:** structured LSP, lint, formatter, AST/tree-sitter, and
  optional scanning tools with several smoke/health workflows.
- **What to verify:** grammar/download integrity, dependency install approval,
  server process lifecycle, mutation preview, formatter conflict, large
  repository behavior, and current Pi compatibility.
- **Critical boundary:** build/lifecycle paths can download grammars and tools;
  structured analysis can still mutate files. One compatibility workflow was
  pinned to Pi 0.80.10, so it does not alone prove complete v0.83.0 support.

<!-- resource:watch-gentle-pi -->

### gentle-pi

[Repository](https://github.com/Gentleman-Programming/gentle-pi) ·
[reviewed snapshot](https://github.com/Gentleman-Programming/gentle-pi/tree/3b6b3d2183dbbc4d45b16a1a0f127728c0a2435c) ·
MIT · source-reviewed, high-risk trial

- **Why trial it:** unusually broad case study in specification-driven
  development, TDD, review, subagents, and local authority/policy design.
- **What to verify:** choose one documented version/architecture, inspect the
  native runtime artifact and postinstall, enumerate companion extensions,
  execute the threat model, and test rollback/removal.
- **Critical boundary:** the surface is large; `postinstall` obtains or builds a
  native runtime, the current RDD path is described as unstable, and the threat
  model excludes replacement by malicious same-user processes. Treat it as a
  research case, not a lightweight default.

## Memory, observability, and alternate UI

<!-- sync:watchlist-state -->

<!-- resource:watch-hermes-memory -->

### pi-hermes-memory

[Repository](https://github.com/chandra447/pi-hermes-memory) ·
[reviewed snapshot](https://github.com/chandra447/pi-hermes-memory/tree/5aafe2ca04cb55b62204b159389c8381894038ce) ·
MIT · source-reviewed, persistent-private-data

- **Why trial it:** cross-session memory, SQLite full-text session search, and
  procedural memory with tests/CI.
- **What to verify:** database location/scope, project separation, retention,
  deletion/export, malicious stored instructions, secret-scanner false
  negatives, native ABI, model-based consolidation, and recovery.
- **Critical boundary:** persistent memory expands both privacy and prompt-
  injection lifetime. Pattern scanners cannot prove every credential or
  sensitive fact is removed; consolidation sends and rewrites content through a
  model.

<!-- resource:watch-braintrust-tracing -->

### braintrust-pi-extension

[Repository](https://github.com/braintrustdata/braintrust-pi-extension) ·
[reviewed snapshot](https://github.com/braintrustdata/braintrust-pi-extension/tree/c8f1aea1236f47c2681c0104be143b832bc9058c) ·
MIT · source-reviewed, external-data-transfer

- **Why trial it:** explicit tracing for session, turn, model, tool, and
  compaction behavior with integration/packaging/compatibility CI.
- **What to verify:** keep tracing disabled until a data classification exists;
  test redaction, sampling, endpoint/account, retention/deletion, offline
  behavior, backpressure, failure isolation, and removal.
- **Critical boundary:** when enabled, implementation can send raw user input,
  normalized context, assistant output, tool arguments, and tool results.
  Omitting provider payloads or thinking signatures does not mean session
  content stays local.

<!-- resource:watch-emacs-frontend -->

### pi-coding-agent for Emacs

[Repository](https://github.com/dnouri/pi-coding-agent) ·
[reviewed snapshot](https://github.com/dnouri/pi-coding-agent/tree/df5ce0a176ce634ccb4883042c415a74a5637c37) ·
GPL-3.0-only · source-reviewed, project-trust-sensitive

- **Why trial it:** well-tested alternate UI over Pi RPC and a useful concrete
  example of trust decisions in a headless controller.
- **What to verify:** set an explicit project-trust policy before opening an
  unknown repository; test approve/deny behavior, context files, auth-store
  access, cancellation, child restart, and buffer/session cleanup.
- **Critical boundary:** the frontend's documented default passes `--approve`,
  enabling project `.pi` settings/resources in RPC mode where Pi cannot display
  a trust prompt. For untrusted projects, use the frontend's non-approving
  policy and separately consider `--no-context-files`.

## Deferred from the watchlist

<!-- sync:watchlist-deferred -->

These sources may be useful for historical research but currently fail a
watchlist gate or need item-by-item decomposition.

<!-- resource:defer-extension-collection -->

- **[pi-extensions reviewed snapshot](https://github.com/tmustier/pi-extensions/tree/60d70f24825446205c45e89f98813688e52823f3)** —
  Mixed personal collection rather than one atomic
  capability. Test/CI coverage varies by subdirectory, and some documentation
  retains legacy links. Review individual extensions, not the repository as one
  recommendation.

<!-- resource:defer-pi-skills -->

- **[pi-skills reviewed snapshot](https://github.com/badlogic/pi-skills/tree/90bb51cae36515a648515b633a81c0c6efc8c74d)** —
  Heterogeneous, high-permission skills with legacy
  `@mariozechner/*` installation guidance and no observed repository CI/tests.
  Each skill needs migration and separate authority review.

<!-- resource:defer-share-hf -->

- **[pi-share-hf reviewed snapshot](https://github.com/badlogic/pi-share-hf/tree/21c1d9629187b553a2d59f26c5ef28eb33bb4e70)** —
  No detected repository/package license, legacy Pi scope, no
  observed test/CI, and intentional public Hugging Face session upload. Secret
  scanning and model review cannot guarantee removal of private code, business
  facts, names, images, or conversational data.

## Hands-on promotion checklist

<!-- sync:watchlist-promotion -->

To move an item out of this file, a named human reviewer must:

1. pin and record the exact artifact and integrity/ref;
2. disclose any relationship to the project;
3. review install/lifecycle scripts and runtime authority;
4. run the full relevant trial matrix with test credentials and data;
5. verify cleanup and rollback;
6. record Pi/Node version, platform, model/provider if relevant, date, commands,
   expected/actual results, failures, and residual risks;
7. author the English recommendation from direct experience;
8. have another human check the Chinese facts and safety qualifications;
9. set a retest trigger and expiration date.

Stars, downloads, catalog rank, maintainer affiliation, or passing CI cannot
replace these steps.
