import { useState } from 'react';
import '../App.css';
import BabylonScene from '../components/BabylonScene';
import LocaleSwitcher from '../components/LocaleSwitcher';
import ProfilePanel from '../components/ProfilePanel';
import type { Locale } from '../types/Locale';
import { defaultLocale } from '../data/projects';

const exitSite = { es: '← Portafolio', en: '← Portfolio' };

const welcome = {
    title: { es: 'Portfolio VR/XR', en: 'VR/XR Portfolio' },
    subtitle: {
        es: 'Explora mis proyectos en realidad virtual y aumentada',
        en: 'Explore my virtual and augmented reality projects',
    },
    clickLeft: { es: 'Click Izquierdo', en: 'Left Click' },
    viewScreens: {
        es: 'Ver pantalla y detalle del proyecto',
        en: 'View screen and project details',
    },
    drag: { es: 'Drag', en: 'Drag' },
    rotateCamera: { es: 'Rotar cámara', en: 'Rotate camera' },
};

export default function BabylonPortfolioPage() {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const [profileCollapsed, setProfileCollapsed] = useState(false);

    return (
        <div className="app-container babylon-portfolio-page">
            <div className="app-top-bar">
                <a href="/" className="babylon-exit-link">
                    {exitSite[locale]}
                </a>
                <LocaleSwitcher locale={locale} onChange={setLocale} />
            </div>
            <ProfilePanel
                locale={locale}
                collapsed={profileCollapsed}
                onToggle={() => setProfileCollapsed((c) => !c)}
            />
            <BabylonScene locale={locale} />
            <div className="welcome-overlay">
                <h1>{welcome.title[locale]}</h1>
                <p>{welcome.subtitle[locale]}</p>
                <div className="instructions">
                    <p>
                        🖱️ <strong>{welcome.clickLeft[locale]}:</strong>{' '}
                        {welcome.viewScreens[locale]}
                    </p>
                    <p>
                        🔄 <strong>{welcome.drag[locale]}:</strong>{' '}
                        {welcome.rotateCamera[locale]}
                    </p>
                </div>
            </div>
        </div>
    );
}
