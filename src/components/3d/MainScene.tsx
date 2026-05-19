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
    
    group.current.rotation.y += 0.001;
    group.current.position.y = Math.sin(time * 0.5) * 0.2;
    
    coreRef.current.rotation.x = time * 0.2;
    coreRef.current.rotation.z = time * 0.1;
    
    // Pulsing core
    const scale = 1 + Math.sin(time * 2) * 0.05;
    coreRef.current.scale.set(scale, scale, scale);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color={activeColor} />
      
      <group ref={group}>
        {/* Deep Space Particles */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        {/* Active Step "Nur" Particles */}
        <Sparkles 
          count={200} 
          scale={20} 
          size={1.5} 
          speed={0.3} 
          opacity={0.5} 
          color={activeColor} 
        />

        {/* The Central Geometry "The Anchor" */}
        <DreiFloat speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh ref={coreRef}>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial 
              color={activeColor} 
              wireframe 
              transparent 
              opacity={0.2} 
              emissive={activeColor}
              emissiveIntensity={1}
            />
          </mesh>
          
          <mesh scale={[1.1, 1.1, 1.1]}>
             <octahedronGeometry args={[2.1, 0]} />
             <meshBasicMaterial 
                color={activeColor} 
                wireframe 
                transparent 
                opacity={0.05} 
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

