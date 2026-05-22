import type { Locale } from '../types/Locale';
import { t } from '../types/Locale';
import type { ProfileSkill } from '../types/Skill';
import { skillCategoryLabels, skillsById } from './skills';
import { portfolioProjectsSource } from './portfolio.projects';

export interface ProfileContent {
    headline: { es: string; en: string };
    summary: { es: string; en: string };
    role: { es: string; en: string };
}

export const profileContent: ProfileContent = {
    role: {
        es: 'Desarrollador XR / VR / AR',
        en: 'XR / VR / AR Developer',
    },
    headline: {
        es: 'Experiencias inmersivas, investigación UX y plataformas 3D web',
        en: 'Immersive experiences, UX research, and web 3D platforms',
    },
    summary: {
        es: 'Desarrollo experiencias en Unity, Babylon.js y WebAR para empresas, competencias internacionales y estudios con usuarios reales. Combino implementación técnica (multijugador, eye tracking, streaming) con validación en campo.',
        en: 'I build experiences in Unity, Babylon.js, and WebAR for enterprises, international competitions, and studies with real users. I combine technical implementation (multiplayer, eye tracking, streaming) with in-the-field validation.',
    },
};

/** Agrega skills únicas desde todos los proyectos, ordenadas por frecuencia */
function buildProfileSkills(): ProfileSkill[] {
    const counts = new Map<string, number>();

    for (const project of portfolioProjectsSource) {
        for (const skillId of project.skillIds) {
            counts.set(skillId, (counts.get(skillId) ?? 0) + 1);
        }
    }

    const skills: ProfileSkill[] = [];

    for (const [id, projectCount] of counts) {
        const skill = skillsById[id];
        if (skill) {
            skills.push({ ...skill, projectCount });
        }
    }

    return skills.sort((a, b) => b.projectCount - a.projectCount);
}

export const profileSkills: ProfileSkill[] = buildProfileSkills();

export function getProfileSkillsByCategory(locale: Locale): Record<string, ProfileSkill[]> {
    const grouped: Record<string, ProfileSkill[]> = {};

    for (const skill of profileSkills) {
        const label = skillCategoryLabels[skill.category][locale];
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(skill);
    }

    return grouped;
}

export function getProfileText(locale: Locale) {
    return {
        role: t(profileContent.role, locale),
        headline: t(profileContent.headline, locale),
        summary: t(profileContent.summary, locale),
    };
}
