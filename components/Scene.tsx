
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, ScrollControls, useScroll, Scroll, Cloud, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Lights } from './Lights';
import { MayaSculpture } from './MayaSculpture';
import { StoreInterface } from './StoreInterface';

// CONSTANT: Morning Mist (Premium Off-White)
const BG_COLOR = '#f4f6f8';

const CameraRig: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    const offset = scroll.offset; // 0 to 1

    // 1. CAMERA MOVEMENT ONLY
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
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0
      }}
    >
      {/* 1. PALETTE: Morning Mist */}
      <color attach="background" args={[BG_COLOR]} />
      
      {/* 2. FOG: Seamless blend */}
      <fog attach="fog" args={[BG_COLOR, 5, 25]} />

      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 6]} 
        fov={40} 
        near={0.1} 
        far={100} 
      />

      <Lights />
      
      {/* Removed Environment preset to avoid Fetch Errors for HDR files */}

      <ScrollControls pages={3} damping={0.2}>
        <CameraRig />
        
        {/* 3D Content */}
        <group position={[0, -2.0, 0]}>
          <MayaSculpture />
        </group>
          
        {/* 3. VOLUMETRIC CLOUDS & STARS */}
        <group position={[0, -4, 0]}>
          {/* Main Cloud Bed */}
          <Cloud 
            opacity={0.5} 
            speed={0.4} 
            bounds={[10, 2, 1.5]}
            segments={20} 
            color="#ffffff" 
          />
          {/* Distant Cloud Layer */}
          <Cloud 
            opacity={0.3} 
            speed={0.2} 
            bounds={[20, 2, 2]}
            segments={10} 
            position={[0, -2, -10]} 
            color="#d0e0f0" 
          />
        </group>

        {/* Subtle sparkle in the background */}
        <Stars 
          radius={100} 
          depth={50} 
          count={1000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />

        {/* UI Layer */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          <HeroContent />
          <StoreInterface />
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
};
