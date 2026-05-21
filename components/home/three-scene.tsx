// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { useRef, Suspense, useMemo, useEffect, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { Points as ThreePoints, PerspectiveCamera } from 'three';

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

function CanvasSizeSync({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const { gl, camera } = useThree();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      gl.setSize(width, height, false);
      if (camera instanceof PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [camera, gl, containerRef]);

  return null;
}

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-background">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Canvas
          camera={{ position: [0, 0, 1] }}
          onError={(error) => {
            console.warn('Three.js Canvas error:', error);
          }}
          className="h-full w-full"
        >
          <CanvasSizeSync containerRef={containerRef} />
          <Stars />
        </Canvas>
      </Suspense>
    </div>
  );
}