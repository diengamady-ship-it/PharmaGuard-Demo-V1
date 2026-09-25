@echo off
chcp 65001 > nul
title Tests API PharmaGuard SN
echo ===========================================
echo   TEST 1 - Statut du serveur
echo ===========================================
curl -s http://localhost:8000/api/v1/status
echo.
echo.
echo ===========================================
echo   TEST 2 - Autocomplete Medicaments (q=asp)
echo ===========================================
curl -s "http://localhost:8000/api/v1/medicaments/search?q=asp"
echo.
echo.
echo ===========================================
echo   TEST 3 - Analyse d'Ordonnance (Moussa Diallo)
echo ===========================================
curl -s -X POST http://localhost:8000/api/v1/analyse ^
  -H "Content-Type: application/json" ^
  -d "{\"patient_nom\": \"Moussa Diallo\",\"patient_age\": 58,\"medicaments\": [{\"nom\": \"Kardegic\"},{\"nom\": \"Sintrom\"},{\"nom\": \"Brufen\"},{\"nom\": \"Metformine\"},{\"nom\": \"Lisinopril\"}]}"
echo.
echo.
pause
