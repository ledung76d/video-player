/**
 * Main Application - Initializes and coordinates all components
 */

class MultiVideoPlayer {
    constructor() {
        this.isInitialized = false;
        this.components = {
            videoManager: null,
            gridManager: null,
            controls: null
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.startApplication();
            });
        } else {
            this.startApplication();
        }
    }

    /**
     * Start the application
     */
    async startApplication() {
        try {
            console.log('🚀 Starting Multi Video Player...');
            
            // Initialize theme
            Utils.Theme.init();
            
            // Initialize components
            await this.initializeComponents();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Load initial state
            this.loadInitialState();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Multi Video Player initialized successfully!');
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Error initializing Multi Video Player:', error);
            this.showErrorMessage('Có lỗi xảy ra khi khởi tạo ứng dụng. Vui lòng tải lại trang.');
        }
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        // Initialize video manager first (it's async now)
        if (window.videoManager) {
            await window.videoManager.init();
        }
        
        // Store references to components
        this.components.videoManager = window.videoManager;
        this.components.gridManager = window.gridManager;
        this.components.controls = window.controls;
        
        if (!this.components.videoManager) {
            throw new Error('Video Manager not initialized');
        }
        
        if (!this.components.gridManager) {
            throw new Error('Grid Manager not initialized');
        }
        
        if (!this.components.controls) {
            throw new Error('Controls not initialized');
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEvents() {
        // Handle window resize
        Utils.DOM.addEvent(window, 'resize', () => {
            this.handleWindowResize();
        });

        // Handle beforeunload to save state
        Utils.DOM.addEvent(window, 'beforeunload', () => {
            this.saveApplicationState();
        });

        // Handle visibility change
        Utils.DOM.addEvent(document, 'visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle keyboard shortcuts globally
        Utils.DOM.addEvent(document, 'keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
    }

    /**
     * Load initial application state
     */
    loadInitialState() {
        // Load saved layout
        const savedLayout = Utils.Storage.get('currentLayout', '2x2');
        if (savedLayout && this.components.videoManager) {
            this.components.videoManager.currentLayout = savedLayout;
            this.components.videoManager.updateGridLayout();
        }

        // Load saved theme
        const savedTheme = Utils.Storage.get('theme', 'light');
        if (savedTheme) {
            document.body.classList.remove('light-theme', 'dark-theme');
            document.body.classList.add(`${savedTheme}-theme`);
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Update grid layout if needed
        if (this.components.gridManager) {
            const gridInfo = this.components.gridManager.getGridInfo();
            if (gridInfo) {
                // Adjust layout for smaller screens
                const width = window.innerWidth;
                if (width < 768) {
                    // Force single column layout on mobile
                    this.components.videoManager.currentLayout = '1x1';
                    this.components.videoManager.updateGridLayout();
                }
            }
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause all videos when tab becomes hidden
            if (this.components.videoManager) {
                this.components.videoManager.synchronizeVideos('pause');
            }
        }
    }

    /**
     * Handle global keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleGlobalKeyboard(e) {
        // Only handle shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl/Cmd + key combinations
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveApplicationState();
                    this.showMessage('Đã lưu trạng thái ứng dụng', 'success');
                    break;
                    
                case 'r':
                    e.preventDefault();
                    this.resetApplication();
                    break;
                    
                case 'h':
                    e.preventDefault();
                    this.showHelp();
                    break;
            }
        }
    }

    /**
     * Save application state
     */
    saveApplicationState() {
        try {
            const state = {
                layout: this.components.videoManager.currentLayout,
                theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
                timestamp: Date.now()
            };
            
            Utils.Storage.set('appState', state);
            console.log('💾 Application state saved');
        } catch (error) {
            console.error('Error saving application state:', error);
        }
    }

    /**
     * Reset application
     */
    resetApplication() {
        if (confirm('Bạn có chắc chắn muốn đặt lại ứng dụng? Tất cả dữ liệu sẽ bị mất.')) {
            // Clear localStorage
            Utils.Storage.remove('appState');
            Utils.Storage.remove('videoManagerState');
            Utils.Storage.remove('appSettings');
            
            // Reload page
            window.location.reload();
        }
    }

    /**
     * Show help information
     */
    showHelp() {
        const helpContent = `
            <div class="help-content">
                <h2>Hướng dẫn sử dụng</h2>
                
                <h3>Thêm video:</h3>
                <ul>
                    <li>Chọn video từ dropdown trong sidebar</li>
                    <li>Nhấn "Thêm Video" hoặc click vào video trong danh sách</li>
                </ul>
                
                <h3>Điều khiển video:</h3>
                <ul>
                    <li>Play/Pause: Click vào nút ▶️ hoặc Space</li>
                    <li>Mute/Unmute: Click vào nút 🔊 hoặc phím M</li>
                    <li>Fullscreen: Click vào nút ⛶</li>
                    <li>Focus: Click vào nút 🔍 để phóng to video</li>
                </ul>
                
                <h3>Đồng bộ hóa:</h3>
                <ul>
                    <li>Play All: Phát tất cả video cùng lúc</li>
                    <li>Pause All: Tạm dừng tất cả video</li>
                    <li>Stop All: Dừng tất cả video</li>
                </ul>
                
                <h3>Layout:</h3>
                <ul>
                    <li>1x1: Hiển thị 1 video</li>
                    <li>2x2: Hiển thị 4 video (2x2)</li>
                    <li>3x3: Hiển thị 9 video (3x3)</li>
                    <li>4x4: Hiển thị 16 video (4x4)</li>
                </ul>
                
                <h3>Phím tắt:</h3>
                <ul>
                    <li><kbd>Space</kbd> - Phát/Tạm dừng tất cả</li>
                    <li><kbd>S</kbd> - Dừng tất cả</li>
                    <li><kbd>M</kbd> - Tắt/Bật âm thanh</li>
                    <li><kbd>Esc</kbd> - Thoát fullscreen</li>
                    <li><kbd>Ctrl+S</kbd> - Lưu trạng thái</li>
                    <li><kbd>Ctrl+R</kbd> - Đặt lại ứng dụng</li>
                    <li><kbd>Ctrl+H</kbd> - Hiển thị hướng dẫn</li>
                </ul>
                
                <h3>Kéo thả:</h3>
                <ul>
                    <li>Kéo video để sắp xếp lại vị trí</li>
                    <li>Kéo góc để thay đổi kích thước video</li>
                </ul>
            </div>
        `;
        
        const modal = Utils.DOM.create('div', {
            className: 'modal-overlay'
        });
        
        const modalContent = Utils.DOM.create('div', {
            className: 'modal-content help-modal'
        });
        
        modalContent.innerHTML = helpContent;
        
        const closeBtn = Utils.DOM.create('button', {
            className: 'modal-close',
            style: 'position: absolute; top: 1rem; right: 1rem;'
        }, '✕');
        
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add event listeners
        Utils.DOM.addEvent(closeBtn, 'click', () => {
            document.body.removeChild(modal);
        });
        
        Utils.DOM.addEvent(modal, 'click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const message = `
            <div class="welcome-message">
                <h3>🎉 Chào mừng đến với Multi Video Player!</h3>
                <p>Để bắt đầu:</p>
                <ol>
                    <li>Đặt video vào folder <code>video/</code></li>
                    <li>Chọn video từ danh sách bên trái</li>
                    <li>Nhấn "Thêm Video" để thêm vào grid</li>
                </ol>
                <p><strong>Tip:</strong> Nhấn <kbd>Ctrl+H</kbd> để xem hướng dẫn chi tiết</p>
            </div>
        `;
        
        const videoSection = document.querySelector('.video-section');
        if (videoSection) {
            const videoGrid = videoSection.querySelector('#video-grid');
            if (videoGrid && videoGrid.children.length === 0) {
                videoGrid.innerHTML = message;
            }
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showErrorMessage(message) {
        const errorDiv = Utils.DOM.create('div', {
            className: 'error'
        }, message);
        
        document.body.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Show message
     * @param {string} message - Message to show
     * @param {string} type - Message type
     */
    showMessage(message, type = 'info') {
        if (this.components.controls) {
            this.components.controls.showMessage(message, type);
        }
    }

    /**
     * Get application status
     * @returns {Object} Application status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            videoCount: this.components.videoManager ? this.components.videoManager.getVideos().length : 0,
            layout: this.components.videoManager ? this.components.videoManager.currentLayout : '2x2',
            theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light'
        };
    }

    /**
     * Export application data
     * @returns {Object} Application data
     */
    exportData() {
        return {
            status: this.getStatus(),
            settings: this.components.controls ? this.components.controls.getSettings() : {},
            videos: this.components.videoManager ? this.components.videoManager.getVideos().map(v => ({
                id: v.id,
                filename: v.filename
            })) : []
        };
    }
}

// Add help modal styles
const helpStyles = `
<style>
.help-modal {
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.help-content h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.help-content h3 {
    color: var(--text-secondary);
    margin: 1.5rem 0 0.5rem 0;
    font-size: 1.1rem;
}

.help-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.help-content li {
    margin-bottom: 0.25rem;
    color: var(--text-primary);
}

.help-content kbd {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
    font-family: monospace;
}

.welcome-message {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.welcome-message h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.welcome-message ol {
    text-align: left;
    max-width: 400px;
    margin: 1rem auto;
}

.welcome-message code {
    background: var(--bg-tertiary);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
}
</style>
`;

// Add styles to document
document.head.insertAdjacentHTML('beforeend', helpStyles);

// Create global instance
window.app = new MultiVideoPlayer();

// Export for debugging
console.log('Multi Video Player loaded. Use window.app to access the application.'); 