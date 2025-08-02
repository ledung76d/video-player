const fs = require('fs');
const path = require('path');

/**
 * Script để tự động cập nhật file videos.json
 * Chạy: node video/index.js
 */

// Cấu hình
const VIDEO_FOLDER = './video';
const JSON_FILE = './video/videos.json';
const SUPPORTED_FORMATS = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm'];

/**
 * Lấy danh sách file video từ folder
 */
function getVideoFiles() {
    try {
        const files = fs.readdirSync(VIDEO_FOLDER);
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_FORMATS.includes(ext);
        });
    } catch (error) {
        console.error('❌ Lỗi khi đọc folder video:', error.message);
        return [];
    }
}

/**
 * Tạo cấu trúc JSON mới
 */
function createVideoJSON(videoFiles) {
    return {
        videos: videoFiles,
        metadata: {
            totalVideos: videoFiles.length,
            lastUpdated: new Date().toISOString(),
            version: "1.0",
            description: "Danh sách video có sẵn trong Multi Video Player",
            supportedFormats: SUPPORTED_FORMATS
        }
    };
}

/**
 * Cập nhật file JSON
 */
function updateVideoJSON() {
    console.log('🔍 Đang scan folder video...');
    
    const videoFiles = getVideoFiles();
    
    if (videoFiles.length === 0) {
        console.log('⚠️  Không tìm thấy file video nào trong folder video/');
        console.log('📝 Các định dạng được hỗ trợ:', SUPPORTED_FORMATS.join(', '));
        return;
    }
    
    console.log(`📹 Tìm thấy ${videoFiles.length} file video:`);
    videoFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
    
    const jsonData = createVideoJSON(videoFiles);
    
    try {
        fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2), 'utf8');
        console.log('✅ Đã cập nhật file videos.json thành công!');
        console.log(`📊 Thống kê: ${videoFiles.length} video`);
        console.log(`🕒 Cập nhật lúc: ${new Date().toLocaleString('vi-VN')}`);
    } catch (error) {
        console.error('❌ Lỗi khi ghi file JSON:', error.message);
    }
}

/**
 * Kiểm tra file JSON hiện tại
 */
function checkCurrentJSON() {
    try {
        if (fs.existsSync(JSON_FILE)) {
            const currentData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
            console.log('📋 Thông tin file JSON hiện tại:');
            console.log(`   - Tổng video: ${currentData.metadata?.totalVideos || 0}`);
            console.log(`   - Cập nhật lần cuối: ${currentData.metadata?.lastUpdated || 'Không có'}`);
        } else {
            console.log('📋 File videos.json chưa tồn tại, sẽ tạo mới');
        }
    } catch (error) {
        console.log('📋 File videos.json có lỗi, sẽ tạo lại');
    }
}

/**
 * Hiển thị hướng dẫn sử dụng
 */
function showHelp() {
    console.log('\n📖 HƯỚNG DẪN SỬ DỤNG:');
    console.log('1. Đặt file video vào folder video/');
    console.log('2. Chạy lệnh: node video/index.js');
    console.log('3. File videos.json sẽ được cập nhật tự động');
    console.log('4. Refresh trang web để load danh sách video mới');
    console.log('\n📝 Các định dạng video được hỗ trợ:');
    SUPPORTED_FORMATS.forEach(format => console.log(`   - ${format}`));
}

/**
 * Main function
 */
function main() {
    console.log('🎬 Multi Video Player - Video Scanner');
    console.log('=====================================\n');
    
    // Kiểm tra folder video có tồn tại không
    if (!fs.existsSync(VIDEO_FOLDER)) {
        console.error('❌ Folder video/ không tồn tại!');
        console.log('💡 Tạo folder video/ và đặt video vào đó');
        return;
    }
    
    // Kiểm tra file JSON hiện tại
    checkCurrentJSON();
    console.log('');
    
    // Cập nhật file JSON
    updateVideoJSON();
    console.log('');
    
    // Hiển thị hướng dẫn
    showHelp();
}

// Chạy script
if (require.main === module) {
    main();
}

module.exports = {
    getVideoFiles,
    createVideoJSON,
    updateVideoJSON
}; 