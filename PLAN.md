# Kế Hoạch Phát Triển Trang Web Xem Nhiều Video Cùng Lúc

## Mục Tiêu Dự Án
Tạo một trang web local cho phép người dùng mở và xem nhiều video cùng lúc, hỗ trợ việc xem lại và so sánh nội dung video.

## Công Nghệ Sử Dụng
- **HTML5**: Cấu trúc trang web và video elements
- **CSS3**: Styling, layout responsive, animations
- **JavaScript (ES6+)**: Logic xử lý, controls, drag & drop
- **Local Storage**: Lưu trữ cấu hình người dùng

## Tính Năng Chính

### 1. Giao Diện Chính
- **Grid Layout**: Hiển thị nhiều video theo dạng lưới có thể tùy chỉnh
- **Responsive Design**: Tương thích với các kích thước màn hình khác nhau
- **Dark/Light Theme**: Chế độ sáng/tối
- **Sidebar**: Panel điều khiển và quản lý video
- **Toggle Navbar**: Ẩn/hiện header và sidebar cùng lúc, video grid chiếm toàn màn hình, có nút floating để bật lại

### 2. Quản Lý Video
- **Video Loading**: Load video từ file JSON `video/videos.json`
- **Video Controls**: Play/pause, volume, speed, fullscreen cho từng video
- **Synchronization**: Đồng bộ play/pause cho tất cả video
- **Individual Controls**: Điều khiển riêng từng video
- **Video List**: Danh sách video có sẵn từ JSON

### 3. Layout & Grid System
- **Flexible Grid**: 1x1, 2x2, 3x3, 4x4, custom layout
- **Drag & Drop**: Kéo thả để sắp xếp lại vị trí video
- **Resize**: Thay đổi kích thước từng video
- **Focus Mode**: Phóng to một video cụ thể

### 4. Tính Năng Nâng Cao
- **Bookmarks**: Đánh dấu thời điểm quan trọng
- **Notes**: Ghi chú cho từng video
- **Export/Import**: Xuất/nhập cấu hình layout
- **Keyboard Shortcuts**: Phím tắt để điều khiển nhanh
- **Toggle Controls**: Ẩn/hiện navbar (header + sidebar) với animation mượt mà

## Cấu Trúc File

```
multi-video-player/
├── index.html
├── css/
│   ├── style.css
│   ├── grid.css
│   └── themes.css
├── js/
│   ├── main.js
│   ├── videoManager.js
│   ├── gridManager.js
│   ├── controls.js
│   └── utils.js
├── video/
│   ├── video1.mp4
│   ├── video2.mp4
│   └── ...
├── assets/
│   ├── icons/
│   └── images/
└── README.md
```

## Kế Hoạch Triển Khai

### Phase 1: Cơ Bản (Tuần 1)
- [x] Tạo cấu trúc HTML cơ bản
- [x] CSS layout và styling
- [x] JavaScript load và hiển thị video từ folder
- [x] Video controls cơ bản (play/pause, volume)
- [x] Toggle navbar (ẩn/hiện header và sidebar cùng lúc)

### Phase 2: Grid System (Tuần 2)
- [x] Grid layout system
- [x] Drag & drop để sắp xếp video
- [x] Resize video containers
- [x] Synchronization controls

### Phase 3: Tính Năng Nâng Cao (Tuần 3)
- [x] Keyboard shortcuts
- [x] Theme switching
- [ ] Bookmarks và notes
- [ ] Export/import cấu hình

### Phase 4: Tối Ưu Hóa (Tuần 4)
- [x] Error handling
- [x] Documentation
- [ ] Performance optimization
- [ ] Testing và debugging

## Công Nghệ Chi Tiết

### HTML5 Video API
```javascript
// Ví dụ sử dụng
const video = document.createElement('video');
video.src = './video/video1.mp4';
video.controls = true;
```

### CSS Grid/Flexbox
```css
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
}
```

### Video Loading
```javascript
// Load video từ JSON file
const response = await fetch('./video/videos.json');
const data = await response.json();
const videoFiles = data.videos;

videoFiles.forEach(filename => {
    const video = document.createElement('video');
    video.src = `./video/${filename}`;
    video.controls = true;
});
```

### Local Storage
```javascript
// Lưu cấu hình
localStorage.setItem('videoLayout', JSON.stringify(layout));

// Lưu trạng thái toggle navbar
localStorage.setItem('navbarHidden', navbarHidden);
```

### Toggle Navbar System
```javascript
// Toggle navbar (header + sidebar)
const toggleNavbar = () => {
    const isHidden = header.classList.contains('hidden');
    
    header.classList.toggle('hidden');
    sidebar.classList.toggle('hidden');
    mainContent.classList.toggle('navbar-hidden');
    videoSection.classList.toggle('fullscreen');
    
    Utils.Storage.set('navbarHidden', !isHidden);
};

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        toggleNavbar();
    }
});
```

## Giao Diện Mockup

### Layout Chính
```
┌─────────────────────────────────────────┐
│ Header: Multi Video Player [☰] [⚙️]    │
├─────────────────────────────────────────┤
│ Sidebar │ Video Grid                   │
│ Controls│ ┌─────┐ ┌─────┐             │
│ [⌃]     │ │ V1  │ │ V2  │             │
│         │ └─────┘ └─────┘             │
│         │ ┌─────┐ ┌─────┐             │
│         │ │ V3  │ │ V4  │             │
│         │ └─────┘ └─────┘             │
└─────────────────────────────────────────┘

Toggle Controls:
- ☰ : Toggle navbar (Ctrl+N)
- ☰ : Floating toggle button (hiện khi navbar ẩn)
- Ẩn/hiện cả header và sidebar cùng lúc
- Video grid chiếm toàn màn hình khi ẩn navbar
```

### Controls Panel
- Video selector (dropdown)
- Grid layout selector
- Sync controls
- Theme toggle
- Settings
- **Toggle Controls**:
  - Navbar toggle button (☰/✕)
  - Floating toggle button (☰) hiện khi navbar ẩn
  - Ẩn/hiện header và sidebar cùng lúc
  - Keyboard shortcut (Ctrl+N)
  - Video grid chiếm toàn màn hình khi ẩn
  - State persistence với localStorage

## Performance Considerations
- Lazy loading video
- Thumbnail generation
- Memory management
- Browser compatibility

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Testing Strategy
- Unit tests cho JavaScript functions
- Cross-browser testing
- Performance testing với nhiều video
- User experience testing

## Deployment
- Local development server
- GitHub Pages (optional)
- Documentation và hướng dẫn sử dụng
