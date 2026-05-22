# 🚀 Script de Deploy para GitHub Pages (PowerShell)
# Portfolio VR/XR BabylonJS

Write-Host "🚀 Iniciando proceso de deploy..." -ForegroundColor Cyan
Write-Host ""

# Paso 1: Verificar estado de Git
Write-Host "📊 Verificando estado de Git..." -ForegroundColor Yellow
git status

Write-Host ""
$commitChanges = Read-Host "¿Hay cambios que quieras commitear? (s/n)"

if ($commitChanges -eq "s" -or $commitChanges -eq "S") {
    # Paso 2: Agregar cambios
    Write-Host "📦 Agregando archivos al staging..." -ForegroundColor Yellow
    git add .
    
    # Paso 3: Commit
    Write-Host ""
    $commitMessage = Read-Host "Mensaje de commit"
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Update portfolio"
    }
    
    git commit -m $commitMessage
    
    # Paso 4: Push a main
    Write-Host "⬆️ Subiendo cambios a GitHub (rama main)..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Código fuente actualizado en GitHub" -ForegroundColor Green
    } else {
        Write-Host "❌ Error al hacer push" -ForegroundColor Red
        exit 1
    }
}

# Paso 5: Build
Write-Host ""
Write-Host "🔨 Compilando proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso" -ForegroundColor Green
} else {
    Write-Host "❌ Error en build. Abortando deploy." -ForegroundColor Red
    exit 1
}

# Paso 6: Deploy a GitHub Pages
Write-Host ""
Write-Host "🌐 Deploying a GitHub Pages..." -ForegroundColor Yellow
npx gh-pages -d dist

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 ¡Deploy exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu portfolio estará disponible en:" -ForegroundColor Cyan
    Write-Host "🔗 https://delias2798.github.io/" -ForegroundColor White
    Write-Host ""
    Write-Host "⏱️ Puede tardar 1-5 minutos en actualizarse." -ForegroundColor Yellow
    Write-Host "💡 Limpia cache del navegador (Ctrl + Shift + R) para ver cambios." -ForegroundColor Yellow
} else {
    Write-Host "❌ Error en deploy." -ForegroundColor Red
    exit 1
}

