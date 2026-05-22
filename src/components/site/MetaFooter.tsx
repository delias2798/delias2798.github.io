import type { Locale } from '../../types/Locale';
import { t } from '../../types/Locale';
import { siteConfig } from '../../config/site.config';

interface MetaFooterProps {
    locale: Locale;
}

export default function MetaFooter({ locale }: MetaFooterProps) {
    return (
        <footer className="site-meta-footer">
            <div className="meta-block">
                <p className="meta-block__label">BASE</p>
                <p className="meta-block__value">{t(siteConfig.base, locale)}</p>
            </div>
            <div className="meta-block">
                <p className="meta-block__label">FOCUS</p>
                <p className="meta-block__value">{t(siteConfig.focus, locale)}</p>
            </div>
            <div className="meta-block">
                <p className="meta-block__label">INDEX</p>
                <p className="meta-block__value">{t(siteConfig.index, locale)}</p>
            </div>
        </footer>
    );
}
