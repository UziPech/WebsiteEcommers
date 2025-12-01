
import React from 'react';

export const Lights: React.FC = () => {
  return (
    <>
      {/* Ethereal Lighting Setup */}
      
      {/* 1. Hemisphere Light: Replaces Environment map. Blue-ish ground for cloud reflection. */}
      <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#d0e0f0" />

      {/* 2. High Key Ambient: Fills the scene with light (Morning look) */}
      <ambientLight intensity={0.6} />

      {/* 3. Warm Sun: Soft shadows, positioned high */}
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1.5} 
        castShadow 
        color="#fff0dd" 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </>
  );
};
