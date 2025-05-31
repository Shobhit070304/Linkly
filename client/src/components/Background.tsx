// import React, { useRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// const FuturisticBuilding = ({
//   position,
//   size,
//   color,
//   speed
// }: {
//   position: [number, number, number];
//   size: [number, number, number];
//   color: string;
//   speed: number;
// }) => {
//   const mesh = useRef<THREE.Mesh>(null!);
//   const wireframe = useRef<THREE.LineSegments>(null!);

//   useFrame(() => {
//     if (mesh.current) {
//       mesh.current.rotation.y += speed * 0.2;
//       mesh.current.position.y =
//         position[1] + Math.sin(Date.now() * 0.001 * speed + position[0]) * 0.5;
//     }
//     if (wireframe.current) {
//       wireframe.current.rotation.y += speed * 0.2;
//       wireframe.current.position.y =
//         position[1] + Math.sin(Date.now() * 0.001 * speed + position[0]) * 0.5;
//     }
//   });

//   return (
//     <group position={position}>
//       <mesh ref={mesh} castShadow>
//         <boxGeometry args={size} />
//         <meshStandardMaterial
//           color={color}
//           metalness={0.9}
//           roughness={0.1}
//           transparent
//           opacity={0.05}
//           emissive={color}
//           emissiveIntensity={0.3}
//         />
//       </mesh>
//       <lineSegments ref={wireframe}>
//         <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
//         <lineBasicMaterial color={color} emissive={color} emissiveIntensity={0.5} />
//       </lineSegments>
//     </group>
//   );
// };

// const FloatingPlatform = ({
//   position,
//   size,
//   rotationSpeed
// }: {
//   position: [number, number, number];
//   size: [number, number, number];
//   rotationSpeed: number;
// }) => {
//   const mesh = useRef<THREE.Mesh>(null!);

//   useFrame(() => {
//     if (mesh.current) {
//       mesh.current.rotation.y += rotationSpeed;
//     }
//   });

//   return (
//     <mesh position={position} ref={mesh}>
//       <boxGeometry args={size} />
//       <meshStandardMaterial
//         color="#ffffff"
//         metalness={0.95}
//         roughness={0.05}
//         transparent
//         opacity={0.03}
//         wireframe
//       />
//     </mesh>
//   );
// };

// const FuturisticCity = () => {
//   const group = useRef<THREE.Group>(null!);

//   useFrame(() => {
//     if (group.current) {
//       group.current.rotation.y += 0.001;
//     }
//   });

//   const buildings = [];
//   const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6'];
//   const gridSize = 6;
//   const spacing = 8;

//   // Central megastructure
//   buildings.push(
//     <FuturisticBuilding
//       key="central-tower"
//       position={[0, 12, 0]}
//       size={[6, 24, 6]}
//       color="#6366f1"
//       speed={0.3}
//     />
//   );

//   // Surrounding buildings
//   for (let x = -gridSize; x <= gridSize; x++) {
//     for (let z = -gridSize; z <= gridSize; z++) {
//       if (x === 0 && z === 0) continue;
//       if (Math.random() > 0.7) continue;

//       const height = 4 + Math.random() * 12;
//       const width = 1 + Math.random() * 3;
//       const depth = 1 + Math.random() * 3;
//       const color = colors[Math.floor(Math.random() * colors.length)];

//       buildings.push(
//         <FuturisticBuilding
//           key={`building-${x}-${z}`}
//           position={[x * spacing, height / 2, z * spacing]}
//           size={[width, height, depth]}
//           color={color}
//           speed={0.1 + Math.random() * 0.3}
//         />
//       );
//     }
//   }

//   // Floating platforms
//   for (let i = 0; i < 8; i++) {
//     const size = 10 + Math.random() * 15;
//     buildings.push(
//       <FloatingPlatform
//         key={`platform-${i}`}
//         position={[
//           (Math.random() - 0.5) * 60,
//           -8 + Math.random() * 16,
//           (Math.random() - 0.5) * 60
//         ]}
//         size={[size, 0.3, size]}
//         rotationSpeed={0.01 + Math.random() * 0.02}
//       />
//     );
//   }

//   return <group ref={group}>{buildings}</group>;
// };

// const FuturisticBackground = () => {
//   return (
//     <div className="fixed inset-0 -z-10">
//       <Canvas
//         camera={{ position: [30, 15, 30], fov: 45 }}
//         gl={{ antialias: true, powerPreference: "high-performance" }}
//       >
//         <color attach="background" args={['#000000']} />
//         <ambientLight intensity={0.2} />
//         <pointLight position={[10, 20, 10]} intensity={0.8} color="#6366f1" />
//         <pointLight position={[-10, 20, -10]} intensity={0.8} color="#8b5cf6" />
//         <fog attach="fog" args={['#000000', 20, 80]} />
//         <FuturisticCity />
//       </Canvas>
//     </div>
//   );
// };

// export default FuturisticBackground;






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
