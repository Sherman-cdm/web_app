@echo off
title Mi Salud - Hospitales de Pilar
cd /d "%~dp0"
echo ===================================================
echo   Iniciando Mi Salud - Hospitales de Pilar
echo ===================================================
echo.
echo Abriendo la aplicacion en el navegador...
start http://127.0.0.1:5173
echo.
npm.cmd run dev
pause
