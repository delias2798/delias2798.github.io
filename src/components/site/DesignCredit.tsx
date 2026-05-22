import { siteConfig } from '../../config/site.config';
import type { Locale } from '../../types/Locale';
import { t } from '../../types/Locale';

interface DesignCreditProps {
    locale: Locale;
    variant: 'about' | 'footer';
}

export default function DesignCredit({ locale, variant }: DesignCreditProps) {
    const { designCredit } = siteConfig;
    const prefix =
        variant === 'about'
            ? t(designCredit.about, locale)
            : t(designCredit.footer, locale);

    return (
        <p className={`site-credit site-credit--${variant}`}>
            {prefix}{' '}
            <a
                href={designCredit.linkedin}
                target="_blank"
                rel="noopener noreferrer"
            >
                {designCredit.name}
            </a>
            {variant === 'about' && (
                <>
                    {' '}
                    (
                    <a
                        href={designCredit.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        hirotos.com
                    </a>
                    )
                </>
            )}
            .
        </p>
    );
}
