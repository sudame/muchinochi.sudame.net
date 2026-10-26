import { KANA, LENGTH, generate, bestLayout, isJackpot, isReach } from "./muchinochi.js";

const stage = document.getElementById("stage");
const word = document.getElementById("word");
const lines = document.getElementById("lines");
const stamp = document.getElementById("stamp");
const status = document.getElementById("status");
const button = document.getElementById("regenerate");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const CHARGE_MS = 700;
const FIRST_STOP_MS = 1100;
const STOP_GAP_MS = 500;
const REACH_EXTRA_MS = 3800;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const slots = () => [...word.children];
const randomKana = (except) => {
  const choices = KANA.filter((ch) => ch !== except);
  return choices[Math.floor(Math.random() * choices.length)];
};

function fit() {
  const { cols, size } = bestLayout(stage.clientWidth, stage.clientHeight);
  word.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  // グリフの余白ぶんだけ少し小さくして、はみ出さないようにする
  word.style.fontSize = `${Math.floor(size * 0.92)}px`;
}

// 光過敏発作を避けるため、全画面の反転は 1 秒に 3 回を超えて呼ばない
function flash() {
  document.documentElement.animate([{ filter: "invert(1)" }, { filter: "invert(0)" }], { duration: 180 });
}

function shake(power, duration) {
  const keyframes = Array.from({ length: 12 }, (_, i) => {
    const decay = 1 - i / 12;
    const x = (Math.random() * 2 - 1) * power * decay;
    const y = (Math.random() * 2 - 1) * power * decay;
    const r = (Math.random() * 2 - 1) * power * 0.15 * decay;
    return { transform: `translate(${x}px, ${y}px) rotate(${r}deg)` };
  });
  keyframes.push({ transform: "none" });
  stage.animate(keyframes, { duration });
}

function slam(el) {
  el.animate(
    [
      { transform: "scale(2.6)", filter: "blur(10px)", opacity: 0 },
      { transform: "scale(0.85)", filter: "blur(0)", opacity: 1, offset: 0.55 },
      { transform: "scale(1.06)", offset: 0.8 },
      { transform: "scale(1)" },
    ],
    { duration: 420, easing: "cubic-bezier(.2,.9,.2,1)" },
  );
}

async function spin(slot, target, duration, slowdown) {
  slot.classList.add("spinning");
  const start = performance.now();
  for (;;) {
    const progress = (performance.now() - start) / duration;
    if (progress >= 1) break;
    slot.textContent = randomKana(slot.textContent);
    // 止まりぎわほど切り替えを遅くして、どれで止まるかを見せつける
    await sleep(30 + slowdown * progress ** 3);
  }
  slot.textContent = target;
  slot.classList.remove("spinning");
  slam(slot);
  shake(18, 320);
}

async function play(text) {
  const reach = isReach(text);
  const jackpot = isJackpot(text);

  document.body.classList.remove("jackpot");
  stamp.hidden = true;
  button.disabled = true;
  button.textContent = "……";

  lines.className = "active";
  word.classList.add("charging");
  shake(10, CHARGE_MS);
  await sleep(CHARGE_MS);
  word.classList.remove("charging");

  const spins = slots().map((slot, i) => {
    const last = i === LENGTH - 1;
    const duration = FIRST_STOP_MS + STOP_GAP_MS * i + (last && reach ? REACH_EXTRA_MS : 0);
    return spin(slot, text[i], duration, last && reach ? 600 : 220);
  });

  if (reach) {
    await spins[LENGTH - 2];
    lines.className = "active reach";
    button.textContent = "リーチ！！";
    button.classList.add("reach");
  }
  await Promise.all(spins);
  button.classList.remove("reach");

  slam(word);
  shake(jackpot ? 60 : 30, jackpot ? 900 : 500);
  flash();

  if (jackpot) {
    document.body.classList.add("jackpot");
    lines.className = "active jackpot";
    // 出た文字を見せてから判子を押す
    await sleep(900);
    stamp.hidden = false;
    shake(40, 500);
    flash();
    slam(stamp);
  } else {
    await sleep(400);
    lines.className = "";
  }
}

function show(text) {
  document.body.classList.toggle("jackpot", isJackpot(text));
  stamp.hidden = !isJackpot(text);
  slots().forEach((slot, i) => {
    slot.textContent = text[i];
  });
}

async function regenerate() {
  const text = generate();
  if (reduceMotion.matches) {
    show(text);
  } else {
    await play(text);
  }
  status.textContent = isJackpot(text) ? `${text}。無知の知！` : text;
  button.textContent = "もういちど";
  button.disabled = false;
}

button.addEventListener("click", regenerate);
new ResizeObserver(fit).observe(stage);

fit();
regenerate();
