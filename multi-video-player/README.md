# Multi Video Player

Ứng dụng web cho phép xem nhiều video cùng lúc với giao diện grid linh hoạt.

## Tính Năng

### ✨ Tính Năng Chính
- **Grid Layout**: Hiển thị nhiều video theo dạng lưới (1x1, 2x2, 3x3, 4x4)
- **Video Controls**: Play/pause, volume, speed, fullscreen cho từng video
- **Synchronization**: Đồng bộ play/pause cho tất cả video
- **Drag & Drop**: Kéo thả để sắp xếp lại vị trí video
- **Resize**: Thay đổi kích thước từng video
- **Focus Mode**: Phóng to một video cụ thể
- **Dark/Light Theme**: Chế độ sáng/tối
- **Responsive Design**: Tương thích với các kích thước màn hình

### 🎮 Điều Khiển
- **Play/Pause**: Click nút ▶️ hoặc phím Space
- **Mute/Unmute**: Click nút 🔊 hoặc phím M
- **Fullscreen**: Click nút ⛶
- **Focus**: Click nút 🔍 để phóng to video
- **Remove**: Click nút ✕ để xóa video

### ⌨️ Phím Tắt
- `Space` - Phát/Tạm dừng tất cả
- `S` - Dừng tất cả
- `M` - Tắt/Bật âm thanh
- `Esc` - Thoát fullscreen
- `Ctrl+S` - Lưu trạng thái
- `Ctrl+R` - Đặt lại ứng dụng
- `Ctrl+H` - Hiển thị hướng dẫn

## Cài Đặt

### 1. Cấu Trúc Thư Mục
```
multi-video-player/
├── index.html
├── css/
│   ├── style.css
│   ├── grid.css
│   └── themes.css
├── js/
│   ├── utils.js
│   ├── videoManager.js
│   ├── gridManager.js
│   ├── controls.js
│   └── main.js
├── video/
│   ├── sample1.mp4
│   ├── sample2.mp4
│   └── ...
└── README.md
```

### 2. Thêm Video
1. Đặt các file video vào folder `video/`
2. Hỗ trợ định dạng: MP4, WebM, OGG, AVI, MOV, MKV
3. Khởi động ứng dụng và chọn video từ danh sách

### 3. Chạy Ứng Dụng
```bash
# Sử dụng Python HTTP server
python -m http.server 8000

# Hoặc sử dụng Node.js
npx http-server

# Hoặc mở trực tiếp file index.html trong trình duyệt
```

## Sử Dụng

### Bước 1: Thêm Video
1. Chọn video từ dropdown trong sidebar
2. Nhấn "Thêm Video" hoặc click vào video trong danh sách
3. Video sẽ xuất hiện trong grid

### Bước 2: Điều Khiển Video
- **Individual Controls**: Điều khiển riêng từng video
- **Sync Controls**: Đồng bộ tất cả video (Play All, Pause All, Stop All)
- **Layout Controls**: Thay đổi layout grid (1x1, 2x2, 3x3, 4x4)

### Bước 3: Tùy Chỉnh
- **Drag & Drop**: Kéo video để sắp xếp lại vị trí
- **Resize**: Kéo góc để thay đổi kích thước video
- **Focus**: Click nút 🔍 để phóng to video
- **Theme**: Click nút 🌙/☀️ để chuyển đổi theme

## Cài Đặt

### Settings Modal
Nhấn nút ⚙️ để mở cài đặt:
- **Tự động phát**: Tự động phát video khi thêm vào grid
- **Lặp lại**: Lặp lại video khi kết thúc
- **Âm lượng mặc định**: Âm lượng cho video mới
- **Tốc độ phát mặc định**: Tốc độ phát cho video mới
- **Giao diện**: Chọn theme sáng hoặc tối

## Tính Năng Nâng Cao

### Local Storage
- Lưu trữ cấu hình người dùng
- Lưu trạng thái video và layout
- Lưu cài đặt theme và controls

### Responsive Design
- Tự động điều chỉnh layout cho mobile
- Touch-friendly controls
- Optimized cho tablet và desktop

### Performance
- Lazy loading video
- Memory management
- Browser compatibility

## Hỗ Trợ Trình Duyệt

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Troubleshooting

### Video Không Tải Được
1. Kiểm tra định dạng video (MP4, WebM, OGG, AVI, MOV, MKV)
2. Kiểm tra đường dẫn file trong folder `video/`
3. Kiểm tra quyền truy cập file

### Layout Không Hiển Thị Đúng
1. Kiểm tra CSS Grid support của trình duyệt
2. Thử refresh trang
3. Kiểm tra console để xem lỗi

### Controls Không Hoạt Động
1. Kiểm tra JavaScript console
2. Thử refresh trang
3. Kiểm tra quyền truy cập localStorage

## Phát Triển

### Cấu Trúc Code
- **Modular Design**: Tách biệt các component
- **Event-Driven**: Sử dụng event listeners
- **Local Storage**: Lưu trữ state
- **Error Handling**: Xử lý lỗi gracefully

### Mở Rộng
- Thêm tính năng bookmarks
- Thêm notes cho video
- Export/import cấu hình
- Thêm filters và search

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console để xem lỗi
2. Thử refresh trang
3. Kiểm tra cài đặt trình duyệt
4. Tạo issue trên GitHub

---

**Multi Video Player** - Xem nhiều video cùng lúc một cách dễ dàng! 🎬 