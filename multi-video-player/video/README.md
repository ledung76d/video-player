# Video Scanner - Tự động cập nhật danh sách video

Script này giúp tự động cập nhật file `videos.json` khi bạn thêm video vào folder `video/`.

## 📋 Cách sử dụng

### 1. Thêm video vào folder
Đặt các file video vào folder `video/` với các định dạng được hỗ trợ:
- `.mp4`
- `.avi`
- `.mov`
- `.mkv`
- `.wmv`
- `.flv`
- `.webm`

### 2. Chạy script cập nhật

#### Cách 1: Sử dụng Node.js trực tiếp
```bash
node video/index.js
```

#### Cách 2: Sử dụng PowerShell script (Windows)
```powershell
.\update-videos.ps1
```

### 3. Kết quả
Script sẽ:
- ✅ Scan folder `video/` để tìm file video
- ✅ Cập nhật file `videos.json` với danh sách mới
- ✅ Hiển thị thống kê và thông tin cập nhật
- ✅ Hiển thị hướng dẫn sử dụng

### 4. Refresh trang web
Sau khi chạy script, refresh trang web để load danh sách video mới.

## 📊 Ví dụ output

```
🎬 Multi Video Player - Video Scanner
=====================================

📋 Thông tin file JSON hiện tại:
   - Tổng video: 4
   - Cập nhật lần cuối: 2025-02-08T10:30:00.000Z

🔍 Đang scan folder video...

📹 Tìm thấy 6 file video:
   1. sample1.mp4
   2. sample2.mp4
   3. sample3.mp4
   4. sample4.mp4
   5. demo1.mp4
   6. demo2.mp4

✅ Đã cập nhật file videos.json thành công!
📊 Thống kê: 6 video
🕒 Cập nhật lúc: 08/02/2025 17:30:00

📖 HƯỚNG DẪN SỬ DỤNG:
1. Đặt file video vào folder video/
2. Chạy lệnh: node video/index.js
3. File videos.json sẽ được cập nhật tự động
4. Refresh trang web để load danh sách video mới

📝 Các định dạng video được hỗ trợ:
   - .mp4
   - .avi
   - .mov
   - .mkv
   - .wmv
   - .flv
   - .webm
```

## 🔧 Cấu trúc file JSON

File `videos.json` sẽ có cấu trúc:

```json
{
  "videos": [
    "sample1.mp4",
    "sample2.mp4",
    "sample3.mp4",
    "sample4.mp4",
    "demo1.mp4",
    "demo2.mp4"
  ],
  "metadata": {
    "totalVideos": 6,
    "lastUpdated": "2025-02-08T10:30:00.000Z",
    "version": "1.0",
    "description": "Danh sách video có sẵn trong Multi Video Player",
    "supportedFormats": [".mp4", ".avi", ".mov", ".mkv", ".wmv", ".flv", ".webm"]
  }
}
```

## ⚠️ Lưu ý

1. **Node.js**: Cần cài đặt Node.js để chạy script
2. **Quyền truy cập**: Đảm bảo có quyền đọc/ghi file trong folder
3. **Định dạng**: Chỉ các file video với định dạng được hỗ trợ mới được thêm vào
4. **Backup**: Script sẽ ghi đè file `videos.json` hiện tại

## 🚀 Tự động hóa

Bạn có thể tạo batch file hoặc shortcut để chạy script nhanh hơn:

### Windows Batch File (`update-videos.bat`)
```batch
@echo off
node video/index.js
pause
```

### Linux/Mac Shell Script (`update-videos.sh`)
```bash
#!/bin/bash
node video/index.js
```

## 📝 Troubleshooting

### Lỗi "Node.js chưa được cài đặt"
- Tải và cài đặt Node.js từ: https://nodejs.org/

### Lỗi "Folder video/ không tồn tại"
- Tạo folder `video/` trong thư mục project

### Lỗi "Không tìm thấy file video"
- Kiểm tra định dạng file có được hỗ trợ không
- Đảm bảo file video đã được copy vào folder `video/`

### Lỗi "Quyền truy cập bị từ chối"
- Chạy PowerShell/Command Prompt với quyền Administrator
- Kiểm tra quyền đọc/ghi trong folder project 