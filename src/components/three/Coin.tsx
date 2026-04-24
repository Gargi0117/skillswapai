import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function CoinMesh() {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 1.6;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0, 0]}>
      <cylinderGeometry args={[1, 1, 0.18, 48]} />
      <meshStandardMaterial color="#f4c244" metalness={0.9} roughness={0.25} emissive="#c2810a" emissiveIntensity={0.3} />
    </mesh>
  );
}

export default function Coin3D() {
  return (
    <div className="h-24 w-24">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 3]} intensity={1.4} color="#fff5cf" />
        <Suspense fallback={null}>
          <CoinMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
