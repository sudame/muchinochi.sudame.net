// 公開する dist/index.html に埋め込んだ JS を、最小限の偽の DOM の上で動かす。
// esbuild や node の更新でバンドルが壊れたら、ここで落ちる。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { KANA, LENGTH } from "../muchinochi.js";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

function fakeElement(extra = {}) {
  const listeners = {};
  return {
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    textContent: "",
    hidden: false,
    disabled: false,
    clientWidth: 1280,
    clientHeight: 720,
    animate() {},
    addEventListener(type, fn) {
      listeners[type] = fn;
    },
    listeners,
    ...extra,
  };
}

function run(code) {
  const slots = Array.from({ length: LENGTH }, () => fakeElement({ textContent: "？" }));
  const elements = {
    stage: fakeElement(),
    word: fakeElement({ children: slots }),
    lines: fakeElement(),
    stamp: fakeElement(),
    status: fakeElement(),
    regenerate: fakeElement({ disabled: true, textContent: "まわす" }),
  };
  const context = {
    document: {
      getElementById: (id) => elements[id],
      body: fakeElement(),
      documentElement: fakeElement(),
    },
    // 動きを減らす設定にして、演出を待たずに結果を出させる
    matchMedia: () => ({ matches: true }),
    ResizeObserver: class {
      observe() {}
    },
    setTimeout,
    performance,
  };
  vm.runInNewContext(code, context);
  return { elements, slots };
}

test("dist/index.html は JS を外から読まず、1 本の script に埋め込んでいる", () => {
  assert.doesNotMatch(html, /<script[^>]*\ssrc=/);
  assert.equal(html.match(/<script type="module">/g)?.length, 1);
});

test("埋め込んだ JS は、読み込むとボタンを押せるようにし、押すと 4 文字を出す", async () => {
  const code = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  const { elements, slots } = run(code);
  const button = elements.regenerate;
  assert.equal(button.disabled, false);

  await button.listeners.click();
  const word = slots.map((slot) => slot.textContent).join("");
  assert.equal([...word].length, LENGTH);
  for (const ch of word) {
    assert.ok(KANA.includes(ch), ch);
  }
  assert.equal(button.textContent, "もういちど");
});
