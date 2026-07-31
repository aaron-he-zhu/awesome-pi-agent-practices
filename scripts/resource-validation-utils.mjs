export function resourceMarkers(text) {
  return [...text.matchAll(/<!--\s*resource:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/gu)].map(
    (match) => match[1],
  );
}

export function sameSequence(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function sameMembership(left, right) {
  return sameSequence([...left].sort(), [...right].sort());
}

export function duplicateValues(values) {
  const seen = new Set();
  const duplicate = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicate.add(value);
    seen.add(value);
  }
  return [...duplicate];
}

export function resourceBlocks(text) {
  const markerPattern = /<!--\s*resource:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/gu;
  const matches = [...text.matchAll(markerPattern)];
  return new Map(
    matches.map((match) => {
      const start = match.index + match[0].length;
      const tail = text.slice(start);
      const boundary = /<!--\s*(?:resource|sync):[A-Za-z0-9._-]+\s*-->|^##\s+/gmu.exec(tail);
      return [match[1], tail.slice(0, boundary?.index ?? tail.length)];
    }),
  );
}

export function normalizedText(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

export function displayedNameMatches(displayedName, registryName) {
  const displayed = normalizedText(displayedName);
  const expected = normalizedText(registryName);
  return expected !== "" && (displayed === expected || displayed.startsWith(`${expected} `));
}

export function firstMarkdownLink(block) {
  const match = /\[([^\]\n]+)\]\((https:\/\/[^)\s]+)\)/u.exec(block);
  return match ? { label: match[1], target: match[2] } : undefined;
}

export function resourceDisplayName(block) {
  const heading = /^#{3,6}\s+(.+?)\s*#*\s*$/mu.exec(block);
  return heading?.[1] ?? firstMarkdownLink(block)?.label;
}

export function isRegistryResourceLink(target, resource) {
  if (target === resource.url) return true;
  return (
    typeof resource.reviewedRef === "string" &&
    target === `${resource.url}/tree/${resource.reviewedRef}`
  );
}

export function expectedRootIds(resources) {
  return resources
    .filter(
      (resource) =>
        resource.kind === "official" ||
        (resource.kind === "related-list" && resource.currentScope) ||
        (resource.kind === "community" && resource.status === "featured"),
    )
    .map((resource) => resource.id);
}

export function expectedRootIdGroups(resources) {
  return [
    {
      label: "official",
      ids: resources.filter((resource) => resource.kind === "official").map((resource) => resource.id),
    },
    {
      label: "current related-list",
      ids: resources
        .filter((resource) => resource.kind === "related-list" && resource.currentScope)
        .map((resource) => resource.id),
    },
    {
      label: "featured community",
      ids: resources
        .filter((resource) => resource.kind === "community" && resource.status === "featured")
        .map((resource) => resource.id),
    },
  ];
}

export function expectedLandscapeIds(resources) {
  return resources
    .filter((resource) => resource.kind === "related-list")
    .map((resource) => resource.id);
}

export function expectedWatchlistIds(resources) {
  return resources
    .filter((resource) => resource.kind === "community" && resource.status !== "featured")
    .map((resource) => resource.id);
}
