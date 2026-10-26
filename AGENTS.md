# muchinochi.sudame.net のエージェント向けの決まり

「無知の知チャレンジ」の静的サイト。
使い方と公開の流れは README にある。

## ツールとコマンド

ツールのバージョンは `mise.toml` で固定している。
`mise exec` は付けず、`node` や `esbuild` をそのまま実行する。
ツールは `npx` などで実行時に取ってこず、`mise.toml` の tools に足す。

- `mise run test`、`mise run lint`、`mise run build`：CI も同じタスクを呼ぶ。
- `mise run github-settings`：自動マージと main の ruleset を GitHub に設定する。

## 進め方

- 作業はブランチごとに gwq で worktree を切って行う。
- Renovate の更新は、メジャーも含めて人が見ずにマージされる。壊れたら test か lint か build が落ちるように、テストを保つ。
- 演出は過剰でよいが、全画面の反転のような閃光は、光過敏発作を避けるため 1 秒に 3 回を超えない。
