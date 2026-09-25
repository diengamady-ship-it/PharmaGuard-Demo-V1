@echo off
title PharmaGuard SN - Lancement
cd /d "%~dp0"

start "PharmaGuard SN - Serveur" /D "%~dp0." cmd /k START_BACKEND.bat

echo Attente du serveur...
for /l %%i in (1,1,30) do (
    curl -s -o nul http://localhost:8000/api/v1/status && goto ok
    timeout /t 1 /nobreak >nul
)
echo [ATTENTION] Le serveur ne repond pas. Regardez la fenetre "PharmaGuard SN - Serveur".
pause
exit /b 1

:ok
start http://localhost:8000/landing.html
