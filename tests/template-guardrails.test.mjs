import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), "utf8");

const [evaluationEnglish, evaluationChinese, handsOnEnglish, handsOnChinese] =
  await Promise.all([
    read("../templates/evaluation-record.md"),
    read("../templates/evaluation-record.zh-CN.md"),
    read("../templates/hands-on-review.md"),
    read("../templates/hands-on-review.zh-CN.md"),
  ]);

test("evaluation templates separate review stage from record disposition", () => {
  for (const text of [evaluationEnglish, evaluationChinese]) {
    assert.match(text, /Review Stage|Review stage/u);
    assert.match(text, /Record Disposition|Record disposition/u);
    assert.doesNotMatch(text, /Evidence [Ss]tatus/u);
    assert.match(text, /NOT RUN/u);
    assert.match(text, /NOT OBSERVED/u);
  }
});

test("source and hands-on stages require explicit human observation", () => {
  assert.match(evaluationEnglish, /named human to open and inspect every cited source/u);
  assert.match(evaluationEnglish, /execute the applicable\s+cases and observe/gu);
  assert.match(evaluationChinese, /具名人类打开并检查每个引用来源/u);
  assert.match(evaluationChinese, /执行所有适用案例，并观察/u);
});

test("hands-on templates cannot directly award featured status", () => {
  for (const text of [handsOnEnglish, handsOnChinese]) {
    const decisionLine = text.split("\n").find((line) => /^- Decision/u.test(line));
    assert.ok(decisionLine, "hands-on template must retain a decision field");
    assert.doesNotMatch(decisionLine, /featured/u);
    assert.match(text, /NOT RUN/u);
    assert.match(text, /NOT OBSERVED/u);
  }
  assert.match(handsOnEnglish, /does not .*award `featured`/u);
  assert.match(handsOnChinese, /不能自行授予 `featured`/u);
});
