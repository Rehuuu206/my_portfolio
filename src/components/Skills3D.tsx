import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface SkillNodeProps {
  position: [number, number, number];
  skill: string;
  color: string;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

function SkillNode({ position, skill, color, index, isHovered, onHover }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        <mesh 
          ref={meshRef}
          onPointerEnter={() => onHover(index)}
          onPointerLeave={() => onHover(null)}
          scale={isHovered ? 1.3 : 1}
        >
          <icosahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/SpaceGrotesk-Bold.woff"
        >
          {skill}
        </Text>
      </group>
    </Float>
  );
}

function SkillsOrbit({ skills, hoveredIndex, onHover }: { 
  skills: { name: string; color: string }[];
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const radius = 2.5;

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.5;
        
        return (
          <SkillNode
            key={skill.name}
            position={[x, y, z]}
            skill={skill.name}
            color={skill.color}
            index={index}
            isHovered={hoveredIndex === index}
            onHover={onHover}
          />
        );
      })}
      
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export default function Skills3D() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const skills = [
    { name: "HTML", color: "#e34f26", description: "Semantic markup & accessibility" },
    { name: "CSS", color: "#1572b6", description: "Modern layouts & animations" },
    { name: "Python", color: "#3776ab", description: "DSA & problem solving" },
    { name: "UI/UX", color: "#ff61f6", description: "User-centered design" },
    { name: "Editing", color: "#00e676", description: "Video & graphic creation" },
  ];

  return (
    <section id="skills" className="relative section-padding overflow-hidden snap-section">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-display tracking-widest uppercase text-sm">
            Expertise
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px] relative"
          >
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00e676" />
              <SkillsOrbit 
                skills={skills} 
                hoveredIndex={hoveredIndex}
                onHover={setHoveredIndex}
              />
            </Canvas>

            {/* Interaction hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
              <span className="glass px-4 py-2 rounded-full">Hover over nodes to explore</span>
            </div>
          </motion.div>

          {/* Skills List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`glass p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  hoveredIndex === index ? 'glow-border scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${skill.color}20`, boxShadow: `0 0 20px ${skill.color}30` }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
