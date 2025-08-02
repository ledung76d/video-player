@echo off
title Multi Video Player - Video Scanner
color 0A

echo.
echo ========================================
echo    Multi Video Player - Video Scanner
echo ========================================
echo.

REM Kiểm tra Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js chưa được cài đặt!
    echo Vui lòng cài đặt Node.js từ: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Kiểm tra folder video
if not exist "video" (
    echo [ERROR] Folder video/ không tồn tại!
    echo Tạo folder video/ và đặt video vào đó
    echo.
    pause
    exit /b 1
)

REM Kiểm tra file index.js
if not exist "video\index.js" (
    echo [ERROR] File video/index.js không tồn tại!
    echo Vui lòng kiểm tra lại cấu trúc project
    echo.
    pause
    exit /b 1
)

echo [INFO] Đang chạy script cập nhật video...
echo.

REM Chạy script Node.js
node video/index.js

echo.
echo [INFO] Hoàn thành cập nhật video!
echo [INFO] Refresh trang web để xem danh sách video mới
echo.
pause 