@echo off
title FlyGo - Descargar Cambios
color 0B

:inicio
cls

echo.
echo  ===============================================
echo                FLYGO UPDATE SYSTEM
echo  ===============================================
echo.
echo         Este script va a:
echo.
echo          [✓] Entrar al proyecto
echo          [✓] Descargar cambios de GitHub
echo          [✓] Actualizar tu repositorio
echo.
echo  ===============================================
echo.

pause

cls

echo.
echo  ===============================================
echo             CONECTANDO CON GITHUB...
echo  ===============================================
echo.

cd /d "C:\Users\El Loco Mike\Desktop\FlyGo\FlyGo"

echo.
echo  Descargando cambios...
echo.

git pull

echo.
echo  ===============================================
echo              ACTUALIZACION COMPLETADA
echo  ===============================================
echo.

echo  Ya tenes la ultima version del proyecto.
echo.

pause