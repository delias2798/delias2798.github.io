#!/bin/bash

# 🚀 Script de Deploy para GitHub Pages
# Portfolio VR/XR BabylonJS

echo "🚀 Iniciando proceso de deploy..."
echo ""

# Paso 1: Verificar estado de Git
echo "📊 Verificando estado de Git..."
git status

echo ""
read -p "¿Hay cambios que quieras commitear? (s/n): " commit_changes

if [ "$commit_changes" = "s" ] || [ "$commit_changes" = "S" ]; then
    # Paso 2: Agregar cambios
    echo "📦 Agregando archivos al staging..."
    git add .
    
    # Paso 3: Commit
    echo ""
    read -p "Mensaje de commit: " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update portfolio"
    fi
    
    git commit -m "$commit_message"
    
    # Paso 4: Push a main
    echo "⬆️ Subiendo cambios a GitHub (rama main)..."
    git push origin main
    
    echo "✅ Código fuente actualizado en GitHub"
fi

# Paso 5: Build
echo ""
echo "🔨 Compilando proyecto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
else
    echo "❌ Error en build. Abortando deploy."
    exit 1
fi

# Paso 6: Deploy a GitHub Pages
echo ""
echo "🌐 Deploying a GitHub Pages..."
npx gh-pages -d dist

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Deploy exitoso!"
    echo ""
    echo "Tu portfolio estará disponible en:"
    echo "🔗 https://delias2798.github.io/"
    echo ""
    echo "⏱️ Puede tardar 1-5 minutos en actualizarse."
    echo "💡 Limpia cache del navegador (Ctrl + Shift + R) para ver cambios."
else
    echo "❌ Error en deploy."
    exit 1
fi

