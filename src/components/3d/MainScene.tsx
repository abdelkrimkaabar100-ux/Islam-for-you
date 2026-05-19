import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sparkles,
  Stars,
  Text,
  Float as DreiFloat
} from '@react-three/drei';
import * as THREE from 'three';

export function Scene({ activeStep }: { activeStep: number }) {
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  // Dynamic color based on step
  const colors = [
    '#0f172a', // Chaos (Dark Blue/Slate)
    '#065f46', // Mercy (Emerald)
    '#312e81', // Revelation (Indigo)
    '#0c4a6e', // Liberation (Sky)
    '#451a03'  // Destiny (Amber)
  ];

  const activeColor = useMemo(() => new THREE.Color(colors[activeStep]), [activeStep]);

  useFrame((state) => {
    if (!group.current || !coreRef.current) return;
    
    // Smooth transition for rotation and scale
    const time = state.clock.getElapsedTime();
    
    // Complex rotation
    group.current.rotation.y += 0.002;
    group.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    group.current.position.y = Math.sin(time * 0.5) * 0.3;
    
    // Core interaction
    coreRef.current.rotation.x = time * 0.4;
    coreRef.current.rotation.z = time * 0.3;
    
    // Pulsing core with larger variance
    const scale = 1.2 + Math.sin(time * 1.5) * 0.15;
    coreRef.current.scale.set(scale, scale, scale);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={3} color={activeColor} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
      
      <group ref={group}>
        {/* Deep Space Particles */}
        <Stars radius={100} depth={50} count={7000} factor={6} saturation={0} fade speed={1.5} />
        
        {/* Active Step "Nur" Particles - Higher Density */}
        <Sparkles 
          count={400} 
          scale={30} 
          size={2} 
          speed={0.5} 
          opacity={0.6} 
          color={activeColor} 
        />

        {/* The Central Geometry "The Anchor" */}
        <DreiFloat speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
          <mesh ref={coreRef}>
            <octahedronGeometry args={[2.5, 0]} />
            <meshStandardMaterial 
              color={activeColor} 
              wireframe 
              transparent 
              opacity={0.3} 
              emissive={activeColor}
              emissiveIntensity={2}
            />
          </mesh>
          
          <mesh scale={[1.2, 1.2, 1.2]}>
             <octahedronGeometry args={[2.6, 0]} />
             <meshBasicMaterial 
                color={activeColor} 
                wireframe 
                transparent 
                opacity={0.1} 
             />
          </mesh>
        </DreiFloat>

        {/* Ambient Floating Text for Perspective */}
        <Text
          position={[0, -4, -5]}
          fontSize={0.2}
          color="white"
          opacity={0.1}
          transparent
          textAlign="center"
          font="serif"
        >
          {activeStep === 0 && "LAILATUL QADR • THE NIGHT OF POWER"}
          {activeStep === 1 && "AL-AMIN • THE TRUSTWORTHY"}
          {activeStep === 2 && "WAHI • THE DIVINE BREATH"}
          {activeStep === 3 && "HURRIYAH • THE SOUL'S FREEDOM"}
          {activeStep === 4 && "AL-AKHIRAH • THE ULTIMATE RETURN"}
        </Text>
      </group>

      {/* Ground Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={activeColor} 
          transparent 
          opacity={0.05} 
          roughness={1} 
        />
      </mesh>
    </>
  );
}

