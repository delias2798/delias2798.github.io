import { useState } from 'react';
import PageHeader from '../components/site/PageHeader';
import DesignCredit from '../components/site/DesignCredit';
import LocaleSwitcher from '../components/LocaleSwitcher';
import { siteConfig } from '../config/site.config';
import { getProfileText } from '../data/profile';
import type { Locale } from '../types/Locale';
import { t } from '../types/Locale';
import { defaultLocale } from '../data/projects';

export default function AboutPage() {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const profile = getProfileText(locale);

    return (
        <main className="site-page site-page--centered">
            <div className="site-locale-bar">
                <LocaleSwitcher locale={locale} onChange={setLocale} />
            </div>
            <PageHeader
                label={t(siteConfig.pages.about.label, locale)}
                title={profile.headline}
            />
            <p className="about-body">{profile.summary}</p>
            <div className="about-grid">
                <div className="meta-block">
                    <p className="meta-block__label">FOCUS</p>
                    <p className="meta-block__value">{t(siteConfig.focus, locale)}</p>
                </div>
                <div className="meta-block">
                    <p className="meta-block__label">BASE</p>
                    <p className="meta-block__value">{t(siteConfig.base, locale)}</p>
                </div>
                <div className="meta-block">
                    <p className="meta-block__label">CONTACT</p>
                    <p className="meta-block__value">
                        <a href={`mailto:${siteConfig.contact.email}`}>
                            {siteConfig.contact.email}
                        </a>
                        <br />
                        <a
                            href={siteConfig.contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn ↗
                        </a>
                    </p>
                </div>
            </div>
            <DesignCredit locale={locale} variant="about" />
        </main>
    );
}
