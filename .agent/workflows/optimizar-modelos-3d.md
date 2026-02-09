---
description: Optimizar modelos 3D GLTF/GLB para web con compresión y mejoras de rendimiento
---

# Workflow: Optimización de Modelos 3D para Web

Este workflow te guía paso a paso para optimizar modelos 3D pesados (.glb, .gltf) y renderizarlos eficientemente en React Three Fiber.

## 📋 Requisitos Previos

- Node.js instalado
- Modelo 3D en formato GLTF o GLB
- Proyecto React con `@react-three/fiber` y `@react-three/drei`

## 🚀 Paso 1: Instalar gltf-transform CLI

```bash
npm install -g @gltf-transform/cli
```

**Nota**: Instalación global para usar en todos los proyectos.

## 📂 Paso 2: Preparar Estructura de Directorios

```bash
mkdir -p public/models
```

Coloca tu modelo original en `public/models/`.

## ⚡ Paso 3: Optimizar el Modelo

// turbo
```bash
gltf-transform optimize public/models/NOMBRE_ORIGINAL.gltf public/models/NOMBRE_OPTIMIZADO.glb --compress draco --simplify 0.75
```

**Parámetros explicados:**
- `--compress draco`: Compresión Draco (70-90% reducción de tamaño)
- `--simplify 0.75`: Mantener 75% de los polígonos (ajustar según necesidad)
  - `0.5` = 50% polígonos (mayor optimización)
  - `0.9` = 90% polígonos (mayor calidad)

**Resultado esperado:**
```
✔ draco
info: NOMBRE_ORIGINAL.gltf (XX MB) → NOMBRE_OPTIMIZADO.glb (Y MB)
```

## 📊 Paso 4: Verificar Tamaño del Archivo

// turbo
```bash
ls -lh public/models/
```

Compara los tamaños antes y después.

## 💻 Paso 5: Crear Componente React Three Fiber

Crea un archivo `Modelo3D.tsx`:

```tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Configurar Draco decoder (necesario para modelos comprimidos)
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const MODEL_PATH = '/models/NOMBRE_OPTIMIZADO.glb';

export const Modelo3D: React.FC = () => {
  const { scene } = useGLTF(MODEL_PATH);
  const processedRef = useRef(false);

  // Material personalizado (ajustar según necesidad)
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f0e6e0',        // Color base
      roughness: 0.3,          // 0 = brillante, 1 = mate
      metalness: 0.05,         // 0 = no metálico, 1 = metálico
    });
  }, []);

  // Aplicar material y optimizaciones
  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Limpiar material anterior
        if (child.material && child.material !== material) {
          child.material.dispose();
        }
        
        // Aplicar nuevo material
        child.material = material;
        
        // Habilitar frustum culling (no renderiza fuera de cámara)
        child.frustumCulled = true;
      }
    });
  }, [scene, material]);

  return (
    <group dispose={null}>
      <primitive
        object={scene}
        scale={1.0}              // Ajustar escala
        position={[0, 0, 0]}     // Ajustar posición
        rotation={[0, 0, 0]}     // Ajustar rotación
      />
    </group>
  );
};

// Precargar modelo para carga más rápida
useGLTF.preload(MODEL_PATH);
```

## 🎨 Paso 6: Integrar en la Escena

```tsx
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Modelo3D } from './Modelo3D';

export const Scene = () => {
  return (
    <Canvas
      dpr={[1, 1.5]}                    // Device Pixel Ratio (menor = mejor performance)
      gl={{
        antialias: false,               // Desactivar para mejor performance
        powerPreference: "high-performance",
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      
      {/* Luces */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Tu modelo */}
      <Modelo3D />
    </Canvas>
  );
};
```

## 🔧 Optimizaciones Adicionales

### Mejorar Performance de React

```tsx
import { memo } from 'react';

export const Scene = memo(() => {
  // ... contenido del componente
});

export const Modelo3D = memo(() => {
  // ... contenido del componente
});
```

### Reducir Efectos Visuales Pesados

Si usas `<Cloud>` o `<Stars>`:

```tsx
// Configuración ligera
<Cloud
  opacity={0.3}
  speed={0.2}
  bounds={[8, 1.5, 1]}
  segments={3}        // Reducir segmentos
/>

<Stars
  count={100}         // Reducir número de estrellas
  speed={0.5}
/>
```

## 📈 Verificar Performance

Abrir DevTools Console y ejecutar:

```javascript
const fpsData = [];
let lastTime = performance.now();
const measure = (time) => {
  const delta = time - lastTime;
  if (delta > 0) fpsData.push(1000 / delta);
  lastTime = time;
  if (measuring) requestAnimationFrame(measure);
};
let measuring = true;
requestAnimationFrame(measure);
setTimeout(() => {
  measuring = false;
  const avgFps = fpsData.reduce((a, b) => a + b, 0) / fpsData.length;
  console.log('FPS promedio:', avgFps.toFixed(2));
}, 5000);
```

**Objetivo**: 30+ FPS para experiencia fluida, 60 FPS ideal.

## 🎯 Checklist de Optimización

- [ ] Modelo comprimido con Draco
- [ ] Tamaño de archivo reducido >70%
- [ ] Frustum culling habilitado
- [ ] Componentes memoizados
- [ ] DPR reducido ([1, 1.5] en lugar de [1, 2])
- [ ] Antialiasing desactivado (opcional)
- [ ] Efectos visuales minimizados
- [ ] FPS estable >30

## 🛠️ Troubleshooting

### Error: "WebGL context could not be created"
**Solución**: Memoizar el componente `Scene` para evitar re-renderizados.

### FPS bajo (<20)
**Soluciones**:
1. Aumentar simplificación: `--simplify 0.5`
2. Desactivar sombras: No usar `shadows` en `<Canvas>`
3. Reducir DPR: `dpr={[1, 1]}`

### Modelo no se ve
**Soluciones**:
1. Verificar ruta: `/models/archivo.glb`
2. Ajustar escala: `scale={0.1}` o `scale={10}`
3. Verificar posición de cámara

## 📚 Recursos Adicionales

- [gltf-transform docs](https://gltf-transform.dev/)
- [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Performance Tips](https://threejs.org/docs/#manual/en/introduction/How-to-update-things)

---

**💡 Tip Final**: Siempre guarda el modelo original sin comprimir. Puedes re-optimizar con diferentes parámetros según el proyecto.
