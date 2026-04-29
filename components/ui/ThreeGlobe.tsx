// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ARC_PAIRS: [[number, number], [number, number]][] = [
  [[-0.05,  0.38], [-0.40,  0.28]],
  [[ 0.08,  0.32], [-0.55,  0.15]],
  [[ 0.12,  0.35], [ 0.68,  0.20]],
  [[-0.02,  0.28], [ 0.75,  0.05]],
  [[ 0.78,  0.18], [ 0.88, -0.22]],
  [[ 0.65,  0.08], [ 0.92, -0.10]],
  [[ 0.88, -0.20], [-0.65,  0.18]],
  [[-0.42,  0.25], [-0.50, -0.18]],
  [[-0.62,  0.12], [-0.38, -0.30]],
  [[ 0.18,  0.10], [ 0.05,  0.35]],
  [[ 0.22, -0.05], [-0.42, -0.12]],
  [[ 0.38,  0.22], [ 0.25, -0.05]],
  [[ 0.55,  0.15], [ 0.38,  0.22]],
  [[ 0.72, -0.05], [ 0.55,  0.15]],
  [[ 0.82,  0.22], [ 0.72, -0.05]],
  [[ 0.85,  0.22], [-0.68,  0.22]],
  [[ 0.45,  0.32], [ 0.08,  0.38]],
  [[-0.52, -0.18], [-0.38, -0.38]],
  [[-0.15,  0.42], [ 0.50, -0.38]],
  [[ 0.60,  0.40], [-0.35, -0.32]],
  [[ 0.10,  0.30], [ 0.60,  0.12]],
  [[-0.45,  0.20], [ 0.20,  0.08]],
  [[ 0.80,  0.10], [-0.50,  0.10]],
  [[ 0.30,  0.15], [-0.30,  0.40]],
];

/* ── timing ──────────────────────────────────────────────────────
   K=3 pulses active at once.
   Each arc is active for PULSE_SEC seconds, then waits.
   CYCLE_PER_ARC = PULSE_SEC * (N / K) so exactly K arcs overlap.
   Arc i starts at phaseShift = i * (PULSE_SEC / K).
──────────────────────────────────────────────────────────────────*/
const K          = 3;
const PULSE_SEC  = 5.0;
const N          = ARC_PAIRS.length;
const CYCLE      = PULSE_SEC * (N / K);   // full rotation period per arc

const ARC_POINTS = 80;

function spherePoint(lng: number, lat: number, r: number) {
  const p = lat * Math.PI, t = lng * 2 * Math.PI;
  return new THREE.Vector3(
    r * Math.cos(p) * Math.cos(t),
    r * Math.sin(p),
    r * Math.cos(p) * Math.sin(t),
  );
}

export default function ThreeGlobe({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    /* ── dark sphere ────────────────────────────────────────── */
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(100, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x060d1f, transparent: true, opacity: 0.95 }),
    ));

    /* ── wireframe ──────────────────────────────────────────── */
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(100.5, 28, 28),
      new THREE.MeshBasicMaterial({ color: 0x1a3a8a, wireframe: true, transparent: true, opacity: 0.25 }),
    ));

    /* ── surface dots ───────────────────────────────────────── */
    const dotPositions: number[] = [];
    const DOT_N = 2200;
    for (let i = 0; i < DOT_N; i++) {
      const phi   = Math.acos(-1 + (2 * i) / DOT_N);
      const theta = Math.sqrt(DOT_N * Math.PI) * phi;
      const noise = Math.sin(theta * 3) * Math.cos(phi * 5);
      if (noise > -0.20) {
        const r = 101.5;
        dotPositions.push(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        );
      }
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
    globeGroup.add(new THREE.Points(
      dotsGeo,
      new THREE.PointsMaterial({ color: 0x4d8fcc, size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.75 }),
    ));

    /* ── atmosphere ─────────────────────────────────────────── */
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(111, 64, 64),
      new THREE.ShaderMaterial({
        vertexShader:   "varying vec3 vNormal; void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "varying vec3 vNormal; void main(){ float i = pow(0.65 - dot(vNormal, vec3(0,0,1.0)), 2.0); gl_FragColor = vec4(0.3, 0.55, 1.0, 1.0) * i; }",
        blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true,
      }),
    ));

    /* ── arcs ───────────────────────────────────────────────── */
    const arcsGroup = new THREE.Group();

    type ArcObj = {
      curve:    THREE.QuadraticBezierCurve3;
      trailMat: THREE.LineBasicMaterial;
      pulseMesh:THREE.Mesh;
      pulseMat: THREE.MeshBasicMaterial;
      startMat: THREE.MeshBasicMaterial;
      endMat:   THREE.MeshBasicMaterial;
      shift:    number;   // phaseShift = i * (PULSE_SEC / K)
    };

    const arcObjs: ArcObj[] = ARC_PAIRS.map(([a, b], idx) => {
      const start = spherePoint(a[0], a[1], 101.5);
      const end   = spherePoint(b[0], b[1], 101.5);
      const dist  = start.distanceTo(end);
      const lift  = 130 + dist * 0.25;
      const mid   = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(lift);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      /* faint permanent trail */
      const trailGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(ARC_POINTS));
      const trailMat = new THREE.LineBasicMaterial({ color: 0x2a5faa, transparent: true, opacity: 0.15 });
      arcsGroup.add(new THREE.Line(trailGeo, trailMat));

      /* single pulse dot */
      const pulseMat  = new THREE.MeshBasicMaterial({ color: 0xb8d8ff, transparent: true, opacity: 0 });
      const pulseMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 10, 10), pulseMat);
      arcsGroup.add(pulseMesh);

      /* endpoint dots */
      const startMat = new THREE.MeshBasicMaterial({ color: 0x6aa8e8, transparent: true, opacity: 0.4 });
      const endMat   = new THREE.MeshBasicMaterial({ color: 0x6aa8e8, transparent: true, opacity: 0.4 });
      const s = new THREE.Mesh(new THREE.SphereGeometry(1.8, 10, 10), startMat);
      const e = new THREE.Mesh(new THREE.SphereGeometry(1.8, 10, 10), endMat);
      s.position.copy(start);
      e.position.copy(end);
      arcsGroup.add(s);
      arcsGroup.add(e);

      return {
        curve, trailMat, pulseMesh, pulseMat, startMat, endMat,
        shift: idx * (PULSE_SEC / K),
      };
    });

    globeGroup.add(arcsGroup);
    globeGroup.rotation.x = -0.3;

    /* ── mouse parallax ─────────────────────────────────────── */
    let mouseX = 0;
    const onMouse = (e: MouseEvent) => { mouseX = (e.clientX / window.innerWidth - 0.5) * 0.35; };
    window.addEventListener("mousemove", onMouse);

    /* ── render loop ────────────────────────────────────────── */
    const t0 = performance.now();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;

      globeGroup.rotation.y = t * 0.055 + mouseX;
      arcsGroup.rotation.y  = -t * 0.018;

      arcObjs.forEach((arc) => {
        // phase within one full CYCLE for this arc
        const phase = (t + arc.shift) % CYCLE;

        if (phase < PULSE_SEC) {
          // this arc is one of the K=3 currently active
          const progress = phase / PULSE_SEC;                    // 0 → 1
          const ease     = Math.sin(progress * Math.PI);         // bell: 0→1→0

          arc.pulseMat.opacity = ease * 0.80;
          arc.pulseMesh.position.copy(arc.curve.getPoint(progress));

          // endpoint dots brighten as pulse departs / arrives
          arc.startMat.opacity = progress < 0.15
            ? 0.4 + (1 - progress / 0.15) * 0.5
            : 0.4;
          arc.endMat.opacity = progress > 0.85
            ? 0.4 + ((progress - 0.85) / 0.15) * 0.5
            : 0.4;
        } else {
          // inactive — hide pulse, endpoint dots idle-breathe slowly
          arc.pulseMat.opacity = 0;
          const breath = 0.28 + 0.12 * Math.sin(t * 0.4 + arc.shift);
          arc.startMat.opacity = breath;
          arc.endMat.opacity   = breath;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    /* ── resize ─────────────────────────────────────────────── */
    const onResize = () => {
      const cw = container.clientWidth, ch = container.clientHeight;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
