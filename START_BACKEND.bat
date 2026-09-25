@echo off
title PharmaGuard SN - Serveur (port 8000)
cd /d "%~dp0pharmaguard-api"

if not exist "venv\Scripts\python.exe" (
    echo [ERREUR] Environnement virtuel absent. Lancez d'abord INSTALL_DEMO.bat
    pause
    exit /b 1
)
"venv\Scripts\python.exe" -c "import fastapi, uvicorn" >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Dependances manquantes. Lancez d'abord INSTALL_DEMO.bat
    pause
    exit /b 1
)

echo Application : http://localhost:8000/landing.html
echo Documentation API : http://localhost:8000/docs
echo NE CLIQUEZ PAS dans cette fenetre (cela met le serveur en pause).
echo Fermez cette fenetre pour arreter le serveur.
echo.
"venv\Scripts\python.exe" -m uvicorn main:app --port 8000
pause
