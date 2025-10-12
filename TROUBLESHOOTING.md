# 🔧 Troubleshooting - Pantalla Gris / Canvas Vacío

## 🐛 Problema: El canvas solo muestra pantalla gris

Si ves solo un canvas gris sin ningún elemento 3D, sigue estos pasos:

### Paso 1: Abrir la Consola del Navegador

1. Presiona **F12** (o Click derecho → Inspeccionar)
2. Ve a la pestaña **Console**
3. Busca los siguientes mensajes:

#### ✅ Mensajes Esperados (Escena funcionando):

```
🎬 Iniciando escena BabylonJS...
⚙️ Cargando Havok Physics...
✅ Havok Physics cargado
✅ Modelo cargado
📷 Inicializando Camera Controller...
🎬 Inicializando Screen Manager...
⚠️ No se pudo cargar el video: /videos/project1.mp4  (NORMAL si no tienes videos)
🎮 Inicializando objetos interactivos...
✅ Objetos interactivos creados
🎨 Iniciando render loop...
✅ Escena BabylonJS iniciada correctamente
```

#### ❌ Mensajes de Error Comunes:

**Error 1: WebGL no disponible**
```
WebGL: CONTEXT_LOST_WEBGL
```
**Solución:** Tu GPU no soporta WebGL o está deshabilitado
- Actualiza drivers de GPU
- Habilita aceleración de hardware en el navegador

**Error 2: Havok no carga**
```
❌ Error cargando Havok Physics
```
**Solución:** El archivo WASM de Havok no se descargó
- Verifica conexión a internet
- Limpia cache del navegador (Ctrl + Shift + Delete)

**Error 3: Modelo no carga**
```
❌ Error cargando modelo: 404 Not Found
```
**Solución:** El archivo furniture.glb no existe
- Verifica que exista en `public/models/furniture.glb`

### Paso 2: Verificar que el Canvas se Crea

En la consola, escribe:

```javascript
document.querySelector('canvas')
```

Deberías ver:
```
<canvas width="..." height="..."></canvas>
```

Si ves `null`, el canvas no se está creando.

### Paso 3: Verificar Network (Red)

1. Ve a la pestaña **Network** (Red)
2. Recarga la página (F5)
3. Verifica que se descarguen:
   - ✅ `HavokPhysics....wasm` (~2MB)
   - ✅ `furniture.glb` (modelo 3D)
   - ⚠️ `project1.mp4` (404 es normal si no tienes videos)

### Paso 4: Revisar Tamaño del Canvas

En la consola, escribe:

```javascript
const canvas = document.querySelector('canvas');
console.log('Width:', canvas.clientWidth, 'Height:', canvas.clientHeight);
```

Debería mostrar dimensiones del viewport. Si es 0x0, hay un problema con el CSS.

## 🛠️ Soluciones Rápidas

### Solución 1: Limpiar Cache y Reconstruir

```bash
# Detener servidor (Ctrl + C)
# Limpiar todo
rm -rf node_modules dist .vite
npm install
npm run build
npm run dev
```

### Solución 2: Modo Seguro (Sin Havok)

Si Havok está causando problemas, edita temporalmente `BabylonScene.tsx`:

Comenta la sección de Havok (líneas 48-57):

```typescript
// try {
//     console.log('⚙️ Cargando Havok Physics...');
//     const havokInstance = await HavokPhysics();
//     const havokPlugin = new HavokPlugin(true, havokInstance);
//     scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);
//     console.log('✅ Havok Physics cargado');
// } catch (error) {
//     console.error('❌ Error cargando Havok Physics:', error);
//     console.warn('⚠️ Continuando sin física...');
// }
```

Esto deshabilitará la física pero debería mostrar la escena.

### Solución 3: Verificar Puerto

Si el servidor no responde en http://localhost:5173:

```bash
# Verifica que el puerto esté libre
netstat -ano | findstr :5173

# Usa otro puerto
npm run dev -- --port 3000
```

## 🔍 Diagnóstico Avanzado

### Verificar que BabylonJS se Carga

En la consola:

```javascript
console.log(typeof BABYLON !== 'undefined' ? 'BabylonJS cargado' : 'BabylonJS NO cargado');
```

### Verificar Engine y Scene

```javascript
// Debería existir un engine global o en window
console.log('Engine:', window.engine);
console.log('Scene:', window.scene);
```

### Forzar Renderizado

En la consola:

```javascript
const canvas = document.querySelector('canvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
BABYLON.MeshBuilder.CreateBox('box', {size: 2}, scene);
engine.runRenderLoop(() => scene.render());
```

Si ves un cubo, BabylonJS funciona. El problema está en tu código de inicialización.

## 📋 Checklist de Verificación

- [ ] Consola muestra "✅ Escena BabylonJS iniciada correctamente"
- [ ] Canvas existe en el DOM
- [ ] Canvas tiene dimensiones > 0
- [ ] HavokPhysics.wasm se descarga (Network tab)
- [ ] furniture.glb se descarga (Network tab)
- [ ] No hay errores de WebGL
- [ ] Puerto 5173 está funcionando
- [ ] Navegador moderno (Chrome 90+, Firefox 88+, Edge 90+)

## 🆘 Si Nada Funciona

### Opción 1: Versión Simplificada

Crea un archivo `test.html` en la raíz:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test BabylonJS</title>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        canvas { width: 100%; height: 100%; }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        
        const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
        
        const box = BABYLON.MeshBuilder.CreateBox('box', {size: 2}, scene);
        
        engine.runRenderLoop(() => scene.render());
        window.addEventListener('resize', () => engine.resize());
        
        console.log('✅ Test BabylonJS funcionando');
    </script>
</body>
</html>
```

Abre directamente `test.html` en el navegador. Si ves un cubo, BabylonJS funciona y el problema es con React/Vite.

### Opción 2: Compartir Logs

Copia **TODOS** los mensajes de la consola (Console tab) y pégalos aquí para diagnóstico.

## 🎯 Casos Específicos

### "DOMException: Failed to execute 'texImage2D'"

**Causa:** Problema con texturas/videos
**Solución:** Los videos no existen, pero esto NO debería detener la escena. Ya está manejado.

### "TypeError: Cannot read property 'x' of undefined"

**Causa:** Vector3 o mesh undefined
**Solución:** Verifica que todos los managers se inicialicen correctamente.

### Pantalla Negra (no gris)

**Causa:** La escena se renderiza pero no hay luz
**Solución:** Verifica que las luces se creen (líneas 64-78 de BabylonScene.tsx)

## 📞 Soporte

Si después de todo esto aún tienes problemas:

1. **Copia el output completo de la consola del navegador**
2. **Ejecuta:** `npm run build` y copia cualquier error
3. **Verifica:** ¿Qué navegador y versión usas?
4. **Especifica:** ¿Windows/Mac/Linux?

---

**Última actualización:** 2025-10-11

