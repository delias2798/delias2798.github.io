import {
    Scene,
    MeshBuilder,
    StandardMaterial,
    VideoTexture,
    Vector3,
    Mesh,
    Color3,
    AbstractMesh,
} from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock, Rectangle } from '@babylonjs/gui';
import type { Project } from '../types/Project';

export class ScreenManager {
    private scene: Scene;
    private projects: Project[];
    private currentIndex: number = 0;
    private screen: Mesh;
    private videoTexture?: VideoTexture;
    private material: StandardMaterial;
    private textPlane?: Mesh;
    private advancedTexture?: AdvancedDynamicTexture;
    private onProjectChangeCallback?: (project: Project, index: number) => void;

    constructor(scene: Scene, projects: Project[]) {
        this.scene = scene;
        this.projects = projects;
        
        // Crear la pantalla principal
        this.screen = this.createScreen();
        this.material = new StandardMaterial('screenMaterial', scene);
        this.screen.material = this.material;

        // Crear el plano de texto lateral
        this.createTextPlane();

        // Cargar el primer proyecto
        this.loadProject(0);
    }

    /**
     * Crear la pantalla 3D
     */
    private createScreen(): Mesh {
        // Aspect ratio 16:9
        const width = 4;
        const height = width * (9 / 16);
        
        const screen = MeshBuilder.CreatePlane('screen', {
            width: width,
            height: height
        }, this.scene);

        // Posicionar la pantalla (frente al mueble)
        screen.position = new Vector3(0, 2, -3);
        screen.rotation.y = Math.PI; // Girar hacia la cámara
        screen.isPickable = true; // Pickable para el sistema de enfoque de cámara

        return screen;
    }

    /**
     * Crear plano de texto lateral con GUI
     */
    private createTextPlane(): void {
        // Crear un plano para el texto
        this.textPlane = MeshBuilder.CreatePlane('textPlane', {
            width: 2,
            height: 1.5
        }, this.scene);

        // Posicionar a la derecha de la pantalla
        this.textPlane.position = new Vector3(3.5, 2, -3);
        this.textPlane.rotation.y = Math.PI;
        this.textPlane.isPickable = false; // No interferir con interacciones

        // Crear textura GUI avanzada
        this.advancedTexture = AdvancedDynamicTexture.CreateForMesh(this.textPlane, 512, 384);

        // Container principal
        const container = new Rectangle('textContainer');
        container.width = 1;
        container.height = 1;
        container.thickness = 0;
        container.background = 'rgba(0, 0, 0, 0.7)';
        container.cornerRadius = 10;
        this.advancedTexture.addControl(container);

        // El texto se actualizará en updateTextPlane()
    }

    /**
     * Actualizar el contenido del plano de texto
     */
    private updateTextPlane(project: Project): void {
        if (!this.advancedTexture) return;

        // Limpiar controles anteriores
        this.advancedTexture.getChildren().forEach(child => {
            if (child instanceof TextBlock) {
                this.advancedTexture!.removeControl(child);
            }
        });

        // Título
        const title = new TextBlock('title', project.title);
        title.color = 'white';
        title.fontSize = 36;
        title.fontWeight = 'bold';
        title.textWrapping = true;
        title.top = -100;
        title.height = '80px';
        this.advancedTexture.addControl(title);

        // Descripción
        const description = new TextBlock('description', project.description);
        description.color = '#cccccc';
        description.fontSize = 20;
        description.textWrapping = true;
        description.top = 20;
        description.height = '120px';
        this.advancedTexture.addControl(description);

        // Fecha
        const date = new TextBlock('date', project.date);
        date.color = '#888888';
        date.fontSize = 16;
        date.top = 140;
        date.height = '30px';
        this.advancedTexture.addControl(date);
    }

    /**
     * Cargar un proyecto específico
     */
    private loadProject(index: number): void {
        if (index < 0 || index >= this.projects.length) return;

        this.currentIndex = index;
        const project = this.projects[index];

        // Limpiar video anterior
        if (this.videoTexture) {
            this.videoTexture.dispose();
            this.videoTexture = undefined;
        }

        try {
            // Crear nueva textura de video
            this.videoTexture = new VideoTexture(
                'videoTexture',
                project.videoUrl,
                this.scene,
                false,
                true,
                VideoTexture.TRILINEAR_SAMPLINGMODE,
                {
                    autoPlay: true,
                    loop: true,
                    muted: true
                }
            );

            // Manejar errores de carga de video
            this.videoTexture.video.onerror = () => {
                console.warn(`⚠️ No se pudo cargar el video: ${project.videoUrl}`);
                console.log('ℹ️ Agrega tus videos en public/videos/ - Ver VIDEOS_SETUP.md');
                
                // Usar color de placeholder si el video falla
                this.material.diffuseTexture = null;
                this.material.diffuseColor = new Color3(0.3, 0.3, 0.4);
                this.material.emissiveColor = new Color3(0.1, 0.1, 0.15);
            };

            // Aplicar textura al material
            this.material.diffuseTexture = this.videoTexture;
            this.material.emissiveColor = new Color3(1, 1, 1);
            this.material.backFaceCulling = false;

        } catch (error) {
            console.warn(`⚠️ Error al crear VideoTexture:`, error);
            // Usar color de placeholder
            this.material.diffuseTexture = null;
            this.material.diffuseColor = new Color3(0.3, 0.3, 0.4);
            this.material.emissiveColor = new Color3(0.1, 0.1, 0.15);
        }

        // Actualizar texto lateral
        this.updateTextPlane(project);

        // Callback
        if (this.onProjectChangeCallback) {
            this.onProjectChangeCallback(project, index);
        }
    }

    /**
     * Avanzar al siguiente proyecto
     */
    next(): void {
        const nextIndex = (this.currentIndex + 1) % this.projects.length;
        this.loadProject(nextIndex);
    }

    /**
     * Retroceder al proyecto anterior
     */
    previous(): void {
        const prevIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
        this.loadProject(prevIndex);
    }

    /**
     * Ir a un proyecto específico por índice
     */
    goToProject(index: number): void {
        this.loadProject(index);
    }

    /**
     * Obtener el mesh de la pantalla (para raycasting y enfoque de cámara)
     */
    getScreenMesh(): AbstractMesh {
        return this.screen;
    }

    /**
     * Obtener la posición de la pantalla
     */
    getScreenPosition(): Vector3 {
        return this.screen.position.clone();
    }

    /**
     * Obtener el mesh completo de la pantalla (para enfoque con rotación)
     */
    getScreen(): Mesh {
        return this.screen;
    }

    /**
     * Obtener el proyecto actual
     */
    getCurrentProject(): Project {
        return this.projects[this.currentIndex];
    }

    /**
     * Obtener el índice actual
     */
    getCurrentIndex(): number {
        return this.currentIndex;
    }

    /**
     * Obtener todos los proyectos
     */
    getProjects(): Project[] {
        return this.projects;
    }

    /**
     * Registrar callback para cambios de proyecto
     */
    onProjectChange(callback: (project: Project, index: number) => void): void {
        this.onProjectChangeCallback = callback;
    }

    /**
     * Reproducir/pausar video
     */
    toggleVideo(): void {
        if (!this.videoTexture) return;
        
        const video = this.videoTexture.video;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    /**
     * Limpiar recursos
     */
    dispose(): void {
        if (this.videoTexture) {
            this.videoTexture.dispose();
        }
        this.screen.dispose();
        if (this.textPlane) {
            this.textPlane.dispose();
        }
        this.material.dispose();
    }
}

