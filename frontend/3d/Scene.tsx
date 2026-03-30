import React, { useRef, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, ScrollControls, useScroll, Scroll, Cloud, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Lights } from './Lights';
import { MayaSculpture } from './MayaSculpture';
import { StoreInterface } from '../../components/StoreInterface';
import { useProducts } from '../../backend/presentation/ProductContext';

// CONSTANT: Morning Mist (Premium Off-White)
const BG_COLOR = '#f4f6f8';

const ResponsiveCamera: React.FC = () => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7; // ~768px

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0, 6]}
      fov={isMobile ? 50 : 40}
      near={0.1}
      far={100}
    />
  );
};

const CameraRig: React.FC = () => {
  const scroll = useScroll();
  const { camera, viewport } = useThree();

  // Detect mobile for responsive camera adjustments
  const isMobile = viewport.width < 7; // ~768px in Three.js units

  useFrame(() => {
    const offset = scroll.offset; // 0 to 1

    // 1. CAMERA MOVEMENT ONLY
    // Interpolate from Z=6 (Start) to Z=-4 (End/Through the portal)
    // Adjust starting position for mobile to see more
    const startZ = isMobile ? 7 : 6;
    const targetZ = THREE.MathUtils.lerp(startZ, -4, offset);

    // Set position and ensure constant focus on the object's center
    camera.position.set(0, 0, targetZ);
    camera.lookAt(0, -1, 0);
  });

  return null;
};

// Helper to read viewport width inside Canvas and pick the right page count
const ResponsiveScrollControls: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;
  // Mobile: products stack 1-col so we need more virtual scroll pages
  const pages = isMobile ? 7 : 3;

  return (
    <ScrollControls pages={pages} damping={0.05} maxSpeed={1.0}>
      {children}
    </ScrollControls>
  );
};

const HeroContent = memo(() => {
  return (
    <div
      className="absolute top-0 left-0 w-full pt-12 flex flex-col items-center z-10 pointer-events-none"
      style={{ transition: 'opacity 0.3s ease-out' }}
    >
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-stone-900 leading-none mb-4">
        VIVERO BALAM
      </h1>
      <h2 className="text-lg md:text-xl font-medium tracking-wide text-stone-800 max-w-md mx-auto text-center">
        Artesanías y novedades en el mejor lugar
      </h2>
    </div>
  );
});

export const Scene: React.FC = memo(() => {
  // Use hook here, outside of Canvas context (works because Scene is inside ProductProvider in App.tsx)
  const { products, loading } = useProducts();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
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

      <ResponsiveCamera />

      <Lights />

      {/* Removed Environment preset to avoid Fetch Errors for HDR files */}

      <ResponsiveScrollControls>
        <CameraRig />

        {/* 3D Content */}
        <group position={[0, -2.0, 0]}>
          <MayaSculpture />
        </group>

        {/* Nubes más visibles */}
        <group position={[0, -4, 0]}>
          {/* Capa principal de nubes - más visible */}
          <Cloud
            opacity={0.7}
            speed={0.2}
            bounds={[10, 2, 1.5]}
            segments={4}
            color="#ffffff"
          />
          {/* Segunda capa - fondo */}
          <Cloud
            opacity={0.4}
            speed={0.15}
            bounds={[15, 2, 2]}
            segments={3}
            position={[0, -1, -8]}
            color="#e8f0f8"
          />
        </group>

        <Stars
          radius={80}
          depth={40}
          count={100}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* UI Layer */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          <HeroContent />
          <StoreInterface products={products} loading={loading} />
        </Scroll>
      </ResponsiveScrollControls>
    </Canvas>
  );
});
