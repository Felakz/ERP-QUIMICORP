# ERP QUIMICORP v2.4 - Automatic Setup Script for New PC
# Execute in PowerShell: .\setup.ps1

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🚀 CONFIGURANDO ENTORNO ERP QUIMICORP Y ANTIGRAVITY IDE " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$userGeminiPath = Join-Path $env:USERPROFILE ".gemini"
$configDst = Join-Path $userGeminiPath "config"
$configSrc = Join-Path $PSScriptRoot ".antigravity-config"

# 1. Configurar Antigravity (Skills & Plugins)
Write-Host "`n[1/4] Instalando configuraciones de Antigravity (Skills, Plugins y Personalización)..." -ForegroundColor Yellow
if (Test-Path $configSrc) {
    if (-not (Test-Path $userGeminiPath)) {
        New-Item -ItemType Directory -Path $userGeminiPath -Force | Out-Null
    }
    if (-not (Test-Path $configDst)) {
        New-Item -ItemType Directory -Path $configDst -Force | Out-Null
    }
    Copy-Item -Path "$configSrc\*" -Destination $configDst -Recurse -Force
    Write-Host "  ✅ Configuraciones de Antigravity instaladas en: $configDst" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ No se encontró la carpeta .antigravity-config" -ForegroundColor Red
}

# 2. Configurar Archivos de Entorno (.env)
Write-Host "`n[2/4] Verificando archivos de entorno (.env)..." -ForegroundColor Yellow

$backendEnvExample = Join-Path $PSScriptRoot "backend\.env.example"
$backendEnv = Join-Path $PSScriptRoot "backend\.env"
if (-not (Test-Path $backendEnv) -and (Test-Path $backendEnvExample)) {
    Copy-Item -Path $backendEnvExample -Destination $backendEnv
    Write-Host "  ✅ Creado backend\.env desde .env.example" -ForegroundColor Green
}

$frontendEnvExample = Join-Path $PSScriptRoot "frontend\.env.local.example"
$frontendEnv = Join-Path $PSScriptRoot "frontend\.env.local"
if (-not (Test-Path $frontendEnv) -and (Test-Path $frontendEnvExample)) {
    Copy-Item -Path $frontendEnvExample -Destination $frontendEnv
    Write-Host "  ✅ Creado frontend\.env.local desde .env.local.example" -ForegroundColor Green
}

# 3. Instalar Dependencias de Node.js
Write-Host "`n[3/4] Instalando paquetes de Node.js (Backend y Frontend)..." -ForegroundColor Yellow

Write-Host "  📦 Instalando dependencias Backend..." -ForegroundColor Cyan
Push-Location "$PSScriptRoot\backend"
npm install
Pop-Location

Write-Host "  📦 Instalando dependencias Frontend..." -ForegroundColor Cyan
Push-Location "$PSScriptRoot\frontend"
npm install
Pop-Location

# 4. Finalización y Comandos de Ejecución
Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  ✨ ¡CONFIGURACIÓN COMPLETADA CON ÉXITO!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "`nPara iniciar el proyecto en la nueva PC:" -ForegroundColor White
Write-Host "  1. Backend:  cd backend; npm run start:dev" -ForegroundColor Cyan
Write-Host "  2. Frontend: cd frontend; npm run dev" -ForegroundColor Cyan
Write-Host "  3. Abre el navegador en: http://localhost:3000" -ForegroundColor Yellow
Write-Host "`n¡Tu Antigravity IDE ya cuenta con todas tus skills y plugins cargados!" -ForegroundColor Green
