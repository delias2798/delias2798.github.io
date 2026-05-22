import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Animation,
    EasingFunction,
    CircleEase,
    AbstractMesh,
    type Animatable,
} from '@babylonjs/core';

export type CameraState = 'normal' | 'focused';

export class CameraController {
    private camera: ArcRotateCamera;
    private scene: Scene;
    private state: CameraState = 'normal';
    private activeAnimations: Animatable[] = [];

    private readonly originalAlpha: number;
    private readonly originalBeta: number;
    private readonly originalRadius: number;
    private readonly originalTarget: Vector3;

    constructor(camera: ArcRotateCamera, scene: Scene) {
        this.camera = camera;
        this.scene = scene;

        this.originalAlpha = camera.alpha;
        this.originalBeta = camera.beta;
        this.originalRadius = camera.radius;
        this.originalTarget = camera.target.clone();
    }

    /**
     * Enfoca el centro del plano de video, perpendicular a su superficie.
     */
    focusOn(target: Vector3 | AbstractMesh, distance: number = 9, onComplete?: () => void): void {
        if (this.state === 'focused') return;

        this.state = 'focused';
        this.camera.detachControl();
        this.stopCameraAnimations();

        const minR = this.camera.lowerRadiusLimit ?? 5;
        const maxR = this.camera.upperRadiusLimit ?? 30;
        const focusRadius = Math.max(minR, Math.min(distance, maxR));

        const screenCenter = this.resolveScreenCenter(target);
        const viewDirection = this.resolveViewDirection(target, screenCenter);
        const cameraPosition = screenCenter.add(viewDirection.scale(focusRadius));
        const { alpha, beta, radius } = this.sphericalFromOffset(
            cameraPosition.subtract(screenCenter)
        );

        this.animateCamera(
            this.shortestAlpha(this.camera.alpha, alpha),
            beta,
            radius,
            screenCenter,
            onComplete
        );
    }

    reset(onComplete?: () => void): void {
        if (this.state === 'normal') return;

        this.state = 'normal';
        this.stopCameraAnimations();

        this.animateCamera(
            this.originalAlpha,
            this.originalBeta,
            this.originalRadius,
            this.originalTarget.clone(),
            () => {
                this.camera.setTarget(this.originalTarget.clone());
                this.camera.alpha = this.originalAlpha;
                this.camera.beta = this.originalBeta;
                this.camera.radius = this.originalRadius;

                const canvas = this.scene.getEngine().getRenderingCanvas();
                if (canvas) {
                    this.camera.attachControl(canvas, true);
                }
                onComplete?.();
            }
        );
    }

    private resolveScreenCenter(target: Vector3 | AbstractMesh): Vector3 {
        if (target instanceof AbstractMesh) {
            target.computeWorldMatrix(true);
            return target.getAbsolutePosition().clone();
        }
        return target.clone();
    }

    /**
     * Normal del plano hacia el lado desde el que ya se ve la pantalla (misma hemisferio que la cámara actual).
     */
    private resolveViewDirection(
        target: Vector3 | AbstractMesh,
        screenCenter: Vector3
    ): Vector3 {
        const towardViewer = this.camera.position.subtract(screenCenter);
        if (towardViewer.lengthSquared() > 1e-6) {
            if (target instanceof AbstractMesh) {
                target.computeWorldMatrix(true);
                const normal = target.getDirection(Vector3.Forward()).normalize();
                return Vector3.Dot(normal, towardViewer) >= 0
                    ? normal
                    : normal.scale(-1);
            }
            return towardViewer.normalize();
        }

        if (target instanceof AbstractMesh) {
            target.computeWorldMatrix(true);
            return target.forward.normalize();
        }
        return new Vector3(0, 0, 1);
    }

    /** Evita que alpha anime dando la vuelta por el lado opuesto (misma posición, otro hemisferio). */
    private shortestAlpha(from: number, to: number): number {
        let result = to;
        const twoPi = Math.PI * 2;
        while (result - from > Math.PI) {
            result -= twoPi;
        }
        while (result - from < -Math.PI) {
            result += twoPi;
        }
        return result;
    }

    /** Convierte posición relativa al target en alpha/beta/radius de ArcRotateCamera */
    private sphericalFromOffset(offset: Vector3): {
        alpha: number;
        beta: number;
        radius: number;
    } {
        const radius = offset.length();
        if (radius < 0.001) {
            return {
                alpha: this.camera.alpha,
                beta: this.camera.beta,
                radius: 0.001,
            };
        }

        const beta = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));
        const alpha = Math.atan2(offset.z, offset.x);

        return { alpha, beta, radius };
    }

    private stopCameraAnimations(): void {
        for (const anim of this.activeAnimations) {
            anim.stop();
        }
        this.activeAnimations = [];
        this.scene.stopAnimation(this.camera);
    }

    private animateCamera(
        toAlpha: number,
        toBeta: number,
        toRadius: number,
        toTarget: Vector3,
        onComplete?: () => void
    ): void {
        const frameRate = 60;
        const duration = 45;
        const easingFunction = new CircleEase();
        easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

        const start = (property: string, from: number, to: number) => {
            const anim = Animation.CreateAndStartAnimation(
                `cam_${property}_${Date.now()}`,
                this.camera,
                property,
                frameRate,
                duration,
                from,
                to,
                Animation.ANIMATIONLOOPMODE_CONSTANT,
                easingFunction
            );
            if (anim) this.activeAnimations.push(anim);
            return anim;
        };

        start('alpha', this.camera.alpha, toAlpha);
        start('beta', this.camera.beta, toBeta);
        start('radius', this.camera.radius, toRadius);
        start('target.x', this.camera.target.x, toTarget.x);
        start('target.y', this.camera.target.y, toTarget.y);
        start('target.z', this.camera.target.z, toTarget.z);

        const alphaAnim = this.activeAnimations[0];
        if (alphaAnim && onComplete) {
            alphaAnim.onAnimationEndObservable.addOnce(() => {
                this.camera.setTarget(toTarget.clone());
                onComplete();
            });
        } else if (onComplete) {
            onComplete();
        }
    }

    getState(): CameraState {
        return this.state;
    }

    isNormal(): boolean {
        return this.state === 'normal';
    }

    isFocused(): boolean {
        return this.state === 'focused';
    }
}
