# Configuración de Videos

## ⚠️ IMPORTANTE: Videos Placeholder

Actualmente, el proyecto está configurado para cargar videos desde:
- `/videos/project1.mp4`
- `/videos/project2.mp4`
- `/videos/project3.mp4`

**Estos archivos NO existen todavía.** Necesitas agregar tus videos VR para que el portfolio funcione completamente.

## 📹 Cómo Agregar tus Videos VR

### Paso 1: Preparar tus Videos

1. **Graba tus proyectos VR:**
   - Desde Oculus Quest: Usa el botón de compartir → Grabar video
   - Desde Pico: Usa la función de grabación integrada
   - Transfiere los videos a tu PC mediante USB o app móvil

2. **Optimiza los videos (opcional pero recomendado):**
   ```bash
   # Usando FFmpeg para optimizar tamaño manteniendo calidad
   ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
   ```

### Paso 2: Colocar los Videos

1. Renombra tus videos a:
   - `project1.mp4` - Para tu primer proyecto
   - `project2.mp4` - Para tu segundo proyecto
   - `project3.mp4` - Para tu tercer proyecto

2. Coloca los archivos en: `public/videos/`

### Paso 3: Actualizar Información

Edita `src/data/projects.ts` para actualizar:
- Títulos de proyectos
- Descripciones
- Tecnologías utilizadas
- Fechas

```typescript
{
    id: 'vr-project-1',
    title: 'TU TÍTULO AQUÍ',
    description: 'Descripción corta',
    detailedDescription: 'Descripción detallada con toda la información...',
    videoUrl: '/videos/project1.mp4',
    technologies: ['Las', 'Tecnologías', 'Que', 'Usaste'],
    date: '2024'
}
```

## 🎬 Especificaciones Recomendadas

- **Formato:** MP4 (H.264 codec)
- **Resolución:** 1920x1080 (Full HD) mínimo
- **Aspect Ratio:** 16:9
- **Duración:** 30-120 segundos (óptimo para portfolio)
- **Tamaño:** < 50MB por video (para carga rápida)
- **FPS:** 30 o 60fps

## 🔧 Mientras Tanto (Desarrollo)

Si quieres probar la aplicación sin videos reales, puedes:

1. **Usar videos de prueba:** Descarga cualquier video MP4 y renómbralo
2. **Comentar temporalmente:** Comenta el código de VideoTexture en `ScreenManager.ts` (no recomendado)
3. **Usar imágenes estáticas:** Reemplaza VideoTexture con Texture estándar temporalmente

## 🚀 Verificar que Funciona

Después de agregar los videos:

```bash
npm run dev
```

- Deberías ver los videos reproduciéndose en las pantallas 3D
- Haz click en una pantalla para enfocarla
- Los videos deberían reproducirse en loop automáticamente

## ❓ Troubleshooting

**Problema:** Los videos no se cargan
- Verifica que los archivos existan en `public/videos/`
- Verifica que los nombres coincidan exactamente (project1.mp4, project2.mp4, project3.mp4)
- Verifica que sean archivos MP4 válidos
- Abre la consola del navegador para ver errores

**Problema:** Los videos se cargan pero no se reproducen
- Algunos navegadores requieren interacción del usuario primero
- Intenta hacer click en la pantalla para iniciar reproducción

**Problema:** Performance lenta
- Reduce la resolución de los videos
- Reduce el bitrate usando FFmpeg
- Considera usar formatos más optimizados

## 📦 Agregar Más Proyectos

Para agregar un 4to, 5to proyecto, etc.:

1. Agrega el video: `public/videos/project4.mp4`
2. Agrega el proyecto en `src/data/projects.ts`
3. ¡Listo! El carrusel se actualizará automáticamente

No necesitas modificar ningún otro archivo. El sistema es completamente dinámico.


