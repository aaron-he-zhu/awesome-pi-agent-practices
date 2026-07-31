[English](./run-manifest.md) | [简体中文](./run-manifest.zh-CN.md)

# Pi 运行清单

<!-- sync:manifest-purpose -->

把本清单保存在重要 Automation Result 或 Sanitized Reproduction 旁。Session JSONL
本身不会记录完整 Runtime、Catalog、Repository、Package、Transport、Credential
与 Network Envelope。

<!-- sync:manifest-data -->

```yaml
manifest_version: 1
captured_at:
operator:
purpose:

pi:
  distribution: npm | source | bun-binary | other
  version:
  commit:
  install_integrity:
runtime:
  node_or_bun:
  version:
  os:
  architecture:
  terminal:
  shell:

repository:
  canonical_url:
  cwd:
  commit:
  branch:
  status_summary:
  preexisting_changes_record:

model:
  provider:
  model:
  thinking:
  transport:
  catalog_checked_at:
  catalog_snapshot_or_hash:
  authentication_category:

pi_policy:
  mode:
  session_id_or_none:
  session_name:
  trust_override:
  context_files:
  tools:
  excluded_tools:
  extensions:
  skills:
  prompt_templates:
  themes:
  settings_hash:

packages:
  - source:
    exact_ref:
    artifact_integrity:
    lockfile_hash:

containment:
  type:
  image_or_vm_version:
  mounts:
  network_policy:
  credential_scopes:
  host_surfaces_remaining:

task:
  brief_path_or_hash:
  command:
  acceptance_checks:
  result_paths:
  full_log_paths:

outcome:
  passed:
  failed:
  skipped:
  cleanup:
  residual_risks:
  rollback:
```

<!-- sync:manifest-handling -->

不要把 Credential Value、Private Source、Raw Session Content、Signed URL 或
Personal Identifier 放入 Manifest。需要 Correlation 时，只记录 Credential
*Category/Scope* 和 Stable Hash/Label。
