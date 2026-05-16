import React, { useRef, memo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, ScrollControls, useScroll, Scroll, Cloud, Stars, PerformanceMonitor } from '@react-three/drei';
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
      className="absolute top-0 left-0 w-full pt-32 md:pt-24 flex flex-col items-center z-10 pointer-events-none px-6"
      style={{ transition: 'opacity 0.3s ease-out' }}
    >
      <h1 className="flex flex-col items-center justify-center leading-none mb-6 w-full">
        <span className="text-5xl md:text-7xl font-vogue font-bold tracking-widest text-stone-900 mb-1 w-full text-center">
          VIVERO
        </span>
        <span className="text-6xl md:text-8xl font-cursive font-bold text-stone-800 -mt-4 md:-mt-6 w-full text-center pl-2">
          Balam
        </span>
      </h1>
      <h2 className="text-xs md:text-sm font-light tracking-[0.2em] text-stone-500 max-w-xs md:max-w-md mx-auto text-center uppercase">
        Artesanías y novedades
      </h2>
    </div>
  );
});

const OptimizedClouds = memo(() => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;

  if (isMobile) {
    return (
      <group position={[0, -4.2, 0]}>
        {/* En móvil: una sola nube pero con mayor opacidad y presencia para que se note */}
        <Cloud
          opacity={0.9}
          speed={0.1}
          bounds={[10, 1, 4]}
          segments={5}
          color="#c0c6cc"
        />
      </group>
    );
  }

  return (
    <group position={[0, -4.2, 0]}>
      {/* Capa principal: neblina densa gris-claro en la base */}
      <Cloud
        opacity={1}
        speed={0.15}
        bounds={[10, 2, 4]}
        segments={8}
        color="#d0d4d8"
      />
      {/* Capa media: gris más notorio, ancha */}
      <Cloud
        opacity={0.85}
        speed={0.1}
        bounds={[14, 1.5, 5]}
        segments={6}
        position={[0, -0.3, 0]}
        color="#c0c6cc"
      />
      {/* Capa baja: gris-azulado para profundidad */}
      <Cloud
        opacity={0.6}
        speed={0.08}
        bounds={[18, 2.5, 4]}
        segments={5}
        position={[0, -1.2, -4]}
        color="#b0b8c0"
      />
    </group>
  );
});

export const Scene: React.FC = memo(() => {
  // Use hook here, outside of Canvas context (works because Scene is inside ProductProvider in App.tsx)
  const { products, loading } = useProducts();
  const [dpr, setDpr] = useState<number>(1.5);

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4
      }}
    >
      <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)} />
      
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

        {/* Neblina envolvente optimizada */}
        <OptimizedClouds />

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
