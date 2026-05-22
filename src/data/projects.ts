import type { Locale } from '../types/Locale';
import { portfolioProjectsSource } from './portfolio.projects';
import { resolveProjects } from './resolveProject';

/** Idioma por defecto del portfolio */
export const defaultLocale: Locale = 'en';

/** Proyectos resueltos en el idioma por defecto (compatibilidad con imports existentes) */
export const projects = resolveProjects(portfolioProjectsSource, defaultLocale);

export function getProjects(locale: Locale = defaultLocale) {
    return resolveProjects(portfolioProjectsSource, locale);
}

export { portfolioProjectsSource };
