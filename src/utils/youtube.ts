/** Extrae el ID de video de URLs youtu.be, youtube.com/watch y /embed/ */
export function getYoutubeVideoId(url: string | undefined): string | null {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace('www.', '');

        if (host === 'youtu.be') {
            const id = parsed.pathname.slice(1).split('/')[0];
            return id || null;
        }

        if (host.includes('youtube.com')) {
            const fromQuery = parsed.searchParams.get('v');
            if (fromQuery) return fromQuery;

            const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
            if (embedMatch) return embedMatch[1];
        }
    } catch {
        // fallback regex
    }

    const patterns = [
        /youtu\.be\/([^?&/]+)/,
        /[?&]v=([^?&/]+)/,
        /youtube\.com\/embed\/([^?&/]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
    }

    return null;
}

export function getYoutubeThumbnailUrl(videoId: string, quality: 'hq' | 'mq' = 'hq'): string {
    const file = quality === 'hq' ? 'hqdefault.jpg' : 'mqdefault.jpg';
    return `https://img.youtube.com/vi/${videoId}/${file}`;
}

export function getYoutubeWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
}

/** URL de embed para iframe en el plano 3D (sin autoplay para evitar errores de origen) */
export function getYoutubeEmbedUrl(videoId: string): string {
    const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function isYoutubeUrl(url: string | undefined): boolean {
    return getYoutubeVideoId(url) !== null;
}
