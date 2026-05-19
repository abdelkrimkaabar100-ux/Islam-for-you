import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Text,
  Image,
  Sparkles,
  ContactShadows,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';

const GALLERIES = [
  { img: '/src/assets/images/jahiliyyah_chaos_1779201770991.png', pos: [0, 0, 0], rot: [0, 0.5, 0] },
  { img: '/src/assets/images/medina_masjid_serene_1779187648478.png', pos: [12, 2, -5], rot: [0, -0.8, 0] },
  { img: '/src/assets/images/hira_light_1779201787322.png', pos: [-12, -2, -10], rot: [0.2, 1.2, 0] },
  { img: '/src/assets/images/liberation_dawn_1779201804632.png', pos: [0, 8, -15], rot: [-0.4, 0, 0] },
  { img: '/src/assets/images/kaaba_holy_glow_1779187631912.png', pos: [8, -8, -20], rot: [0.4, -0.6, 0] },
];

export function Scene({ activeStep }: { activeStep: number }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    const targetX = -GALLERIES[activeStep].pos[0];
    const targetY = -GALLERIES[activeStep].pos[1];
    const targetZ = -GALLERIES[activeStep].pos[2] + 5;
    
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.05);
    
    // Smooth idle swaying
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.02;
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#34d399" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#fbbf24" />
      <spotLight position={[0, 20, 0]} intensity={1.5} angle={0.2} penumbra={1} castShadow />
      
      <group ref={group}>
        <Sparkles count={100} scale={30} size={1} speed={0.2} opacity={0.3} color="#34d399" />
        
        {GALLERIES.map((item, i) => (
          <group key={i} position={item.pos as any} rotation={item.rot as any}>
            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
               <mesh>
                 <planeGeometry args={[14, 9]} />
                 <meshStandardMaterial 
                    color={i === activeStep ? "#ffffff" : "#111827"}
                    transparent 
                    opacity={i === activeStep ? 0.3 : 0.01}
                    roughness={0.5}
                    metalness={0.5}
                 />
               </mesh>
               <Image 
                  url={item.img} 
                  transparent 
                  opacity={i === activeStep ? 1 : 0.1}
                  scale={[13.8, 8.8]}
               />
               
               {/* Reflection Halo */}
               {i === activeStep && (
                  <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[14.2, 9.2]} />
                    <meshBasicMaterial color="#34d399" transparent opacity={0.05} />
                  </mesh>
               )}
            </Float>
            
            {/* Context Label */}
            <Text
              position={[0, -5, 0]}
              fontSize={0.2}
              color="white"
              opacity={i === activeStep ? 0.3 : 0}
              transparent
              maxWidth={5}
              textAlign="center"
              font="serif"
            >
              MEMORIES OF THE SOUL
            </Text>
          </group>
        ))}

        {/* Abstract Cosmic Centerpiece */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
           <mesh position={[0, 0, -30]} scale={[1.5, 1.5, 1.5]}>
             <torusKnotGeometry args={[10, 3, 100, 16]} />
             <meshStandardMaterial 
                color="#34d399" 
                wireframe 
                transparent 
                opacity={0.03} 
                emissive="#10b981" 
                emissiveIntensity={0.2} 
             />
           </mesh>
        </Float>
      </group>

      <ContactShadows 
         position={[0, -12, 0]} 
         opacity={0.3} 
         scale={60} 
         blur={3} 
         far={20} 
         color="#000000" 
      />
    </>
  );
}
