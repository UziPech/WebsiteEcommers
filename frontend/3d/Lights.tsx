import React from 'react';
import { useThree } from '@react-three/fiber';

export const Lights: React.FC = () => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7; // ~768px in Three.js units

  return (
    <>
      {/* Ethereal Lighting Setup for Bonsai */}
      
      {/* 1. Hemisphere Light: Sky/ground fill — warm top, soft cool bottom */}
      <hemisphereLight intensity={0.8} color="#ffffff" groundColor="#e8e0d8" />

      {/* 2. Ambient: Strong fill to lift all shadows (eliminates harsh dark areas) */}
      <ambientLight intensity={0.9} color="#faf8f5" />

      {/* 3. Main Sun: Warm key light from upper-right */}
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.2}
        color="#fff5e8"
      />

      {/* Only render fill lights on desktop to save GPU performance on mobile */}
      {!isMobile && (
        <>
          {/* 4. Fill Light: Opposite side to soften trunk shadows */}
          <directionalLight
            position={[-4, 3, 4]}
            intensity={0.6}
            color="#f0f0ff"
          />

          {/* 5. Rim/Back Light: Subtle separation from background */}
          <directionalLight
            position={[0, 2, -5]}
            intensity={0.3}
            color="#ffffff"
          />
        </>
      )}
    </>
  );
};
