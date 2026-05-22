import { useEffect, useState } from 'react';
import PageHeader from '../components/site/PageHeader';
import ProjectCard from '../components/site/ProjectCard';
import ProjectModal from '../components/site/ProjectModal';
import LocaleSwitcher from '../components/LocaleSwitcher';
import { getProjects } from '../data/projects';
import { siteConfig } from '../config/site.config';
import type { Locale } from '../types/Locale';
import { t } from '../types/Locale';
import { defaultLocale } from '../data/projects';
import type { Project } from '../types/Project';

const COI_RELOAD_KEY = 'portfolio-projects-coi-reload';

export default function ProjectsPage() {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const [selected, setSelected] = useState<Project | null>(null);
    const projects = getProjects(locale);

    useEffect(() => {
        const isolated =
            typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated;

        if (isolated && !sessionStorage.getItem(COI_RELOAD_KEY)) {
            sessionStorage.setItem(COI_RELOAD_KEY, '1');
            window.location.reload();
            return;
        }

        if (!isolated) {
            sessionStorage.removeItem(COI_RELOAD_KEY);
        }
    }, []);

    return (
        <main className="site-page">
            <div className="site-locale-bar">
                <LocaleSwitcher locale={locale} onChange={setLocale} />
            </div>
            <PageHeader
                label={t(siteConfig.pages.projects.label, locale)}
                title={t(siteConfig.pages.projects.headline, locale)}
            />
            <div className="projects-gallery" role="list">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={() => setSelected(project)}
                    />
                ))}
            </div>
            {selected && (
                <ProjectModal
                    project={selected}
                    locale={locale}
                    onClose={() => setSelected(null)}
                />
            )}
        </main>
    );
}
