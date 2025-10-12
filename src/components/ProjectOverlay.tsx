import React from 'react';
import type { Project } from '../types/Project';
import '../styles/ProjectOverlay.css';

interface ProjectOverlayProps {
    project: Project | null;
    isVisible: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
    currentIndex: number;
    totalProjects: number;
}

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({
    project,
    isVisible,
    onClose,
    onNext,
    onPrevious,
    currentIndex,
    totalProjects
}) => {
    if (!project || !isVisible) return null;

    return (
        <div className="project-overlay">
            <div className="overlay-content">
                <button className="close-button" onClick={onClose} aria-label="Cerrar">
                    ×
                </button>

                <div className="project-info">
                    <h1 className="project-title">{project.title}</h1>
                    
                    <p className="project-description">{project.detailedDescription}</p>

                    <div className="project-meta">
                        <div className="meta-item">
                            <span className="meta-label">Fecha:</span>
                            <span className="meta-value">{project.date}</span>
                        </div>
                    </div>

                    <div className="technologies">
                        <h3>Tecnologías</h3>
                        <div className="tech-tags">
                            {project.technologies.map((tech, index) => (
                                <span key={index} className="tech-tag">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="carousel-controls">
                    <button 
                        className="carousel-button prev" 
                        onClick={onPrevious}
                        aria-label="Proyecto anterior"
                    >
                        ‹
                    </button>
                    
                    <div className="carousel-indicator">
                        {currentIndex + 1} / {totalProjects}
                    </div>
                    
                    <button 
                        className="carousel-button next" 
                        onClick={onNext}
                        aria-label="Siguiente proyecto"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="overlay-hint">
                <p>Presiona ESC, haz scroll o haz clic fuera para salir</p>
            </div>
        </div>
    );
};

export default ProjectOverlay;

