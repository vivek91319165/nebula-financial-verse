
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

// Planet component representing a budget category
const Planet = ({ position, size, color, name, amount, orbitRadius, orbitSpeed }: { 
  position: [number, number, number], 
  size: number, 
  color: string,
  name: string,
  amount: string,
  orbitRadius: number,
  orbitSpeed: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      
      // Rotate the planet itself
      meshRef.current.rotation.y += 0.01;
      
      // Orbit around the center
      meshRef.current.position.x = Math.sin(t * orbitSpeed) * orbitRadius;
      meshRef.current.position.z = Math.cos(t * orbitSpeed) * orbitRadius;
    }
  });

  return (
    <>
      {/* Orbit path */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      
      {/* Planet */}
      <mesh 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.5} 
          roughness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
        
        {/* Label */}
        <Text
          position={[0, size + 0.3, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
        
        <Text
          position={[0, size + 0.6, 0]}
          fontSize={0.2}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          {amount}
        </Text>
      </mesh>
    </>
  );
};

// Main budget galaxy visualization
const BudgetGalaxy = () => {
  // Sample budget data
  const budgetCategories = [
    { name: "Housing", amount: "$1,200", color: "#1EAEDB", size: 0.8, orbitRadius: 4, orbitSpeed: 0.15 },
    { name: "Food", amount: "$400", color: "#F97316", size: 0.5, orbitRadius: 6, orbitSpeed: 0.2 },
    { name: "Transport", amount: "$350", color: "#6E59A5", size: 0.4, orbitRadius: 8, orbitSpeed: 0.25 },
    { name: "Entertainment", amount: "$200", color: "#F2FCE2", size: 0.3, orbitRadius: 10, orbitSpeed: 0.3 },
    { name: "Savings", amount: "$500", color: "#9b87f5", size: 0.6, orbitRadius: 12, orbitSpeed: 0.1 },
  ];

  return (
    <div className="w-full h-[500px] bg-nebula-space-dark rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 10, 20], fov: 40 }}>
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Sun - represents total budget */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial 
            color="#FEC6A1" 
            emissive="#F97316"
            emissiveIntensity={1} 
            toneMapped={false}
          />
        </mesh>
        
        {/* Planets - budget categories */}
        {budgetCategories.map((category, i) => (
          <Planet 
            key={i}
            position={[category.orbitRadius, 0, 0]} 
            size={category.size}
            color={category.color}
            name={category.name}
            amount={category.amount}
            orbitRadius={category.orbitRadius}
            orbitSpeed={category.orbitSpeed}
          />
        ))}
        
        {/* One-time expenses as asteroids */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh 
            key={`asteroid-${i}`} 
            position={[
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 30
            ]}
            scale={[0.1, 0.1, 0.2]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#888888" 
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        ))}
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
};

export default BudgetGalaxy;
