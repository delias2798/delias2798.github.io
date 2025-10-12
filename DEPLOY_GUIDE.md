# 🚀 Guía de Deploy a GitHub Pages

## 📋 Pre-requisitos

Antes de hacer deploy, asegúrate de:
- [ ] Tus videos VR están en `public/videos/` (o estás OK con placeholders)
- [ ] Información actualizada en `src/data/projects.ts`
- [ ] Todo funciona en local (`npm run dev`)
- [ ] Build sin errores (`npm run build`)

## ⚙️ Configuración de GitHub Pages

### Paso 1: Verificar la URL de tu GitHub Pages

Tu GitHub Pages puede estar en:

**Opción A: Sitio principal de usuario**
```
https://delias2798.github.io/
```
→ En este caso, `base: '/'` está correcto ✅

**Opción B: Repositorio específico**
```
https://delias2798.github.io/portafolio-babylon/
```
→ En este caso, necesitas cambiar `base` en `vite.config.ts`

### Paso 2: Ajustar vite.config.ts (Si es necesario)

#### Si tu URL es `delias2798.github.io/portafolio-babylon/`:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/portafolio-babylon/', // ← Cambiar aquí
  // ...resto de la config
})
```

#### Si tu URL es `delias2798.github.io/`:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // ← Ya está correcto ✅
  // ...resto de la config
})
```

## 📝 Proceso de Deploy Completo

### Opción 1: Comando Rápido (Recomendado)

```bash
# Asegúrate de estar en la rama main
git status

# Agregar todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "Portfolio VR/XR completo con BabylonJS - v1.0"

# Push a main
git push origin main

# Deploy a GitHub Pages
npm run deploy
```

### Opción 2: Paso a Paso (Más Control)

#### 1. Verificar Estado
```bash
git status
```

Verás los archivos modificados y nuevos.

#### 2. Agregar Archivos
```bash
# Agregar todos
git add .

# O selectivo:
git add src/
git add public/
git add *.md
git add package.json
git add vite.config.ts
```

#### 3. Commit
```bash
git commit -m "feat: Portfolio VR/XR con BabylonJS

- Sistema de pantallas 3D con videos VR
- Carrusel de proyectos
- Objetos interactivos con física Havok
- Sistema de cámara con enfoque inteligente
- UI moderna con glassmorphism
- Responsive design

Tecnologías: BabylonJS, React, TypeScript, Havok Physics"
```

#### 4. Push a Main
```bash
git push origin main
```

#### 5. Build y Deploy
```bash
# Build de producción
npm run build

# Verificar que build funciona
npm run preview
# Abre http://localhost:4173 y verifica que todo funcione

# Si todo OK, deploy
npm run deploy
```

### Opción 3: Deploy Automático

Si prefieres un solo comando:

```bash
# Esto hará todo automáticamente
npm run deploy
```

**Nota:** Este comando:
1. Hace build (`vite build`)
2. Publica a rama gh-pages (`gh-pages -d dist`)
3. **NO hace commit/push a main automáticamente**

## ⚠️ Importante: Orden Correcto

```bash
# SIEMPRE en este orden:
1. git add .
2. git commit -m "mensaje"
3. git push origin main       # ← Actualiza código fuente
4. npm run deploy              # ← Actualiza sitio publicado
```

## 🔧 Configuración de GitHub (Primera vez)

Si es tu primera vez deploying a GitHub Pages:

### 1. Ir a GitHub.com

1. Ve a tu repositorio: `https://github.com/delias2798/portafolio-babylon`
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**

### 2. Configurar Source

En "Build and deployment":
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` 
- **Folder:** `/ (root)`
- Click **Save**

### 3. Esperar Deploy

GitHub Pages tarda ~1-3 minutos en procesar. Verás un mensaje:
```
Your site is ready to be published at https://delias2798.github.io/
```

## 📊 Verificación Post-Deploy

### 1. Verificar que se Publicó

```bash
# Ver rama gh-pages
git branch -a

# Debería mostrar:
# * main
#   remotes/origin/gh-pages
#   remotes/origin/main
```

### 2. Visitar el Sitio

Abre: `https://delias2798.github.io/` (o `/portafolio-babylon/`)

### 3. Verificar en Navegador

- [ ] La escena 3D carga
- [ ] Los objetos son visibles
- [ ] Puedes interactuar (click derecho en objetos)
- [ ] Las pantallas funcionan
- [ ] El overlay aparece

### 4. Verificar Consola del Navegador

Presiona F12 y verifica que no haya errores críticos.

**Errores normales:**
- `404` para videos → Normal si no los has subido
- Warnings de Havok → Normal, se maneja automáticamente

## 🐛 Troubleshooting Deploy

### Error: "Failed to deploy"

**Causa:** Problemas con permisos o configuración

**Solución:**
```bash
# Limpiar cache de gh-pages
rm -rf node_modules/.cache/gh-pages

# O en Windows PowerShell:
Remove-Item -Recurse -Force node_modules/.cache/gh-pages -ErrorAction SilentlyContinue

# Reintentar
npm run deploy
```

### Error: "Nothing to commit"

Esto NO es un error. Significa que gh-pages ya está actualizado.

### Página 404 en GitHub Pages

**Causas posibles:**
1. GitHub Pages no está habilitado
2. La rama gh-pages no existe
3. El path base está mal configurado

**Solución:**
1. Verifica configuración en Settings → Pages
2. Espera 5 minutos (puede tardar)
3. Fuerza actualización con Ctrl + Shift + R

### Assets No Cargan (404)

**Causa:** El `base` path está mal

**Solución:**
- Si estás en `delias2798.github.io/portafolio-babylon/`
- Cambia `base: '/'` a `base: '/portafolio-babylon/'`
- Rebuild y redeploy

## 📦 Estructura de Ramas

```
main (tu código fuente)
  ├── src/
  ├── public/
  ├── package.json
  └── ...

gh-pages (build compilado - AUTO-GENERADO)
  ├── index.html
  ├── assets/
  ├── models/
  ├── videos/
  └── ...
```

**Nunca edites gh-pages manualmente.** Se genera automáticamente con `npm run deploy`.

## 🔄 Workflow de Actualización

### Para Cambios Pequeños:
```bash
# Editar código
# ...

git add .
git commit -m "fix: descripción del cambio"
git push origin main
npm run deploy
```

### Para Cambios Grandes:
```bash
# Editar código
# ...

# Probar en local
npm run dev

# Build y preview
npm run build
npm run preview

# Si todo OK:
git add .
git commit -m "feat: nueva característica"
git push origin main
npm run deploy
```

### Para Agregar Nuevos Videos:
```bash
# 1. Agrega videos en public/videos/
# 2. Actualiza src/data/projects.ts

# 3. Commit y deploy
git add public/videos/
git add src/data/projects.ts
git commit -m "feat: agregar videos de proyectos VR"
git push origin main
npm run deploy
```

## 📋 Checklist Pre-Deploy

Antes de cada deploy:

- [ ] `npm run build` sin errores
- [ ] `npm run preview` funciona
- [ ] Probaste todas las funcionalidades
- [ ] Actualizaste README si es necesario
- [ ] Commit message es descriptivo
- [ ] Push a main exitoso

## 🎯 Comandos Resumidos

```bash
# Deploy completo (recomendado):
git add .
git commit -m "tu mensaje aquí"
git push origin main
npm run deploy

# Solo actualizar GitHub Pages (si main ya está actualizado):
npm run deploy

# Ver historial de deploys:
git log --oneline origin/gh-pages

# Ver diferencias antes de commit:
git diff
```

## 🌐 URLs de tu Proyecto

Después del deploy, tu portfolio estará en:

**Sitio publicado:**
- `https://delias2798.github.io/` (si base: '/')
- O `https://delias2798.github.io/portafolio-babylon/` (si base: '/portafolio-babylon/')

**Repositorio:**
- `https://github.com/delias2798/portafolio-babylon`

## 🔐 Permisos de GitHub Actions

Si usas GitHub Actions (opcional), asegúrate de:
1. Settings → Actions → General
2. Workflow permissions → Read and write permissions
3. Save

## 📊 Verificar Deploy Exitoso

En la terminal verás:

```bash
> portafolio-babylon@0.0.0 deploy
> vite build && gh-pages -d dist

vite v7.0.2 building for production...
✓ 2192 modules transformed.
✓ built in 12.34s

Published
```

**"Published"** = ✅ Deploy exitoso!

## ⏱️ Tiempo de Propagación

- **Build:** ~10-30 segundos
- **GitHub Pages:** ~1-5 minutos
- **Total:** ~2-6 minutos desde `npm run deploy`

Si no ves cambios inmediatamente, espera 5 minutos y limpia cache (Ctrl + Shift + R).

---

## 🎉 Siguiente Paso

**Dime cuál es tu URL de GitHub Pages:**
- ¿`delias2798.github.io/`?
- ¿O `delias2798.github.io/portafolio-babylon/`?

Actualizaré `vite.config.ts` si es necesario y luego te guío en el deploy. 🚀

