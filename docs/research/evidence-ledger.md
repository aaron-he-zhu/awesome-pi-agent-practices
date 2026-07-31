[English](./evidence-ledger.md) | [简体中文](./evidence-ledger.zh-CN.md)

# Practice evidence ledger

<!-- sync:evidence-scope -->

This ledger separates upstream fact from this repository's recommendation.
Unless a row says otherwise, stable source links are pinned to Pi v0.83.0 at
commit `845d6ff1f6643aba440341cce877ce1c43ebbc39`. “Inference” means the
recommended procedure is our synthesis; it is not a built-in Pi guarantee.

| Label | Meaning |
| --- | --- |
| Primary | Pi repository, tagged source, or official Pi documentation. |
| Primary example | Code shipped in the Pi repository as an example, not a core feature guarantee. |
| Community | Third-party public source. |
| Inference | A practice derived from cited facts and general engineering controls. |

<!-- sync:evidence-claims -->

## Practice claims

<!-- sync:E01 -->

### E01

- **Supports:** [P01](../practice-guide.md#p01--pin-and-record-the-execution-envelope).
- **Facts:** Pi exposes version, provider/model, thinking, transport, tool, and
  resource-related CLI/configuration inputs; catalogs can refresh separately.
- **Sources:** [v0.83.0 coding-agent README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md),
  [models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md),
  and [settings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md).
- **Status:** Primary facts + reproducibility inference.

<!-- sync:E02 -->

### E02

- **Supports:** [P02](../practice-guide.md#p02--start-from-a-recoverable-version-control-state).
- **Facts:** Upstream ships examples for a dirty-repository guard and Git
  checkpoints, demonstrating the risk and extension pattern without making
  either behavior built in.
- **Sources:** [dirty-repo-guard.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/dirty-repo-guard.ts)
  and [git-checkpoint.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/git-checkpoint.ts).
- **Status:** Primary examples + version-control inference.

<!-- sync:E03 -->

### E03

- **Supports:** [P03](../practice-guide.md#p03--put-untrusted-or-unattended-work-behind-an-os-boundary).
- **Facts:** Pi runs as the invoking user, has no built-in sandbox, and
  recommends containment for untrusted or unmonitored work.
- **Sources:** [security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  and [containerization](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/containerization.md).
- **Status:** Primary.

<!-- sync:E04 -->

### E04

- **Supports:** [P04](../practice-guide.md#p04--treat-project-trust-as-a-loading-gate-not-a-sandbox).
- **Facts:** Project Trust gates protected project resources; it is not a
  sandbox. Context files load independently unless disabled. Non-interactive
  overrides and restart behavior are documented.
- **Sources:** [security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  and [settings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md).
- **Status:** Primary.

<!-- sync:E05 -->

### E05

- **Supports:** [P05](../practice-guide.md#p05--minimize-credentials-mounts-and-network-reach).
- **Facts:** Containment guidance explicitly recommends minimal mounts,
  credentials, environment variables, network access, and review before copying
  results back.
- **Sources:** [security: running untrusted work](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  and [containerization](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/containerization.md).
- **Status:** Primary facts + least-privilege inference.

<!-- sync:E06 -->

### E06

- **Supports:** [P06](../practice-guide.md#p06--inspect-pin-and-trial-packages-before-adoption).
- **Facts:** Packages can contain executable/resource material; project
  packages can install after trust; Git refs can be pinned; reconciliation can
  run npm dependency installation.
- **Sources:** [packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)
  and [security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md).
- **Status:** Primary facts + supply-chain inference.

<!-- sync:E07 -->

### E07

- **Supports:** [P07](../practice-guide.md#p07--keep-hierarchical-context-concise-and-reviewable).
- **Facts:** Pi discovers hierarchical `AGENTS.md`/`CLAUDE.md` context from
  global and project paths and offers a flag to disable it.
- **Sources:** [coding-agent README: context files](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)
  and [SDK context example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/sdk/07-context-files.ts).
- **Status:** Primary facts + context-design inference.

<!-- sync:E08 -->

### E08

- **Supports:** [P08](../practice-guide.md#p08--begin-with-a-testable-task-brief).
- **Facts:** No Pi mechanism can infer a user's acceptance boundary reliably
  from an underspecified prompt.
- **Sources:** The repository's [task brief template](../../templates/task-brief.md)
  operationalizes goal, scope, constraints, and checks.
- **Status:** Engineering inference; no claim of upstream enforcement.

<!-- sync:E09 -->

### E09

- **Supports:** [P09](../practice-guide.md#p09--reconnoiter-read-only-then-expand-capabilities).
- **Facts:** The default tool set and `--tools` allowlist are documented;
  `grep`, `find`, and `ls` are optional read-only tools.
- **Sources:** [coding-agent README: tools and CLI options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md).
- **Status:** Primary facts + staged-capability inference.

<!-- sync:E10 -->

### E10

- **Supports:** [P10](../practice-guide.md#p10--target-context-and-keep-noise-out-of-the-model-transcript).
- **Facts:** `@path` includes file context; `!command` sends output to the model,
  while `!!command` does not.
- **Sources:** [quickstart](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/quickstart.md)
  and [coding-agent README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md).
- **Status:** Primary facts + context-budget inference.

<!-- sync:E11 -->

### E11

- **Supports:** [P11](../practice-guide.md#p11--choose-the-least-powerful-customization-primitive).
- **Facts:** Upstream separately documents context files, prompt templates,
  skills, extensions, packages, JSON, RPC, and SDK.
- **Sources:** [documentation index](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/index.md),
  [prompt templates](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md),
  [skills](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md),
  and [extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md).
- **Status:** Primary facts + least-power inference.

<!-- sync:E12 -->

### E12

- **Supports:** [P12](../practice-guide.md#p12--give-one-session-one-coherent-goal).
- **Facts:** Pi sessions are persistent, nameable JSONL histories with branching
  and compaction.
- **Sources:** [sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md)
  and [session format](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/session-format.md).
- **Status:** Primary facts + session-cohesion inference.

<!-- sync:E13 -->

### E13

- **Supports:** [P13](../practice-guide.md#p13--use-steering-and-follow-up-messages-intentionally).
- **Facts:** Upstream defines distinct delivery timing and queue modes for
  steering and follow-up messages.
- **Sources:** [coding-agent README: message queue](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)
  and [RPC message queue commands](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md).
- **Status:** Primary.

<!-- sync:E14 -->

### E14

- **Supports:** [P14](../practice-guide.md#p14--use-tree-fork-and-clone-for-different-intentions).
- **Facts:** `/tree`, `/fork`, `/clone`, and CLI `--fork` have documented,
  different file and branch semantics.
- **Sources:** [sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md)
  and [coding-agent README: session tree](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md).
- **Status:** Primary.

<!-- sync:E15 -->

### E15

- **Supports:** [P15](../practice-guide.md#p15--compact-at-semantic-boundaries-and-externalize-durable-state).
- **Facts:** Upstream labels compaction lossy, retains full history in JSONL,
  documents automatic thresholds, and exposes manual/custom compaction.
- **Sources:** [compaction](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/compaction.md)
  and [sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md).
- **Status:** Primary facts + durable-state inference.

<!-- sync:E16 -->

### E16

- **Supports:** [P16](../practice-guide.md#p16--scrub-sessions-before-export-or-sharing).
- **Facts:** Sessions include messages and tool results; the HTML exporter can
  include the header, entries, active leaf, system prompt, and tool
  descriptions/schemas. `/share` uploads that export to a secret/unlisted
  GitHub gist (`--public=false`), not an access-controlled private object;
  anyone with its URL may be able to read it.
- **Sources:** [sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md)
  and [session format](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/session-format.md);
  [share implementation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/modes/interactive/interactive-mode.ts#L5560-L5613)
  and [HTML exporter](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/core/export-html/index.ts#L236-L274).
- **Status:** Primary facts + privacy-review inference.

<!-- sync:E17 -->

### E17

- **Supports:** [P17](../practice-guide.md#p17--scope-and-record-model-dependent-behavior).
- **Facts:** Provider and model catalogs expose different capabilities,
  transports, authentication routes, costs, and context limits.
- **Sources:** [models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md),
  [providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md),
  and [environment variables](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/environment-variables.md).
- **Status:** Primary.

<!-- sync:E18 -->

### E18

- **Supports:** [P18](../practice-guide.md#p18--treat-cross-provider-handoff-as-best-effort).
- **Facts:** `pi-ai` documents cross-provider message transformations and
  provider-specific compatibility paths rather than a universal lossless
  representation.
- **Sources:** [pi-ai README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md)
  and [providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md).
- **Status:** Primary facts + checkpoint inference.

<!-- sync:E19 -->

### E19

- **Supports:** [P19](../practice-guide.md#p19--retry-at-the-layer-that-understands-the-failure).
- **Facts:** Settings define agent retry defaults and provider retry defaults;
  upstream warns that provider retries can hide usage-limit errors.
- **Sources:** [settings: retry](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md)
  and [custom provider errors](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/custom-provider.md).
- **Status:** Primary.

<!-- sync:E20 -->

### E20

- **Supports:** [P20](../practice-guide.md#p20--bound-commands-and-design-for-truncated-output).
- **Facts:** Built-in output limits are 2,000 lines or 50 KB; read preserves the
  head and supports offset continuation, while bash preserves the tail and a
  full-output path.
- **Sources:** [extensions: result truncation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)
  and [truncated tool example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/truncated-tool.ts).
- **Status:** Primary.

<!-- sync:E21 -->

### E21

- **Supports:** [P21](../practice-guide.md#p21--prototype-with-instructions-before-runtime-code).
- **Facts:** Prompt templates, skills, and extensions have distinct documented
  loading and capability models.
- **Sources:** [prompt templates](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md),
  [skills](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md),
  and [extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md).
- **Status:** Primary facts + prototype-first inference.

<!-- sync:E22 -->

### E22

- **Supports:** [P22](../practice-guide.md#p22--make-extension-lifecycle-explicit-and-idempotent).
- **Facts:** Extension docs define factories, session events, reloads,
  replacement behavior, and shutdown; stale session-bound objects can fail.
- **Sources:** [extensions: lifecycle and events](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)
  and [shutdown example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/shutdown-command.ts).
- **Status:** Primary facts + lifecycle inference.

<!-- sync:E23 -->

### E23

- **Supports:** [P23](../practice-guide.md#p23--build-honest-bounded-composable-custom-tools).
- **Facts:** Extension docs require thrown tool errors for `isError`, recommend
  `StringEnum`, document parallel execution/file mutation queues, sequential
  tools, cancellation, and truncation utilities.
- **Sources:** [extensions: custom tools](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)
  and [tools example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/tools.ts).
- **Status:** Primary.

<!-- sync:E24 -->

### E24

- **Supports:** [P24](../practice-guide.md#p24--design-pi-packages-as-executable-supply-chain-artifacts).
- **Facts:** Package manifests declare Pi resources and dependencies; npm, Git,
  and local sources have different install/update behavior.
- **Sources:** [packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)
  and [with-deps example](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/with-deps).
- **Status:** Primary facts + package hygiene inference.

<!-- sync:E25 -->

### E25

- **Supports:** [P25](../practice-guide.md#p25--select-the-interface-from-the-ownership-boundary).
- **Facts:** Pi documents interactive/print behavior, a JSON event stream, a
  bidirectional RPC process protocol, and an in-process TypeScript SDK.
- **Sources:** [usage](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md),
  [JSON](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/json.md),
  [RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md),
  and [SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md).
- **Status:** Primary.

<!-- sync:E26 -->

### E26

- **Supports:** [P26](../practice-guide.md#p26--make-non-interactive-policy-explicit-and-fail-closed).
- **Facts:** Non-interactive modes cannot ask for Project Trust; behavior
  depends on saved/global policy or explicit approval flags. Tool/model/context
  flags are available.
- **Sources:** [security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  and [coding-agent CLI options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md).
- **Status:** Primary facts + fail-closed inference.

<!-- sync:E27 -->

### E27

- **Supports:** [P27](../practice-guide.md#p27--own-sdk-and-rpc-lifecycle-completely).
- **Facts:** The v0.83.0 released CLI RPC is LF-delimited JSON over stdio; no
  long-term compatibility guarantee is documented. The framed-CBOR
  `@earendil-works/pi-protocol` appears only after v0.83.0 and declares no
  compatibility guarantee.
- **Sources:** [v0.83.0 RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md),
  [v0.83.0 SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md),
  and [main-only protocol README](https://github.com/earendil-works/pi/blob/9b50b046d328d589a81400d2e184175d0bf19734/packages/protocol/README.md).
- **Status:** Primary; final source is main-only and experimental.

<!-- sync:E28 -->

### E28

- **Supports:** [P28](../practice-guide.md#p28--diagnose-with-an-isolation-ladder).
- **Facts:** Pi exposes independent controls for mode, session, context files,
  trust, extensions, packages, tools, model, provider, and working directory.
- **Sources:** [CLI options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md),
  [extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md),
  and [packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md).
- **Status:** Primary controls + diagnostic inference.

<!-- sync:E29 -->

### E29

- **Supports:** [P29](../practice-guide.md#p29--upgrade-through-a-pinned-staged-reversible-path).
- **Facts:** Pi has frequent releases, package/model update commands, pinned Git
  refs, and a changelog with migrations.
- **Sources:** [releases](https://github.com/earendil-works/pi/releases),
  [changelog](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/CHANGELOG.md),
  and [packages: update behavior](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md).
- **Status:** Primary facts + staged-rollout inference.

<!-- sync:E30 -->

### E30

- **Supports:** [P30](../practice-guide.md#p30--contribute-upstream-only-after-human-reproduction-and-review).
- **Facts:** Pi's upstream contribution guide documents its maintainer approval
  gate and asks for concise, human communication.
- **Sources:** [Pi CONTRIBUTING.md](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/CONTRIBUTING.md)
  and this repository's [contribution policy](../../CONTRIBUTING.md).
- **Status:** Primary upstream policy + local human-review policy.

<!-- sync:evidence-limitations -->

## Limits of this ledger

- A source proves only the adjacent fact, not every recommended control.
- Example extensions prove that an implementation pattern exists; they do not
  make it a stable core feature.
- `latest` documentation may move after this snapshot. Stable claims therefore
  use tag/commit links; discovery links live in the
  [source map](source-map.md).
- Community projects are intentionally kept in the
  [watchlist](watchlist.md) until hands-on review is recorded.
