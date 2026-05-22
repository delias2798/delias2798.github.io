/** Comprueba si existe un MP4 local antes de intentar VideoTexture */
export async function localVideoExists(videoPath: string): Promise<boolean> {
    if (!videoPath || videoPath.startsWith('http')) {
        return false;
    }

    try {
        const response = await fetch(videoPath, { method: 'HEAD' });
        const type = (response.headers.get('content-type') ?? '').toLowerCase();

        // Vite/GitHub Pages devuelven index.html (200) para rutas inexistentes
        if (type.includes('text/html') || type.includes('application/xhtml')) {
            return false;
        }

        return (
            response.ok &&
            (type.includes('video') || type.includes('octet-stream') || type === '')
        );
    } catch {
        return false;
    }
}
