export const KANA = ["む", "ち", "の"];
export const LENGTH = 4;
export const JACKPOT = "むちのち";

// 2×2 だと読み順が分からないので、横 1 行か縦 1 列に限る
export const LAYOUTS = [
  { cols: 4, rows: 1 },
  { cols: 1, rows: 4 },
];

export function generate(random = Math.random) {
  return Array.from({ length: LENGTH }, () => KANA[Math.floor(random() * KANA.length)]).join("");
}

export function isJackpot(word) {
  return word === JACKPOT;
}

// 最後の 1 文字しだいで大当たりになる状態
export function isReach(word) {
  return word.slice(0, LENGTH - 1) === JACKPOT.slice(0, LENGTH - 1);
}

// 与えられた領域で文字がいちばん大きくなる並べ方と、そのときの 1 文字の大きさを返す
export function bestLayout(width, height) {
  let best = null;
  for (const layout of LAYOUTS) {
    const size = Math.min(width / layout.cols, height / layout.rows);
    if (best === null || size > best.size) {
      best = { ...layout, size };
    }
  }
  return best;
}
