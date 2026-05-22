# 🚀 Deploy a https://delias2798.github.io/

## ✅ Configuración Correcta

Tu sitio es el **sitio principal de usuario**, por lo que:
- ✅ URL: `https://delias2798.github.io/`
- ✅ `base: '/'` en vite.config.ts (ya correcto)
- ✅ Repositorio: `delias2798.github.io`
- ✅ Rama de código: `main`
- ✅ Rama de deploy: `gh-pages`

## 🎯 Pasos para Deploy (PowerShell)

### Método 1: Comando Simple (Rápido)

```powershell
# 1. Agregar todos los cambios
git add .

# 2. Commit
git commit -m "feat: Portfolio VR/XR completo con BabylonJS v1.0"

# 3. Push a main
git push origin main

# 4. Deploy a GitHub Pages
npm run deploy
```

**Listo!** En 5 minutos estará en: `https://delias2798.github.io/`

### Método 2: Script Automático (Interactivo)

```powershell
# Ejecutar el script de PowerShell
.\deploy.ps1
```

El script te guiará paso a paso y hará todo automáticamente.

### Método 3: Manual Detallado

#### Paso 1: Verificar Cambios
```powershell
git status
```

Verás todos los archivos nuevos y modificados.

#### Paso 2: Agregar Archivos
```powershell
git add .
```

#### Paso 3: Commit
```powershell
git commit -m "feat: Portfolio VR/XR completo

- Sistema de pantallas 3D con videos VR
- Carrusel de proyectos dinámico
- Objetos interactivos con física Havok (click derecho)
- Sistema de cámara con enfoque perpendicular
- UI moderna con glassmorphism
- 100% responsive

Tech: BabylonJS 8.15, React 19, TypeScript, Havok Physics"
```

#### Paso 4: Push a Main
```powershell
git push origin main
```

Espera confirmación: `Everything up-to-date` o conteo de commits.

#### Paso 5: Build
```powershell
npm run build
```

Verás: `✓ built in XX.XXs`

#### Paso 6: Deploy a GitHub Pages
```powershell
npm run deploy
```

Verás:
```
vite v7.0.2 building for production...
✓ built in 12.34s
Published
```

**"Published" = ✅ Deploy Exitoso!**

## ⏱️ Tiempos de Actualización

- **Build local:** ~10-15 segundos
- **Push a GitHub:** ~2-5 segundos
- **Deploy a gh-pages:** ~10-20 segundos
- **Propagación GitHub Pages:** ~1-5 minutos

**Total:** ~2-6 minutos desde que ejecutas `npm run deploy`

## 🔍 Verificar Deploy

### 1. En la Terminal

Verás:
```
Published
```

### 2. En GitHub

1. Ve a: `https://github.com/delias2798/delias2798.github.io`
2. Verás la rama `gh-pages` actualizada
3. En Actions (si está habilitado) verás "pages build and deployment"

### 3. En el Navegador

1. Abre: `https://delias2798.github.io/`
2. **Limpia cache:** Ctrl + Shift + R (importante!)
3. Deberías ver tu portfolio actualizado

## 🐛 Si No Ves Cambios

### Solución 1: Limpiar Cache
```
Ctrl + Shift + R (hard reload)
```

O:
```
Ctrl + Shift + Delete → Limpiar cache → Confirmar
```

### Solución 2: Modo Incógnito
Abre en ventana incógnita (Ctrl + Shift + N) para ver sin cache.

### Solución 3: Forzar Redeploy
```powershell
# Limpiar cache de gh-pages
Remove-Item -Recurse -Force node_modules/.cache/gh-pages -ErrorAction SilentlyContinue

# Redeploy
npm run deploy
```

## ⚠️ Problemas Comunes

### "fatal: remote origin already exists"

Esto NO es un error si estás haciendo push. Continúa normal.

### "rejected - non-fast-forward"

**Causa:** Tu rama local está desactualizada.

**Solución:**
```powershell
git pull origin main
git push origin main
```

### "Permission denied"

**Causa:** No tienes permisos o no estás autenticado.

**Solución:**
```powershell
# Configurar credenciales (una sola vez)
git config user.name "Tu Nombre"
git config user.email "tu-email@example.com"
```

### Assets 404 en el Sitio

**Causa:** Rutas incorrectas.

**Verificar:**
- Los archivos deben estar en `public/` (modelos, videos)
- El build los copiará a `dist/`
- GitHub Pages los servirá desde la raíz

## 📦 Qué se Sube a GitHub

### Rama `main` (Código Fuente):
```
- src/
- public/
- package.json
- vite.config.ts
- README.md
- *.md (documentación)
```

### Rama `gh-pages` (Build Compilado - AUTO):
```
- index.html
- assets/
- models/
- videos/ (si existen)
- vite.svg
```

**Nunca edites `gh-pages` manualmente.**

## 🎯 Workflow Recomendado

### Para Desarrollo Diario:
```powershell
# Trabaja normalmente
npm run dev

# Cuando termines:
git add .
git commit -m "descripción cambios"
git push origin main
# NO deploy cada vez, solo cuando quieras actualizar el sitio público
```

### Para Actualizar el Sitio Público:
```powershell
# Solo cuando quieras actualizar lo que se ve en internet:
npm run deploy
```

## 📊 Resumen de Comandos

| Comando | Qué Hace | Cuándo Usarlo |
|---------|----------|---------------|
| `git add .` | Staging de cambios | Antes de commit |
| `git commit -m "..."` | Guardar cambios | Después de add |
| `git push origin main` | Subir a GitHub | Actualizar repo |
| `npm run build` | Compilar proyecto | Verificar que funciona |
| `npm run deploy` | Publicar sitio | Actualizar sitio web |

## 🎉 Deploy Ahora (Copy-Paste)

```powershell
# Copia y pega estos comandos:

git add .
git commit -m "feat: Portfolio VR/XR v1.0 - BabylonJS completo"
git push origin main
npm run deploy
```

Espera ~5 minutos y abre: `https://delias2798.github.io/`

## 🔗 URLs del Proyecto

**Sitio Publicado:**
- https://delias2798.github.io/

**Repositorio GitHub:**
- https://github.com/delias2798/delias2798.github.io

**Código Fuente (main):**
- https://github.com/delias2798/delias2798.github.io/tree/main

**Build Compilado (gh-pages):**
- https://github.com/delias2798/delias2798.github.io/tree/gh-pages

---

**¿Listo para hacer deploy?** Ejecuta los comandos de arriba. 🚀

