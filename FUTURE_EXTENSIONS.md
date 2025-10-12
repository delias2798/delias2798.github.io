# 🔮 Extensiones Futuras - Portfolio VR/XR

Guía para agregar características avanzadas a tu portfolio BabylonJS.

## 🎮 WebXR - Experiencia VR en Navegador

### 1. Agregar Soporte WebXR Básico

**Instalar dependencias:**
```bash
# Ya tienes @babylonjs/core, no necesitas instalar nada más
```

**Agregar a BabylonScene.tsx:**
```typescript
import { WebXRDefaultExperience } from '@babylonjs/core';

// Después de crear la escena
const xrHelper = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground],
});

// Opcional: Detectar cuando entras/sales de VR
xrHelper.baseExperience.onStateChangedObservable.add((state) => {
    if (state === WebXRState.IN_XR) {
        console.log('Entraste en VR!');
    }
});
```

### 2. Controllers VR (Manos/Controles)

```typescript
// Agregar controles de mano
const xr = await scene.createDefaultXRExperienceAsync();

xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
        // Detectar botones
        motionController.getAllComponentsOfType('trigger').forEach((component) => {
            component.onButtonStateChangedObservable.add((value) => {
                if (value.pressed) {
                    console.log('Trigger presionado!');
                    // Aquí puedes agarrar objetos en VR
                }
            });
        });
    });
});
```

## 🤝 Hápticos - Feedback Táctil

### 1. Hápticos Básicos (WebXR)

```typescript
// src/babylon/HapticsManager.ts
export class HapticsManager {
    private xrHelper: WebXRDefaultExperience;

    constructor(xrHelper: WebXRDefaultExperience) {
        this.xrHelper = xrHelper;
    }

    /**
     * Vibración simple
     */
    pulse(intensity: number = 0.5, duration: number = 100): void {
        this.xrHelper.input.controllers.forEach((controller) => {
            const gamepad = controller.motionController?.gamepad;
            if (gamepad && 'hapticActuators' in gamepad) {
                const actuators = (gamepad as any).hapticActuators;
                if (actuators && actuators[0]) {
                    actuators[0].pulse(intensity, duration);
                }
            }
        });
    }

    /**
     * Vibración al agarrar objeto
     */
    onGrab(): void {
        this.pulse(0.7, 50);
    }

    /**
     * Vibración al soltar objeto
     */
    onRelease(): void {
        this.pulse(0.3, 30);
    }

    /**
     * Vibración al colisionar
     */
    onCollision(strength: number): void {
        const intensity = Math.min(strength * 0.5, 1.0);
        this.pulse(intensity, 100);
    }
}
```

**Integrar en InteractiveObjects.ts:**
```typescript
private grabObject(object: InteractiveObject, distance: number): void {
    this.grabbedObject = object;
    // ... código existente ...
    
    // Agregar feedback háptico
    if (this.hapticsManager) {
        this.hapticsManager.onGrab();
    }
}
```

## 🌐 AR - Realidad Aumentada

### 1. WebXR AR Mode

```typescript
// Crear experiencia AR en lugar de VR
const xrHelper = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
        sessionMode: 'immersive-ar',
    },
});

// Detección de superficies (planes)
const featuresManager = xrHelper.baseExperience.featuresManager;
const planeDetector = featuresManager.enableFeature(
    WebXRFeatureName.PLANE_DETECTION,
    'latest'
) as WebXRPlaneDetector;

planeDetector.onPlaneAddedObservable.add((plane) => {
    console.log('Superficie detectada!', plane);
    
    // Colocar objetos en la superficie
    const planeMesh = MeshBuilder.CreatePlane('detectedPlane', {
        width: plane.polygon.length,
        height: 1,
    });
    planeMesh.position = plane.position;
    planeMesh.rotationQuaternion = plane.rotationQuaternion;
});
```

## 🎯 Hit Test - Colocación Precisa (AR)

```typescript
const hitTest = featuresManager.enableFeature(
    WebXRFeatureName.HIT_TEST,
    'latest'
) as WebXRHitTest;

// Crear marcador de colocación
const marker = MeshBuilder.CreateCylinder('marker', {
    diameter: 0.3,
    height: 0.01,
});
marker.isVisible = false;

// Actualizar posición del marcador
scene.onBeforeRenderObservable.add(() => {
    if (hitTest && xrHelper.baseExperience.state === WebXRState.IN_XR) {
        const results = hitTest.doHitTest(xrHelper.input.xrCamera.position);
        if (results.length > 0) {
            const result = results[0];
            marker.isVisible = true;
            marker.position = result.position;
            marker.rotationQuaternion = result.rotationQuaternion;
        }
    }
});

// Colocar objeto en tap
scene.onPointerDown = () => {
    if (marker.isVisible) {
        // Colocar tu proyecto/pantalla aquí
        screenManager.getScreenMesh().position = marker.position.clone();
    }
};
```

## 🎨 Iluminación Avanzada - IBL y PBR

### 1. Image-Based Lighting

```typescript
import { CubeTexture, PBRMaterial } from '@babylonjs/core';

// Cargar environment texture
const hdrTexture = CubeTexture.CreateFromPrefilteredData(
    '/textures/environment.env',
    scene
);
scene.environmentTexture = hdrTexture;

// Actualizar materiales a PBR
const pbrMaterial = new PBRMaterial('pbr', scene);
pbrMaterial.metallic = 0.0;
pbrMaterial.roughness = 0.5;
pbrMaterial.environmentIntensity = 1.0;
```

## 🌊 Post-Processing - Efectos Visuales

```typescript
import { DefaultRenderingPipeline } from '@babylonjs/core';

// Agregar pipeline de rendering
const pipeline = new DefaultRenderingPipeline(
    'defaultPipeline',
    true,
    scene,
    [camera]
);

// Bloom effect
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.8;
pipeline.bloomWeight = 0.3;

// Tone mapping
pipeline.imageProcessingEnabled = true;
pipeline.imageProcessing.toneMappingEnabled = true;
pipeline.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;

// Chromatic aberration
pipeline.chromaticAberrationEnabled = true;
pipeline.chromaticAberration.aberrationAmount = 30;
```

## 🎤 Reconocimiento de Voz

```typescript
// src/utils/VoiceCommands.ts
export class VoiceCommands {
    private recognition: any;

    constructor() {
        const SpeechRecognition = (window as any).SpeechRecognition || 
                                  (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.lang = 'es-ES';
        }
    }

    start(onCommand: (command: string) => void): void {
        if (!this.recognition) return;

        this.recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase();
            onCommand(command);
        };

        this.recognition.start();
    }

    stop(): void {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

// Uso:
const voiceCommands = new VoiceCommands();
voiceCommands.start((command) => {
    if (command.includes('siguiente')) {
        screenManager.next();
    } else if (command.includes('anterior')) {
        screenManager.previous();
    } else if (command.includes('enfocar')) {
        // Enfocar pantalla
    }
});
```

## 🎭 Avatares y Multiplayer

### 1. Socket.io para Multiplayer

**Instalar:**
```bash
npm install socket.io-client
```

**Cliente:**
```typescript
// src/multiplayer/MultiplayerManager.ts
import io from 'socket.io-client';

export class MultiplayerManager {
    private socket: any;
    private avatars: Map<string, Mesh> = new Map();

    constructor(scene: Scene) {
        this.socket = io('wss://tu-servidor.com');
        
        // Recibir posición de otros usuarios
        this.socket.on('playerMoved', (data: any) => {
            this.updateAvatar(data.id, data.position);
        });

        // Enviar tu posición
        scene.onBeforeRenderObservable.add(() => {
            const camera = scene.activeCamera;
            if (camera) {
                this.socket.emit('move', {
                    position: camera.position,
                    rotation: camera.rotation,
                });
            }
        });
    }

    private updateAvatar(id: string, position: Vector3): void {
        let avatar = this.avatars.get(id);
        if (!avatar) {
            // Crear nuevo avatar
            avatar = MeshBuilder.CreateSphere(id, { diameter: 0.5 });
            this.avatars.set(id, avatar);
        }
        avatar.position = position;
    }
}
```

## 📊 Analytics - Rastreo de Interacciones

```typescript
// src/analytics/PortfolioAnalytics.ts
export class PortfolioAnalytics {
    private events: any[] = [];

    trackProjectView(projectId: string, duration: number): void {
        this.logEvent('project_view', {
            project_id: projectId,
            duration: duration,
            timestamp: Date.now(),
        });
    }

    trackObjectGrab(objectName: string): void {
        this.logEvent('object_grabbed', {
            object: objectName,
            timestamp: Date.now(),
        });
    }

    trackCameraFocus(targetPosition: Vector3): void {
        this.logEvent('camera_focus', {
            position: {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
            },
            timestamp: Date.now(),
        });
    }

    private logEvent(eventName: string, data: any): void {
        this.events.push({ event: eventName, ...data });
        
        // Enviar a Google Analytics, Mixpanel, etc.
        if ((window as any).gtag) {
            (window as any).gtag('event', eventName, data);
        }
    }

    exportData(): string {
        return JSON.stringify(this.events, null, 2);
    }
}
```

## 🎬 Grabación de Sesiones

```typescript
// src/utils/SessionRecorder.ts
export class SessionRecorder {
    private recording: boolean = false;
    private frames: any[] = [];

    startRecording(camera: Camera): void {
        this.recording = true;
        this.frames = [];

        const recordFrame = () => {
            if (!this.recording) return;

            this.frames.push({
                position: camera.position.clone(),
                rotation: camera.rotation.clone(),
                timestamp: Date.now(),
            });

            requestAnimationFrame(recordFrame);
        };

        recordFrame();
    }

    stopRecording(): void {
        this.recording = false;
    }

    exportRecording(): Blob {
        const data = JSON.stringify(this.frames);
        return new Blob([data], { type: 'application/json' });
    }

    playback(camera: Camera, frames: any[]): void {
        let index = 0;
        const playFrame = () => {
            if (index >= frames.length) return;

            const frame = frames[index];
            camera.position = frame.position;
            camera.rotation = frame.rotation;

            index++;
            setTimeout(playFrame, 16); // ~60fps
        };

        playFrame();
    }
}
```

## 🔐 Integración con Backend

```typescript
// src/api/projects.api.ts
export class ProjectsAPI {
    private baseUrl = 'https://tu-api.com';

    async fetchProjects(): Promise<Project[]> {
        const response = await fetch(`${this.baseUrl}/projects`);
        return response.json();
    }

    async trackView(projectId: string): Promise<void> {
        await fetch(`${this.baseUrl}/projects/${projectId}/view`, {
            method: 'POST',
        });
    }

    async uploadVideo(projectId: string, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('video', file);

        const response = await fetch(
            `${this.baseUrl}/projects/${projectId}/video`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();
        return data.videoUrl;
    }
}
```

## 🎯 Próximos Pasos Recomendados

1. **Prioridad Alta:**
   - ✅ WebXR básico (inmersivo en VR)
   - ✅ Hápticos simples (pulse en agarrar/soltar)

2. **Prioridad Media:**
   - AR mode con hit testing
   - Post-processing (bloom, tone mapping)
   - Analytics básico

3. **Prioridad Baja (Showcase avanzado):**
   - Multiplayer
   - Reconocimiento de voz
   - Grabación de sesiones

## 📚 Recursos

- **WebXR:** https://doc.babylonjs.com/features/featuresDeepDive/webXR
- **Haptics:** https://www.w3.org/TR/gamepad/#gamepadvibrationactuator-interface
- **Socket.io:** https://socket.io/docs/v4/
- **PBR Materials:** https://doc.babylonjs.com/features/featuresDeepDive/materials/using/introToPBR

---

**Nota:** Todas estas extensiones son opcionales. Tu portfolio ya está completamente funcional y muestra tu expertise en BabylonJS, Web3D, React, y VR/AR/XR. Estas extensiones son para llevar el portfolio al siguiente nivel. 🚀


