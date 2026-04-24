import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import { Suspense } from "react";

function GlobeMesh() {
  return (
    <group>
      <Sphere args={[1.4, 64, 64]}>
        <meshStandardMaterial
          color="#7c5cff"
          emissive="#3a1f8a"
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.4}
          wireframe
        />
      </Sphere>
      <Sphere args={[1.38, 64, 64]}>
        <meshStandardMaterial color="#1a1240" transparent opacity={0.55} />
      </Sphere>
    </group>
  );
}

export default function Globe() {
  return (
    <div className="h-[420px] w-full md:h-[520px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} color="#a78bfa" />
        <directionalLight position={[-3, -2, -3]} intensity={0.6} color="#22d3ee" />
        <Suspense fallback={null}>
          <GlobeMesh />
          <Stars radius={50} depth={20} count={1500} factor={3} fade speed={1} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}
