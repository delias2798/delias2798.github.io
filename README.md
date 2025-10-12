# Portfolio VR/XR - BabylonJS

Portfolio interactivo 3D desarrollado con BabylonJS, React y TypeScript que muestra proyectos de realidad virtual, realidad aumentada y experiencias XR.

## 🌟 Características

- **Pantallas 3D Interactivas:** Visualiza videos de proyectos VR grabados desde Oculus o Pico
- **Sistema de Carrusel:** Navega entre diferentes proyectos con animaciones suaves
- **Física Havok:** Objetos interactivos que puedes agarrar y mover en el espacio 3D
- **Sistema de Cámara Inteligente:** Enfoque automático en pantallas con animaciones fluidas
- **UI Moderna:** Overlays con efecto glassmorphism para información detallada
- **Totalmente Responsivo:** Funciona en desktop, tablet y móvil

## 🛠️ Tecnologías

- **BabylonJS 8.15** - Motor 3D Web
- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Havok Physics** - Motor de física realista
- **Vite** - Build tool ultrarrápido

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para Producción

```bash
npm run build
```

### Deploy a GitHub Pages

```bash
npm run deploy
```

## 📹 Agregar Nuevos Proyectos

### 1. Agregar Videos

Coloca tus videos de proyectos VR en la carpeta `public/videos/`:
- Formato recomendado: MP4 (H.264)
- Resolución: 1920x1080 o superior
- Aspect ratio: 16:9

### 2. Actualizar Datos

Edita `src/data/projects.ts` y agrega un nuevo proyecto al array:

```typescript
{
    id: 'vr-project-4',
    title: 'Mi Nuevo Proyecto',
    description: 'Descripción corta',
    detailedDescription: 'Descripción detallada del proyecto...',
    videoUrl: '/videos/project4.mp4',
    technologies: ['BabylonJS', 'WebXR', 'React'],
    date: '2025'
}
```

¡Eso es todo! El sistema automáticamente incluirá el nuevo proyecto en el carrusel.

## 🎮 Controles

- **Mouse Click en Pantalla:** Enfocar proyecto y mostrar información detallada
- **Mouse Click en Objetos:** Agarrar y mover objetos interactivos
- **ESC / Scroll Down / Click Fuera:** Salir del modo enfoque
- **Flechas en Overlay:** Navegar entre proyectos

## 🏗️ Estructura del Proyecto

```
portafolio-babylon/
├── src/
│   ├── babylon/
│   │   ├── CameraController.ts    # Control de cámara y animaciones
│   │   ├── ScreenManager.ts       # Gestión de pantallas y videos
│   │   └── InteractiveObjects.ts  # Objetos con física Havok
│   ├── components/
│   │   ├── BabylonScene.tsx       # Escena principal
│   │   └── ProjectOverlay.tsx     # UI overlay para proyectos
│   ├── data/
│   │   └── projects.ts            # Datos de proyectos
│   ├── types/
│   │   └── Project.ts             # TypeScript types
│   └── styles/
│       └── ProjectOverlay.css     # Estilos del overlay
├── public/
│   ├── models/                    # Modelos 3D (.glb)
│   └── videos/                    # Videos de proyectos VR
└── package.json
```

## 🎨 Personalización

### Cambiar Posiciones de Pantallas

Edita `src/babylon/ScreenManager.ts`, método `createScreen()`:

```typescript
screen.position = new Vector3(x, y, z);
```

### Ajustar Cantidad de Objetos Interactivos

Edita `src/babylon/InteractiveObjects.ts`, método `createObjects()`:

```typescript
// Cambiar cantidad de esferas o cubos
for (let i = 0; i < 5; i++) { // Modifica el número
    // ...
}
```

### Personalizar Colores y Estilos

Edita `src/styles/ProjectOverlay.css` y `src/App.css`

## 📝 Próximas Características

- [ ] Soporte para hápticos
- [ ] Integración WebXR para VR en navegador
- [ ] Modo AR con detección de superficies
- [ ] Multiplayer con WebRTC
- [ ] Editor visual de escenas
- [ ] Analytics de interacciones

## 🤝 Contribuciones

Este es mi portfolio personal, pero si tienes sugerencias o encuentras bugs, siéntete libre de abrir un issue.

## 📄 Licencia

MIT License - Siéntete libre de usar este código para tu propio portfolio.

---

**Desarrollado con ❤️ usando BabylonJS, React y TypeScript**

## Deploy Instructions

```bash
# En main:
git add .
git commit -m "Update portfolio"
git push -u origin main
npm run deploy
```
