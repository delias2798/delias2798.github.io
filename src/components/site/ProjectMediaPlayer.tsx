import { useEffect, useState } from 'react';
import type { Locale } from '../../types/Locale';
import type { Project } from '../../types/Project';
import {
    resolveProjectMediaSource,
    type ProjectMediaSource,
} from '../../utils/projectMedia';
import { getYoutubeEmbedUrl, getYoutubeWatchUrl } from '../../utils/youtube';

const ui = {
    loading: { es: 'Cargando video…', en: 'Loading video…' },
    unavailable: {
        es: 'Video no disponible en este momento.',
        en: 'Video not available at this time.',
    },
    openYoutube: { es: 'Abrir en YouTube', en: 'Open on YouTube' },
    embedBlocked: {
        es: 'El reproductor embebido no está disponible en esta vista. Abre el video en YouTube.',
        en: 'Embedded player is not available in this view. Open the video on YouTube.',
    },
    externalLink: { es: 'Ver demo / enlace', en: 'View demo / link' },
};

interface ProjectMediaPlayerProps {
    project: Project;
    locale: Locale;
    autoPlay?: boolean;
}

export default function ProjectMediaPlayer({
    project,
    locale,
    autoPlay = false,
}: ProjectMediaPlayerProps) {
    const [media, setMedia] = useState<ProjectMediaSource | 'loading'>('loading');

    useEffect(() => {
        let cancelled = false;
        setMedia('loading');

        resolveProjectMediaSource(project).then((resolved) => {
            if (!cancelled) setMedia(resolved);
        });

        return () => {
            cancelled = true;
        };
    }, [project.id, project.videoUrl, project.externalUrl]);

    if (media === 'loading') {
        return (
            <div className="project-modal__media project-modal__media--loading">
                <span>{ui.loading[locale]}</span>
            </div>
        );
    }

    if (media.type === 'local') {
        return (
            <div className="project-modal__media">
                <video
                    controls
                    playsInline
                    autoPlay={autoPlay}
                    src={media.src}
                    title={project.title}
                />
            </div>
        );
    }

    if (media.type === 'youtube') {
        const isolated =
            typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated;

        return (
            <div className="project-modal__media">
                {isolated && (
                    <p className="project-modal__embed-warning">
                        {ui.embedBlocked[locale]}
                    </p>
                )}
                <iframe
                    src={getYoutubeEmbedUrl(media.videoId)}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                <a
                    className="project-modal__youtube-link"
                    href={getYoutubeWatchUrl(media.videoId)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {ui.openYoutube[locale]} ↗
                </a>
            </div>
        );
    }

    return (
        <div className="project-modal__media project-modal__media--empty">
            <p>{ui.unavailable[locale]}</p>
            {project.externalUrl && (
                <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {ui.externalLink[locale]} ↗
                </a>
            )}
        </div>
    );
}
