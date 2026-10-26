import { test } from "node:test";
import assert from "node:assert/strict";
import { KANA, generate, bestLayout, isJackpot, isReach } from "../muchinochi.js";

test("isJackpot は「むちのち」のときだけ真になる", () => {
  assert.equal(isJackpot("むちのち"), true);
  assert.equal(isJackpot("むちのむ"), false);
  assert.equal(isJackpot("ちのちむ"), false);
});

test("isReach は先頭 3 文字が「むちの」のときだけ真になる", () => {
  assert.equal(isReach("むちのち"), true);
  assert.equal(isReach("むちのの"), true);
  assert.equal(isReach("むちちち"), false);
  assert.equal(isReach("ちむのち"), false);
});

test("generate は「む」「ち」「の」だけで 4 文字を作る", () => {
  for (let i = 0; i < 1000; i++) {
    const word = generate();
    assert.equal([...word].length, 4);
    for (const ch of word) {
      assert.ok(KANA.includes(ch), ch);
    }
  }
});

test("generate は乱数の値域の端でも 3 文字のどれかを選ぶ", () => {
  assert.equal(generate(() => 0), "むむむむ");
  assert.equal(generate(() => 0.5), "ちちちち");
  assert.equal(generate(() => 0.9999999), "のののの");
});

test("bestLayout は横長なら横 1 行にする", () => {
  assert.deepEqual(bestLayout(1600, 400), { cols: 4, rows: 1, size: 400 });
});

test("bestLayout は正方形に近い画面でも 2×2 にはしない", () => {
  assert.deepEqual(bestLayout(800, 700), { cols: 4, rows: 1, size: 200 });
  assert.deepEqual(bestLayout(700, 800), { cols: 1, rows: 4, size: 200 });
});

test("bestLayout は縦長なら縦 1 列にする", () => {
  assert.deepEqual(bestLayout(390, 1600), { cols: 1, rows: 4, size: 390 });
});
