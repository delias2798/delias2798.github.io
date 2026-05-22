import { useState } from 'react';
import PageHeader from '../components/site/PageHeader';
import LocaleSwitcher from '../components/LocaleSwitcher';
import { siteConfig } from '../config/site.config';
import type { Locale } from '../types/Locale';
import { t } from '../types/Locale';
import { defaultLocale } from '../data/projects';

export default function ContactPage() {
    const [locale, setLocale] = useState<Locale>(defaultLocale);

    return (
        <main className="site-page site-page--centered">
            <div className="site-locale-bar">
                <LocaleSwitcher locale={locale} onChange={setLocale} />
            </div>
            <PageHeader
                label={t(siteConfig.pages.contact.label, locale)}
                title={t(siteConfig.pages.contact.headline, locale)}
            />
            <div className="contact-links">
                <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="external-arrow"
                >
                    {siteConfig.contact.email}
                </a>
                <a
                    href={siteConfig.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-arrow"
                >
                    LinkedIn
                </a>
            </div>
        </main>
    );
}
