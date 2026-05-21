@echo off
title FlyGo Git Manager
color 0B

echo ============================================
echo              FLYGO GIT MANAGER
echo ============================================
echo.
echo [1/4] Entrando al proyecto...
echo.

:: Cambiamos a la carpeta y verificamos si existe
cd /d "C:\Users\El Loco Mike\Desktop\FlyGo\FlyGo"| (echo Error: No se pudo acceder a la carpeta. & pause & exit)

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

:: Verificamos que el mensaje no esté vacío
if "%commitmsg%"=="" (
    echo Error: El mensaje del commit no puede estar vacio.
    pause
    exit
)

echo.
echo ============================================
echo [4/4] Subiendo cambios...
echo ============================================
echo.

:: Preparamos y hacemos el commit
git add .
git commit -m "%commitmsg%"

:: Verificamos si el commit tuvo éxito antes de intentar el push
if %errorlevel% neq 0 (
    echo.
    echo [!] No se realizaron cambios para subir.
    echo.
    pause
    exit
)

:: Subimos los cambios
git push
if %errorlevel% neq 0 (
    echo.
    echo [!] Error al subir a GitHub.
    pause
    exit
)

echo.
echo ============================================
echo       TODO SUBIDO CORRECTAMENTE
echo ============================================
echo.

pause