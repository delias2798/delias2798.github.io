import { CubeTexture, Scene } from '@babylonjs/core';
import { SceneConfig } from '../config/scene.config';

/**
 * Carga el HDR de public/ como environment map y skybox.
 */
export function setupPortfolioEnvironment(scene: Scene): CubeTexture {
    const { hdrUrl, intensity, skyboxScale, skyboxBlur } = SceneConfig.environment;

    const envTexture = CubeTexture.CreateFromPrefilteredData(hdrUrl, scene);
    scene.environmentTexture = envTexture;
    scene.environmentIntensity = intensity;

    scene.createDefaultSkybox(envTexture, true, skyboxScale, skyboxBlur, false);

    return envTexture;
}
