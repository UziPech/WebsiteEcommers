import React, { useEffect, useRef, memo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Set Draco decoder path for compressed models
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const MODEL_PATH = '/models/Modelo3D-optimized.glb';

export const MayaSculpture: React.FC = memo(() => {
  const { scene } = useGLTF(MODEL_PATH);
  const processedRef = useRef(false);
  const { viewport } = useThree();

  // Responsive scaling based on viewport width
  const isMobile = viewport.width < 7; // ~768px in Three.js units
  // Model bbox: ~0.66 x 1.0 x 0.52 units
  const modelScale = isMobile ? 3.0 : 4.5;

  // Apply performance + visual optimizations preserving original textures
  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enable frustum culling (don't render meshes outside camera view)
        child.frustumCulled = true;

        // Optimize material rendering
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;

          // Correct color space on baseColor texture
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.anisotropy = 4;
          }

          // Lift dark areas: subtle emissive glow to soften harsh shadows
          mat.emissive = new THREE.Color('#3a3530');
          mat.emissiveIntensity = 0.35;

          // Slightly brighten the overall color factor
          mat.color.multiplyScalar(1.3);

          // Soften roughness slightly for more light bounce
          mat.roughness = Math.min(mat.roughness * 0.85, 1.0);

          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

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
});

// Preload the model
useGLTF.preload(MODEL_PATH);