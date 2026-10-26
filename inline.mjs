export const SCRIPT_TAG = '<script type="module" src="main.js"></script>';

// index.html が読み込む main.js を、まとめた JS の埋め込みに差し替える
export function inline(html, js) {
  if (!html.includes(SCRIPT_TAG)) {
    throw new Error(`index.html に ${SCRIPT_TAG} がない`);
  }
  if (/<\/script/i.test(js)) {
    throw new Error("JS に </script が含まれていて、HTML に埋め込めない");
  }
  return html.replace(SCRIPT_TAG, () => `<script type="module">${js.trim()}</script>`);
}
