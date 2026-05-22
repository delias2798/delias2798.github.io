export type Locale = 'es' | 'en';

export interface LocalizedString {
    es: string;
    en: string;
}

export function t(value: LocalizedString, locale: Locale): string {
    return value[locale];
}
