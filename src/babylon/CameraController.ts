import { Scene, ArcRotateCamera, Vector3, Animation, EasingFunction, CircleEase, AbstractMesh } from '@babylonjs/core';

export type CameraState = 'normal' | 'focused';

export class CameraController {
    private camera: ArcRotateCamera;
    private scene: Scene;
    private state: CameraState = 'normal';
    
    // Posición y target originales de la cámara
    private originalAlpha: number;
    private originalBeta: number;
    private originalRadius: number;
    private originalTarget: Vector3;

    constructor(camera: ArcRotateCamera, scene: Scene) {
        this.camera = camera;
        this.scene = scene;
        
        // Guardar estado original
        this.originalAlpha = camera.alpha;
        this.originalBeta = camera.beta;
        this.originalRadius = camera.radius;
        this.originalTarget = camera.target.clone();
    }

    /**
     * Animar la cámara hacia una posición para enfocar un objeto
     * @param target - Posición Vector3 o AbstractMesh del objeto
     * @param distance - Distancia desde el objeto
     * @param onComplete - Callback al terminar animación
     */
    focusOn(target: Vector3 | AbstractMesh, distance: number = 3, onComplete?: () => void): void {
        if (this.state === 'focused') return;
        
        this.state = 'focused';
        this.camera.detachControl();

        let targetPosition: Vector3;
        let optimalAlpha: number;
        let optimalBeta: number;

        // Si el target es un mesh, calcular posición óptima basada en su rotación
        if (target instanceof AbstractMesh) {
            targetPosition = target.position.clone();

            // Obtener la rotación Y del mesh (principal ángulo de rotación para planos)
            const meshRotationY = target.rotation.y;

            // Para estar perpendicular al plano, la cámara debe estar en el lado opuesto
            // Si la pantalla tiene rotation.y = π, queremos alpha = 0 (cámara en +Z mirando hacia -Z)
            // Ajustamos sumando π para estar del lado opuesto
            optimalAlpha = meshRotationY - Math.PI/2;

            // Beta: ligeramente elevado para mejor vista
            optimalBeta = Math.PI / 2.2; // ~82° - ligeramente por encima del nivel

            console.log('📐 Enfocando mesh:', target.name);
            console.log('   Posición mesh:', targetPosition);
            console.log('   Rotación Y del mesh:', (meshRotationY * 180 / Math.PI).toFixed(1), '°');
            console.log('   Alpha calculado:', (optimalAlpha * 180 / Math.PI).toFixed(1), '°');
            console.log('   Beta calculado:', (optimalBeta * 180 / Math.PI).toFixed(1), '°');
            console.log('   → Cámara se posicionará perpendicular al plano');
        } else {
            // Si es solo un Vector3, usar método original
            targetPosition = target.clone();
            const direction = targetPosition.subtract(this.camera.position).normalize();
            
            optimalAlpha = Math.atan2(direction.x, direction.z);
            optimalBeta = Math.acos(direction.y);
        }

        // Crear animaciones
        this.animateCamera(optimalAlpha, optimalBeta, distance, targetPosition, onComplete);
    }

    /**
     * Volver a la posición original de la cámara
     */
    reset(onComplete?: () => void): void {
        if (this.state === 'normal') return;
        
        this.state = 'normal';
        
        this.animateCamera(
            this.originalAlpha,
            this.originalBeta,
            this.originalRadius,
            this.originalTarget,
            () => {
                this.camera.attachControl(this.scene.getEngine().getRenderingCanvas()!, true);
                if (onComplete) onComplete();
            }
        );
    }

    /**
     * Crear animaciones suaves para la cámara
     */
    private animateCamera(
        toAlpha: number,
        toBeta: number,
        toRadius: number,
        toTarget: Vector3,
        onComplete?: () => void
    ): void {
        const frameRate = 60;
        const duration = 60; // 1 segundo

        // Easing function para animación suave
        const easingFunction = new CircleEase();
        easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

        // Animación Alpha
        const alphaAnimation = Animation.CreateAndStartAnimation(
            'cameraAlpha',
            this.camera,
            'alpha',
            frameRate,
            duration,
            this.camera.alpha,
            toAlpha,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            easingFunction
        );

        // Animación Beta
        Animation.CreateAndStartAnimation(
            'cameraBeta',
            this.camera,
            'beta',
            frameRate,
            duration,
            this.camera.beta,
            toBeta,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            easingFunction
        );

        // Animación Radius
        Animation.CreateAndStartAnimation(
            'cameraRadius',
            this.camera,
            'radius',
            frameRate,
            duration,
            this.camera.radius,
            toRadius,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            easingFunction
        );

        // Animación Target (x, y, z por separado)
        Animation.CreateAndStartAnimation(
            'cameraTargetX',
            this.camera,
            'target.x',
            frameRate,
            duration,
            this.camera.target.x,
            toTarget.x,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            easingFunction
        );

        Animation.CreateAndStartAnimation(
            'cameraTargetY',
            this.camera,
            'target.y',
            frameRate,
            duration,
            this.camera.target.y,
            toTarget.y,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            easingFunction
        );

        Animation.CreateAndStartAnimation(
            'cameraTargetZ',
            this.camera,
            'target.z',
            frameRate,
            duration,
            this.camera.target.z,
            toTarget.z,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            easingFunction
        );

        // Callback cuando termina la animación
        if (alphaAnimation && onComplete) {
            alphaAnimation.onAnimationEndObservable.addOnce(() => {
                onComplete();
            });
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


