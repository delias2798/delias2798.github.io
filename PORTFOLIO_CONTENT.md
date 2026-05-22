# Contenido del portfolio (ES / EN)

Guía para editar textos, proyectos y skills del portfolio 3D.

## Archivos principales

| Archivo | Uso |
|---------|-----|
| `src/data/portfolio.projects.ts` | **Proyectos bilingües** (título, descripción corta, descripción larga, skills, links) |
| `src/data/skills.ts` | Catálogo de **skills del perfil** (nombre ES/EN y categoría) |
| `src/data/profile.ts` | Texto del **perfil** y agregación automática de skills desde proyectos |
| `src/data/projects.ts` | `getProjects('es' \| 'en')` para la app |

## Agregar o editar un proyecto

En `portfolio.projects.ts`, cada entrada tiene esta forma:

```typescript
{
  id: 'mi-proyecto',
  category: 'enterprise', // research | enterprise | competition | platform | mobile | web-3d | ar | prototype
  date: '2025',
  videoUrl: '/videos/mi-proyecto.mp4',  // colocar MP4 en public/videos/
  externalUrl: 'https://...',           // opcional: demo o YouTube
  skillIds: ['unity', 'babylonjs'],     // IDs de src/data/skills.ts
  technologies: ['Unity', 'Babylon.js'],
  title: { es: '...', en: '...' },
  description: { es: '...', en: '...' },
  detailedDescription: { es: '...', en: '...' },
}
```

## Skills del perfil

- Cada proyecto declara `skillIds`.
- El panel de perfil muestra skills **únicas**, agrupadas por categoría, ordenadas por número de proyectos.
- Para una skill nueva: añádela en `skills.ts` y referénciala en los proyectos.

## Videos: local vs YouTube

| Uso | Dónde | Notas |
|-----|--------|--------|
| **Pantalla 3D** en la escena | `videoUrl` → `public/videos/*.mp4` | Babylon usa `VideoTexture`; el plano **no rota con la cámara**. Sin MP4 → cartel estático en el plano. |
| **Video YouTube** | `externalUrl` | Solo en el **panel lateral** al hacer clic en la pantalla (no flota sobre el canvas). Requiere video **público o no listado** (no privado). |

### Recomendación para Experiment 1, Experiment 2 y DriveDreams

Tienes los archivos **en local** → **úsalo en el repo** (`public/videos/`):

- `ux-research-manatee-ab.mp4`
- `retail-coffee-vr-vs-physical.mp4`
- `drivedreams-xrcc.mp4`

Ventajas: la pantalla 3D reproduce al instante, funciona offline y en GitHub Pages sin depender de YouTube.

Opcional: si más adelante subes esos mismos videos a YouTube (p. ej. no listados), añade `externalUrl` como respaldo; no reemplaza el MP4 en `videoUrl`.

### Proyectos con YouTube (enlace en overlay)

| Proyecto | YouTube |
|----------|---------|
| Polar | https://youtu.be/NQzNLbvYvuE |
| AR Pharma | https://youtu.be/UsXFe--YV3w |
| Shell | https://youtu.be/WwG8w639qy0 |
| Ocean Race | https://youtu.be/iVa-4weTKkQ |
| Prisma | https://youtu.be/mZPn2bFsvNM |
| Oracle | https://youtu.be/oyAck21PkRM |
| Cigarrillo electrónico (Lume Pad) | https://youtu.be/qSzE3y7ICB4 |
| Traverse | https://youtu.be/upkakPvMV9k |

Para que **también** se vean en la pantalla 3D, descarga o exporta MP4 y colócalos con el nombre de `videoUrl` (mismo nombre que en `portfolio.projects.ts`).

## Idioma en la UI

El selector **ES / EN** (esquina superior derecha) actualiza overlay, pantalla lateral 3D y panel de perfil.
