import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useCursor } from "@react-three/drei";
import * as THREE from "three";

const BALL_RADIUS = 0.95;

// Phát hiện iOS và trình duyệt
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function CrystalBall({ onOpen }: { onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  useCursor(hovered);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group
      onClick={() => onOpen()}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.03 : 1}
    >
      {/* Quả cầu chính - dùng material đơn giản nhất */}
      <mesh ref={meshRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
        <meshStandardMaterial
          color="#e8d5b5"
          emissive="#d4af37"
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Lớp phủ sáng bên ngoài */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[BALL_RADIUS * 1.01, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          wireframe={false}
        />
      </mesh>

      {/* Đế gỗ đơn giản */}
      <group position={[0, -BALL_RADIUS - 0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[BALL_RADIUS * 0.6, BALL_RADIUS * 0.4, 0.25, 12]} />
          <meshStandardMaterial color="#3d2314" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[BALL_RADIUS * 0.55, 0.03, 6, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Vòng hào quang đơn giản */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <ringGeometry args={[BALL_RADIUS * 1.3, BALL_RADIUS * 1.4, 24]} />
        <meshBasicMaterial 
          color="#ffd700" 
          transparent 
          opacity={0.12} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function TarotHero3D({ onOpen }: { onOpen: () => void }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleResize = () => setKey(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0" style={{ background: 'transparent' }}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-amber-400 text-xl font-light tracking-wider">
            🔮 Đang tải...
          </div>
        </div>
      }>
        <Canvas
          key={key}
          camera={{ 
            position: isIOS ? [0, 0.5, 8] : [0, 0.8, 7], 
            fov: isIOS ? 50 : 45 
          }}
          dpr={isIOS ? [0.5, 1] : [1, 1.5]}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            failIfMajorPerformanceCaveat: false
          }}
          style={{ 
            width: '100%', 
            height: '100%',
            display: 'block'
          }}
        >
          {/* Ánh sáng tối thiểu */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 3, 4]} intensity={0.8} />
          <directionalLight position={[-2, -1, 3]} intensity={0.3} color="#ffd700" />
          
          {/* Nội dung chính */}
          <CrystalBall onOpen={onOpen} />
          
          {/* Controls */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.4}
            minPolarAngle={Math.PI / 2.8}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}