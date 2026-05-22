import type { Locale } from '../types/Locale';
import { t } from '../types/Locale';
import type { Project, ProjectSource } from '../types/Project';

export function resolveProject(source: ProjectSource, locale: Locale): Project {
    return {
        id: source.id,
        title: t(source.title, locale),
        description: t(source.description, locale),
        detailedDescription: t(source.detailedDescription, locale),
        videoUrl: source.videoUrl,
        thumbnailUrl: source.thumbnailUrl,
        technologies: source.technologies,
        skillIds: source.skillIds,
        date: source.date,
        category: source.category,
        externalUrl: source.externalUrl,
        location: source.location ? t(source.location, locale) : undefined,
    };
}

export function resolveProjects(sources: ProjectSource[], locale: Locale): Project[] {
    return sources.map((s) => resolveProject(s, locale));
}
