@echo off
:: Batch script to permanently disable background bloatware and telemetry services
:: Must be run as Administrator (Right click -> Run as Administrator)

echo ======================================================
echo Disabling Unnecessary Background and Telemetry Services
echo ======================================================

set services=AdobeUpdateService "Bonjour Service" DiagTrack "Lenovo Instant On" "Tekla Warehouse" "Autodesk Access Service Host" "Autodesk CER Service" "Autodesk Content Service" brave bravem MapsBroker dmwappushservice XblAuthManager XblGameSave XboxNetApiSvc

for %%s in (%services%) do (
    echo Disabling %%s...
    sc config %%s start= disabled
    sc stop %%s
)

echo.
echo ======================================================
echo Successfully disabled background services!
echo ======================================================
pause
