import type { Project } from '../../types/Project';
import type { ProjectCategory } from '../../types/Project';
import {
    getProjectYoutubeId,
    isKnownLocalVideo,
} from '../../utils/projectMedia';
import { getYoutubeThumbnailUrl } from '../../utils/youtube';

const categoryGradients: Record<ProjectCategory, string> = {
    research: 'linear-gradient(160deg, #4a6fa5 0%, #2c3e50 100%)',
    enterprise: 'linear-gradient(160deg, #5c6bc0 0%, #3949ab 100%)',
    competition: 'linear-gradient(160deg, #e53935 0%, #b71c1c 100%)',
    platform: 'linear-gradient(160deg, #00897b 0%, #004d40 100%)',
    mobile: 'linear-gradient(160deg, #7b1fa2 0%, #4a148c 100%)',
    'web-3d': 'linear-gradient(160deg, #546e7a 0%, #263238 100%)',
    ar: 'linear-gradient(160deg, #f57c00 0%, #e65100 100%)',
    prototype: 'linear-gradient(160deg, #78909c 0%, #455a64 100%)',
};

interface ProjectCardProps {
    project: Project;
    onSelect: () => void;
}

function ProjectCardPreview({ project }: { project: Project }) {
    const gradient = categoryGradients[project.category];
    const youtubeId = getProjectYoutubeId(project);

    if (project.thumbnailUrl) {
        return (
            <img
                src={project.thumbnailUrl}
                alt=""
                className="project-card__thumb"
            />
        );
    }

    if (youtubeId) {
        return (
            <img
                src={getYoutubeThumbnailUrl(youtubeId)}
                alt=""
                className="project-card__thumb"
            />
        );
    }

    if (isKnownLocalVideo(project.videoUrl)) {
        return (
            <video
                src={project.videoUrl}
                muted
                playsInline
                preload="metadata"
                aria-hidden
            />
        );
    }

    return (
        <div
            className="project-card__gradient"
            style={{ background: gradient }}
        >
            <p className="project-card__title">{project.title}</p>
        </div>
    );
}

export default function ProjectCard({ project, onSelect }: ProjectCardProps) {
    return (
        <button type="button" className="project-card" onClick={onSelect}>
            <div className="project-card__preview">
                <ProjectCardPreview project={project} />
            </div>
            <p className="project-card__meta">
                {project.date} · {project.category}
            </p>
        </button>
    );
}
