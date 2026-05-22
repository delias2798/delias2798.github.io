import type { Skill, SkillCategory } from '../types/Skill';
import type { LocalizedString } from '../types/Locale';

const skill = (
    id: string,
    name: LocalizedString,
    category: SkillCategory
): Skill => ({ id, name, category });

/** Catálogo maestro de skills — usado en perfil y etiquetas de proyectos */
export const skillsCatalog: Skill[] = [
    skill('unity', { es: 'Unity', en: 'Unity' }, 'engines'),
    skill('babylonjs', { es: 'Babylon.js', en: 'Babylon.js' }, 'engines'),
    skill('unreal-engine', { es: 'Unreal Engine', en: 'Unreal Engine' }, 'engines'),
    skill('oculus-quest', { es: 'Meta Quest / Oculus SDK', en: 'Meta Quest / Oculus SDK' }, 'xr-hardware'),
    skill('pico-vr', { es: 'Pico VR', en: 'Pico VR' }, 'xr-hardware'),
    skill('tobii', { es: 'Tobii eye tracking', en: 'Tobii eye tracking' }, 'xr-hardware'),
    skill('lume-pad', { es: 'Lume Pad (lenticular 3D)', en: 'Lume Pad (lenticular 3D)' }, 'xr-hardware'),
    skill('insta360', { es: 'Insta360', en: 'Insta360' }, 'xr-hardware'),
    skill('photon', { es: 'Photon multiplayer', en: 'Photon multiplayer' }, 'networking'),
    skill('eighth-wall', { es: '8th Wall WebAR', en: '8th Wall WebAR' }, 'web-ar'),
    skill('webxr', { es: 'WebXR', en: 'WebXR' }, 'web-ar'),
    skill('ux-research', { es: 'Investigación UX', en: 'UX research' }, 'research'),
    skill('ab-testing', { es: 'Pruebas A/B', en: 'A/B testing' }, 'research'),
    skill('eye-tracking-analytics', { es: 'Analítica de eye tracking', en: 'Eye-tracking analytics' }, 'research'),
    skill('gamification', { es: 'Gamificación', en: 'Gamification' }, 'design'),
    skill('xr-ui', { es: 'UI/UX en XR', en: 'XR UI/UX' }, 'design'),
    skill('3d-animation', { es: 'Animación 3D y triggers', en: '3D animation & triggers' }, 'design'),
    skill('blender', { es: 'Blender', en: 'Blender' }, 'design'),
    skill(
        'product-visualization',
        { es: 'Visualización de producto', en: 'Product visualization' },
        'design'
    ),
    skill('csharp', { es: 'C#', en: 'C#' }, 'programming'),
    skill('typescript', { es: 'TypeScript', en: 'TypeScript' }, 'programming'),
    skill('mobile-dev', { es: 'Desarrollo móvil', en: 'Mobile development' }, 'programming'),
    skill('navmesh-pathfinding', { es: 'NavMesh y pathfinding', en: 'NavMesh & pathfinding' }, 'programming'),
    skill('gltf-glb', { es: 'glTF / GLB', en: 'glTF / GLB' }, 'programming'),
    skill('video-streaming', { es: 'Video streaming', en: 'Video streaming' }, 'platform'),
    skill('digital-twins', { es: 'Gemelos digitales', en: 'Digital twins' }, 'platform'),
    skill('multiplayer-xr', { es: 'XR multijugador', en: 'Multiplayer XR' }, 'platform'),
    skill('post-processing', { es: 'Post-processing', en: 'Post-processing' }, 'platform'),
    skill('in-app-browser', { es: 'Navegador in-app', en: 'In-app browser' }, 'platform'),
    skill('ads-monetization', { es: 'Ads y monetización', en: 'Ads & monetization' }, 'platform'),
];

export const skillsById: Record<string, Skill> = Object.fromEntries(
    skillsCatalog.map((s) => [s.id, s])
);

export const skillCategoryLabels: Record<
    SkillCategory,
    { es: string; en: string }
> = {
    engines: { es: 'Motores 3D', en: '3D engines' },
    'xr-hardware': { es: 'Hardware XR', en: 'XR hardware' },
    networking: { es: 'Red y multijugador', en: 'Networking' },
    'web-ar': { es: 'Web y AR', en: 'Web & AR' },
    research: { es: 'Investigación', en: 'Research' },
    design: { es: 'Diseño y contenido', en: 'Design & content' },
    programming: { es: 'Programación', en: 'Programming' },
    platform: { es: 'Plataforma y producto', en: 'Platform & product' },
};
