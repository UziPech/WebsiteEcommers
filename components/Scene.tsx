
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, ScrollControls, useScroll, Scroll, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Lights } from './Lights';
import { MayaSculpture } from './MayaSculpture';
import { StoreInterface } from './StoreInterface';

// CONSTANT: Pure White
const BG_COLOR = '#ffffff';

const CameraRig: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    const offset = scroll.offset; // 0 to 1

    // 1. CAMERA MOVEMENT ONLY
    // No color interpolation ensures stable white background.

    // Interpolate from Z=6 (Start) to Z=-4 (End/Through the portal)
    const targetZ = THREE.MathUtils.lerp(6, -4, offset);
    
    // Set position and ensure constant focus on the object's center
    camera.position.set(0, 0, targetZ);
    camera.lookAt(0, -1, 0);
  });

  return null;
};

const HeroContent = () => {
  const scroll = useScroll();
  const ref = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (ref.current) {
      // Text fades out quickly as we start moving (0 to 0.25 scroll)
      const opacity = 1 - scroll.range(0, 0.25);
      ref.current.style.opacity = Math.max(0, opacity).toString();
      ref.current.style.transform = `translateY(-${scroll.range(0, 0.3) * 50}px)`;
    }
  });

  return (
    <div 
      ref={ref} 
      className="absolute top-0 left-0 w-full pt-12 flex flex-col items-center z-10 pointer-events-none"
    >
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-stone-900 leading-none mb-4">
        VIVERO BALAM
      </h1>
      <h2 className="text-lg md:text-xl font-medium tracking-wide text-stone-800 max-w-md mx-auto text-center">
        Artesanías y novedades en el mejor lugar
      </h2>
    </div>
  );
};

export const Scene: React.FC = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ 
        antialias: true,
        alpha: false, // Opaque canvas is best for solid colors
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0
      }}
    >
      {/* 1. STATIC WHITE BACKGROUND */}
      <color attach="background" args={[BG_COLOR]} />
      
      {/* 2. STATIC WHITE FOG */}
      {/* near=10, far=50 ensures a deep, clean fade without a visible floor line */}
      <fog attach="fog" args={[BG_COLOR, 10, 50]} />

      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 6]} 
        fov={40} 
        near={0.1} 
        far={100} 
      />

      <Lights />
      
      {/* 
         Environment: preset="studio" provides neutral reflections.
         background={false} is CRITICAL: prevents HDRI from turning the white background gray.
      */}
      <Environment preset="studio" background={false} />

      <ScrollControls pages={3} damping={0.2}>
        <CameraRig />
        
        {/* 3D Content */}
        <group position={[0, -2.0, 0]}>
          <MayaSculpture />
        </group>
          
        {/* Shadows Only - Subtler opacity for elegance */}
        <ContactShadows 
          position={[0, -2.51, 0]} 
          opacity={0.25} 
          scale={20} 
          blur={2} 
          far={10} 
          resolution={1024} 
          color="#000000"
          frames={1} 
        />

        {/* UI Layer */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          <HeroContent />
          {/* Shop Interface appears on the second page (top: 100vh) */}
          <StoreInterface />
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
};
