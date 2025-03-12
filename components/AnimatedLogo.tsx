'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  MeshDistortMaterial
} from '@react-three/drei';
import { useScroll, useMotionValue } from 'framer-motion';
import * as THREE from 'three';

// The glowing prism component
const GlowingPrism = () => {
  const prismRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerPrismRef = useRef<THREE.Mesh>(null);
  
  // State for hover effect
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!prismRef.current || !glowRef.current || !innerPrismRef.current) return;
    
    // Rotate the prism
    prismRef.current.rotation.y += 0.005;
    prismRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    
    // Make the glow pulse
    const pulseScale = 1.05 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    glowRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    
    // Rotate inner prism in opposite direction
    innerPrismRef.current.rotation.y -= 0.01;
    innerPrismRef.current.rotation.z += 0.005;
    
    // Float up and down slightly
    prismRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });
  
  return (
    <group>
      {/* Main prism */}
      <mesh 
        ref={prismRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0, 1.5, 3, 6, 1]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          metalness={0.9}
          roughness={0.2}
          emissive="#6366f1"
          emissiveIntensity={hovered ? 0.8 : 0.4}
        />
        
        {/* Inner prism for extra visual interest */}
        <mesh ref={innerPrismRef} scale={0.8} position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0, 1.2, 2.4, 6, 1]} />
          <MeshDistortMaterial
            color="#4f46e5"
            metalness={0.8}
            roughness={0.1}
            emissive="#4338ca"
            emissiveIntensity={0.6}
            distort={0.3}
            speed={3}
          />
        </mesh>
        
        {/* Edge highlights */}
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[1.5, 0.05, 16, 6]} />
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1} />
        </mesh>
      </mesh>
      
      {/* Outer glow effect */}
      <mesh ref={glowRef} scale={1.2}>
        <cylinderGeometry args={[0, 1.8, 3.5, 6, 1]} />
        <meshBasicMaterial 
          color="#818cf8" 
          transparent={true} 
          opacity={0.2} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Light sources */}
      <pointLight position={[0, 2, 3]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[0, -2, -3]} intensity={1} color="#6366f1" />
    </group>
  );
};

// Main component
const AnimatedLogo: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-36 h-36 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-spin-slow flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">✦</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center cursor-pointer relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* 3D Canvas */}
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <GlowingPrism />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={true}
          autoRotate={!isMounted}
          autoRotateSpeed={0.5}
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default AnimatedLogo;