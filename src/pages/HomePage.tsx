import { useState } from 'react';
import HomeHeroCanvas from '../components/site/HomeHeroCanvas';
import MetaFooter from '../components/site/MetaFooter';
import { siteConfig } from '../config/site.config';
import type { Locale } from '../types/Locale';
import { t } from '../types/Locale';
import { defaultLocale } from '../data/projects';

export default function HomePage() {
    const [locale] = useState<Locale>(defaultLocale);

    return (
        <main className="site-page site-page--home">
            <header className="site-home-header">
                <p className="site-home-header__role">
                    {t(siteConfig.roleLabel, locale)}
                </p>
                <h1 className="site-home-header__name">{siteConfig.name}</h1>
            </header>
            <div className="site-home-hero-wrap">
                <HomeHeroCanvas locale={locale} />
            </div>
            <MetaFooter locale={locale} />
        </main>
    );
}
