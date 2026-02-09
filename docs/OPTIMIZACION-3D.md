# Optimización de Modelos 3D para Web

## 🎯 Resumen Ejecutivo

Esta guía documenta el proceso completo de optimización de modelos 3D (GLTF/GLB) para renderizado eficiente en aplicaciones web con React Three Fiber.

**Resultado demostrado**: Reducción de 44.43 MB → 3.79 MB (91%) con FPS estable de 30+

---

## 📊 Problema Común

Los modelos 3D descargados de sitios como Sketchfab, TurboSquid, o exportados directamente de Blender suelen ser:
- ✗ Demasiado pesados (20-100+ MB)
- ✗ Alta densidad de polígonos (50K-200K+ vértices)
- ✗ Sin compresión
- ✗ Causan lag en navegadores (10-20 FPS)

---

## ✅ Solución: Pipeline de Optimización

### 1. Compresión con gltf-transform

**Herramienta**: [`@gltf-transform/cli`](https://gltf-transform.dev/)

**Instalación**:
```bash
npm install -g @gltf-transform/cli
```

**Comando de optimización**:
```bash
gltf-transform optimize INPUT.gltf OUTPUT.glb \
  --compress draco \
  --simplify 0.75
```

**Parámetros**:
- `--compress draco`: Compresión geométrica (70-90% reducción)
- `--simplify 0.75`: Simplificación de mesh (mantiene 75% polígonos)

**Reducción típica**: 80-95% del tamaño original

---

### 2. Implementación en React Three Fiber

**Componente base**:

```tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Configurar decoder Draco (OBLIGATORIO para modelos comprimidos)
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const MODEL_PATH = '/models/optimized-model.glb';

export const Modelo3D: React.FC = () => {
  const { scene } = useGLTF(MODEL_PATH);
  const processedRef = useRef(false);

  // Material personalizado
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f0e6e0',
      roughness: 0.3,
      metalness: 0.05,
    });
  }, []);

  // Aplicar optimizaciones
  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Limpiar material anterior
        if (child.material && child.material !== material) {
          child.material.dispose();
        }
        
        child.material = material;
        child.frustumCulled = true;  // No renderizar fuera de vista
      }
    });
  }, [scene, material]);

  return (
    <primitive object={scene} scale={1.0} />
  );
};

// Precargar para carga más rápida
useGLTF.preload(MODEL_PATH);
```

---

### 3. Optimizaciones de Escena

**Canvas con configuración de alto rendimiento**:

```tsx
<Canvas
  dpr={[1, 1.5]}                      // Reducir device pixel ratio
  gl={{
    antialias: false,                 // Desactivar antialiasing
    powerPreference: "high-performance",
  }}
>
  <Modelo3D />
</Canvas>
```

**Componentes memoizados**:

```tsx
import { memo } from 'react';

export const Scene = memo(() => {
  // Evita re-renders innecesarios
});
```

---

## 📈 Métricas de Éxito

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Tamaño archivo** | 44.43 MB | 3.79 MB | 91% ↓ |
| **FPS promedio** | 20.77 | 30.08 | 45% ↑ |
| **Tiempo de carga** | 2-3s | <1s | 67% ↓ |
| **Calidad visual** | 100% | 95% | -5% |

---

## 🎨 Casos de Uso

### Caso 1: E-commerce (Visualización de Productos)
```bash
gltf-transform optimize producto.gltf producto.glb --compress draco --simplify 0.8
```
- Alta calidad visual (80% polígonos)
- Tamaño moderado

### Caso 2: Fondos/Decoración
```bash
gltf-transform optimize fondo.gltf fondo.glb --compress draco --simplify 0.5
```
- Performance máxima (50% polígonos)
- Calidad suficiente para elemento de fondo

### Caso 3: Hero Section
```bash
gltf-transform optimize hero.gltf hero.glb --compress draco --simplify 0.75
```
- Balance calidad/performance (75% polígonos)
- Ideal para elementos destacados

---

## 🔧 Comandos Útiles

**Ver tamaño de archivos**:
```bash
ls -lh public/models/
```

**Analizar modelo con gltf-transform**:
```bash
gltf-transform inspect INPUT.gltf
```

**Conversión GLTF → GLB**:
```bash
gltf-transform copy INPUT.gltf OUTPUT.glb
```

**Solo compresión Draco (sin simplificación)**:
```bash
gltf-transform draco INPUT.gltf OUTPUT.glb
```

---

## 🛡️ Mejores Prácticas

### ✅ Hacer
- Comprimir con Draco para producción
- Guardar modelo original sin comprimir
- Probar diferentes niveles de simplificación (0.5, 0.75, 0.9)
- Memoizar componentes React
- Usar frustum culling
- Precargar modelos críticos

### ❌ Evitar
- Cargar modelos sin comprimir (>10MB)
- Aplicar material en cada render
- Usar sombras si no es necesario
- DPR muy alto ([1, 3])
- Antialiasing en modelos complejos
- Múltiples instancias del mismo modelo sin `<Instances>`

---

## 📦 Dependencias Necesarias

```json
{
  "dependencies": {
    "@react-three/fiber": "^9.0.0",
    "@react-three/drei": "^10.0.0",
    "three": "^0.181.0"
  },
  "devDependencies": {
    "@gltf-transform/cli": "^4.0.0"  // Global install recommended
  }
}
```

---

## 🔍 Debugging

### Verificar FPS en DevTools Console

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
  console.log('FPS:', avgFps.toFixed(2));
}, 5000);
```

**Objetivo**: 30+ FPS (aceptable), 60 FPS (ideal)

### Verificar tamaño de geometría

```javascript
scene.traverse((child) => {
  if (child.geometry) {
    const vertices = child.geometry.attributes.position.count;
    console.log(`${child.name}: ${vertices} vértices`);
  }
});
```

---

## 🚀 Workflow Rápido

1. **Preparar**:
   ```bash
   mkdir -p public/models
   # Copiar modelo.gltf a public/models/
   ```

2. **Optimizar**:
   ```bash
   gltf-transform optimize public/models/modelo.gltf public/models/modelo-opt.glb --compress draco --simplify 0.75
   ```

3. **Implementar**:
   - Copiar plantilla de componente (ver arriba)
   - Ajustar `MODEL_PATH`
   - Ajustar `scale`, `position`, `rotation`

4. **Probar**:
   - Verificar FPS en DevTools
   - Ajustar `--simplify` si es necesario

5. **Deploy**:
   - Commit solo el modelo optimizado (.glb)
   - No subir modelo original (añadir a `.gitignore`)

---

## 📚 Referencias

- [gltf-transform Documentation](https://gltf-transform.dev/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Draco Compression](https://google.github.io/draco/)
- [Three.js Performance](https://threejs.org/docs/#manual/en/introduction/How-to-update-things)
- [glTF 2.0 Specification](https://www.khronos.org/gltf/)

---

**Creado**: 2026-01-29  
**Proyecto**: Vivero Balam  
**Autor**: UziPech con Antigravity AI  
**Versión**: 1.0
