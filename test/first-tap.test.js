import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const main = await readFile(new URL("../main.js", import.meta.url), "utf8");

test("開いた直後は「？？？？」を出す", () => {
  assert.match(html, /<div id="word">(<span>？<\/span>){4}<\/div>/);
});

test("ボタンは main.js が動くまで押せない「まわす」にしておく", () => {
  assert.match(html, /<button id="regenerate" type="button" disabled>まわす<\/button>/);
});

test("main.js は読み込んだだけでは回さない", () => {
  assert.doesNotMatch(main, /^\s*(await\s+)?regenerate\(\)/m);
});
