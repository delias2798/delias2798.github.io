# 🚀 Quick Start - Portfolio VR/XR

Guía de inicio rápido para poner tu portfolio en funcionamiento en **5 minutos**.

## ✅ Pre-requisitos

- Node.js 20.x instalado ✅ (tienes v20.18.0)
- Navegador moderno (Chrome, Firefox, Edge)
- Videos VR (o usa placeholders temporalmente)

## 📋 Pasos Rápidos

### 1. Verificar Instalación

Las dependencias ya están instaladas, pero si necesitas reinstalar:

```bash
npm install
```

### 2. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor iniciará en: **http://localhost:5173**

### 3. Ver en el Navegador

Abre **http://localhost:5173** y deberías ver:
- ✅ Espacio 3D con mueble
- ✅ Una pantalla 3D (sin video todavía)
- ✅ Texto lateral con información del proyecto
- ✅ 5 objetos interactivos (esferas y cubos)
- ✅ Welcome overlay con instrucciones

### 4. Probar Interacciones

**Cámara:**
- Drag con mouse → Rotar cámara
- Scroll → Zoom in/out
- Click en pantalla → Enfocar (aunque el video aún no esté)

**Objetos:**
- Click + drag en esferas/cubos → Agarrar y mover
- Soltar → Liberar con física
- Si caen → Respawn automático

**Carrusel:**
- Enfoca la pantalla (click)
- Usa las flechas ‹ › en el overlay
- O presiona ESC para salir

## ⚠️ Videos Pendientes

Los videos NO están incluidos. Verás errores en la consola como:
```
Failed to load resource: /videos/project1.mp4
```

**Esto es normal.** Para solucionarlo:

### Opción A: Usar Videos Reales (Recomendado)

1. Coloca tus 3 videos en: `public/videos/`
   - `project1.mp4`
   - `project2.mp4`
   - `project3.mp4`

2. Actualiza info en: `src/data/projects.ts`

3. Recarga el navegador

### Opción B: Usar Placeholders Temporales

Descarga cualquier video MP4 de internet y renómbralo:

```bash
# Windows PowerShell
cd public/videos
# Descarga o copia cualquier video MP4 aquí
# Renómbralo a project1.mp4, project2.mp4, project3.mp4
```

## 🎯 Personalización Rápida

### Cambiar Textos

Edita `src/data/projects.ts`:

```typescript
{
    title: 'TU PROYECTO',
    description: 'Descripción corta aquí',
    detailedDescription: 'Descripción larga aquí...',
    technologies: ['BabylonJS', 'WebXR', 'React'],
    date: '2024'
}
```

### Cambiar Posición de Pantalla

Edita `src/config/scene.config.ts`:

```typescript
screen: {
    position: {
        x: 0,    // Izquierda (-) / Derecha (+)
        y: 2,    // Abajo (-) / Arriba (+)
        z: -3,   // Adelante (-) / Atrás (+)
    }
}
```

### Cambiar Colores del Overlay

Edita `src/styles/ProjectOverlay.css`:

```css
.overlay-content {
    background: rgba(0, 0, 0, 0.85);  /* Tu color aquí */
}
```

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Pantalla negra en el navegador
- Abre la consola (F12)
- Busca errores en rojo
- Si dice "WebGL not supported", tu GPU no es compatible

### Objetos no se mueven
- Verifica que Havok WASM se cargó (tab Network)
- Intenta en Chrome (mejor soporte)

### Videos no se reproducen
- Verifica que los archivos existan en `public/videos/`
- Verifica que sean MP4 válidos
- Algunos navegadores bloquean autoplay

## 📦 Build para Producción

Cuando estés listo para deploy:

```bash
npm run build
```

Los archivos compilados estarán en `dist/`

### Deploy a GitHub Pages

```bash
npm run deploy
```

O manualmente:

```bash
git add .
git commit -m "Portfolio update"
git push origin main
npm run deploy
```

## 🎓 Aprender Más

Consulta estos archivos en orden:

1. **`README.md`** - Documentación completa
2. **`IMPLEMENTATION_SUMMARY.md`** - Qué se implementó
3. **`VIDEOS_SETUP.md`** - Cómo agregar videos
4. **`FUTURE_EXTENSIONS.md`** - WebXR, haptics, AR
5. **`FILES_INDEX.md`** - Referencia de archivos

## 💡 Tips

- **F12** → Abre consola para ver errores
- **Ctrl + Shift + R** → Recarga sin cache
- El servidor hot-reload automáticamente al editar código
- Los videos pueden tardar en cargar la primera vez

## ✨ Siguiente Nivel

Una vez funcional, considera:

1. ✅ Agregar tus videos VR reales
2. ✅ Personalizar textos y colores
3. ✅ Cambiar el modelo 3D del espacio
4. 🔮 Agregar WebXR (ver `FUTURE_EXTENSIONS.md`)
5. 🔮 Implementar hápticos
6. 🔮 Modo AR

## 📞 Necesitas Ayuda?

- **Errores de compilación:** Ver consola de terminal
- **Errores en navegador:** Ver consola del navegador (F12)
- **Documentación BabylonJS:** https://doc.babylonjs.com/

---

## 🎉 ¡Listo!

Tu portfolio está funcionando. Ahora solo:

1. ✅ Agrega tus videos VR
2. ✅ Personaliza la información
3. ✅ Haz deploy

**¡Muestra tu expertise en BabylonJS, Web3D, React y VR/XR al mundo! 🚀**

---

**Servidor corriendo:** http://localhost:5173
**Documentación completa:** README.md
**Soporte técnico:** Ver IMPLEMENTATION_SUMMARY.md


