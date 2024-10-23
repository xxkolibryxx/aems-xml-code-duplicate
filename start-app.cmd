@echo off
:: Запуск React приложения
echo Starting the development server...
npm start

:: Проверка на ошибки
if %ERRORLEVEL% neq 0 (
    echo An error occurred while starting the application.
    exit /b %ERRORLEVEL%
)

:: Завершаем скрипт
echo Application is running.
pause
