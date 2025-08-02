# Script PowerShell để cập nhật danh sách video
# Chạy: .\update-videos.ps1

Write-Host "🎬 Multi Video Player - Video Scanner" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Node.js có được cài đặt không
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "💡 Vui lòng cài đặt Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra folder video có tồn tại không
if (-not (Test-Path "video")) {
    Write-Host "❌ Folder video/ không tồn tại!" -ForegroundColor Red
    Write-Host "💡 Tạo folder video/ và đặt video vào đó" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra file index.js có tồn tại không
if (-not (Test-Path "video/index.js")) {
    Write-Host "❌ File video/index.js không tồn tại!" -ForegroundColor Red
    Write-Host "💡 Vui lòng kiểm tra lại cấu trúc project" -ForegroundColor Yellow
    exit 1
}

# Chạy script Node.js
Write-Host "🚀 Đang chạy script cập nhật video..." -ForegroundColor Green
Write-Host ""

try {
    node video/index.js
    Write-Host ""
    Write-Host "✅ Hoàn thành cập nhật video!" -ForegroundColor Green
    Write-Host "🔄 Refresh trang web để xem danh sách video mới" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Có lỗi xảy ra khi chạy script!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 