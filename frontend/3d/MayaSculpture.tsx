import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Set Draco decoder path for compressed models
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const MODEL_PATH = '/models/scene-optimized.glb';

export const MayaSculpture: React.FC = () => {
  const { scene } = useGLTF(MODEL_PATH);
  const processedRef = useRef(false);
  const { viewport } = useThree();

  // Responsive scaling based on viewport width
  const isMobile = viewport.width < 7; // ~768px in Three.js units
  const modelScale = isMobile ? 0.035 : 0.055;

  // Optimized quartz material
  const quartzMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f0e6e0',
      roughness: 0.3,
      metalness: 0.05,
    });
  }, []);

  // Apply material and optimizations
  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Dispose old material to prevent memory leak
        if (child.material && child.material !== quartzMaterial) {
          child.material.dispose();
        }

        // Apply quartz material
        child.material = quartzMaterial;

        // Enable frustum culling
        child.frustumCulled = true;
      }
    });
  }, [scene, quartzMaterial]);

  return (
    <group dispose={null}>
      <primitive
        object={scene}
        scale={modelScale}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

// Preload the model
useGLTF.preload(MODEL_PATH);