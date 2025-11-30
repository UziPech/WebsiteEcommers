import React from 'react';

export const Lights: React.FC = () => {
  return (
    <>
      {/* 3-Point Studio Lighting Setup */}
      
      {/* 1. FILL Light: Softens shadows, ensures dark areas aren't pitch black */}
      <ambientLight intensity={0.5} />

      {/* 2. KEY Light: Main light source (Sun), creates form and casts shadows */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* 3. RIM Light: Highlights edges, separates object from the white background */}
      <spotLight 
        position={[-5, 5, -5]} 
        intensity={2} 
        color="white" 
        angle={0.5}
        penumbra={1}
      />
    </>
  );
};