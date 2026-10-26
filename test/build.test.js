import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { SCRIPT_TAG, inline } from "../inline.mjs";

test("index.html はビルドで差し替える script タグで main.js を読む", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.ok(html.includes(SCRIPT_TAG));
});

test("inline は main.js の読み込みを埋め込みの JS に差し替える", () => {
  const html = `<head>${SCRIPT_TAG}</head>`;
  assert.equal(inline(html, "let a=1;\n"), '<head><script type="module">let a=1;</script></head>');
});

test("inline は JS の中の $ を置換の記法として扱わない", () => {
  assert.equal(inline(SCRIPT_TAG, "a=`$&`"), '<script type="module">a=`$&`</script>');
});

test("inline は script タグがない HTML を拒む", () => {
  assert.throws(() => inline("<head></head>", "let a=1;"));
});

test("inline は </script を含む JS を拒む", () => {
  assert.throws(() => inline(SCRIPT_TAG, 'x="</script>"'));
});
