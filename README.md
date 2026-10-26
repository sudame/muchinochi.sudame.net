# 無知の知チャレンジ

https://muchinochi.sudame.net/

「む」「ち」「の」から 1 文字ずつ等確率で選んで 4 文字を作り、明朝体で画面いっぱいに出すだけのサイト。
「むちのち」が出たら大当たり。

## 使い方

ツールのバージョンは `mise.toml` で固定している。

```sh
mise run test    # build してから node --test。公開する dist/index.html の JS も動かす
mise run lint    # html-validate、jactionlint、shellcheck
mise run build   # JS を 1 本にまとめて HTML に埋め込み、dist/ に置く
```

## 公開

main に push すると、GitHub Actions の `pages.yml` が test、lint、build を回し、すべて通れば dist/ を GitHub Pages にデプロイする。
DNS のレコードは sudame/dns で管理している。

## 依存の更新

Renovate が毎朝 9 時前（Asia/Tokyo）に依存を調べ、PR を作る。
メジャー以外の更新は 1 つの PR にまとめ、メジャーの更新は依存ごとに別の PR にする。
どちらも、出てから 3 日たった版だけを使い、CI が通ったら自動でマージされる。
脆弱性の修正は、スケジュールと 3 日の待ちを無視してすぐ PR になる。

自動マージと main の必須チェック（`test`、`lint`、`build`）は、`scripts/configure-github-repo.sh` で設定する。
ruleset の中身は `scripts/github-ruleset.json` にある。
CI のジョブ名を変えたら、このファイルの必須チェックも直して実行し直す。

```sh
mise run github-settings
```
