@echo off
title Push Emaratis Fashion to GitHub
cd /d "%~dp0"
echo ========================================================
echo   EMARATIS FASHION - PUSH TO GITHUB
echo ========================================================
echo.
echo Connecting to: https://github.com/syedzakirazanaqvi786-stack/Emaratis-fashion.git
echo.
echo NOTE: Agar screen par GitHub ka login box ya browser popup aaye,
echo to 'Sign in with your browser' par click kar ke Authorize karein.
echo.
echo Pushing files to main branch...
echo ========================================================
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ========================================================
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
) else (
    echo [NOTICE] Agar koi authentication issue aye, to check karein.
)
echo ========================================================
pause
