import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

async function walk(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const entries = await readdir(absolutePath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(child)));
    else if (entry.name.endsWith(".md")) files.push(child);
  }

  return files;
}

function slugify(heading) {
  return heading
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replace(/<[^>]+>/gu, "")
    .replace(/[`*_~]/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s_-]/gu, "")
    .replace(/\s/gu, "-");
}

function anchorsFor(text) {
  const anchors = new Set();
  const occurrences = new Map();

  for (const match of text.matchAll(/<[a-z][a-z0-9-]*\s+[^>]*\bid=["']([^"']+)["'][^>]*>/giu)) {
    anchors.add(match[1].toLowerCase());
  }

  for (const match of text.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gmu)) {
    const base = slugify(match[1]);
    if (!base) continue;
    const count = occurrences.get(base) ?? 0;
    anchors.add(count === 0 ? base : `${base}-${count}`);
    occurrences.set(base, count + 1);
  }

  return anchors;
}

function lineAt(text, index) {
  return text.slice(0, index).split("\n").length;
}

function maskCode(text) {
  const preserveLines = (value) => value.replace(/[^\n]/gu, " ");
  return text
    .replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gmu, preserveLines)
    .replace(/`+[^`\n]*`+/gu, preserveLines);
}

async function isFile(absolutePath) {
  try {
    return (await stat(absolutePath)).isFile();
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function normalizeTarget(rawTarget) {
  const trimmed = rawTarget.trim();
  const withoutTitle = trimmed.startsWith("<")
    ? trimmed.slice(1, trimmed.indexOf(">"))
    : trimmed.split(/\s+/u, 1)[0];
  return withoutTitle.replace(/\\([\\() ])/gu, "$1");
}

const markdownFiles = (await walk(".")).sort();
const contents = new Map();
const anchorCache = new Map();

for (const file of markdownFiles) {
  contents.set(file, await readFile(path.join(root, file), "utf8"));
}

for (const [sourceFile, text] of contents) {
  const linkText = maskCode(text);
  for (const match of linkText.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/gu)) {
    if (match[0].startsWith("!")) continue;

    const target = normalizeTarget(match[1]);
    if (
      /^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu.test(target) ||
      target === ""
    ) {
      continue;
    }

    const hashIndex = target.indexOf("#");
    const rawPath = hashIndex === -1 ? target : target.slice(0, hashIndex);
    const rawFragment = hashIndex === -1 ? "" : target.slice(hashIndex + 1);
    const pathWithoutQuery = rawPath.split("?", 1)[0];

    let decodedPath;
    let decodedFragment;
    try {
      decodedPath = decodeURIComponent(pathWithoutQuery);
      decodedFragment = decodeURIComponent(rawFragment);
    } catch {
      failures.push(`${sourceFile}:${lineAt(text, match.index)}: invalid URL encoding in ${target}`);
      continue;
    }

    const targetFile = path
      .relative(
        root,
        decodedPath === ""
          ? path.join(root, sourceFile)
          : path.resolve(root, path.dirname(sourceFile), decodedPath),
      )
      .replaceAll(path.sep, "/");

    if (targetFile.startsWith("../") || path.isAbsolute(targetFile)) {
      failures.push(`${sourceFile}:${lineAt(text, match.index)}: link escapes repository: ${target}`);
      continue;
    }

    if (!(await isFile(path.join(root, targetFile)))) {
      failures.push(`${sourceFile}:${lineAt(text, match.index)}: missing file: ${target}`);
      continue;
    }

    if (decodedFragment !== "") {
      if (!anchorCache.has(targetFile)) {
        const targetText =
          contents.get(targetFile) ?? (await readFile(path.join(root, targetFile), "utf8"));
        anchorCache.set(targetFile, anchorsFor(targetText));
      }
      if (!anchorCache.get(targetFile).has(decodedFragment.toLowerCase())) {
        failures.push(
          `${sourceFile}:${lineAt(text, match.index)}: missing anchor ` +
            `#${decodedFragment} in ${targetFile}`,
        );
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`Local-link validation failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Local-link validation passed: ${markdownFiles.length} Markdown files checked.`);
}
