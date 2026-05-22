import React from 'react';
import type { Locale } from '../types/Locale';
import '../styles/LocaleSwitcher.css';

interface LocaleSwitcherProps {
    locale: Locale;
    onChange: (locale: Locale) => void;
}

const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ locale, onChange }) => {
    return (
        <div className="locale-switcher" role="group" aria-label="Idioma">
            <button
                type="button"
                className={locale === 'es' ? 'active' : ''}
                onClick={() => onChange('es')}
            >
                ES
            </button>
            <button
                type="button"
                className={locale === 'en' ? 'active' : ''}
                onClick={() => onChange('en')}
            >
                EN
            </button>
        </div>
    );
};

export default LocaleSwitcher;
