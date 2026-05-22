import type { LocalizedString } from '../types/Locale';

/** Edita aquí nombre, contacto y textos del sitio editorial (estilo hirotos) */
export const siteConfig = {
    name: 'Elias A. M.',
    roleLabel: {
        es: 'Desarrollador XR / VR / AR',
        en: 'XR / VR / AR Developer',
    } satisfies LocalizedString,
    base: {
        es: 'COSTA RICA',
        en: 'COSTA RICA',
    } satisfies LocalizedString,
    focus: {
        es: 'DESARROLLO XR / INVESTIGACIÓN UX / BABYLON.JS / UNITY',
        en: 'XR DEVELOPMENT / UX RESEARCH / BABYLON.JS / UNITY',
    } satisfies LocalizedString,
    index: {
        es: 'PORTFOLIO 2026',
        en: 'PORTFOLIO 2026',
    } satisfies LocalizedString,
    contact: {
        email: 'delias9827@gmail.com',
        linkedin: 'https://www.linkedin.com/in/elias-a-méndez-692664220/',
    },
    pages: {
        projects: {
            label: { es: 'PROYECTOS', en: 'PROJECTS' } satisfies LocalizedString,
            headline: {
                es: 'Proyectos que exploran XR, investigación UX, 3D web y desarrollo front-end interactivo.',
                en: 'Projects that explore XR, UX research, web 3D, and interactive front-end development.',
            } satisfies LocalizedString,
        },
        about: {
            label: { es: 'ACERCA DE', en: 'ABOUT' } satisfies LocalizedString,
        },
        contact: {
            label: { es: 'CONTACTO', en: 'CONTACT' } satisfies LocalizedString,
            headline: {
                es: 'Ponte en contacto.',
                en: 'Get in touch.',
            } satisfies LocalizedString,
        },
    },
    babylonCta: {
        es: 'Experiencia 3D completa',
        en: 'Full 3D experience',
    } satisfies LocalizedString,
    immersiveEntry: {
        es: 'PORTAFOLIO INMERSIVO',
        en: 'IMMERSIVE PORTFOLIO',
    } satisfies LocalizedString,
    designCredit: {
        about: {
            es: 'Diseño de la interfaz inspirado en el portfolio de',
            en: 'Interface design inspired by',
        } satisfies LocalizedString,
        footer: {
            es: 'Diseño inspirado en',
            en: 'Design inspired by',
        } satisfies LocalizedString,
        name: 'Hiroto Sato',
        linkedin: 'https://www.linkedin.com/in/hiroto-sato-2414b23b7',
        portfolio: 'https://hirotos.com',
    },
};
