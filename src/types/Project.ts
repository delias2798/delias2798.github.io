import type { LocalizedString } from './Locale';

export type ProjectCategory =
    | 'research'
    | 'enterprise'
    | 'competition'
    | 'platform'
    | 'mobile'
    | 'web-3d'
    | 'ar'
    | 'prototype';

/** Proyecto resuelto para un idioma (UI y escena 3D) */
export interface Project {
    id: string;
    title: string;
    description: string;
    detailedDescription: string;
    videoUrl: string;
    thumbnailUrl?: string;
    technologies: string[];
    /** IDs de skills (ver src/data/skills.ts) */
    skillIds: string[];
    date: string;
    category: ProjectCategory;
    externalUrl?: string;
    location?: string;
}

/** Fuente bilingüe — editar aquí las descripciones */
export interface ProjectSource {
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    detailedDescription: LocalizedString;
    technologies: string[];
    skillIds: string[];
    videoUrl: string;
    thumbnailUrl?: string;
    externalUrl?: string;
    date: string;
    category: ProjectCategory;
    location?: LocalizedString;
}
