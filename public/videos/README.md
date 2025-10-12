# Videos de Proyectos VR

Este directorio debe contener los videos de tus proyectos VR grabados desde Oculus o Pico.

## Archivos Requeridos

Los siguientes archivos de video son necesarios para que los proyectos se muestren correctamente:

- `project1.mp4` - VR Training Simulation
- `project2.mp4` - AR Product Visualizer  
- `project3.mp4` - XR Collaborative Space

## Formato Recomendado

- **Formato:** MP4 (H.264)
- **Resolución:** 1920x1080 (Full HD) o superior
- **Aspect Ratio:** 16:9
- **Duración:** 30-120 segundos recomendado
- **Bitrate:** 5-10 Mbps para buena calidad

## Cómo Agregar Nuevos Proyectos

1. **Agregar el video:** Coloca tu archivo de video en este directorio (por ejemplo: `project4.mp4`)

2. **Actualizar datos:** Edita el archivo `src/data/projects.ts` y agrega un nuevo objeto al array:

```typescript
{
    id: 'vr-project-4',
    title: 'Mi Nuevo Proyecto VR',
    description: 'Descripción corta del proyecto',
    detailedDescription: 'Descripción detallada con más información sobre el proyecto...',
    videoUrl: '/videos/project4.mp4',
    technologies: ['BabylonJS', 'WebXR', 'React'],
    date: '2025'
}
```

3. **Listo!** El sistema automáticamente incluirá el nuevo proyecto en el carrusel.

## Captura de Videos desde Dispositivos VR

### Oculus Quest
- Presiona el botón Oculus y luego el botón de compartir
- Selecciona "Grabar video"
- Los videos se guardan en la galería del Quest

### Pico
- Usa la función de grabación integrada del sistema
- Los videos se guardan en la memoria interna

Transfiere los videos a tu PC usando un cable USB o mediante la aplicación móvil correspondiente.


