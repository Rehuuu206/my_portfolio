import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function FloatingCreature({ position, scale, speed, distort }: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
      meshRef.current.rotation.y += speed * 0.002;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          distort={distort}
          speed={speed}
          roughness={0.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingOrb({ position, scale, speed }: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.05}
        wireframe
      />
    </mesh>
  );
}

function FloatingTorus({ position, scale, speed }: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.1;
    }
  });

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 8, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlesCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.3} />
      
      <Particles />
      
      {/* Floating creatures spread across the scene */}
      <FloatingCreature position={[-8, 3, -5]} scale={1.5} speed={1.2} distort={0.4} />
      <FloatingCreature position={[7, -2, -8]} scale={2} speed={0.8} distort={0.3} />
      <FloatingCreature position={[-5, -4, -6]} scale={1} speed={1.5} distort={0.5} />
      <FloatingCreature position={[10, 4, -10]} scale={2.5} speed={0.6} distort={0.2} />
      
      <FloatingOrb position={[5, 2, -4]} scale={0.8} speed={0.5} />
      <FloatingOrb position={[-10, -3, -7]} scale={1.2} speed={0.7} />
      <FloatingOrb position={[0, 5, -12]} scale={1.5} speed={0.4} />
      
      <FloatingTorus position={[-3, 0, -6]} scale={0.6} speed={1} />
      <FloatingTorus position={[8, -4, -9]} scale={0.8} speed={0.8} />
      <FloatingTorus position={[-7, 5, -11]} scale={1} speed={0.5} />
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
