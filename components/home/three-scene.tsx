// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { Points as ThreePoints } from 'three';

function Stars() {
  const ref = useRef<ThreePoints>(null);

  const sphere = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const radius = 1.5;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.pow(Math.random(), 1 / 3) * radius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = isFinite(x) ? x : (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = isFinite(y) ? y : (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = isFinite(z) ? z : (Math.random() - 0.5) * 2;
    }

    return positions;
  }, []);

  useFrame((_, delta) => {
    if (ref.current && isFinite(delta) && delta > 0) {
      const rotationDelta = Math.min(Math.abs(delta), 0.1);
      ref.current.rotation.x -= rotationDelta / 10;
      ref.current.rotation.y -= rotationDelta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
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
            console.warn('Three.js Canvas error:', error);
          }}
        >
          <Stars />
        </Canvas>
      </Suspense>
    </div>
  );
}