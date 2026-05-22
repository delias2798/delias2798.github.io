import { useEffect } from 'react';
import type { Locale } from '../../types/Locale';
import type { Project } from '../../types/Project';
import { siteConfig } from '../../config/site.config';
import { t } from '../../types/Locale';
import { getProjectYoutubeId } from '../../utils/projectMedia';
import ProjectMediaPlayer from './ProjectMediaPlayer';

interface ProjectModalProps {
    project: Project;
    locale: Locale;
    onClose: () => void;
}

export default function ProjectModal({ project, locale, onClose }: ProjectModalProps) {
    const hasYoutube = Boolean(getProjectYoutubeId(project));

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="project-modal-backdrop"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="project-modal"
                role="dialog"
                aria-labelledby="project-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="project-modal__close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 id="project-modal-title">{project.title}</h2>
                <ProjectMediaPlayer project={project} locale={locale} />
                <p>{project.detailedDescription || project.description}</p>
                <div className="project-modal__tags">
                    {project.technologies.map((tech) => (
                        <span key={tech} className="project-modal__tag">
                            {tech}
                        </span>
                    ))}
                </div>
                {project.externalUrl && !hasYoutube && (
                    <p>
                        <a
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {locale === 'es' ? 'Ver demo / enlace' : 'View demo / link'} ↗
                        </a>
                    </p>
                )}
                <a href="/babylonPortfolio" className="project-modal__cta">
                    {t(siteConfig.babylonCta, locale)}
                </a>
            </div>
        </div>
    );
}
