"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Float, Billboard, Text } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

/**
 * The signature hero visual: an abstract AI signal pipeline.
 *
 * Nodes (Inbox → Header → Scan → PII-Mask → Fetch → Claude → Churn-tier) are glowing
 * ember points joined by thin lines, wrapped in a slow auto-rotation, set against a
 * drifting particle field. Mouse-reactive parallax + drag-to-orbit.
 *
 * Adaptive: postprocessing auto-disables on small screens / low core counts.
 */

const NODE_LABELS = [
  "Inbox",
  "Header",
  "Scan",
  "PII-Mask",
  "Fetch",
  "Claude",
  "Churn-tier",
];

const EMBER = new THREE.Color("#F37512");
const EMBER_HI = new THREE.Color("#FBD5A5");

// A gentle helical layout so the pipeline reads as a flowing signal path.
function nodePositions(): THREE.Vector3[] {
  const n = NODE_LABELS.length;
  return NODE_LABELS.map((_, i) => {
    const t = i / (n - 1);
    const angle = t * Math.PI * 1.6;
    const radius = 2.1;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      (t - 0.5) * 3.4,
      Math.sin(angle) * radius
    );
  });
}

function ParticleField({ count = 420 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={EMBER_HI}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function PipelineNode({
  position,
  label,
  index,
  total,
}: {
  position: THREE.Vector3;
  label: string;
  index: number;
  total: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    // Pulse each node in sequence, like a signal travelling the pipeline.
    const phase = state.clock.elapsedTime * 1.2 - index * 0.5;
    const pulse = 0.5 + 0.5 * Math.sin(phase);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.55 + pulse * 0.45;
    const s = 1 + pulse * 0.35;
    ref.current.scale.setScalar(s);
  });

  const isEndpoint = index === 0 || index === total - 1;

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[isEndpoint ? 0.16 : 0.11, 16, 16]} />
        <meshBasicMaterial color={isEndpoint ? EMBER_HI : EMBER} transparent toneMapped={false} />
      </mesh>
      <Billboard>
        <Text
          position={[0, 0.32, 0]}
          fontSize={0.16}
          color="#F2F2EC"
          anchorX="center"
          anchorY="bottom"
          fillOpacity={0.7}
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}

function Pipeline() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const nodes = useMemo(() => nodePositions(), []);
  const linePoints = useMemo(() => nodes.map((v) => v.toArray() as [number, number, number]), [nodes]);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Gentle auto-rotation.
    group.current.rotation.y += delta * 0.12;
    // Mouse-reactive parallax tilt (eased toward pointer).
    const targetX = pointer.y * 0.18;
    const targetZ = pointer.x * 0.08;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      <Line points={linePoints} color="#F37512" lineWidth={1.1} transparent opacity={0.45} />
      {nodes.map((pos, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={0.25}>
          <PipelineNode position={pos} label={NODE_LABELS[i]} index={i} total={nodes.length} />
        </Float>
      ))}
    </group>
  );
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.6} mipmapBlur />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0006, 0.0006)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
    </EffectComposer>
  );
}

export default function SignalPipeline() {
  // Adaptive quality: disable heavy postprocessing on small / low-power devices.
  const highPerf =
    typeof navigator !== "undefined" &&
    (navigator.hardwareConcurrency ?? 4) >= 4 &&
    typeof window !== "undefined" &&
    window.innerWidth >= 768;

  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      dpr={highPerf ? [1, 2] : [1, 1.3]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <Pipeline />
      <ParticleField count={highPerf ? 460 : 200} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.4}
        autoRotate={false}
      />
      {highPerf && <Effects />}
    </Canvas>
  );
}
