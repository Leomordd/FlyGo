@echo off
:: Cambia el color de la consola (0 = Fondo Negro, 9 = Texto Azul Claro)
color 0B

:: Cambia la consola a la carpeta donde está guardado ESTE archivo .bat
cd /d "%~dp0"

echo ============================================
echo            FLYGO GIT MANAGER
echo ============================================
echo [1/4] Entrando al proyecto...
echo Carpeta actual: %cd%

echo ============================================
echo [2/4] Descargando cambios de GitHub...
echo ============================================
git pull

echo ============================================
echo [3/4] Preparando y escribiendo el mensaje del commit
echo ============================================
git add -A

set /p msg="Commit: "
git commit -m "%msg%"

echo ============================================
echo [4/4] Subiendo cambios...
echo ============================================
git push

pause