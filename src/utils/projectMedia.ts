import type { Project } from '../types/Project';
import { localVideoExists } from './localVideo';
import {
    getYoutubeVideoId,
    isYoutubeUrl,
} from './youtube';

export type ProjectMediaSource =
    | { type: 'local'; src: string }
    | { type: 'youtube'; videoId: string }
    | { type: 'none' };

/** MP4 presentes en public/videos/ — evita HEAD en tarjetas de galería */
export const KNOWN_LOCAL_VIDEOS = new Set([
    '/videos/ux-research-manatee-ab.mp4',
    '/videos/retail-coffee-vr-vs-physical.mp4',
    '/videos/drivedreams-xrcc.mp4',
]);

export function getProjectYoutubeId(project: Project): string | null {
    return (
        getYoutubeVideoId(project.externalUrl) ??
        getYoutubeVideoId(project.videoUrl)
    );
}

export function isKnownLocalVideo(videoUrl: string | undefined): boolean {
    return Boolean(videoUrl && KNOWN_LOCAL_VIDEOS.has(videoUrl));
}

/** Misma prioridad que ScreenManager.loadProject */
export async function resolveProjectMediaSource(
    project: Project,
): Promise<ProjectMediaSource> {
    const canUseLocal =
        project.videoUrl &&
        !isYoutubeUrl(project.videoUrl) &&
        (await localVideoExists(project.videoUrl));

    if (canUseLocal) {
        return { type: 'local', src: project.videoUrl };
    }

    const videoId = getProjectYoutubeId(project);
    if (videoId) {
        return { type: 'youtube', videoId };
    }

    return { type: 'none' };
}
