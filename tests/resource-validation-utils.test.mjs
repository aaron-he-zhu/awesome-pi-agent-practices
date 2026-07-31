import assert from "node:assert/strict";
import test from "node:test";

import {
  displayedNameMatches,
  expectedRootIds,
  expectedWatchlistIds,
  firstMarkdownLink,
  isRegistryResourceLink,
  resourceBlocks,
  resourceDisplayName,
  sameMembership,
} from "../scripts/resource-validation-utils.mjs";

test("resource blocks stop at sync markers and level-two sections", () => {
  const text = [
    "<!-- resource:one -->",
    "### One",
    "[Wrong](https://example.test/wrong)",
    "<!-- sync:next-section -->",
    "[Late match](https://example.test/one)",
    "## Next section",
    "[Another late match](https://example.test/one)",
  ].join("\n");
  const block = resourceBlocks(text).get("one");
  assert.match(block, /example\.test\/wrong/u);
  assert.doesNotMatch(block, /example\.test\/one/u);
});

test("resource identity comes from the first local heading or link, not later prose", () => {
  const headingBlock = [
    "### Wrong name",
    "[Repository](https://example.test/one)",
    "The later prose says Correct name.",
  ].join("\n");
  assert.equal(resourceDisplayName(headingBlock), "Wrong name");

  const listBlock = "[Correct name reviewed snapshot](https://example.test/one/tree/abc)";
  assert.equal(resourceDisplayName(listBlock), "Correct name reviewed snapshot");
  assert.equal(displayedNameMatches("Correct name reviewed snapshot", "Correct name"), true);
  assert.equal(displayedNameMatches("Unrelated Correct name", "Correct name"), false);
  assert.equal(displayedNameMatches("工具甲 reviewed snapshot", "工具甲"), true);
  assert.equal(displayedNameMatches("另一个工具", "工具甲"), false);
});

test("the first resource link must be canonical or the exact reviewed snapshot", () => {
  const resource = {
    url: "https://example.test/one",
    reviewedRef: "a".repeat(40),
  };
  assert.equal(
    isRegistryResourceLink(firstMarkdownLink("[Repo](https://example.test/one)").target, resource),
    true,
  );
  assert.equal(
    isRegistryResourceLink(
      firstMarkdownLink(`[Snapshot](https://example.test/one/tree/${"a".repeat(40)})`).target,
      resource,
    ),
    true,
  );
  assert.equal(
    isRegistryResourceLink(
      firstMarkdownLink("[Wrong snapshot](https://example.test/one/tree/bad)").target,
      resource,
    ),
    false,
  );
});

test("featured community resources move from watchlist membership to root membership", () => {
  const resources = [
    { id: "official", kind: "official", status: "primary", currentScope: true },
    { id: "related", kind: "related-list", status: "related", currentScope: true },
    { id: "community", kind: "community", status: "watchlist", currentScope: true },
  ];
  assert.deepEqual(expectedRootIds(resources), ["official", "related"]);
  assert.deepEqual(expectedWatchlistIds(resources), ["community"]);

  resources[2].status = "featured";
  assert.deepEqual(expectedRootIds(resources), ["official", "related", "community"]);
  assert.deepEqual(expectedWatchlistIds(resources), []);
  assert.equal(
    sameMembership(["official", "community", "related"], expectedRootIds(resources)),
    true,
    "human section layout may place featured items before related lists",
  );
});
