import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/maya_sculpture.glb';

export const MayaSculpture: React.FC = () => {
  // ---------------------------------------------------------
  // MODO PLACEHOLDER: Visualizing the scene with procedural geometry
  // ---------------------------------------------------------
  
  // Updated Stone Material: Better light interaction
  // Lower roughness to catch more highlights from the rim light
  const stoneMaterial = (
    <meshStandardMaterial 
      color="#e8e8e8" 
      roughness={0.5} 
      metalness={0.1}
    />
  );

  return (
    <group dispose={null}>
      {/* Base block */}
      <mesh receiveShadow castShadow position={[0, -0.25, 0]}>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        {stoneMaterial}
      </mesh>

      {/* Main Sculpture Mass */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]} rotation={[0.5, 0.5, 0]}>
        <dodecahedronGeometry args={[0.8, 0]} />
        {stoneMaterial}
      </mesh>
    </group>
  );
};

// useGLTF.preload(MODEL_PATH);