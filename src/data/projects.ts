import type { Project } from '../types/Project';

export const projects: Project[] = [
    {
        id: 'vr-project-1',
        title: 'VR Training Simulation',
        description: 'Simulación inmersiva de entrenamiento en realidad virtual',
        detailedDescription: 'Aplicación de entrenamiento en VR desarrollada para Oculus Quest que permite a los usuarios practicar procedimientos complejos en un entorno virtual seguro. Incluye interacciones hápticas, reconocimiento de gestos y feedback en tiempo real.',
        videoUrl: '/videos/project1.mp4',
        technologies: ['BabylonJS', 'WebXR', 'Oculus SDK', 'TypeScript', 'React'],
        date: '2024'
    },
    {
        id: 'vr-project-2',
        title: 'AR Product Visualizer',
        description: 'Visualizador de productos en realidad aumentada',
        detailedDescription: 'Herramienta de visualización en AR que permite a los clientes ver productos en su entorno real antes de comprar. Implementa detección de superficies, iluminación realista y escalado automático usando WebXR.',
        videoUrl: '/videos/project2.mp4',
        technologies: ['BabylonJS', 'WebXR', 'AR.js', 'Three.js', 'React'],
        date: '2024'
    },
    {
        id: 'vr-project-3',
        title: 'XR Collaborative Space',
        description: 'Espacio colaborativo multiusuario en XR',
        detailedDescription: 'Plataforma XR multiusuario que permite colaboración en tiempo real. Los usuarios pueden compartir espacios virtuales, manipular objetos 3D colaborativamente y comunicarse mediante avatares personalizados.',
        videoUrl: '/videos/project3.mp4',
        technologies: ['BabylonJS', 'WebXR', 'WebRTC', 'Socket.io', 'Node.js'],
        date: '2025'
    }
];

