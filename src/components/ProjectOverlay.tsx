import React from 'react';
import type { Locale } from '../types/Locale';
import type { Project } from '../types/Project';
import { getSkillNames } from '../utils/skills';
import { getYoutubeWatchUrl } from '../utils/youtube';
import '../styles/ProjectOverlay.css';

interface ProjectOverlayProps {
    project: Project | null;
    isVisible: boolean;
    locale: Locale;
    youtubeVideoId?: string | null;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
    currentIndex: number;
    totalProjects: number;
}

const ui = {
    date: { es: 'Fecha', en: 'Date' },
    location: { es: 'Ubicación', en: 'Location' },
    technologies: { es: 'Tecnologías', en: 'Technologies' },
    skills: { es: 'Habilidades', en: 'Skills' },
    externalLink: { es: 'Ver demo / video', en: 'View demo / video' },
    watchYoutube: { es: 'Ver video en YouTube', en: 'Watch on YouTube' },
    youtubeOnScreen: {
        es: 'El video se reproduce en la pantalla 3D; si no carga, ábrelo en YouTube.',
        en: 'Video plays on the 3D screen; if it does not load, open it on YouTube.',
    },
    hint: {
        es: 'Presiona ESC o haz clic fuera para salir',
        en: 'Press ESC or click outside to exit',
    },
    close: { es: 'Cerrar', en: 'Close' },
    prev: { es: 'Proyecto anterior', en: 'Previous project' },
    next: { es: 'Siguiente proyecto', en: 'Next project' },
};

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({
    project,
    isVisible,
    locale,
    youtubeVideoId,
    onClose,
    onNext,
    onPrevious,
    currentIndex,
    totalProjects
}) => {
    if (!project || !isVisible) return null;

    const skillNames = getSkillNames(project.skillIds, locale);

    return (
        <div className="project-overlay">
            <div className="overlay-content">
                <button className="close-button" onClick={onClose} aria-label={ui.close[locale]}>
                    ×
                </button>

                <div className="project-info-scroll">
                    <h1 className="project-title">{project.title}</h1>

                    {youtubeVideoId && (
                        <div className="project-youtube-notice">
                            <p>{ui.youtubeOnScreen[locale]}</p>
                            <a
                                className="project-youtube-button"
                                href={getYoutubeWatchUrl(youtubeVideoId)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {ui.watchYoutube[locale]} ↗
                            </a>
                        </div>
                    )}

                    <p className="project-description">{project.detailedDescription}</p>

                    <div className="project-meta">
                        <div className="meta-item">
                            <span className="meta-label">{ui.date[locale]}:</span>
                            <span className="meta-value">{project.date}</span>
                        </div>
                        {project.location && (
                            <div className="meta-item">
                                <span className="meta-label">{ui.location[locale]}:</span>
                                <span className="meta-value">{project.location}</span>
                            </div>
                        )}
                    </div>

                    {project.externalUrl && !youtubeVideoId && (
                        <a
                            className="project-external-link"
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {ui.externalLink[locale]} ↗
                        </a>
                    )}

                    <div className="technologies">
                        <h3>{ui.skills[locale]}</h3>
                        <div className="tech-tags">
                            {skillNames.map((name) => (
                                <span key={name} className="tech-tag skill-tag">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="technologies tech-stack">
                        <h3>{ui.technologies[locale]}</h3>
                        <div className="tech-tags">
                            {project.technologies.map((tech) => (
                                <span key={tech} className="tech-tag tech-stack-tag">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="carousel-controls carousel-controls-sticky">
                    <button 
                        className="carousel-button prev" 
                        onClick={onPrevious}
                        aria-label={ui.prev[locale]}
                    >
                        ‹
                    </button>
                    
                    <div className="carousel-indicator">
                        {currentIndex + 1} / {totalProjects}
                    </div>
                    
                    <button 
                        className="carousel-button next" 
                        onClick={onNext}
                        aria-label={ui.next[locale]}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="overlay-hint">
                <p>{ui.hint[locale]}</p>
            </div>
        </div>
    );
};

export default ProjectOverlay;

