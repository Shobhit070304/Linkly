import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingBoxes = ({ count = 40 }) => {
  const boxes = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    boxes.current.forEach((box) => {
      if (!box) return;
      box.position.y += 0.01;
      if (box.position.y > 20) {
        box.position.y = -10;
      }
      box.rotation.x += 0.005;
      box.rotation.y += 0.005;
    });
  });

  const elements = Array.from({ length: count }, (_, i) => {
    const size = 0.5 + Math.random() * 4; // Random sizes from 0.5 to 4
    const position: [number, number, number] = [
      (Math.random() - 0.5) * 100,
      Math.random() * 20 - 10,
      (Math.random() - 0.5) * 100
    ];

    return (
      <mesh
        key={i}
        ref={(el) => (boxes.current[i] = el!)}
        position={position}
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.1 + Math.random() * 0.3}
          metalness={1}
          roughness={0}
          emissive="#6366f1"
          emissiveIntensity={0.6}
        />
      </mesh>
    );
  });

  return <>{elements}</>;
};

const FuturisticBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 10, 30], fov: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 20, 10]} intensity={0.8} color="#6366f1" />
        <pointLight position={[-10, 20, -10]} intensity={0.8} color="#8b5cf6" />
        <fog attach="fog" args={['#000000', 30, 100]} />
        <FloatingBoxes count={50} />
      </Canvas>
    </div>
  );
};

export default FuturisticBackground;
