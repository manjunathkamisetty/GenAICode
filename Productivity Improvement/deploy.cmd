@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ===================================================
:: FORCE NODE.JS DEPLOYMENT FOR CP SIMULATOR
:: ===================================================

echo.
echo ============================================
echo CP SIMULATOR AZURE DEPLOYMENT SCRIPT
echo ============================================
echo Timestamp: %date% %time%
echo Deployment Source: %DEPLOYMENT_SOURCE%
echo Deployment Target: %DEPLOYMENT_TARGET%
echo.

:: Setup default paths if not provided by Azure
IF NOT DEFINED DEPLOYMENT_SOURCE (
  SET DEPLOYMENT_SOURCE=%~dp0%.
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%~dp0%..\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%~dp0%..\artifacts\manifest
  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%~dp0%..\artifacts\manifest
  )
)

:: Install KuduSync for file copying
IF NOT DEFINED KUDU_SYNC_CMD (
  echo Installing KuduSync...
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)

echo Step 1: Copying Node.js application files...
:: Copy main application files
copy "%DEPLOYMENT_SOURCE%\package.json" "%DEPLOYMENT_TARGET%\"
copy "%DEPLOYMENT_SOURCE%\server.js" "%DEPLOYMENT_TARGET%\"
copy "%DEPLOYMENT_SOURCE%\web.config" "%DEPLOYMENT_TARGET%\"
copy "%DEPLOYMENT_SOURCE%\iisnode.yml" "%DEPLOYMENT_TARGET%\"
copy "%DEPLOYMENT_SOURCE%\index.html" "%DEPLOYMENT_TARGET%\"

echo Step 2: Copying cp-simulator source...
xcopy "%DEPLOYMENT_SOURCE%\cp-simulator" "%DEPLOYMENT_TARGET%\cp-simulator\" /E /Y /I

echo Step 3: Installing dependencies in deployment target...
pushd "%DEPLOYMENT_TARGET%"
call npm install
IF !ERRORLEVEL! NEQ 0 (
  echo ERROR: npm install failed
  popd
  goto error
)

echo Step 4: Building React application...
call npm run build
IF !ERRORLEVEL! NEQ 0 (
  echo ERROR: npm build failed
  popd
  goto error
)

popd

echo Step 5: Verifying deployment...
IF NOT EXIST "%DEPLOYMENT_TARGET%\server.js" (
  echo ERROR: server.js not found in deployment target
  goto error
)

IF NOT EXIST "%DEPLOYMENT_TARGET%\package.json" (
  echo ERROR: package.json not found in deployment target
  goto error
)

echo.
echo ============================================
echo CP SIMULATOR DEPLOYMENT COMPLETED SUCCESS
echo ============================================
echo Files deployed to: %DEPLOYMENT_TARGET%
echo Check Azure logs for Node.js startup messages
echo ============================================
goto end

:error
echo.
echo ============================================
echo DEPLOYMENT FAILED - CHECK LOGS
echo ============================================
endlocal
echo An error has occurred during deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Deployment script completed successfully. 