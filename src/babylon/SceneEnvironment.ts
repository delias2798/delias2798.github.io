import {
    Color3,
    Color4,
    HDRCubeTexture,
    Mesh,
    MeshBuilder,
    PBRMaterial,
    StandardMaterial,
    Texture,
    type Scene,
} from '@babylonjs/core';
import '@babylonjs/core/Materials/Textures/Loaders/hdrTextureLoader';
import { SceneConfig } from '../config/scene.config';

export interface PortfolioEnvironmentResult {
    texture: HDRCubeTexture;
    skybox: Mesh;
}

function loadHdrCube(url: string, scene: Scene, size: number): Promise<HDRCubeTexture> {
    return new Promise((resolve, reject) => {
        const hdr = new HDRCubeTexture(
            url,
            scene,
            size,
            false,
            true,
            false,
            false,
            () => resolve(hdr),
            (message, exception) => {
                reject(
                    new Error(message ?? 'No se pudo cargar el HDR', { cause: exception }),
                );
            },
        );
        hdr.isBlocking = true;
    });
}

function createHdrSkybox(scene: Scene, hdr: HDRCubeTexture, diameter: number): Mesh {
    const skybox = MeshBuilder.CreateSphere(
        'portfolioHdrSkybox',
        { diameter, segments: 48, sideOrientation: Mesh.BACKSIDE },
        scene,
    );
    const skyMaterial = new StandardMaterial('portfolioHdrSkyMaterial', scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.reflectionTexture = hdr;
    skyMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyMaterial.diffuseColor = Color3.Black();
    skyMaterial.specularColor = Color3.Black();
    skyMaterial.disableLighting = true;
    skybox.material = skyMaterial;
    skybox.infiniteDistance = true;
    skybox.isPickable = false;
    return skybox;
}

/** Piso metálico suave: usa scene.environmentTexture (no reflectionTexture manual). */
export function createEnvironmentGroundMaterial(
    scene: Scene,
    name: string,
): PBRMaterial {
    const mat = new PBRMaterial(name, scene);
    mat.albedoColor = new Color3(0.22, 0.22, 0.24);
    mat.metallic = 0.12;
    mat.roughness = 0.82;
    mat.environmentIntensity = SceneConfig.environment.intensity;
    return mat;
}

/**
 * Una sola instancia HDR: cubemap completo para cielo + IBL en el piso (PBR).
 * Sin prefiltrado en carga (evita cielo negro/blanco y reflejos “cortados”).
 */
export async function setupPortfolioEnvironment(
    scene: Scene,
): Promise<PortfolioEnvironmentResult> {
    const { hdrUrl, intensity, skyboxScale, cubemapSize, skyRotationY } =
        SceneConfig.environment;

    const hdr = await loadHdrCube(hdrUrl, scene, cubemapSize);

    if (skyRotationY) {
        hdr.rotationY = skyRotationY;
    }

    scene.environmentTexture = hdr;
    scene.environmentIntensity = intensity;
    scene.clearColor = new Color4(0, 0, 0, 1);

    const skybox = createHdrSkybox(scene, hdr, skyboxScale);

    return { texture: hdr, skybox };
}
