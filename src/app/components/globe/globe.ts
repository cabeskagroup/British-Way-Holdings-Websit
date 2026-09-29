import * as THREE from "three";
import { worldDots, lankaDots } from "@/data/worldDots";

const DEG = Math.PI / 180;
const HOME = { lat: 7.87, lon: 80.77 }; // centre of Sri Lanka

export interface GlobePlace {
  lat: number;
  lon: number;
  label?: string;
}

export interface GlobeOptions {
  /** Cities the arcs fly to from Sri Lanka. */
  destinations: GlobePlace[];
  /** HTML elements to keep pinned over places, keyed by label. */
  labels?: Map<string, HTMLElement>;
  origin?: GlobePlace;
}

function toVec(lat: number, lon: number, r = 1) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function dotSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function pointsFrom(data: Float32Array, radius: number) {
  const pos = new Float32Array((data.length / 2) * 3);
  for (let i = 0; i < data.length; i += 2) {
    const v = toVec(data[i + 1], data[i], radius);
    pos.set([v.x, v.y, v.z], (i / 2) * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return geo;
}

/** Great-circle arc lifted off the surface in proportion to its length. */
function arcCurve(a: GlobePlace, b: GlobePlace) {
  const va = toVec(a.lat, a.lon);
  const vb = toVec(b.lat, b.lon);
  const angle = va.angleTo(vb);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    const v = new THREE.Vector3().copy(va).lerp(vb, t).normalize();
    // slerp-like normalisation + altitude bump
    const lift = 1 + Math.sin(Math.PI * t) * (0.12 + angle * 0.16);
    pts.push(v.multiplyScalar(lift));
  }
  return new THREE.CatmullRomCurve3(pts);
}

const arcVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const arcFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOffset;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float head = fract(uTime * 0.28 + uOffset) * 1.6 - 0.3;
    float d = vUv.x - head;
    float trail = smoothstep(-0.28, 0.0, d) * (1.0 - smoothstep(0.0, 0.02, d));
    float base = 0.14;
    float a = base + trail * 1.4;
    vec3 col = mix(uColor, vec3(1.0), trail * 0.6);
    gl_FragColor = vec4(col, a);
  }
`;

export class Globe {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  private world = new THREE.Group();
  private timer = new THREE.Timer();
  private arcMaterials: THREE.ShaderMaterial[] = [];
  private markers: THREE.Mesh[] = [];
  private labelPoints: { el: HTMLElement; pos: THREE.Vector3 }[] = [];
  private base = { x: 0, y: 0 };
  private drag = { x: 0, y: 0, vx: 0, vy: 0, active: false, lastX: 0, lastY: 0 };
  private visible = false;
  private disposed = false;
  private io: IntersectionObserver;
  private ro: ResizeObserver;

  constructor(private container: HTMLElement, private opts: GlobeOptions) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.touchAction = "pan-y";
    this.renderer.domElement.style.cursor = "grab";
    container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 0, 5.3);
    this.scene.add(this.world);
    this.build();

    // Start with Sri Lanka facing the viewer
    const origin = opts.origin ?? HOME;
    const p = toVec(origin.lat, origin.lon);
    this.base.y = Math.atan2(-p.x, p.z);
    this.base.x = origin.lat * DEG * 0.85;
    this.world.rotation.set(this.base.x, this.base.y, 0);

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.renderer.setAnimationLoop(this.visible && !this.disposed ? this.render : null);
    });
    this.io.observe(container);

    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", this.onDown);
    window.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
    window.addEventListener("pointercancel", this.onUp);
  }

  private build() {
    const origin = this.opts.origin ?? HOME;

    // Ocean body with a soft rim light
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.995, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
            vec3 col = mix(vec3(0.02, 0.04, 0.10), vec3(0.16, 0.32, 0.72), rim);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    );
    this.world.add(body);

    // Atmosphere halo
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            float i = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(0.35, 0.55, 1.0, 1.0) * i;
          }
        `,
      }),
    );
    this.scene.add(halo);

    const sprite = dotSprite();
    const land = new THREE.Points(
      pointsFrom(worldDots, 1.001),
      new THREE.PointsMaterial({ size: 0.03, map: sprite, color: 0x9cc0ff, transparent: true, opacity: 1, depthWrite: false }),
    );
    this.world.add(land);

    const lanka = new THREE.Points(
      pointsFrom(lankaDots, 1.004),
      new THREE.PointsMaterial({ size: 0.05, map: sprite, color: 0xffd98a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.world.add(lanka);

    // Home beacon
    const home = toVec(origin.lat, origin.lon, 1.0);
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.012, 0.35, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xf3dca0, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    beam.position.copy(home.clone().multiplyScalar(1.17));
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), home.clone().normalize());
    this.world.add(beam);

    const ringGeo = new THREE.RingGeometry(0.02, 0.028, 40);
    const addMarker = (place: GlobePlace, color: number, scale: number) => {
      const pos = toVec(place.lat, place.lon, 1.006);
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      m.position.copy(pos);
      m.lookAt(pos.clone().multiplyScalar(2));
      m.scale.setScalar(scale);
      m.userData.base = scale;
      this.world.add(m);
      this.markers.push(m);
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.012 * scale, 16), new THREE.MeshBasicMaterial({ color, depthWrite: false }));
      dot.position.copy(pos);
      dot.lookAt(pos.clone().multiplyScalar(2));
      this.world.add(dot);
      if (place.label && this.opts.labels?.has(place.label)) {
        this.labelPoints.push({ el: this.opts.labels.get(place.label)!, pos: toVec(place.lat, place.lon, 1.02) });
      }
    };
    addMarker(origin, 0xf3dca0, 1.8);

    const palette = [0xf3dca0, 0x8fb8ff, 0xff8a9a, 0xf3dca0, 0x8fb8ff, 0xffd08a, 0xb9a2ff];
    this.opts.destinations.forEach((d, i) => {
      const curve = arcCurve(origin, d);
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uOffset: { value: i * 0.17 }, uColor: { value: new THREE.Color(palette[i % palette.length]) } },
        vertexShader: arcVertex,
        fragmentShader: arcFragment,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      this.arcMaterials.push(mat);
      this.world.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.0045, 8, false), mat));
      addMarker(d, palette[i % palette.length], 1);
    });
  }

  private onDown = (e: PointerEvent) => {
    this.drag.active = true;
    this.drag.lastX = e.clientX;
    this.drag.lastY = e.clientY;
    this.renderer.domElement.style.cursor = "grabbing";
  };

  private onMove = (e: PointerEvent) => {
    if (!this.drag.active) return;
    const dx = e.clientX - this.drag.lastX;
    const dy = e.clientY - this.drag.lastY;
    this.drag.lastX = e.clientX;
    this.drag.lastY = e.clientY;
    this.drag.vx = dx * 0.005;
    this.drag.vy = e.pointerType === "mouse" ? dy * 0.004 : 0;
    this.drag.x += this.drag.vx;
    this.drag.y = THREE.MathUtils.clamp(this.drag.y + this.drag.vy, -0.8, 0.8);
  };

  private onUp = () => {
    this.drag.active = false;
    this.renderer.domElement.style.cursor = "grab";
  };

  private render = (time: number) => {
    this.timer.update(time);
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const t = this.timer.getElapsed();

    if (!this.drag.active) {
      // Inertia, then drift back so Sri Lanka returns to centre stage
      this.drag.x += this.drag.vx;
      this.drag.vx *= 0.94;
      this.drag.x += (0 - this.drag.x) * dt * 0.35;
      this.drag.y += (0 - this.drag.y) * dt * 0.8;
    }
    const sway = Math.sin(t * 0.25) * 0.22;
    this.world.rotation.y = this.base.y + this.drag.x + sway;
    this.world.rotation.x = this.base.x + this.drag.y;

    this.arcMaterials.forEach((m) => (m.uniforms.uTime.value = t));
    this.markers.forEach((m, i) => {
      const s = m.userData.base * (1 + ((t * 0.8 + i * 0.3) % 1) * 1.6);
      m.scale.setScalar(s);
      (m.material as THREE.MeshBasicMaterial).opacity = 1 - ((t * 0.8 + i * 0.3) % 1);
    });

    this.renderer.render(this.scene, this.camera);

    // Keep HTML labels pinned over their places, hiding them on the far side
    if (this.labelPoints.length) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const camDir = this.camera.position.clone().normalize();
      this.world.updateMatrixWorld();
      for (const lp of this.labelPoints) {
        const world = lp.pos.clone().applyMatrix4(this.world.matrixWorld);
        const facing = world.clone().normalize().dot(camDir) > 0.15;
        const ndc = world.project(this.camera);
        lp.el.style.transform = `translate(${((ndc.x + 1) / 2) * rect.width}px, ${((1 - ndc.y) / 2) * rect.height}px)`;
        lp.el.style.opacity = facing ? "1" : "0";
      }
    }
  };

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.io.disconnect();
    this.ro.disconnect();
    this.renderer.domElement.removeEventListener("pointerdown", this.onDown);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
    window.removeEventListener("pointercancel", this.onUp);
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      mats.forEach((m) => {
        Object.values(m).forEach((v) => (v instanceof THREE.Texture ? v.dispose() : undefined));
        m.dispose();
      });
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
