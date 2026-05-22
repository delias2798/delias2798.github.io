import {
    Scene,
    MeshBuilder,
    StandardMaterial,
    VideoTexture,
    DynamicTexture,
    Vector3,
    Mesh,
    Color3,
    AbstractMesh,
    type BaseTexture,
} from '@babylonjs/core';
import type { Project } from '../types/Project';
import type { ScreenMediaState } from '../types/ScreenMedia';
import { localVideoExists } from '../utils/localVideo';
import { getYoutubeVideoId, isYoutubeUrl } from '../utils/youtube';
import { ScreenYoutubeOverlay } from './ScreenYoutubeOverlay';

export class ScreenManager {
    private scene: Scene;
    private projects: Project[];
    private currentIndex: number = 0;
    private screen: Mesh;
    private videoTexture?: VideoTexture;
    private screenTexture?: DynamicTexture;
    /** Textura base del plano — nunca se deja el material sin textura */
    private idleTexture: DynamicTexture;
    private material: StandardMaterial;
    private onProjectChangeCallback?: (project: Project, index: number) => void;
    private onMediaStateChangeCallback?: (state: ScreenMediaState) => void;
    private loadGeneration = 0;
    private youtubeOverlay: ScreenYoutubeOverlay;

    constructor(scene: Scene, projects: Project[], overlayContainer: HTMLElement) {
        this.scene = scene;
        this.projects = projects;

        this.screen = this.createScreen();
        this.material = new StandardMaterial('portfolioScreenMaterial', scene);
        this.material.specularColor = new Color3(0.1, 0.1, 0.1);
        this.material.backFaceCulling = false;
        this.screen.material = this.material;

        this.idleTexture = this.createIdleTexture();
        this.applyScreenTexture(this.idleTexture);

        this.youtubeOverlay = new ScreenYoutubeOverlay(
            scene,
            this.screen,
            overlayContainer
        );

        void this.loadProject(0);
    }

    private createScreen(): Mesh {
        const width = 4;
        const height = width * (9 / 16);

        const screen = MeshBuilder.CreatePlane(
            'portfolioScreen',
            { width, height },
            this.scene
        );

        screen.position = new Vector3(0, 2, -3);
        screen.rotation.y = Math.PI;
        screen.isPickable = true;

        return screen;
    }

    private createIdleTexture(): DynamicTexture {
        const tex = new DynamicTexture(
            'screenIdle',
            { width: 1280, height: 720 },
            this.scene,
            false
        );
        const ctx = tex.getContext() as CanvasRenderingContext2D;
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, 1280, 720);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
        ctx.lineWidth = 4;
        ctx.strokeRect(24, 24, 1232, 672);
        tex.update();
        return tex;
    }

    private emitMedia(state: ScreenMediaState): void {
        this.onMediaStateChangeCallback?.(state);
    }

    private applyScreenTexture(texture: BaseTexture): void {
        this.material.diffuseTexture = texture;
        this.material.diffuseColor = new Color3(1, 1, 1);
        this.material.emissiveColor = new Color3(0, 0, 0);
        this.material.specularColor = new Color3(0.2, 0.2, 0.2);
    }

    /**
     * Aplica la textura nueva y solo entonces libera la anterior (el plano no parpadea).
     */
    private swapScreenTexture(
        nextTexture: BaseTexture,
        nextVideo?: VideoTexture,
        nextScreen?: DynamicTexture
    ): void {
        const previous = this.material.diffuseTexture;
        const prevVideo = this.videoTexture;
        const prevScreen = this.screenTexture;

        if (nextVideo) {
            this.youtubeOverlay.hide();
        }

        this.applyScreenTexture(nextTexture);
        this.videoTexture = nextVideo;
        this.screenTexture = nextScreen;

        if (prevVideo && prevVideo !== nextTexture) {
            prevVideo.dispose();
        }
        if (
            prevScreen &&
            prevScreen !== nextTexture &&
            prevScreen !== this.idleTexture
        ) {
            prevScreen.dispose();
        }
        if (
            previous &&
            previous !== nextTexture &&
            previous !== prevVideo &&
            previous !== prevScreen &&
            previous !== this.idleTexture
        ) {
            previous.dispose();
        }
    }

    private orientVideoTexture(texture: VideoTexture): void {
        texture.vScale = -1;
    }

    private showYoutubeEmbed(
        project: Project,
        videoId: string,
        generation: number
    ): void {
        if (generation !== this.loadGeneration) return;

        const tex = new DynamicTexture(
            `screenYoutubeBg_${project.id}_${generation}`,
            { width: 16, height: 9 },
            this.scene,
            false
        );
        const ctx = tex.getContext() as CanvasRenderingContext2D;
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, 16, 9);
        tex.update();

        this.swapScreenTexture(tex, undefined, tex);
        this.youtubeOverlay.show(videoId);
        this.emitMedia({ mode: 'youtube-embed', youtubeVideoId: videoId });
    }

    private showPlaceholder(project: Project, generation: number): void {
        this.youtubeOverlay.hide();

        const tex = new DynamicTexture(
            `screenPlaceholder_${project.id}_${generation}`,
            { width: 1280, height: 720 },
            this.scene,
            false
        );

        const ctx = tex.getContext() as CanvasRenderingContext2D;
        ctx.fillStyle = '#14141f';
        ctx.fillRect(0, 0, 1280, 720);
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 48px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const title =
            project.title.length > 40
                ? `${project.title.slice(0, 38)}…`
                : project.title;
        ctx.fillText(title, 640, 300);
        ctx.fillStyle = '#9ca3af';
        ctx.font = '32px system-ui, sans-serif';
        ctx.fillText('No local video', 640, 380);

        tex.update();
        this.swapScreenTexture(tex, undefined, tex);
        this.emitMedia({ mode: 'placeholder' });
    }

    private resolveYoutubeVideoId(project: Project): string | null {
        return (
            getYoutubeVideoId(project.externalUrl) ??
            getYoutubeVideoId(project.videoUrl)
        );
    }

    private fallbackToExternalVideo(project: Project, generation: number): void {
        const youtubeVideoId = this.resolveYoutubeVideoId(project);
        if (youtubeVideoId) {
            this.showYoutubeEmbed(project, youtubeVideoId, generation);
            return;
        }
        this.showPlaceholder(project, generation);
    }

    private loadLocalVideo(project: Project, generation: number): void {
        try {
            const videoTexture = new VideoTexture(
                `screenVideo_${project.id}_${generation}`,
                project.videoUrl,
                this.scene,
                false,
                true,
                VideoTexture.TRILINEAR_SAMPLINGMODE,
                {
                    autoPlay: true,
                    loop: true,
                    muted: true,
                }
            );

            this.orientVideoTexture(videoTexture);

            const swapIn = () => {
                if (generation !== this.loadGeneration) {
                    videoTexture.dispose();
                    return;
                }
                this.swapScreenTexture(videoTexture, videoTexture, undefined);
                this.emitMedia({ mode: 'local' });
            };

            const video = videoTexture.video;

            video.onerror = () => {
                if (generation !== this.loadGeneration) return;
                videoTexture.dispose();
                console.warn(`⚠️ Video no disponible: ${project.videoUrl}`);
                this.fallbackToExternalVideo(project, generation);
            };

            if (video.readyState >= 2) {
                swapIn();
            } else {
                video.onloadeddata = swapIn;
            }
        } catch (error) {
            console.warn('⚠️ Error VideoTexture:', error);
            this.fallbackToExternalVideo(project, generation);
        }
    }

    private async loadProject(index: number): Promise<void> {
        if (index < 0 || index >= this.projects.length) return;

        const generation = ++this.loadGeneration;
        this.currentIndex = index;
        const project = this.projects[index];

        // No limpiar la textura actual: el plano sigue visible hasta el swap

        const youtubeVideoId = this.resolveYoutubeVideoId(project);
        const canUseLocal =
            !isYoutubeUrl(project.videoUrl) &&
            (await localVideoExists(project.videoUrl));
        if (generation !== this.loadGeneration) return;

        if (canUseLocal) {
            this.loadLocalVideo(project, generation);
        } else if (youtubeVideoId) {
            this.showYoutubeEmbed(project, youtubeVideoId, generation);
        } else {
            this.showPlaceholder(project, generation);
        }

        if (generation === this.loadGeneration && this.onProjectChangeCallback) {
            this.onProjectChangeCallback(project, index);
        }
    }

    next(): void {
        void this.loadProject((this.currentIndex + 1) % this.projects.length);
    }

    previous(): void {
        void this.loadProject(
            (this.currentIndex - 1 + this.projects.length) % this.projects.length
        );
    }

    goToProject(index: number): void {
        void this.loadProject(index);
    }

    getScreenMesh(): AbstractMesh {
        return this.screen;
    }

    getScreenPosition(): Vector3 {
        return this.screen.position.clone();
    }

    getScreen(): Mesh {
        return this.screen;
    }

    getCurrentProject(): Project {
        return this.projects[this.currentIndex];
    }

    getCurrentIndex(): number {
        return this.currentIndex;
    }

    getProjects(): Project[] {
        return this.projects;
    }

    setProjects(projects: Project[], keepIndex = true): void {
        this.projects = projects;
        const index = keepIndex
            ? Math.min(this.currentIndex, projects.length - 1)
            : 0;
        void this.loadProject(Math.max(0, index));
    }

    onProjectChange(callback: (project: Project, index: number) => void): void {
        this.onProjectChangeCallback = callback;
    }

    onMediaStateChange(callback: (state: ScreenMediaState) => void): void {
        this.onMediaStateChangeCallback = callback;
    }

    toggleVideo(): void {
        if (!this.videoTexture) return;
        const video = this.videoTexture.video;
        if (video.paused) video.play();
        else video.pause();
    }

    dispose(): void {
        this.youtubeOverlay.dispose();
        if (this.videoTexture) {
            this.videoTexture.dispose();
            this.videoTexture = undefined;
        }
        if (this.screenTexture) {
            this.screenTexture.dispose();
            this.screenTexture = undefined;
        }
        this.idleTexture.dispose();
        this.screen.dispose();
        this.material.dispose();
    }
}
