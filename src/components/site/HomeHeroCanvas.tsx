import { useEffect, useRef, useState } from 'react';
import { createHomeHeroScene } from '../../babylon/HomeHeroScene';
import { siteConfig } from '../../config/site.config';
import type { Locale } from '../../types/Locale';
import { t } from '../../types/Locale';

interface HomeHeroCanvasProps {
    locale: Locale;
}

export default function HomeHeroCanvas({ locale }: HomeHeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const revealRef = useRef(false);
    const [immersiveRevealed, setImmersiveRevealed] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handles = createHomeHeroScene(canvas, {
            revealRef,
            onRevealChange: setImmersiveRevealed,
        });

        return () => handles.dispose();
    }, []);

    const closeImmersive = () => {
        if (!revealRef.current) return;
        revealRef.current = false;
        setImmersiveRevealed(false);
    };

    return (
        <div className="home-hero-canvas-wrap">
            <canvas
                ref={canvasRef}
                className="home-hero-canvas"
                aria-label="Esfera de puntos 3D — mueve el cursor o haz clic en el centro para abrir el portfolio inmersivo"
            />
            {immersiveRevealed && (
                <button
                    type="button"
                    className="home-hero-dismiss-zone"
                    aria-label={locale === 'es' ? 'Cerrar y volver a la esfera' : 'Close and return to sphere'}
                    onClick={closeImmersive}
                />
            )}
            <a
                href="/babylonPortfolio"
                className={`home-hero-immersive-cta ${immersiveRevealed ? 'is-visible' : ''}`}
                aria-hidden={!immersiveRevealed}
                tabIndex={immersiveRevealed ? 0 : -1}
            >
                {t(siteConfig.immersiveEntry, locale)}
            </a>
            <p className="home-hero-hint" aria-hidden={immersiveRevealed}>
                {immersiveRevealed
                    ? locale === 'es'
                        ? 'Clic alrededor para cerrar'
                        : 'Click around to close'
                    : locale === 'es'
                      ? 'Clic en el centro'
                      : 'Click center'}
            </p>
        </div>
    );
}
