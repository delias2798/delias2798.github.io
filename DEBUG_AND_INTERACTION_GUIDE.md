# 🎮 Guía de Interacción y Debug

## ✅ Problema de Cámara Solucionado

### Qué Era el Problema

Cuando intentabas agarrar un objeto, el click también movía la cámara, causando que:
1. El objeto se agarrara (POINTERDOWN)
2. La cámara rotara inmediatamente
3. El objeto se soltara automáticamente (POINTERUP)

Resultado: `🎯 Objeto agarrado` seguido inmediatamente de `🎯 Objeto soltado`

### Solución Implementada

Ahora cuando agarras un objeto:
1. ✅ La cámara se **desactiva** automáticamente
2. ✅ Puedes mover el objeto libremente sin rotar la cámara
3. ✅ Al soltar, la cámara se **reactiva** automáticamente

### Cómo Usar Objetos Interactivos

**Para Agarrar:**
1. Haz click sobre una esfera o cubo
2. Verás en consola:
   ```
   📷 Cámara desactivada para grab
   🎯 Objeto agarrado: sphere1
   ```

**Para Mover:**
1. Mantén el click presionado
2. Mueve el mouse
3. El objeto seguirá tu cursor en 3D (sin mover la cámara)

**Para Soltar:**
1. Suelta el click
2. Verás en consola:
   ```
   🎯 Objeto soltado: sphere1
   📷 Cámara reactivada
   ```
3. El objeto caerá con física
4. La cámara volverá a funcionar normalmente

## 🔍 Inspector de Debug de BabylonJS

### Cómo Activarlo

Agrega `?debug=true` a la URL:

```
http://localhost:5173/?debug=true
```

### Qué Verás

Un panel aparecerá en el **lado derecho** de la pantalla con las siguientes herramientas:

**Scene Explorer:**
- Árbol jerárquico de todos los objetos
- Cámaras, luces, meshes, materiales
- Click en cualquier elemento para inspeccionarlo

**Inspector:**
- Propiedades del elemento seleccionado
- Posición, rotación, escala
- Materiales y texturas
- Física (mass, friction, restitution)

**Estadísticas:**
- FPS (frames por segundo)
- Draw calls
- Vértices y caras
- Memoria de texturas

**Debug:**
- Normals (visualizar normales de meshes)
- Wireframe (modo alambre)
- Bounding boxes (cajas de colisión)
- Physics (visualizar colliders)

### Herramientas Útiles del Inspector

#### Ver Physics Bodies:
1. Abre el Inspector con `?debug=true`
2. Ve a la pestaña "Scene"
3. Activa "Physics Viewer"
4. Verás las cajas de colisión de Havok en verde/azul

#### Inspeccionar un Objeto:
1. En el Scene Explorer, busca "sphere0" o "cube0"
2. Click en él
3. En el Inspector verás todas sus propiedades
4. Puedes modificar valores en tiempo real

#### Ver Estadísticas:
1. Ve a la pestaña "Statistics"
2. Verás FPS, draw calls, etc.
3. Útil para optimización

### Consola del Inspector

En la consola verás estos mensajes cuando actives debug:

```
✅ Escena BabylonJS iniciada correctamente
🔍 Activando Inspector de BabylonJS...
✅ Inspector de BabylonJS activado
💡 Usa las herramientas en el panel derecho
```

## 🎬 Sobre los Videos

### ⚠️ Los Videos No se Cargan (NORMAL)

Esto es **completamente normal** porque los archivos de video no existen todavía:
- `/videos/project1.mp4`
- `/videos/project2.mp4`
- `/videos/project3.mp4`

### Qué Ves en su Lugar

El `ScreenManager` está configurado para manejar esto automáticamente:

1. **Intenta cargar el video**
2. **Si falla**, muestra un placeholder:
   - Color gris/azulado en la pantalla
   - Log en consola: `⚠️ No se pudo cargar el video`
3. **El resto funciona normal**:
   - ✅ Pantalla 3D visible
   - ✅ Texto lateral con información
   - ✅ Sistema de carrusel
   - ✅ Enfoque de cámara al clickear

### Mensajes en Consola (Normales)

```
⚠️ No se pudo cargar el video: /videos/project1.mp4
ℹ️ Agrega tus videos en public/videos/ - Ver VIDEOS_SETUP.md
```

Estos son **warnings, no errors**. La aplicación funciona perfectamente sin videos.

### Para Agregar tus Videos Reales

Consulta el archivo `VIDEOS_SETUP.md` para instrucciones detalladas.

## 🎯 Checklist de Funcionalidad

### Con Objetos Interactivos:
- [ ] Puedo clickear una esfera/cubo
- [ ] Veo "Cámara desactivada para grab"
- [ ] Veo "Objeto agarrado: sphere0"
- [ ] Puedo mover el objeto SIN que la cámara rote
- [ ] Al soltar, veo "Objeto soltado"
- [ ] Veo "Cámara reactivada"
- [ ] La cámara funciona normal después de soltar

### Con el Inspector (?debug=true):
- [ ] Panel aparece en el lado derecho
- [ ] Puedo ver el Scene Explorer
- [ ] Puedo ver propiedades de objetos
- [ ] Puedo ver estadísticas (FPS, etc.)
- [ ] Puedo activar Physics Viewer

### Con las Pantallas:
- [ ] Veo la pantalla 3D (con color placeholder)
- [ ] Veo texto 3D lateral
- [ ] Puedo clickear la pantalla para enfocar
- [ ] Aparece el overlay con información
- [ ] Puedo usar los botones ‹ › del carrusel
- [ ] ESC me saca del modo enfoque

## 🐛 Troubleshooting

### El Inspector No Aparece

**Verificar:**
1. ¿La URL tiene `?debug=true`?
2. ¿La consola muestra "🔍 Activando Inspector de BabylonJS..."?
3. ¿Hay errores en la consola?

**Solución:**
- Recarga la página con Ctrl + Shift + R
- Verifica que @babylonjs/inspector esté instalado

### La Cámara Aún se Mueve al Agarrar

**Verificar:**
1. ¿Ves "📷 Cámara desactivada para grab"?
2. ¿Estás clickeando directamente en una esfera/cubo?

**Solución:**
- Asegúrate de clickear directamente en el objeto
- Si el problema persiste, revisa la consola para errores

### Los Objetos No se Agarran

**Verificar:**
1. ¿Ves "🎮 Inicializando objetos interactivos..." en consola?
2. ¿Ves "✅ Objetos interactivos creados"?
3. ¿Havok Physics está cargado?

**Solución:**
- Verifica que Havok se cargó correctamente
- Los objetos están cerca del mueble en las posiciones:
  - Esferas: Y=1.5, Z=2 (X=-2, 0, 2)
  - Cubos: Y=1.5, Z=3 (X=-1, 1)

## 🎨 Características Implementadas

| Característica | Estado | Notas |
|---------------|--------|-------|
| Agarrar objetos | ✅ | Con desactivación de cámara |
| Mover objetos | ✅ | Física kinematic durante grab |
| Soltar objetos | ✅ | Física dynamic al soltar |
| Respawn automático | ✅ | Si caen (Y < -2) |
| Inspector de debug | ✅ | Con ?debug=true |
| Videos con fallback | ✅ | Placeholder si no existen |
| Sistema de cámara | ✅ | Enfoque en pantallas |
| Carrusel | ✅ | Navegación entre proyectos |

## 📚 Archivos de Referencia

- `VIDEOS_SETUP.md` - Cómo agregar tus videos VR
- `INTERACTION_FIX.md` - Detalles técnicos de interacción
- `TROUBLESHOOTING.md` - Solución de problemas generales

---

**Última actualización:** 2025-10-11
**Estado:** Interacción y Debug completamente funcionales ✅

