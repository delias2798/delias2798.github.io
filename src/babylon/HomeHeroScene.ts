import {
    ArcRotateCamera,
    Color4,
    Engine,
    HemisphericLight,
    PointsCloudSystem,
    Scene,
    Vector3,
} from '@babylonjs/core';
import type { CloudPoint } from '@babylonjs/core/Particles/cloudPoint';

export interface HomeHeroSceneOptions {
    /** Ref compartido con React: true cuando el label central está visible */
    revealRef: { current: boolean };
    onRevealChange?: (revealed: boolean) => void;
}

export interface HomeHeroSceneHandles {
    engine: Engine;
    scene: Scene;
    dispose: () => void;
}

const PARTICLE_COUNT = 4200;
const SPHERE_RADIUS = 1.65;
const POINT_COLOR = new Color4(0.0, 0.27, 0.0, 0.75);
/** Radio normalizado del canvas (0.5 = borde) para abrir el CTA */
const CENTER_CLICK_RATIO_OPEN = 0.22;
/** Zona más amplia al cerrar para volver al estado inicial con un segundo clic */
const CENTER_CLICK_RATIO_CLOSE = 0.42;

function buildSpherePositions(count: number, radius: number): Float32Array {
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        positions[i * 3] = Math.cos(theta) * r * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    }

    return positions;
}

function isNearCanvasCenter(
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement,
    ratio: number,
): boolean {
    const rect = canvas.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width - 0.5;
    const ny = (clientY - rect.top) / rect.height - 0.5;
    const dist = Math.sqrt(nx * nx + ny * ny);
    return dist < ratio;
}

export function createHomeHeroScene(
    canvas: HTMLCanvasElement,
    options: HomeHeroSceneOptions,
): HomeHeroSceneHandles {
    const { revealRef, onRevealChange } = options;

    const engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(1, 1, 1, 1);

    const camera = new ArcRotateCamera(
        'heroCam',
        -Math.PI / 2.4,
        Math.PI / 2.35,
        5.2,
        Vector3.Zero(),
        scene,
    );
    camera.lowerRadiusLimit = 4.5;
    camera.upperRadiusLimit = 6;
    camera.wheelPrecision = 120;
    camera.panningSensibility = 0;

    new HemisphericLight('heroLight', new Vector3(0.2, 1, 0.3), scene).intensity = 1.05;

    const basePositions = buildSpherePositions(PARTICLE_COUNT, SPHERE_RADIUS);
    const currentPositions = new Float32Array(basePositions);

    const pcs = new PointsCloudSystem('pointSphere', 6, scene, { updatable: true });
    pcs.computeParticleRotation = false;

    pcs.addPoints(PARTICLE_COUNT, (particle: CloudPoint, i: number) => {
        const i3 = i * 3;
        particle.position = new Vector3(
            basePositions[i3]!,
            basePositions[i3 + 1]!,
            basePositions[i3 + 2]!,
        );
        particle.color = POINT_COLOR.clone();
    });

    const pointer = { x: 0, y: 0 };
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let smoothReveal = 0;
    let explosionWave = 0;
    let explosionStartTime = 0;
    let meshReady = false;

    const onPointerMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onPointerLeave = () => {
        pointer.x = 0;
        pointer.y = 0;
    };

    const onPointerDown = (e: PointerEvent) => {
        const clickRatio = revealRef.current
            ? CENTER_CLICK_RATIO_CLOSE
            : CENTER_CLICK_RATIO_OPEN;
        if (!isNearCanvasCenter(e.clientX, e.clientY, canvas, clickRatio)) return;
        const opening = !revealRef.current;
        revealRef.current = opening;
        if (opening) {
            explosionWave = 1;
            explosionStartTime = performance.now();
        } else {
            explosionWave = 0;
        }
        onRevealChange?.(revealRef.current);
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);

    pcs.buildMeshAsync().then(() => {
        meshReady = true;
    });

    let autoAlpha = -Math.PI / 2.4;

    scene.onBeforeRenderObservable.add(() => {
        smoothPointerX += (pointer.x - smoothPointerX) * 0.08;
        smoothPointerY += (pointer.y - smoothPointerY) * 0.08;

        if (!revealRef.current) {
            explosionWave = 0;
        }

        const targetReveal = revealRef.current ? 1 : 0;
        const revealLerp = targetReveal > smoothReveal ? 0.14 : 0.055;
        smoothReveal += (targetReveal - smoothReveal) * revealLerp;

        const waveElapsed = (performance.now() - explosionStartTime) / 1000;
        const waveEnvelope = explosionWave * Math.max(0, 1 - waveElapsed / 0.5);
        const waveCurve = Math.sin(waveEnvelope * Math.PI) * waveEnvelope;
        const revealActive = smoothReveal + waveCurve * 0.35;

        autoAlpha += 0.0015;
        camera.alpha = autoAlpha + smoothPointerX * 0.35;
        camera.beta = Math.PI / 2.35 + smoothPointerY * 0.12;

        const mouseFactor = Math.max(0, 1 - smoothReveal * 0.85);
        const influenceX = smoothPointerX * 2.8 * mouseFactor;
        const influenceY = smoothPointerY * 2.8 * mouseFactor;
        const time = performance.now() * 0.001;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            let bx = basePositions[i3]!;
            let by = basePositions[i3 + 1]!;
            let bz = basePositions[i3 + 2]!;

            if (smoothReveal < 0.15 && waveCurve < 0.05) {
                const breathe =
                    1 + Math.sin(time * 1.2 + bx * 2 + by * 2) * 0.018;
                bx *= breathe;
                by *= breathe;
                bz *= breathe;
            }

            const expandScale = 1 + smoothReveal * 0.28 + waveCurve * 0.62;
            bx *= expandScale;
            by *= expandScale;
            bz *= expandScale;

            const dx = bx - influenceX;
            const dy = by - influenceY;
            const dz = bz;
            const distSq = dx * dx + dy * dy + dz * dz;
            const mousePush = Math.exp(-distSq * 1.35) * 0.55 * mouseFactor;

            const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
            const nx = bx / len;
            const ny = by / len;
            const nz = bz / len;

            const radialNorm = len / SPHERE_RADIUS;
            const voidFalloff = Math.exp(-radialNorm * radialNorm * 3.2);

            const shellBurst = revealActive * 0.55 + waveCurve * 1.05;
            const centerVoid = (smoothReveal * 1.25 + waveCurve * 2.1) * voidFalloff;

            const totalPush = mousePush + shellBurst + centerVoid;
            currentPositions[i3] = bx + nx * totalPush;
            currentPositions[i3 + 1] = by + ny * totalPush;
            currentPositions[i3 + 2] = bz + nz * totalPush;

            if (meshReady && pcs.particles[i]) {
                pcs.particles[i]!.position.set(
                    currentPositions[i3]!,
                    currentPositions[i3 + 1]!,
                    currentPositions[i3 + 2]!,
                );
            }
        }

        if (meshReady) {
            pcs.setParticles(0, PARTICLE_COUNT - 1, true);
        }
    });

    engine.runRenderLoop(() => scene.render());

    const resize = () => engine.resize();
    window.addEventListener('resize', resize);

    const dispose = () => {
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerleave', onPointerLeave);
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('resize', resize);
        pcs.dispose();
        scene.dispose();
        engine.dispose();
    };

    return { engine, scene, dispose };
}
