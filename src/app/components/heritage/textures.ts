import * as THREE from "three";

// Procedurally painted materials for the Heritage Hall. Painting them on canvases
// keeps the download tiny and lets every surface tile seamlessly.

type Ctx = CanvasRenderingContext2D;

function makeCanvas(w: number, h: number): [HTMLCanvasElement, Ctx] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!];
}

function toTexture(c: HTMLCanvasElement, repeatX = 1, repeatY = 1, color = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}

// Deterministic randomness so the room looks the same on every visit
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function noise(ctx: Ctx, w: number, h: number, amount: number, alpha: number, rand = Math.random) {
  for (let i = 0; i < amount; i++) {
    const v = rand() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha * rand()})`;
    ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
  }
}

/** Oak/walnut plank floor (1 tile ≈ 2 m square). */
export function floorTexture() {
  const [c, ctx] = makeCanvas(1024, 1024);
  const rand = rng(7);
  const boardW = 64;
  for (let x = 0; x < 1024; x += boardW) {
    let y = -rand() * 400;
    while (y < 1024) {
      const len = 260 + rand() * 380;
      const base = 60 + rand() * 38;
      const r = base + 38;
      const g = base * 0.62 + 12;
      const b = base * 0.34;
      const grad = ctx.createLinearGradient(x, 0, x + boardW, 0);
      grad.addColorStop(0, `rgb(${r - 8},${g - 6},${b - 4})`);
      grad.addColorStop(0.5, `rgb(${r + 6},${g + 4},${b + 2})`);
      grad.addColorStop(1, `rgb(${r - 10},${g - 8},${b - 5})`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, boardW, len);
      // wood grain
      ctx.strokeStyle = `rgba(40,22,10,${0.18 + rand() * 0.2})`;
      ctx.lineWidth = 1;
      for (let gx = 0; gx < 9; gx++) {
        const px = x + 4 + rand() * (boardW - 8);
        ctx.beginPath();
        ctx.moveTo(px, y);
        for (let py = y; py < y + len; py += 24) ctx.lineTo(px + Math.sin(py * 0.03 + gx) * 2.2, py);
        ctx.stroke();
      }
      // seams
      ctx.fillStyle = "rgba(15,8,4,0.85)";
      ctx.fillRect(x, y, boardW, 2);
      y += len;
    }
    ctx.fillStyle = "rgba(15,8,4,0.9)";
    ctx.fillRect(x, 0, 2, 1024);
  }
  noise(ctx, 1024, 1024, 18000, 0.08, rand);
  return toTexture(c);
}

/** Crimson runner with gold borders and a medallion lattice (repeats along its length). */
export function carpetTexture() {
  const [c, ctx] = makeCanvas(512, 1024);
  const rand = rng(11);
  const g = ctx.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, "#4a0a14");
  g.addColorStop(0.5, "#7a1022");
  g.addColorStop(1, "#4a0a14");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 1024);

  const gold = "rgba(212,175,95,0.85)";
  ctx.fillStyle = gold;
  ctx.fillRect(22, 0, 10, 1024);
  ctx.fillRect(480, 0, 10, 1024);
  ctx.fillStyle = "rgba(212,175,95,0.5)";
  ctx.fillRect(44, 0, 3, 1024);
  ctx.fillRect(465, 0, 3, 1024);
  // border meander
  ctx.strokeStyle = "rgba(212,175,95,0.45)";
  ctx.lineWidth = 3;
  for (let y = 0; y < 1024; y += 32) {
    ctx.strokeRect(6, y + 6, 10, 20);
    ctx.strokeRect(496, y + 6, 10, 20);
  }
  // lattice of diamonds and medallions
  ctx.strokeStyle = "rgba(212,175,95,0.32)";
  ctx.lineWidth = 2;
  for (let y = 0; y <= 1024; y += 128) {
    for (let x = 128; x <= 384; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, y - 64);
      ctx.lineTo(x + 64, y);
      ctx.lineTo(x, y + 64);
      ctx.lineTo(x - 64, y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,175,95,0.35)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20,30,70,0.8)";
      ctx.fill();
    }
  }
  noise(ctx, 512, 1024, 40000, 0.12, rand);
  return toTexture(c);
}

/** Oxblood damask wall covering: symmetrical acanthus sprays with a tulip crown. */
export function damaskTexture() {
  const [c, ctx] = makeCanvas(512, 512);
  const rand = rng(3);
  ctx.fillStyle = "#3e1019";
  ctx.fillRect(0, 0, 512, 512);

  const motif = (cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(92,28,40,0.75)";
    ctx.strokeStyle = "rgba(214,170,112,0.16)";
    ctx.lineWidth = 1.6;
    // central stem
    ctx.beginPath();
    ctx.moveTo(-3, 70);
    ctx.quadraticCurveTo(0, 0, -3, -70);
    ctx.lineTo(3, -70);
    ctx.quadraticCurveTo(0, 0, 3, 70);
    ctx.fill();
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      // lower scrolling leaf
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.bezierCurveTo(30, 20, 70, 40, 62, 72);
      ctx.bezierCurveTo(55, 92, 30, 84, 38, 66);
      ctx.bezierCurveTo(26, 70, 12, 60, 0, 58);
      ctx.fill();
      ctx.stroke();
      // upper leaf
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(26, -10, 58, -4, 60, -30);
      ctx.bezierCurveTo(62, -48, 40, -52, 36, -36);
      ctx.bezierCurveTo(30, -22, 14, -14, 0, -14);
      ctx.fill();
      ctx.stroke();
      // tulip petal
      ctx.beginPath();
      ctx.moveTo(0, -58);
      ctx.bezierCurveTo(14, -64, 22, -84, 12, -100);
      ctx.bezierCurveTo(8, -88, 4, -80, 0, -78);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    // bud
    ctx.beginPath();
    ctx.ellipse(0, -96, 7, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  motif(128, 128);
  motif(384, 384);
  motif(384, -128);
  motif(128, 640);
  motif(-128, 384);
  motif(640, 128);

  const v = ctx.createRadialGradient(256, 256, 50, 256, 256, 380);
  v.addColorStop(0, "rgba(255,255,255,0.02)");
  v.addColorStop(1, "rgba(0,0,0,0.12)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 512, 512);
  noise(ctx, 512, 512, 14000, 0.05, rand);
  return toTexture(c);
}

/** Walnut wainscot with raised panels. One tile = one 2 m panel bay. */
export function wainscotTexture() {
  const [c, ctx] = makeCanvas(512, 280);
  const rand = rng(5);
  ctx.fillStyle = "#3a2214";
  ctx.fillRect(0, 0, 512, 280);
  ctx.strokeStyle = "rgba(20,10,4,0.35)";
  for (let i = 0; i < 60; i++) {
    const y = rand() * 280;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + 6, 340, y - 6, 512, y + rand() * 4);
    ctx.stroke();
  }
  const panel = (x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = "#4a2c1a";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(255,210,160,0.18)";
    ctx.fillRect(x, y, w, 4);
    ctx.fillRect(x, y, 4, h);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(x, y + h - 5, w, 5);
    ctx.fillRect(x + w - 5, y, 5, h);
    ctx.strokeStyle = "rgba(216,179,106,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 14, y + 14, w - 28, h - 28);
  };
  panel(28, 40, 456, 190);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, 512, 10);
  ctx.fillRect(0, 260, 512, 20);
  noise(ctx, 512, 280, 9000, 0.06, rand);
  return toTexture(c);
}

/** Cream coffered ceiling. */
export function ceilingTexture() {
  const [c, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = "#e9dfc9";
  ctx.fillRect(0, 0, 512, 512);
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 260);
  g.addColorStop(0, "#f6efdf");
  g.addColorStop(1, "#b9ab8e");
  ctx.fillStyle = g;
  ctx.fillRect(40, 40, 432, 432);
  ctx.strokeStyle = "rgba(160,120,60,0.6)";
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 60, 392, 392);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, 372, 372);
  return toTexture(c);
}

/** White marble for pedestals. */
export function marbleTexture() {
  const [c, ctx] = makeCanvas(512, 512);
  const rand = rng(21);
  ctx.fillStyle = "#ece8e1";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 26; i++) {
    ctx.strokeStyle = `rgba(${90 + rand() * 40},${90 + rand() * 30},${100 + rand() * 30},${0.08 + rand() * 0.2})`;
    ctx.lineWidth = 0.5 + rand() * 2.5;
    ctx.beginPath();
    let x = rand() * 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      x += (rand() - 0.45) * 60;
      y += 20 + rand() * 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  noise(ctx, 512, 512, 8000, 0.05, rand);
  return toTexture(c);
}

/** Soft warm light pool painted on the wall above each picture light. */
export function lightPoolTexture() {
  const [c, ctx] = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 30, 4, 128, 110, 150);
  g.addColorStop(0, "rgba(255,236,190,0.85)");
  g.addColorStop(0.35, "rgba(255,210,150,0.3)");
  g.addColorStop(1, "rgba(255,200,140,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return toTexture(c, 1, 1);
}

/** Round sprite for floating dust motes. */
export function dustTexture() {
  const [c, ctx] = makeCanvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,240,210,1)");
  g.addColorStop(0.4, "rgba(255,220,170,0.35)");
  g.addColorStop(1, "rgba(255,220,170,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return toTexture(c);
}

function wrapLines(ctx: Ctx, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/** Engraved brass-and-ebony museum label. */
export function plaqueTexture(kicker: string, title: string, body?: string) {
  const [c, ctx] = makeCanvas(1024, 440);
  const g = ctx.createLinearGradient(0, 0, 1024, 440);
  g.addColorStop(0, "#1c140d");
  g.addColorStop(1, "#0d0906");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 440);
  const gold = ctx.createLinearGradient(0, 0, 1024, 0);
  gold.addColorStop(0, "#9c7a3c");
  gold.addColorStop(0.5, "#f3dca0");
  gold.addColorStop(1, "#9c7a3c");
  ctx.strokeStyle = gold;
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 996, 412);
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, 956, 372);

  ctx.textAlign = "center";
  ctx.fillStyle = gold;
  ctx.font = "italic 600 92px 'Playfair Display Variable', Georgia, serif";
  ctx.fillText(kicker, 512, 142);
  ctx.fillStyle = "#f5efe2";
  ctx.font = "600 50px Poppins, sans-serif";
  const titleLines = wrapLines(ctx, title, 880);
  titleLines.slice(0, 2).forEach((l, i) => ctx.fillText(l, 512, 222 + i * 58));
  if (body) {
    ctx.fillStyle = "rgba(233,225,210,0.75)";
    ctx.font = "34px 'Inter Variable', sans-serif";
    const start = 222 + Math.min(titleLines.length, 2) * 58 + 8;
    wrapLines(ctx, body, 900)
      .slice(0, 3)
      .forEach((l, i) => ctx.fillText(l, 512, start + i * 42));
  }
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/** Large gilded lettering for the end wall. */
export function titleTexture(text: string, sub: string) {
  const [c, ctx] = makeCanvas(2048, 360);
  ctx.textAlign = "center";
  const gold = ctx.createLinearGradient(0, 0, 2048, 0);
  gold.addColorStop(0, "#9c7a3c");
  gold.addColorStop(0.3, "#f3dca0");
  gold.addColorStop(0.55, "#d8b36a");
  gold.addColorStop(0.8, "#fff1c8");
  gold.addColorStop(1, "#9c7a3c");
  ctx.fillStyle = gold;
  ctx.font = "600 150px 'Playfair Display Variable', Georgia, serif";
  ctx.fillText(text, 1024, 170);
  ctx.fillStyle = "rgba(243,220,160,0.75)";
  ctx.font = "500 56px Poppins, sans-serif";
  ctx.fillText(sub.split("").join(" "), 1024, 290);
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/**
 * Loads an image, downsizes it for the GPU and optionally ages it with a
 * sepia tone. Resolves with the texture and the image's aspect ratio.
 */
export function loadArtwork(src: string, historic: boolean): Promise<{ texture: THREE.Texture; aspect: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
      const [c, ctx] = makeCanvas(Math.round(img.width * scale), Math.round(img.height * scale));
      ctx.drawImage(img, 0, 0, c.width, c.height);
      if (historic) {
        const data = ctx.getImageData(0, 0, c.width, c.height);
        const d = data.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const sr = r * 0.393 + g * 0.769 + b * 0.189;
          const sg = r * 0.349 + g * 0.686 + b * 0.168;
          const sb = r * 0.272 + g * 0.534 + b * 0.131;
          d[i] = Math.min(255, r * 0.3 + sr * 0.7);
          d[i + 1] = Math.min(255, g * 0.3 + sg * 0.7);
          d[i + 2] = Math.min(255, b * 0.3 + sb * 0.7);
        }
        ctx.putImageData(data, 0, 0);
        const v = ctx.createRadialGradient(c.width / 2, c.height / 2, c.width * 0.3, c.width / 2, c.height / 2, c.width * 0.75);
        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(40,20,0,0.35)");
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, c.width, c.height);
      }
      const t = toTexture(c);
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      resolve({ texture: t, aspect: img.width / img.height });
    };
    img.onerror = () => {
      const [c, ctx] = makeCanvas(8, 8);
      ctx.fillStyle = "#1b3f8f";
      ctx.fillRect(0, 0, 8, 8);
      resolve({ texture: toTexture(c), aspect: 0.8 });
    };
    img.src = src;
  });
}
