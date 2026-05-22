import {
    Scene,
    Mesh,
    Vector3,
    type Camera,
    type Observer,
} from '@babylonjs/core';
import { getYoutubeEmbedUrl } from '../utils/youtube';

/**
 * Iframe de YouTube anclado al plano 3D (proyección de esquinas), no billboard a la cámara.
 */
export class ScreenYoutubeOverlay {
    private readonly halfWidth = 2;
    private readonly halfHeight = 1.125;

    private host: HTMLDivElement | null = null;
    private renderObserver: Observer<Scene> | null = null;
    private activeVideoId: string | null = null;

    private readonly scene: Scene;
    private readonly screenMesh: Mesh;
    private readonly container: HTMLElement;

    constructor(scene: Scene, screenMesh: Mesh, container: HTMLElement) {
        this.scene = scene;
        this.screenMesh = screenMesh;
        this.container = container;
    }

    show(videoId: string): void {
        if (this.activeVideoId === videoId && this.host) return;
        this.hide();

        this.activeVideoId = videoId;
        const host = document.createElement('div');
        host.className = 'screen-youtube-host';

        const iframe = document.createElement('iframe');
        iframe.src = getYoutubeEmbedUrl(videoId);
        iframe.title = 'YouTube';
        iframe.allow =
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';

        host.appendChild(iframe);
        this.container.appendChild(host);
        this.host = host;

        this.renderObserver = this.scene.onBeforeRenderObservable.add(() =>
            this.syncToScreenPlane()
        );
        this.syncToScreenPlane();
    }

    hide(): void {
        if (this.renderObserver) {
            this.scene.onBeforeRenderObservable.remove(this.renderObserver);
            this.renderObserver = null;
        }
        this.host?.remove();
        this.host = null;
        this.activeVideoId = null;
    }

    isActive(): boolean {
        return this.host !== null;
    }

    private getLocalCorners(): Vector3[] {
        const w = this.halfWidth;
        const h = this.halfHeight;
        return [
            new Vector3(-w, h, 0),
            new Vector3(w, h, 0),
            new Vector3(w, -h, 0),
            new Vector3(-w, -h, 0),
        ];
    }

    private syncToScreenPlane(): void {
        const host = this.host;
        if (!host) return;

        const camera = this.scene.activeCamera as Camera | null;
        const engine = this.scene.getEngine();
        const canvas = engine.getRenderingCanvas();
        if (!camera || !canvas) return;

        this.screenMesh.computeWorldMatrix(true);
        const meshPosition = this.screenMesh.getAbsolutePosition();
        const normal = this.screenMesh.getDirection(Vector3.Forward());
        const toCamera = camera.position.subtract(meshPosition);

        if (Vector3.Dot(normal, toCamera) <= 0) {
            host.style.visibility = 'hidden';
            return;
        }

        const worldMatrix = this.screenMesh.getWorldMatrix();
        const transformMatrix = this.scene.getTransformMatrix();
        const viewport = camera.viewport.toGlobal(
            engine.getRenderWidth(),
            engine.getRenderHeight()
        );

        const wrapperRect = this.container.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const scaleX = canvasRect.width / engine.getRenderWidth();
        const scaleY = canvasRect.height / engine.getRenderHeight();

        const screenPoints = this.getLocalCorners().map((local) => {
            const world = Vector3.TransformCoordinates(local, worldMatrix);
            const projected = Vector3.Project(
                world,
                worldMatrix,
                transformMatrix,
                viewport
            );
            return {
                x: canvasRect.left - wrapperRect.left + projected.x * scaleX,
                y: canvasRect.top - wrapperRect.top + projected.y * scaleY,
            };
        });

        const xs = screenPoints.map((p) => p.x);
        const ys = screenPoints.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const width = Math.max(2, maxX - minX);
        const height = Math.max(2, maxY - minY);

        host.style.visibility = 'visible';
        host.style.left = `${minX}px`;
        host.style.top = `${minY}px`;
        host.style.width = `${width}px`;
        host.style.height = `${height}px`;

        const poly = screenPoints
            .map(
                (p) =>
                    `${((p.x - minX) / width) * 100}% ${((p.y - minY) / height) * 100}%`
            )
            .join(', ');
        host.style.clipPath = `polygon(${poly})`;
    }

    dispose(): void {
        this.hide();
    }
}
