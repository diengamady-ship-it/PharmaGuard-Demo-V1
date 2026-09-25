@echo off
title Installation PharmaGuard SN
cd /d "%~dp0pharmaguard-api"

echo ===========================================
echo   Installation des dependances du serveur
echo ===========================================

where python >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Python est introuvable. Installez-le depuis https://www.python.org/downloads/
    echo          en cochant "Add python.exe to PATH", puis relancez ce script.
    pause
    exit /b 1
)

rem Un venv cree avec une autre version de Python ne fonctionne plus : on le recree
if exist "venv\Scripts\python.exe" (
    "venv\Scripts\python.exe" -c "import fastapi, uvicorn" >nul 2>&1
    if errorlevel 1 (
        echo Environnement virtuel existant inutilisable, recreation...
        rmdir /s /q venv
    )
)

if not exist "venv\Scripts\python.exe" (
    echo Creation de l'environnement virtuel...
    python -m venv venv
)
if not exist "venv\Scripts\python.exe" (
    echo [ERREUR] Impossible de creer l'environnement virtuel.
    pause
    exit /b 1
)

echo Installation des paquets (requirements.txt)...
"venv\Scripts\python.exe" -m pip install --upgrade pip >nul
"venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo [ERREUR] L'installation des paquets a echoue. Verifiez votre connexion Internet.
    pause
    exit /b 1
)

echo ===========================================
echo   Installation terminee. Lancez START_DEMO.bat
echo ===========================================
pause
