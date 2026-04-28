// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 5000;

function galaxyStarColor(): [number, number, number] {
  const t = Math.random();
  let r = 1;
  let g = 1;
  let b = 1;
  if (t < 0.26) {
    // Blue-white
    r = 0.72 + Math.random() * 0.22;
    g = 0.86 + Math.random() * 0.14;
    b = 1;
  } else if (t < 0.44) {
    // Cyan / young stars
    r = 0.32 + Math.random() * 0.18;
    g = 0.78 + Math.random() * 0.2;
    b = 1;
  } else if (t < 0.58) {
    // Gold / sun-like
    r = 1;
    g = 0.82 + Math.random() * 0.16;
    b = 0.48 + Math.random() * 0.28;
  } else if (t < 0.72) {
    // Violet / magenta giants
    r = 0.82 + Math.random() * 0.16;
    g = 0.38 + Math.random() * 0.22;
    b = 0.95 + Math.random() * 0.05;
  } else if (t < 0.86) {
    // Cool white
    r = 0.92 + Math.random() * 0.08;
    g = 0.94 + Math.random() * 0.06;
    b = 1;
  } else {
    // Amber / orange
    r = 1;
    g = 0.52 + Math.random() * 0.28;
    b = 0.22 + Math.random() * 0.28;
  }
  const intensity = 0.55 + Math.random() * 0.45;
  return [r * intensity, g * intensity, b * intensity];
}

function Stars() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const radius = 1.5;

    for (let i = 0; i < STAR_COUNT; i++) {
      const idx = i * 3;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.pow(Math.random(), 1 / 3) * radius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[idx] = isFinite(x) ? x : (Math.random() - 0.5) * 2;
      positions[idx + 1] = isFinite(y) ? y : (Math.random() - 0.5) * 2;
      positions[idx + 2] = isFinite(z) ? z : (Math.random() - 0.5) * 2;

      const [cr, cg, cb] = galaxyStarColor();
      colors[idx] = cr;
      colors[idx + 1] = cg;
      colors[idx + 2] = cb;
    }

    return { positions, colors };
  }, []);

  const isValid =
    positions.length > 0 &&
    colors.length > 0 &&
    positions.every((val) => isFinite(val)) &&
    colors.every((val) => isFinite(val));

  if (!isValid) {
    console.warn("Invalid star buffer in Stars component");
    return null;
  }

  useFrame((_, delta) => {
    if (ref.current && isFinite(delta) && delta > 0) {
      const rotationDelta = Math.min(Math.abs(delta), 0.1);
      ref.current.rotation.x -= rotationDelta / 10;
      ref.current.rotation.y -= rotationDelta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={ref} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          transparent
          vertexColors
          depthWrite={false}
          size={0.0026}
          sizeAttenuation
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 bg-background">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Canvas
          camera={{ position: [0, 0, 1] }}
          onError={(error) => {
            console.warn("Three.js Canvas error:", error);
          }}
          gl={{ antialias: true, alpha: false }}
        >
          <Stars />
        </Canvas>
      </Suspense>
    </div>
  );
}
