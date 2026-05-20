@echo off
title FlyGo Git Manager
color 0B

echo ============================================
echo              FLYGO GIT MANAGER
echo ============================================
echo.
echo [1/4] Entrando al proyecto...
echo.

cd /d "C:\Users\El Loco Mike\Desktop\FlyGo\FlyGo"

echo ============================================
echo [2/4] Descargando cambios de GitHub...
echo ============================================
echo.

git pull

echo.
echo ============================================
echo [3/4] Escribi el mensaje del commit
echo ============================================
echo.

set /p commitmsg=Commit: 

echo.
echo ============================================
echo [4/4] Subiendo cambios...
echo ============================================
echo.

git add .

git commit -m "%commitmsg%"

git push

echo.
echo ============================================
echo          TODO SUBIDO CORRECTAMENTE
echo ============================================
echo.

pause