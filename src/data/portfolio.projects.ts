import type { ProjectSource } from '../types/Project';

/**
 * Contenido bilingüe de proyectos.
 * videoUrl: MP4 en public/videos/ — reproduce en pantalla 3D y modal si el archivo existe.
 *   Si el MP4 no está en el repo, el modal y Babylon usan externalUrl (YouTube) automáticamente.
 *   YouTube NO funciona en videoUrl; usar externalUrl para YouTube.
 * externalUrl: demo, repositorio o video en YouTube.
 *
 * Experimentos 1, 2 y DriveDreams: preferir videoUrl local si tienes el archivo;
 * YouTube solo como respaldo vía externalUrl (opcional).
 */
export const portfolioProjectsSource: ProjectSource[] = [
    {
        id: 'ux-research-manatee-ab',
        category: 'research',
        date: '2023',
        location: { es: 'TEC Cartago, Costa Rica', en: 'TEC Cartago, Costa Rica' },
        videoUrl: '/videos/ux-research-manatee-ab.mp4',
        // Mantener MP4 local para la pantalla 3D; externalUrl opcional si publicas en YouTube
        skillIds: ['ux-research', 'ab-testing', 'oculus-quest', 'unity', 'xr-ui'],
        technologies: ['Unity', 'Oculus Quest 2', 'UX Research', 'A/B Testing'],
        title: {
            es: 'Investigación UX: manatí cartoon vs. realista',
            en: 'UX research: cartoon vs. realistic manatee',
        },
        description: {
            es: 'Estudio A/B en VR con 100 participantes comparando estilos visuales y tiempos de respuesta.',
            en: 'VR A/B study with 100 participants comparing visual styles and response times.',
        },
        detailedDescription: {
            es: 'Experimento de usabilidad en realidad virtual que comparó dos escenarios (representación tipo cartoon frente a realista) en una experiencia educativa sobre manatíes. Los participantes recibieron información guiada y avanzaron a un cuestionario; el resultado se determinó según tiempos de respuesta y desempeño en las preguntas. La muestra fue de 100 personas en el TEC de Cartago, Costa Rica, usando headsets Oculus Quest 2.',
            en: 'VR usability experiment comparing two scenarios (cartoon-style vs. realistic representation) in an educational manatee experience. Participants received guided information and moved to a questionnaire; outcomes were determined from response times and quiz performance. The sample included 100 participants at TEC Cartago, Costa Rica, using Oculus Quest 2 headsets.',
        },
    },
    {
        id: 'retail-coffee-vr-vs-physical',
        category: 'research',
        date: '2023',
        location: { es: 'TEC San Carlos, Costa Rica', en: 'TEC San Carlos, Costa Rica' },
        videoUrl: '/videos/retail-coffee-vr-vs-physical.mp4',
        // Mantener MP4 local para la pantalla 3D; externalUrl opcional si publicas en YouTube
        skillIds: [
            'ux-research',
            'ab-testing',
            'pico-vr',
            'tobii',
            'eye-tracking-analytics',
            'unity',
            'oculus-quest',
        ],
        technologies: [
            'Unity',
            'Pico Neo 3 Pro Eye',
            'Tobii (VR + Pro Glasses 3)',
            'Eye Tracking',
            'Retail UX',
        ],
        title: {
            es: 'Compra de café: tienda física vs. VR',
            en: 'Coffee shopping: physical store vs. VR',
        },
        description: {
            es: 'Comparación de comportamiento de compra con presupuesto fijo entre estantería real y virtual.',
            en: 'Purchase behavior comparison with a fixed budget between real and virtual shelving.',
        },
        detailedDescription: {
            es: 'Estudio comparativo en el que una estantería de supermercado mostraba cafés de distintas marcas, precios, sabores y colores. Se contrastó el comportamiento en espacio físico real frente a entorno virtualizado con 65 participantes (21–60 años); cada persona realizó ambas condiciones, alternando el orden de inicio. En la prueba física se usaron Tobii Pro Glasses 3; en VR, Pico Neo 3 Pro Eye con sensores Tobii para análisis ocular. La tarea consistía en elegir café respetando un monto máximo de gasto. Realizado en el TEC de San Carlos, Costa Rica.',
            en: 'Comparative study featuring a supermarket shelf with coffees across brands, prices, flavors, and colors. Physical real-world behavior was compared to a virtualized environment with 65 participants (ages 21–60); each person completed both conditions, counterbalancing which they started with. Physical trials used Tobii Pro Glasses 3; VR used Pico Neo 3 Pro Eye with Tobii sensors for ocular analysis. The task was to select coffee within a maximum spending limit. Conducted at TEC San Carlos, Costa Rica.',
        },
    },
    {
        id: 'drivedreams-xrcc',
        category: 'competition',
        date: '2024',
        location: { es: 'Berlín, Alemania (XRCC)', en: 'Berlin, Germany (XRCC)' },
        videoUrl: '/videos/drivedreams-xrcc.mp4',
        // Mantener MP4 local para la pantalla 3D; externalUrl opcional si publicas en YouTube
        skillIds: ['unity', 'gamification', 'xr-ui', 'oculus-quest', '3d-animation'],
        technologies: ['Unity', 'XR', 'Gamification', 'Team leadership'],
        title: {
            es: 'DriveDreams — XR Creator Con 2024',
            en: 'DriveDreams — XR Creator Con 2024',
        },
        description: {
            es: 'Experiencia XR de gamificación para autos eléctricos en tiempos de carga; mención honorífica.',
            en: 'XR gamification for electric vehicles during charging downtime; honorable mention.',
        },
        detailedDescription: {
            es: 'Proyecto presentado en XR Creator Con (XRCC) 2024 en Berlín, dentro de una competencia con múltiples temas. El equipo eligió automóviles y diseñó una experiencia de gamificación para vehículos eléctricos durante la espera por carga o en tiempo libre. El trabajo obtuvo mención honorífica. Equipo interdisciplinario: 3 desarrolladores VR y 2 diseñadores 3D.',
            en: 'Project presented at XR Creator Con (XRCC) 2024 in Berlin, part of a multi-topic competition. The team chose automotive and built a gamification experience for electric vehicles during charging waits or idle time. The entry received an honorable mention. Interdisciplinary team: 3 VR developers and 2 3D designers.',
        },
    },
    {
        id: 'insta360-quest-capture',
        category: 'prototype',
        date: '2024',
        videoUrl: '/videos/insta360-quest-capture.mp4',
        externalUrl: 'https://www.youtube.com/watch?v=qQsEnf8ugJE',
        skillIds: ['oculus-quest', 'insta360', 'video-streaming'],
        technologies: ['Meta Quest', 'Insta360', 'Video capture pipeline'],
        title: {
            es: 'Captura Insta360 desde Meta Quest',
            en: 'Insta360 capture from Meta Quest',
        },
        description: {
            es: 'Prueba de flujo para grabar video con cámara Insta360 controlada desde el headset.',
            en: 'Proof of flow to record video with Insta360 camera controlled from the headset.',
        },
        detailedDescription: {
            es: 'Prototipo y prueba técnica para tomar video con una cámara Insta360 a partir del entorno Meta Quest, documentando el flujo de captura y sincronización entre dispositivos. Referencia en video público.',
            en: 'Technical prototype and test to capture video with an Insta360 camera from the Meta Quest environment, documenting capture flow and device synchronization. Public video reference available.',
        },
    },
    {
        id: 'accenture-shell-future-station',
        category: 'enterprise',
        date: '2024',
        videoUrl: '/videos/accenture-shell-future-station.mp4',
        externalUrl: 'https://youtu.be/WwG8w639qy0',
        skillIds: [
            'unity',
            'photon',
            'multiplayer-xr',
            'oculus-quest',
            '3d-animation',
            'post-processing',
            'csharp',
        ],
        technologies: [
            'Unity',
            'Photon',
            'Oculus Quest SDK',
            'Multiplayer (5 users)',
            'Animation triggers',
            'Post-processing',
        ],
        title: {
            es: 'Gasolinera del futuro — Shell (Accenture)',
            en: 'Future gas station — Shell (Accenture)',
        },
        description: {
            es: 'Experiencia VR multijugador para visualizar la estación de servicio del futuro.',
            en: 'Multiplayer VR experience showcasing the service station of the future.',
        },
        detailedDescription: {
            es: 'Desarrollo para Accenture de una experiencia inmersiva que presenta la gasolinera del futuro para Shell. Implementado en Unity con Photon para multijugador simultáneo (hasta 5 usuarios), SDK de Oculus Quest, triggers de animación, colliders, post-processing, iluminación y renderizado avanzado, entre otras interacciones espaciales.',
            en: 'Accenture delivery of an immersive experience presenting Shell’s future service station. Built in Unity with Photon for synchronous multiplayer (up to 5 users), Oculus Quest SDK, animation triggers, colliders, post-processing, lighting, and advanced rendering, plus spatial interactions.',
        },
    },
    {
        id: 'ar-pharma',
        category: 'ar',
        date: '2024',
        videoUrl: '/videos/ar-pharma.mp4',
        externalUrl: 'https://youtu.be/UsXFe--YV3w',
        skillIds: ['eighth-wall', 'webxr', 'gamification', 'xr-ui'],
        technologies: ['8th Wall', 'WebAR', 'Head tracking', 'Gamification'],
        title: {
            es: 'AR Pharma — información gamificada',
            en: 'AR Pharma — gamified product information',
        },
        description: {
            es: 'WebAR con seguimiento de cabeza e interacción espacial para comunicar datos del cliente.',
            en: 'WebAR with head tracking and spatial interaction to deliver client information.',
        },
        detailedDescription: {
            es: 'Experiencia de realidad aumentada en navegador con 8th Wall que combina el entorno real con contenido superpuesto. La información del cliente se presenta mediante gamificación, reconocimiento de movimiento de cabeza e interacción con elementos en el espacio.',
            en: 'Browser-based augmented reality with 8th Wall blending the real environment with overlaid content. Client information is delivered through gamification, head-movement recognition, and interaction with spatial UI elements.',
        },
    },
    {
        id: 'polar-bear-game',
        category: 'mobile',
        date: '2023',
        videoUrl: '/videos/polar-bear-game.mp4',
        externalUrl: 'https://youtu.be/NQzNLbvYvuE',
        skillIds: [
            'unity',
            'mobile-dev',
            'navmesh-pathfinding',
            'gamification',
            'ads-monetization',
            'csharp',
        ],
        technologies: ['Unity', 'Mobile', 'NavMesh', 'Ads', 'Reward systems', 'Puzzles'],
        title: {
            es: 'Polar — juego móvil solidario',
            en: 'Polar — charitable mobile game',
        },
        description: {
            es: 'Aventura de puzzles en tres niveles para una fundación sin fines de lucro.',
            en: 'Three-level puzzle adventure for a nonprofit foundation.',
        },
        detailedDescription: {
            es: 'Juego Unity 3D orientado a móvil para una fundación sin fines de lucro. El jugador acompaña a un oso polar que busca reencontrarse con su madre, resolviendo puzzles a lo largo de tres niveles. Incluye tile mapping, pathfinding, configuración de publicidad, estructura de recompensas y progresión.',
            en: 'Unity 3D mobile game for a nonprofit foundation. Players guide a polar bear reuniting with its mother across three puzzle levels. Features include tile mapping, pathfinding, ad configuration, reward structure, and progression systems.',
        },
    },
    {
        id: 'rail-system-babylon',
        category: 'web-3d',
        date: '2024',
        videoUrl: '/videos/rail-system-babylon.mp4',
        externalUrl: 'https://accenture-go.starplatform.cloud/',
        skillIds: ['babylonjs', 'gltf-glb', '3d-animation', 'typescript', 'webxr'],
        technologies: ['Babylon.js', 'WebGL', 'GLB', 'Animation triggers'],
        title: {
            es: 'Espacio 3D — sistema ferroviario',
            en: '3D space — rail system',
        },
        description: {
            es: 'Experiencia web 3D con animaciones GLB y triggers para presentar infraestructura ferroviaria.',
            en: 'Web 3D experience with GLB animations and triggers for rail infrastructure.',
        },
        detailedDescription: {
            es: 'Página y recorrido 3D en el navegador usando Babylon.js. Las animaciones provienen de modelos GLB o están codificadas en runtime; los triggers activan secuencias y puntos de interés del sistema ferroviario.',
            en: 'Browser-based 3D walkthrough using Babylon.js. Animations come from GLB assets or runtime code; triggers drive sequences and points of interest across the rail system presentation.',
        },
    },
    {
        id: 'lume-pad-ecig-commercial',
        category: 'enterprise',
        date: '2024',
        videoUrl: '/videos/lume-pad-ecig-commercial.mp4',
        externalUrl: 'https://youtu.be/qSzE3y7ICB4',
        skillIds: ['unity', 'lume-pad', '3d-animation', 'xr-ui', 'in-app-browser', 'csharp'],
        technologies: ['Unity', 'Lume Pad', 'Lenticular 3D', 'In-app browser', 'SDK'],
        title: {
            es: 'Comercial 3D — Lume Pad (cigarrillo electrónico)',
            en: '3D commercial — Lume Pad (e-cigarette)',
        },
        description: {
            es: 'Pieza publicitaria con parallax lenticular y UI para audiencia meta en tablet Lume Pad.',
            en: 'Advertising piece with lenticular parallax and UI for target audience on Lume Pad tablet.',
        },
        detailedDescription: {
            es: 'Desarrollo en Unity para Lume Pad, tablet con efecto parallax/3D mediante pantalla doble y seguimiento de posición ocular respecto a la cámara. Comercial de producto con múltiples animaciones y UI orientada al público meta. Incluye integración de navegador dentro de la app y uso del SDK específico del dispositivo.',
            en: 'Unity development for Lume Pad, a tablet with parallax/3D via dual-screen lenticular display and eye-position tracking relative to the camera. Product commercial with multiple animations and audience-focused UI. Includes in-app browser integration and device-specific SDK usage.',
        },
    },
    {
        id: 'oracle-medical-consulting-room',
        category: 'enterprise',
        date: '2023',
        videoUrl: '/videos/oracle-medical-consulting-room.mp4',
        externalUrl: 'https://youtu.be/oyAck21PkRM',
        skillIds: ['unity', '3d-animation', 'xr-ui', 'csharp'],
        technologies: ['Unity', 'Video Player', 'Teleport', 'Zone triggers', 'Interactive UI'],
        title: {
            es: 'Oracle — consultorio 3D y base de datos clínica',
            en: 'Oracle — 3D clinic & clinical database',
        },
        description: {
            es: 'Recorrido Unity con escenarios para explicar sistemas de datos en centros de salud.',
            en: 'Unity walkthrough with scenarios explaining data systems in healthcare settings.',
        },
        detailedDescription: {
            es: 'Experiencia en Unity que recrea un consultorio y múltiples escenarios para explicar el uso de un sistema de base de datos en centros médicos. Combina reproductores de video, zonas con triggers, bounding boxes, UI interactivo en espacio real, teletransporte y navegación guiada.',
            en: 'Unity experience recreating a consulting room and multiple scenarios to explain database system usage in medical centers. Combines video players, trigger zones, bounding boxes, spatial interactive UI, teleportation, and guided navigation.',
        },
    },
    {
        id: 'xr-showroom-cascade',
        category: 'web-3d',
        date: '2024',
        videoUrl: '/videos/xr-showroom-cascade.mp4',
        skillIds: ['babylonjs', 'gltf-glb', '3d-animation', 'webxr'],
        technologies: ['Babylon.js', 'Web 3D', 'Showroom', 'Camera views'],
        title: {
            es: 'Showroom XR con cascada y vista superior',
            en: 'XR showroom with waterfall & top view',
        },
        description: {
            es: 'Espacio 3D de exhibición con elementos naturales y vista cenital del recorrido.',
            en: '3D exhibition space with natural elements and a top-down overview of the layout.',
        },
        detailedDescription: {
            es: 'Showroom virtual en 3D que integra una cascada como elemento escénico y una vista desde el top para orientar al visitante en el espacio. Pensado para presentación de productos o experiencias XR en entorno web inmersivo.',
            en: 'Virtual 3D showroom featuring a waterfall as a scenic focal point and a top-down view to orient visitors in the space. Designed for product or XR experience presentation in an immersive web environment.',
        },
    },
    {
        id: 'traverse-platform',
        category: 'platform',
        date: '2024–2025',
        videoUrl: '/videos/traverse-platform.mp4',
        externalUrl: 'https://youtu.be/upkakPvMV9k',
        skillIds: [
            'babylonjs',
            'multiplayer-xr',
            'video-streaming',
            'typescript',
            'gltf-glb',
            'gamification',
        ],
        technologies: [
            'Babylon.js',
            'Multiplayer worlds',
            'Video streaming',
            'Physics',
            'Sliders & presentations',
        ],
        title: {
            es: 'Traverse — plataforma XR web',
            en: 'Traverse — web XR platform',
        },
        description: {
            es: 'Ecosistema web para mundos multijugador, streaming, juegos y presentaciones 3D.',
            en: 'Web ecosystem for multiplayer worlds, streaming, games, and 3D presentations.',
        },
        detailedDescription: {
            es: 'Plataforma completa basada en Babylon.js para crear mundos multijugador en el navegador. Incluye streaming de video (por ejemplo, embarcaciones y autos de carrera), minijuegos, presentaciones con sliders, animaciones, interacción con física y múltiples módulos reutilizables para experiencias XR a escala.',
            en: 'Full platform built on Babylon.js to create multiplayer browser worlds. Includes video streaming (e.g., racing boats and cars), mini-games, slider-based presentations, animations, physics interaction, and reusable modules for scalable XR experiences.',
        },
    },
    {
        id: 'ocean-race-traverse',
        category: 'platform',
        date: '2025',
        videoUrl: '/videos/ocean-race-traverse.mp4',
        externalUrl: 'https://youtu.be/iVa-4weTKkQ',
        skillIds: [
            'babylonjs',
            'digital-twins',
            'video-streaming',
            'typescript',
            'gltf-glb',
        ],
        technologies: ['Babylon.js', 'Traverse', 'Digital twin', 'Live streaming'],
        title: {
            es: 'Ocean Race — regata en Traverse',
            en: 'Ocean Race — regatta on Traverse',
        },
        description: {
            es: 'Carrera náutica con gemelo digital del circuito y seguimiento en vivo de participantes.',
            en: 'Sailing race with digital twin of the course and live participant tracking.',
        },
        detailedDescription: {
            es: 'Implementación sobre la plataforma Traverse para una regata oceánica: visualización virtual de información de la carrera, gemelo digital del lugar donde se disputa el evento y capacidad de seguir el streaming en tiempo real de los participantes durante la competición.',
            en: 'Traverse platform implementation for an ocean regatta: virtual race information overlays, a digital twin of the race location, and real-time streaming follow-along for participants during the event.',
        },
    },
    {
        id: 'skillverse-walmart-ar',
        category: 'ar',
        date: '2024',
        videoUrl: '/videos/skillverse-walmart-ar.mp4',
        skillIds: ['mobile-dev', 'eighth-wall', 'webxr', 'gamification', 'xr-ui'],
        technologies: ['Mobile AR', 'Retail', 'Walmart', 'Gamification'],
        title: {
            es: 'Skillverse — AR móvil (Walmart)',
            en: 'Skillverse — mobile AR (Walmart)',
        },
        description: {
            es: 'Experiencia de realidad aumentada en celular para contexto retail Walmart.',
            en: 'Mobile augmented reality experience for Walmart retail context.',
        },
        detailedDescription: {
            es: 'Experiencia de realidad aumentada en dispositivos móviles desarrollada en el ecosistema Skillverse, orientada a casos de uso retail con Walmart. Combina interacción en el espacio físico del usuario con contenido gamificado y educativo sobre productos o habilidades.',
            en: 'Mobile augmented reality experience built in the Skillverse ecosystem for Walmart retail use cases. Blends interaction in the user’s physical space with gamified, educational content around products or skills.',
        },
    },
    {
        id: 'prisma-blender-pipeline',
        category: 'prototype',
        date: '2024',
        videoUrl: '/videos/prisma-blender-pipeline.mp4',
        externalUrl: 'https://youtu.be/mZPn2bFsvNM',
        skillIds: ['blender', 'product-visualization', '3d-animation', 'gltf-glb'],
        technologies: ['Blender', 'Pipeline', 'Product renders', 'Marketing video'],
        title: {
            es: 'Prisma — pipeline de producto en Blender',
            en: 'Prisma — Blender product pipeline',
        },
        description: {
            es: 'Herramienta para modelar productos realistas y generar fotos y video de marketing.',
            en: 'Tool to model realistic products and generate marketing photos and video.',
        },
        detailedDescription: {
            es: 'Pipeline en Blender que permite modelar un objeto 3D realista y, a partir de él, generar fotografías profesionales del producto y un video listo para promociones y campañas de marketing, acelerando la producción de assets sin sesión fotográfica física.',
            en: 'Blender-based pipeline to model a realistic 3D product and generate professional product stills plus a promotional video for marketing campaigns—speeding asset production without a physical photo shoot.',
        },
    },
    {
        id: 'carwash-unreal-david',
        category: 'prototype',
        date: '2024',
        videoUrl: '/videos/carwash-unreal-david.mp4',
        externalUrl: 'https://youtu.be/kjo17Fn4Doc?si=P1YH5qQ30wMAC2Ac',
        skillIds: ['unreal-engine', '3d-animation', 'csharp'],
        technologies: ['Unreal Engine', 'Supporting development'],
        title: {
            es: 'Carwash — apoyo en Unreal (David)',
            en: 'Carwash — Unreal support (David)',
        },
        description: {
            es: 'Colaboración en tareas secundarias de desarrollo en Unreal en tiempo libre.',
            en: 'Contributed secondary development tasks in Unreal during spare time.',
        },
        detailedDescription: {
            es: 'Apoyo como desarrollador en tareas secundarias para un proyecto de carwash en Unreal Engine (colaboración con David). El trabajo incluyó implementación y pulido de elementos de la experiencia.',
            en: 'Supported secondary development tasks on a carwash project in Unreal Engine (collaboration with David). Work included implementation and polish of experience elements.',
        },
    },
];
