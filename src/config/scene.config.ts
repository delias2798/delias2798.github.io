/**
 * Configuración centralizada para la escena 3D
 * Modifica estos valores para personalizar el portfolio sin tocar el código principal
 */

export const SceneConfig = {
    // Configuración de Cámara
    camera: {
        initialAlpha: Math.PI / 2,
        initialBeta: Math.PI / 3,
        initialRadius: 10,
        lowerRadiusLimit: 5,
        upperRadiusLimit: 20,
        lowerBetaLimit: 0.1,
        upperBetaLimit: Math.PI / 2,
        focusDistance: 5, // Distancia de la cámara cuando enfoca una pantalla
        animationDuration: 60, // frames (60 = 1 segundo a 60fps)
    },

    // Configuración de Pantallas
    screen: {
        width: 4,
        aspectRatio: 16 / 9,
        position: {
            x: 0,
            y: 2,
            z: -3,
        },
        autoPlay: true,
        loop: true,
        muted: true,
    },

    // Configuración de Texto 3D
    textPlane: {
        width: 2,
        height: 1.5,
        position: {
            x: 3.5,
            y: 2,
            z: -3,
        },
        textureResolution: {
            width: 512,
            height: 384,
        },
    },

    // Configuración de Objetos Interactivos
    interactiveObjects: {
        spheres: {
            count: 3,
            diameter: 0.3,
            startPosition: { x: -2, y: 1.5, z: 2 },
            spacing: 2,
        },
        cubes: {
            count: 2,
            size: 0.3,
            startPosition: { x: -1, y: 1.5, z: 3 },
            spacing: 2,
        },
        physics: {
            mass: 1,
            restitution: 0.5, // "Bounciness" de esferas
            restitutionCubes: 0.3, // "Bounciness" de cubos
            friction: 0.5,
        },
        fallThreshold: -2, // Y position donde se considera "caído"
    },

    // Configuración del Piso
    ground: {
        width: 20,
        height: 20,
        color: {
            r: 0.2,
            g: 0.2,
            b: 0.25,
        },
    },

    // Configuración de Iluminación
    lighting: {
        hemispheric: {
            intensity: 0.7,
            direction: { x: 0, y: 1, z: 0 },
        },
        directional: {
            intensity: 0.5,
            direction: { x: 1, y: 1, z: -1 },
        },
    },

    // Configuración de Física
    physics: {
        gravity: {
            x: 0,
            y: -9.81,
            z: 0,
        },
    },
};

export default SceneConfig;


