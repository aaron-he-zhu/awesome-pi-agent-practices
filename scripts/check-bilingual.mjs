import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const includedRoots = ["README.md", "CONTRIBUTING.md", "SECURITY.md", "docs", "templates"];
const failures = [];
const checked = [];

async function walk(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const entries = await readdir(absolutePath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(child)));
    else files.push(child);
  }

  return files;
}

function peerFor(file) {
  return file.replace(/\.md$/u, ".zh-CN.md");
}

function extractMarkers(text, kind) {
  const pattern = new RegExp(`<!--\\s*${kind}:([A-Za-z0-9._-]+)\\s*-->`, "gu");
  return [...text.matchAll(pattern)].map((match) => match[1]);
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function sameSequence(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

async function exists(file) {
  try {
    await readFile(path.join(root, file), "utf8");
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

const englishFiles = [];
for (const item of includedRoots) {
  if (item.endsWith(".md")) {
    englishFiles.push(item);
    continue;
  }

  const files = await walk(item);
  englishFiles.push(
    ...files.filter((file) => file.endsWith(".md") && !file.endsWith(".zh-CN.md")),
  );
}

englishFiles.sort();

for (const englishFile of englishFiles) {
  const chineseFile = peerFor(englishFile);
  if (!(await exists(chineseFile))) {
    failures.push(`${englishFile}: missing peer ${chineseFile}`);
    continue;
  }

  const [english, chinese] = await Promise.all([
    readFile(path.join(root, englishFile), "utf8"),
    readFile(path.join(root, chineseFile), "utf8"),
  ]);

  for (const [file, text] of [
    [englishFile, english],
    [chineseFile, chinese],
  ]) {
    if (!text.includes("[English](") || !text.includes("[简体中文](")) {
      failures.push(`${file}: missing the English / 简体中文 language switch`);
    }
  }

  const englishSync = extractMarkers(english, "sync");
  const chineseSync = extractMarkers(chinese, "sync");
  if (englishSync.length === 0) failures.push(`${englishFile}: no sync markers`);

  const englishSyncDuplicates = duplicates(englishSync);
  const chineseSyncDuplicates = duplicates(chineseSync);
  if (englishSyncDuplicates.length > 0) {
    failures.push(`${englishFile}: duplicate sync markers: ${englishSyncDuplicates.join(", ")}`);
  }
  if (chineseSyncDuplicates.length > 0) {
    failures.push(`${chineseFile}: duplicate sync markers: ${chineseSyncDuplicates.join(", ")}`);
  }
  if (!sameSequence(englishSync, chineseSync)) {
    failures.push(
      `${englishFile} <> ${chineseFile}: sync marker order differs\n` +
        `  EN: ${englishSync.join(", ")}\n  ZH: ${chineseSync.join(", ")}`,
    );
  }

  const englishResources = extractMarkers(english, "resource");
  const chineseResources = extractMarkers(chinese, "resource");
  if (!sameSequence(englishResources, chineseResources)) {
    failures.push(
      `${englishFile} <> ${chineseFile}: resource marker order differs\n` +
        `  EN: ${englishResources.join(", ")}\n  ZH: ${chineseResources.join(", ")}`,
    );
  }

  checked.push([englishFile, chineseFile, englishSync.length, englishResources.length]);
}

const chineseFiles = [];
for (const item of ["docs", "templates"]) {
  const files = await walk(item);
  chineseFiles.push(...files.filter((file) => file.endsWith(".zh-CN.md")));
}
chineseFiles.push("README.zh-CN.md", "CONTRIBUTING.zh-CN.md", "SECURITY.zh-CN.md");

for (const chineseFile of chineseFiles) {
  const englishFile = chineseFile.replace(/\.zh-CN\.md$/u, ".md");
  if (!(await exists(englishFile))) failures.push(`${chineseFile}: missing English peer ${englishFile}`);
}

const guide = await readFile(path.join(root, "docs/practice-guide.md"), "utf8");
const practiceMarkers = extractMarkers(guide, "sync").filter((marker) => /^P\d{2}$/u.test(marker));
const expectedPractices = Array.from({ length: 30 }, (_, index) => `P${String(index + 1).padStart(2, "0")}`);
if (!sameSequence(practiceMarkers, expectedPractices)) {
  failures.push(
    `docs/practice-guide.md: expected P01-P30 once and in order\n` +
      `  Found: ${practiceMarkers.join(", ")}`,
  );
}

if (failures.length > 0) {
  console.error(`Bilingual validation failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const syncCount = checked.reduce((total, item) => total + item[2], 0);
  const resourceCount = checked.reduce((total, item) => total + item[3], 0);
  console.log(
    `Bilingual validation passed: ${checked.length} file pairs, ` +
      `${syncCount} sync markers, ${resourceCount} paired resource markers, P01-P30 complete.`,
  );
}
