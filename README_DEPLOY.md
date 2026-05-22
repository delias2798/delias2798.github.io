# 🚀 DEPLOY RÁPIDO - 3 Comandos

Tu portfolio está **100% listo** para publicarse en `https://delias2798.github.io/`

## ⚡ Deploy en 3 Pasos (Copy-Paste)

```powershell
git add .
git commit -m "feat: Portfolio VR/XR completo con BabylonJS v1.0"
git push origin main && npm run deploy
```

**Listo!** En 5 minutos estará online en: **https://delias2798.github.io/**

## 📋 Qué Incluye este Deploy

### ✅ Características Funcionando:
- Sistema de pantallas 3D con carrusel de proyectos
- Objetos interactivos con física Havok (click derecho)
- Enfoque inteligente de cámara (perpendicular al target)
- UI overlay moderna con glassmorphism
- Responsive design (mobile + desktop)
- Sistema de debug integrado (?debug=true)

### ⚠️ Pendiente (Para Después):
- Agregar tus videos VR en `public/videos/`
- Actualizar información de proyectos en `src/data/projects.ts`
- Reactivar furniture.glb (opcional)

## 🔄 Después del Deploy

### Verificar:
1. Espera 2-5 minutos
2. Abre: `https://delias2798.github.io/`
3. Limpia cache: **Ctrl + Shift + R**
4. Deberías ver tu portfolio 3D funcionando

### Probar:
- [ ] Escena 3D carga correctamente
- [ ] Puedes rotar cámara (click izq + drag)
- [ ] Click derecho en objetos los agarra
- [ ] Click izquierdo en pantalla enfoca
- [ ] Overlay aparece con información
- [ ] Botones ‹ › navegan entre proyectos
- [ ] ESC sale del enfoque

## 🎯 Próximos Pasos (Después de Deploy)

### Paso 1: Agregar Videos VR
Ver: `VIDEOS_SETUP.md`

### Paso 2: Personalizar Información
Editar: `src/data/projects.ts`

### Paso 3: Redeploy con Videos
```powershell
git add public/videos/ src/data/projects.ts
git commit -m "feat: agregar videos VR de proyectos"
git push origin main && npm run deploy
```

## 🆘 Si Algo Sale Mal

Ver: `DEPLOY_GUIDE.md` para troubleshooting completo.

## 📞 Comandos Útiles Post-Deploy

### Ver Historial de Deploys:
```powershell
git log --oneline origin/gh-pages | Select-Object -First 5
```

### Forzar Redeploy:
```powershell
npm run deploy
```

### Rollback (Volver a Versión Anterior):
```powershell
git checkout <commit-hash> -- .
git commit -m "rollback"
npm run deploy
```

---

## 🎉 ¡Listo para Deploy!

**Ejecuta los 3 comandos de arriba y tu portfolio estará online.** 🚀

**URL final:** https://delias2798.github.io/

