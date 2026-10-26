// esbuild がまとめた .build/app.js を index.html に埋め込み、公開するファイルだけを dist/ に置く
import { readFile, writeFile, copyFile, rm, mkdir } from "node:fs/promises";
import { inline } from "./inline.mjs";

const html = await readFile("index.html", "utf8");
const js = await readFile(".build/app.js", "utf8");

await rm("dist", { recursive: true, force: true });
await mkdir("dist");
await writeFile("dist/index.html", inline(html, js));
await copyFile("CNAME", "dist/CNAME");
