import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { milestones, awards, type Award } from "@/data/heritage";
import * as T from "./textures";

// Room dimensions in metres. The hall runs from the entrance (+z) to the Hall of Honours (−z).
const HALF_W = 6;
const HEIGHT = 5.4;
const Z_START = 4;
const Z_END = -27;
const EYE = 1.65;
const FRAME_Z = [-3, -3, -9, -9, -15, -15, -21, -21];
const APSE = { x: 0, z: -21.8, r: 3.4 };

export interface TourStop {
  kicker: string;
  title: string;
  text: string;
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export interface MuseumEvents {
  onProgress?: (p: number) => void;
  onReady?: () => void;
  onStop?: (index: number) => void;
  onVRChange?: (active: boolean) => void;
}

const gold = () => new THREE.MeshStandardMaterial({ color: 0xd4af6a, metalness: 1, roughness: 0.28 });
const brass = () => new THREE.MeshStandardMaterial({ color: 0xb8894a, metalness: 1, roughness: 0.35 });

export class HeritageMuseum {
  readonly stops: TourStop[] = [];
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private rig = new THREE.Group();
  private timer = new THREE.Timer();
  private yaw = 0;
  private pitch = 0;
  private keys = new Set<string>();
  private dragging = false;
  private dragMoved = 0;
  private last = { x: 0, y: 0 };
  private clickable: { object: THREE.Object3D; stop: number }[] = [];
  private spinners: THREE.Object3D[] = [];
  private dust?: THREE.Points;
  private raycaster = new THREE.Raycaster();
  private visible = true;
  private disposed = false;
  private currentStop = 0;
  private tween?: gsap.core.Timeline;
  private observer: IntersectionObserver;
  private resizeObserver: ResizeObserver;

  constructor(private container: HTMLElement, private events: MuseumEvents = {}) {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    this.renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.6));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.xr.enabled = true;
    this.renderer.domElement.style.touchAction = "pan-y";
    this.renderer.domElement.style.display = "block";
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(62, 1, 0.05, 80);
    this.camera.rotation.order = "YXZ";
    this.camera.position.set(0, EYE, 0);
    this.rig.add(this.camera);
    this.scene.add(this.rig);

    this.scene.background = new THREE.Color(0x0b0608);
    this.scene.fog = new THREE.Fog(0x0b0608, 18, 42);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;
    pmrem.dispose();

    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.observer = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.updateLoop();
    });
    this.observer.observe(container);

    this.bindInput();
    this.setupVR();
    this.build();
  }

  // ───────────────────────────── scene ─────────────────────────────

  private async build() {
    await Promise.race([
      Promise.all([
        document.fonts.load("italic 600 40px 'Playfair Display Variable'"),
        document.fonts.load("600 40px Poppins"),
        document.fonts.load("400 40px 'Inter Variable'"),
      ]),
      new Promise((r) => setTimeout(r, 1500)),
    ]).catch(() => undefined);
    if (this.disposed) return;

    this.buildRoom();
    this.buildLights();
    this.buildChandeliers();
    this.buildHonours();
    this.buildDust();
    this.stops.push({
      kicker: "Welcome",
      title: "The British Way Heritage Hall",
      text: "Walk through our journey — every milestone framed in gold, and our proudest honours at the end of the hall.",
      position: new THREE.Vector3(0, EYE, 2.6),
      target: new THREE.Vector3(0, 1.9, -20),
    });

    let loaded = 0;
    const total = milestones.length;
    await Promise.all(
      milestones.map(async (m, i) => {
        const art = await T.loadArtwork(m.image, !!m.historic);
        if (this.disposed) return;
        this.buildFrame(i, art.texture, art.aspect);
        loaded++;
        this.events.onProgress?.(loaded / total);
      }),
    );
    if (this.disposed) return;

    // Stops in chronological order: entrance, frames, then the honours
    milestones.forEach((m, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const z = FRAME_Z[i];
      this.stops.push({
        kicker: m.year,
        title: m.title,
        text: m.text,
        position: new THREE.Vector3(side * 2.3, EYE, z + 0.8),
        target: new THREE.Vector3(side * HALF_W, 2.35, z),
      });
    });
    this.stops.push({
      kicker: "Hall of Honours",
      title: "Our proudest recognitions",
      text: "Awards earned across the group, displayed in the apse of the hall. Select a case to take a closer look.",
      position: new THREE.Vector3(0, EYE, -15.5),
      target: new THREE.Vector3(0, 1.5, -24),
    });
    awards.forEach((a, i) => {
      const p = this.pedestalPosition(i);
      const toCenter = new THREE.Vector3(APSE.x - p.x, 0, APSE.z + 2 - p.z).normalize();
      this.stops.push({
        kicker: a.year,
        title: a.title,
        text: a.by,
        position: new THREE.Vector3(p.x + toCenter.x * 1.9, 1.5, p.z + toCenter.z * 1.9),
        target: new THREE.Vector3(p.x, 1.25, p.z),
      });
    });
    // Pedestals were registered before stops existed; point them at their stop
    this.clickable.forEach((c) => {
      if (c.stop < 0) c.stop = this.stops.length - awards.length + (-c.stop - 1);
    });

    this.goTo(0, true);
    this.timer.reset();
    this.updateLoop();
    this.events.onReady?.();
  }

  private plane(w: number, h: number, material: THREE.Material) {
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  }

  private buildRoom() {
    const length = Z_START - Z_END;
    const midZ = (Z_START + Z_END) / 2;

    const floor = this.plane(HALF_W * 2, length, new THREE.MeshStandardMaterial({ map: T.floorTexture(), roughness: 0.42, metalness: 0.05 }));
    (floor.material as THREE.MeshStandardMaterial).map!.repeat.set(6, length / 2);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = midZ;
    this.scene.add(floor);

    const carpetLen = 25;
    const carpetTex = T.carpetTexture();
    carpetTex.repeat.set(1, carpetLen / 5);
    const carpet = this.plane(2.6, carpetLen, new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 1 }));
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.006, Z_START - 1 - carpetLen / 2);
    this.scene.add(carpet);

    // Round rug under the Hall of Honours
    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(4.3, 64),
      new THREE.MeshStandardMaterial({ map: T.carpetTexture(), roughness: 1 }),
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(APSE.x, 0.008, APSE.z - 1.2);
    this.scene.add(rug);

    const ceilTex = T.ceilingTexture();
    ceilTex.repeat.set(4, length / 3);
    const ceiling = this.plane(HALF_W * 2, length, new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.9 }));
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, HEIGHT, midZ);
    this.scene.add(ceiling);

    const wood = new THREE.MeshStandardMaterial({ color: 0x2e1a0f, roughness: 0.55 });
    const trim = gold();

    for (const side of [-1, 1]) {
      const x = side * HALF_W;
      const rot = -side * (Math.PI / 2);

      const damask = T.damaskTexture();
      damask.repeat.set(length / 1.1, (HEIGHT - 1.1) / 1.1);
      const upper = this.plane(length, HEIGHT - 1.1, new THREE.MeshStandardMaterial({ map: damask, roughness: 0.85 }));
      upper.rotation.y = rot;
      upper.position.set(x, 1.1 + (HEIGHT - 1.1) / 2, midZ);
      this.scene.add(upper);

      const panels = T.wainscotTexture();
      panels.repeat.set(length / 2, 1);
      const lower = this.plane(length, 1.1, new THREE.MeshStandardMaterial({ map: panels, roughness: 0.5 }));
      lower.rotation.y = rot;
      lower.position.set(x - side * 0.01, 0.55, midZ);
      this.scene.add(lower);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, length), trim);
      rail.position.set(x - side * 0.03, 1.1, midZ);
      this.scene.add(rail);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, length), wood);
      base.position.set(x - side * 0.03, 0.08, midZ);
      this.scene.add(base);
      const crown = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, length), trim);
      crown.position.set(x - side * 0.1, HEIGHT - 0.11, midZ);
      this.scene.add(crown);

      // Pilasters between the frames
      for (let z = 0; z >= -24; z -= 6) {
        const pil = new THREE.Mesh(new THREE.BoxGeometry(0.16, HEIGHT, 0.45), new THREE.MeshStandardMaterial({ map: T.marbleTexture(), roughness: 0.3 }));
        pil.position.set(x - side * 0.08, HEIGHT / 2, z);
        this.scene.add(pil);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.6), trim);
        cap.position.set(x - side * 0.12, HEIGHT - 0.5, z);
        this.scene.add(cap);
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.4, 0.58), wood);
        plinth.position.set(x - side * 0.11, 0.2, z);
        this.scene.add(plinth);
      }
    }

    // Ceiling beams
    for (let z = 0; z >= -24; z -= 6) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(HALF_W * 2, 0.35, 0.4), new THREE.MeshStandardMaterial({ color: 0xe9dfc9, roughness: 0.8 }));
      beam.position.set(0, HEIGHT - 0.17, z);
      this.scene.add(beam);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(HALF_W * 2, 0.04, 0.44), trim);
      edge.position.set(0, HEIGHT - 0.36, z);
      this.scene.add(edge);
    }

    // End wall with the logo and title
    const endDamask = T.damaskTexture();
    endDamask.repeat.set(HALF_W * 2 / 1.3, HEIGHT / 1.3);
    const end = this.plane(HALF_W * 2, HEIGHT, new THREE.MeshStandardMaterial({ map: endDamask, roughness: 0.85 }));
    end.position.set(0, HEIGHT / 2, Z_END);
    this.scene.add(end);

    new THREE.TextureLoader().load("/logos/bwh-logo-light.png", (tex) => {
      if (this.disposed) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      const aspect = tex.image.width / tex.image.height;
      const w = 5.2;
      const logo = this.plane(w, w / aspect, new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
      logo.position.set(0, 4.1, Z_END + 0.03);
      this.scene.add(logo);
    });
    const title = this.plane(6.4, 1.12, new THREE.MeshBasicMaterial({ map: T.titleTexture("Hall of Honours", "EXCELLENCE SINCE DAY ONE"), transparent: true, toneMapped: false }));
    title.position.set(0, 3.1, Z_END + 0.03);
    this.scene.add(title);

    // Entrance wall with a dark doorway
    const entry = this.plane(HALF_W * 2, HEIGHT, new THREE.MeshStandardMaterial({ map: T.damaskTexture(), roughness: 0.85 }));
    entry.rotation.y = Math.PI;
    entry.position.set(0, HEIGHT / 2, Z_START);
    this.scene.add(entry);
    const door = this.plane(2.4, 3.2, new THREE.MeshBasicMaterial({ color: 0x050304 }));
    door.rotation.y = Math.PI;
    door.position.set(0, 1.6, Z_START - 0.02);
    this.scene.add(door);
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xffe7c4, 0x2a0f14, 0.9));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.12));

    const honours = new THREE.SpotLight(0xfff0d0, 90, 16, 0.75, 0.6, 1.4);
    honours.position.set(0, HEIGHT - 0.2, -17.5);
    honours.target.position.set(0, 0.8, -24);
    this.scene.add(honours, honours.target);

    const endWash = new THREE.SpotLight(0xffd9a0, 60, 12, 0.9, 0.8, 1.5);
    endWash.position.set(0, 1, -20);
    endWash.target.position.set(0, 4, Z_END);
    this.scene.add(endWash, endWash.target);
  }

  private buildChandeliers() {
    const metal = brass();
    const bulb = new THREE.MeshStandardMaterial({ color: 0xfff1d0, emissive: 0xffc878, emissiveIntensity: 3 });
    const crystal = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.05 });
    for (const z of [-3, -12, -21]) {
      const g = new THREE.Group();
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8), metal);
      rod.position.y = 0.55;
      g.add(rod);
      for (const [r, y, n] of [[0.62, 0, 10], [0.36, 0.28, 6]] as const) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 8, 48), metal);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        g.add(ring);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), bulb);
          b.position.set(Math.cos(a) * r, y + 0.08, Math.sin(a) * r);
          g.add(b);
          const drop = new THREE.Mesh(new THREE.OctahedronGeometry(0.035), crystal);
          drop.scale.y = 1.8;
          drop.position.set(Math.cos(a + 0.3) * r, y - 0.12, Math.sin(a + 0.3) * r);
          g.add(drop);
        }
      }
      g.position.set(0, HEIGHT - 1.25, z);
      this.scene.add(g);
      const light = new THREE.PointLight(0xffcf8a, 22, 15, 1.6);
      light.position.set(0, HEIGHT - 1.3, z);
      this.scene.add(light);
      this.spinners.push(g);
    }
  }

  private buildFrame(i: number, texture: THREE.Texture, aspect: number) {
    const side = i % 2 === 0 ? -1 : 1;
    const z = FRAME_Z[i];
    const h = 1.75;
    const w = THREE.MathUtils.clamp(h * aspect, 1.3, 2.9);
    const g = new THREE.Group();

    // Ornate gilded frame: bevelled outer moulding plus an inner gold slip
    const frameMat = gold();
    const t = 0.13;
    const bars: [number, number, number, number][] = [
      [0, h / 2 + t / 2 + 0.06, w + 0.12 + t * 2, t],
      [0, -h / 2 - t / 2 - 0.06, w + 0.12 + t * 2, t],
      [-w / 2 - t / 2 - 0.06, 0, t, h + 0.12],
      [w / 2 + t / 2 + 0.06, 0, t, h + 0.12],
    ];
    bars.forEach(([x, y, bw, bh]) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.09), frameMat);
      bar.position.set(x, y, 0.045);
      g.add(bar);
    });
    const slip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.02), new THREE.MeshStandardMaterial({ color: 0x1a0f08, roughness: 0.8 }));
    slip.position.z = 0.02;
    g.add(slip);
    const art = this.plane(w, h, new THREE.MeshBasicMaterial({ map: texture, toneMapped: false, color: 0xf2eee6 }));
    art.position.z = 0.035;
    g.add(art);

    // Picture light and the glow it casts
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, w * 0.6, 12), brass());
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(0, h / 2 + 0.35, 0.28);
    g.add(lamp);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass());
    arm.rotation.x = Math.PI / 2;
    arm.position.set(0, h / 2 + 0.33, 0.13);
    g.add(arm);
    const pool = this.plane(w * 1.6, h * 1.25, new THREE.MeshBasicMaterial({ map: T.lightPoolTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55 }));
    pool.position.set(0, h * 0.15, 0.005);
    g.add(pool);

    // Label plaque under the frame
    const m = milestones[i];
    const plaque = this.plane(0.8, 0.34, new THREE.MeshBasicMaterial({ map: T.plaqueTexture(m.year, m.title), toneMapped: false }));
    plaque.position.set(0, -h / 2 - 0.42, 0.02);
    g.add(plaque);

    g.position.set(side * (HALF_W - 0.02), 2.35, z);
    g.rotation.y = side * -Math.PI / 2;
    this.scene.add(g);
    this.clickable.push({ object: art, stop: i + 1 });

    // Velvet rope barrier in front of the frame
    this.buildRope(side * (HALF_W - 1.1), z - w / 2 - 0.2, z + w / 2 + 0.2);
  }

  private buildRope(x: number, z1: number, z2: number) {
    const metal = brass();
    for (const z of [z1, z2]) {
      const post = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.95, 16), metal);
      pole.position.y = 0.475;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 24), metal);
      base.position.y = 0.02;
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), metal);
      top.position.y = 0.98;
      post.add(pole, base, top);
      post.position.set(x, 0, z);
      this.scene.add(post);
    }
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 0.92, z1),
      new THREE.Vector3(x, 0.72, (z1 + z2) / 2),
      new THREE.Vector3(x, 0.92, z2),
    ]);
    const rope = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.022, 10), new THREE.MeshStandardMaterial({ color: 0x7a0c1c, roughness: 0.95 }));
    this.scene.add(rope);
  }

  private pedestalPosition(i: number) {
    const a = THREE.MathUtils.degToRad(-56 + i * 28);
    return new THREE.Vector3(APSE.x + Math.sin(a) * APSE.r, 0, APSE.z - Math.cos(a) * APSE.r);
  }

  private buildHonours() {
    const marble = T.marbleTexture();
    awards.forEach((award, i) => {
      const p = this.pedestalPosition(i);
      const g = new THREE.Group();
      g.position.copy(p);
      g.lookAt(APSE.x, 0, APSE.z + 3);

      const column = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1, 0.62), new THREE.MeshStandardMaterial({ map: marble, roughness: 0.25 }));
      column.position.y = 0.5;
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.7), gold());
      cap.position.y = 1.02;
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.72), gold());
      foot.position.y = 0.04;
      g.add(column, cap, foot);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.72, 0.56),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transmission: 0.96, thickness: 0.04, ior: 1.45, transparent: true, opacity: 0.35 }),
      );
      glass.position.y = 1.41;
      g.add(glass);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 0.58), gold());
      lid.position.y = 1.78;
      g.add(lid);

      const trophy = this.trophy(award);
      trophy.position.y = 1.05;
      g.add(trophy);
      this.spinners.push(trophy);

      const plaque = this.plane(0.5, 0.215, new THREE.MeshBasicMaterial({ map: T.plaqueTexture(award.year, award.title, award.by), toneMapped: false }));
      plaque.position.set(0, 0.7, 0.315);
      g.add(plaque);

      const glow = new THREE.PointLight(0xffe2a8, 1.6, 1.6, 2);
      glow.position.set(0, 1.7, 0);
      g.add(glow);

      this.scene.add(g);
      // Negative ids are resolved to real tour stops once they exist
      this.clickable.push({ object: glass, stop: -(i + 1) });
      this.clickable.push({ object: column, stop: -(i + 1) });
    });
  }

  private trophy(award: Award) {
    const g = new THREE.Group();
    const metal = gold();
    const dark = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.4, metalness: 0.3 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 32), dark);
    base.position.y = 0.04;
    g.add(base);

    if (award.kind === "cup") {
      const profile = [
        [0.0, 0.08], [0.08, 0.08], [0.08, 0.1], [0.03, 0.13], [0.022, 0.26], [0.05, 0.3],
        [0.12, 0.36], [0.15, 0.46], [0.155, 0.52], [0.145, 0.52], [0.0, 0.34],
      ].map(([x, y]) => new THREE.Vector2(x, y));
      const cup = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), metal);
      g.add(cup);
      for (const s of [-1, 1]) {
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 12, 24, Math.PI), metal);
        handle.position.set(s * 0.15, 0.44, 0);
        handle.rotation.z = s * -Math.PI / 2;
        g.add(handle);
      }
    } else if (award.kind === "star") {
      const shape = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 0.07 : 0.16;
        const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
        if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      const star = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3 }), metal);
      star.position.set(0, 0.36, -0.02);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.14, 12), metal);
      stem.position.y = 0.15;
      g.add(star, stem);
    } else if (award.kind === "crystal") {
      const crystal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.1, 0.5, 4, 1),
        new THREE.MeshPhysicalMaterial({ color: 0xcfe2ff, roughness: 0, transmission: 1, thickness: 0.3, ior: 1.6, iridescence: 0.4 }),
      );
      crystal.position.y = 0.33;
      crystal.rotation.y = Math.PI / 4;
      g.add(crystal);
    } else if (award.kind === "medal") {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 48), metal);
      disc.rotation.x = Math.PI / 2;
      disc.position.y = 0.3;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 12, 48), metal);
      rim.position.y = 0.3;
      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x1b3f8f, roughness: 0.7 });
      const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.005), ribbonMat);
      r1.position.set(-0.04, 0.48, 0);
      r1.rotation.z = 0.3;
      const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.005), new THREE.MeshStandardMaterial({ color: 0xa3162a, roughness: 0.7 }));
      r2.position.set(0.04, 0.48, 0);
      r2.rotation.z = -0.3;
      g.add(disc, rim, r1, r2);
    } else {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0.2);
      shape.lineTo(0.14, 0.16);
      shape.quadraticCurveTo(0.15, -0.05, 0, -0.18);
      shape.quadraticCurveTo(-0.15, -0.05, -0.14, 0.16);
      shape.closePath();
      const shield = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }),
        new THREE.MeshStandardMaterial({ color: 0xdfe4ea, metalness: 1, roughness: 0.2 }),
      );
      shield.position.set(0, 0.32, -0.015);
      g.add(shield);
    }
    return g;
  }

  private buildDust() {
    const count = window.matchMedia("(max-width: 767px)").matches ? 180 : 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * (HALF_W - 0.5);
      positions[i * 3 + 1] = Math.random() * (HEIGHT - 0.5);
      positions[i * 3 + 2] = Z_START - Math.random() * (Z_START - Z_END);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.035, map: T.dustTexture(), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe0a8 }),
    );
    this.scene.add(this.dust);
  }

  // ───────────────────────────── camera & tour ─────────────────────────────

  /** Glides to a tour stop. */
  goTo(index: number, instant = false) {
    const stop = this.stops[index];
    if (!stop) return;
    this.currentStop = index;
    this.events.onStop?.(index);
    const d = stop.target.clone().sub(stop.position);
    let yaw = Math.atan2(-d.x, -d.z);
    const pitch = Math.atan2(d.y, Math.hypot(d.x, d.z));
    // Turn the short way round
    while (yaw - this.yaw > Math.PI) yaw -= Math.PI * 2;
    while (yaw - this.yaw < -Math.PI) yaw += Math.PI * 2;

    this.tween?.kill();
    if (instant) {
      this.rig.position.set(stop.position.x, 0, stop.position.z);
      this.camera.position.y = stop.position.y;
      this.yaw = yaw;
      this.pitch = pitch;
      return;
    }
    const state = { x: this.rig.position.x, z: this.rig.position.z, y: this.camera.position.y, yaw: this.yaw, pitch: this.pitch };
    this.tween = gsap.timeline().to(state, {
      x: stop.position.x,
      z: stop.position.z,
      y: stop.position.y,
      yaw,
      pitch,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        this.rig.position.x = state.x;
        this.rig.position.z = state.z;
        this.camera.position.y = state.y;
        this.yaw = state.yaw;
        this.pitch = state.pitch;
      },
    });
  }

  next() {
    this.goTo((this.currentStop + 1) % this.stops.length);
  }

  prev() {
    this.goTo((this.currentStop - 1 + this.stops.length) % this.stops.length);
  }

  // ───────────────────────────── input ─────────────────────────────

  private bindInput() {
    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerCancel);
    el.addEventListener("pointermove", this.onHover);
    this.container.addEventListener("keydown", this.onKeyDown);
    this.container.addEventListener("keyup", this.onKeyUp);
    this.container.addEventListener("blur", this.onBlur);
  }

  private onPointerDown = (e: PointerEvent) => {
    this.dragging = true;
    this.dragMoved = 0;
    this.last = { x: e.clientX, y: e.clientY };
    this.container.focus({ preventScroll: true });
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.last.x;
    const dy = e.clientY - this.last.y;
    this.last = { x: e.clientX, y: e.clientY };
    this.dragMoved += Math.abs(dx) + Math.abs(dy);
    if (this.dragMoved > 4) this.tween?.kill();
    this.yaw += dx * 0.0038;
    if (e.pointerType === "mouse") this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.003, -0.7, 0.7);
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.dragMoved < 6) {
      const hit = this.pick(e);
      if (hit !== null) this.goTo(hit);
    }
  };

  // A vertical swipe on touch screens scrolls the page instead of the view
  private onPointerCancel = () => {
    this.dragging = false;
  };

  private onHover = (e: PointerEvent) => {
    if (this.dragging) return;
    this.renderer.domElement.style.cursor = this.pick(e) !== null ? "pointer" : "grab";
  };

  private pick(e: PointerEvent) {
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickable.map((c) => c.object), false);
    if (!hits.length) return null;
    return this.clickable.find((c) => c.object === hits[0].object)?.stop ?? null;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
      e.preventDefault();
      this.tween?.kill();
      this.keys.add(k);
    }
  };

  private onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.key.toLowerCase());
  private onBlur = () => this.keys.clear();

  // ───────────────────────────── VR ─────────────────────────────

  private setupVR() {
    this.renderer.xr.addEventListener("sessionstart", () => {
      this.camera.position.y = 0;
      this.events.onVRChange?.(true);
    });
    this.renderer.xr.addEventListener("sessionend", () => {
      this.camera.position.y = EYE;
      this.events.onVRChange?.(false);
      this.updateLoop();
    });
    // Trigger on either controller walks to the next exhibit
    for (const i of [0, 1]) this.renderer.xr.getController(i).addEventListener("select", () => this.next());
  }

  static async vrSupported() {
    try {
      return !!(await navigator.xr?.isSessionSupported("immersive-vr"));
    } catch {
      return false;
    }
  }

  async enterVR() {
    if (!navigator.xr) return;
    const session = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor"] });
    this.renderer.xr.setReferenceSpaceType("local-floor");
    await this.renderer.xr.setSession(session);
    this.updateLoop();
  }

  // ───────────────────────────── loop ─────────────────────────────

  private updateLoop() {
    const run = !this.disposed && (this.visible || this.renderer.xr.isPresenting);
    this.renderer.setAnimationLoop(run ? this.render : null);
  }

  private render = (time: number) => {
    this.timer.update(time);
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const t = this.timer.getElapsed();

    // Walking
    if (this.keys.size) {
      const f = (this.keys.has("w") || this.keys.has("arrowup") ? 1 : 0) - (this.keys.has("s") || this.keys.has("arrowdown") ? 1 : 0);
      const turn = (this.keys.has("arrowleft") ? 1 : 0) - (this.keys.has("arrowright") ? 1 : 0);
      const strafe = (this.keys.has("d") ? 1 : 0) - (this.keys.has("a") ? 1 : 0);
      this.yaw += turn * dt * 1.6;
      const speed = 3.2 * dt;
      this.rig.position.x += (-Math.sin(this.yaw) * f + Math.cos(this.yaw) * strafe) * speed;
      this.rig.position.z += (-Math.cos(this.yaw) * f - Math.sin(this.yaw) * strafe) * speed;
      this.rig.position.x = THREE.MathUtils.clamp(this.rig.position.x, -HALF_W + 0.9, HALF_W - 0.9);
      this.rig.position.z = THREE.MathUtils.clamp(this.rig.position.z, Z_END + 1.2, Z_START - 0.8);
    }

    if (!this.renderer.xr.isPresenting) {
      this.camera.rotation.y = this.yaw;
      this.camera.rotation.x = this.pitch + Math.sin(t * 0.6) * 0.004;
    }

    this.spinners.forEach((s, i) => (s.rotation.y += dt * (i < 3 ? 0.05 : 0.45)));
    if (this.dust) {
      this.dust.rotation.y = Math.sin(t * 0.05) * 0.02;
      this.dust.position.y = Math.sin(t * 0.3) * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 1 ? 75 : 62;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.disposed = true;
    this.tween?.kill();
    this.renderer.setAnimationLoop(null);
    this.observer.disconnect();
    this.resizeObserver.disconnect();
    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this.onPointerDown);
    el.removeEventListener("pointermove", this.onHover);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerCancel);
    this.container.removeEventListener("keydown", this.onKeyDown);
    this.container.removeEventListener("keyup", this.onKeyUp);
    this.container.removeEventListener("blur", this.onBlur);
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      mats.forEach((m) => {
        Object.values(m).forEach((v) => (v instanceof THREE.Texture ? v.dispose() : undefined));
        m.dispose();
      });
    });
    this.scene.environment?.dispose();
    this.renderer.xr.getSession()?.end();
    this.renderer.dispose();
    el.remove();
  }
}
