import type { LocalizedString } from './Locale';

export type SkillCategory =
    | 'engines'
    | 'xr-hardware'
    | 'networking'
    | 'web-ar'
    | 'research'
    | 'design'
    | 'programming'
    | 'platform';

export interface Skill {
    id: string;
    name: LocalizedString;
    category: SkillCategory;
}

export interface ProfileSkill extends Skill {
    /** Número de proyectos en los que aparece esta skill */
    projectCount: number;
}
