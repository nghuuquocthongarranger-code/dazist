import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, useCursor } from "@react-three/drei";
import * as THREE from "three";

const BALL_RADIUS = 0.95;

// Phát hiện iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

function CrystalBall({ onOpen }: { onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  useCursor(hovered);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      // Hiệu ứng glow nhẹ
      const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
      if (material) {
        material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <group
        onClick={() => onOpen()}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        {/* Quả cầu chính */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[BALL_RADIUS, 48, 48]} />
          <meshPhysicalMaterial
            color="#f2f3f8"
            metalness={0.1}
            roughness={0.15}
            emissive="#ffd700"
            emissiveIntensity={0.2}
            transparent={true}
            opacity={0.9}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
            envMapIntensity={0.5}
          />
        </mesh>

        {/* Đế gỗ đơn giản */}
        <group position={[0, -BALL_RADIUS - 0.3, 0]}>
          <mesh>
            <cylinderGeometry args={[BALL_RADIUS * 0.5, BALL_RADIUS * 0.3, 0.3, 16]} />
            <meshStandardMaterial color="#2b1a12" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[BALL_RADIUS * 0.5, 0.04, 8, 24]} />
            <meshStandardMaterial color="#d4af37" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Vòng sáng bao quanh */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[BALL_RADIUS * 1.4, BALL_RADIUS * 1.5, 32]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

export function TarotHero3D({ onOpen }: { onOpen: () => void }) {
  // Force re-render khi resize
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleResize = () => setKey(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-gold-500 text-xl">🔮 Đang tải...</div>
        </div>
      }>
        <Canvas
          key={key}
          camera={{ position: [0, 0.5, 7], fov: 45 }}
          dpr={isIOS ? [0.5, 1] : [1, 1.5]} // iOS dùng DPR thấp
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "default"
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 4, 5]} intensity={0.8} />
          <pointLight position={[-3, -2, 4]} intensity={0.4} color="#ffd700" />
          <Stars radius={50} depth={30} count={1500} factor={2} saturation={0} fade speed={0.3} />
          <CrystalBall onOpen={onOpen} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}