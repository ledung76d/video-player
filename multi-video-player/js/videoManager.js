/**
 * Video Manager - Handles video loading, controls, and synchronization
 */

class VideoManager {
    constructor() {
        this.videos = [];
        this.availableVideos = [];
        this.currentLayout = '2x2';
        this.isSynchronized = false;
    }

    /**
     * Initialize video manager
     */
    async init() {
        await this.loadAvailableVideos();
        this.setupEventListeners();
        this.loadSavedState();
    }

    /**
     * Load available videos from JSON file
     */
    async loadAvailableVideos() {
        try {
            const response = await fetch('./video/videos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.availableVideos = data.videos || [];
            
            this.populateVideoSelector();
            this.populateVideoList();
        } catch (error) {
            console.error('Error loading videos from JSON:', error);
            // Fallback to default videos if JSON loading fails
            this.availableVideos = [
                'sample1.mp4',
                'sample2.mp4', 
                'sample3.mp4',
                'sample4.mp4'
            ];
            this.populateVideoSelector();
            this.populateVideoList();
        }
    }

    /**
     * Populate video selector dropdown
     */
    populateVideoSelector() {
        const selector = Utils.DOM.getById('video-selector');
        if (!selector) return;

        // Clear existing options except the first one
        selector.innerHTML = '<option value="">-- Chọn video --</option>';

        // Add video options
        this.availableVideos.forEach(filename => {
            const option = Utils.DOM.create('option', {
                value: filename,
                textContent: filename
            });
            selector.appendChild(option);
        });
    }

    /**
     * Populate video list in sidebar
     */
    populateVideoList() {
        const videoList = Utils.DOM.getById('video-list');
        if (!videoList) return;

        videoList.innerHTML = '';

        if (this.availableVideos.length === 0) {
            const emptyMessage = Utils.DOM.create('div', {
                className: 'video-item'
            }, 'Không có video nào trong folder');
            videoList.appendChild(emptyMessage);
            return;
        }

        this.availableVideos.forEach(filename => {
            const videoItem = Utils.DOM.create('div', {
                className: 'video-item'
            }, filename);
            
            Utils.DOM.addEvent(videoItem, 'click', () => {
                this.addVideo(filename);
            });
            
            videoList.appendChild(videoItem);
        });
    }

    /**
     * Add video to grid
     * @param {string} filename - Video filename
     */
    addVideo(filename) {
        if (!filename) {
            Utils.ErrorHandler.show('Vui lòng chọn video', document.querySelector('.video-section'));
            return;
        }

        const validation = Utils.Validation.validateVideoFile(filename);
        if (!validation.isValid) {
            Utils.ErrorHandler.show(validation.errors.join(', '), document.querySelector('.video-section'));
            return;
        }

        // Check if video is already added
        if (this.videos.some(video => video.filename === filename)) {
            Utils.ErrorHandler.show('Video đã được thêm vào grid', document.querySelector('.video-section'));
            return;
        }

        const videoContainer = this.createVideoContainer(filename);
        const videoGrid = Utils.DOM.getById('video-grid');
        
        if (videoGrid) {
            videoGrid.appendChild(videoContainer);
            this.videos.push({
                id: videoContainer.id,
                filename: filename,
                element: videoContainer,
                video: videoContainer.querySelector('video')
            });

            this.updateGridLayout();
            this.saveState();
        }
    }

    /**
     * Create video container element
     * @param {string} filename - Video filename
     * @returns {HTMLElement} Video container
     */
    createVideoContainer(filename) {
        const containerId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const container = Utils.DOM.create('div', {
            id: containerId,
            className: 'video-container'
        });

        // Video header
        const header = Utils.DOM.create('div', {
            className: 'video-header'
        });

        const title = Utils.DOM.create('div', {
            className: 'video-title'
        }, filename);

        const actions = Utils.DOM.create('div', {
            className: 'video-actions'
        });

        const focusBtn = Utils.DOM.create('button', {
            className: 'action-btn'
        }, '🔍');

        actions.appendChild(focusBtn);
        header.appendChild(title);
        header.appendChild(actions);

        // Video element
        const video = Utils.DOM.create('video', {
            src: `./video/${filename}`,
            controls: true,
            preload: 'metadata'
        });

        // Video controls overlay
        const controls = Utils.DOM.create('div', {
            className: 'video-controls'
        });

        const controlButtons = Utils.DOM.create('div', {
            className: 'control-buttons'
        });

        const playBtn = Utils.DOM.create('button', {
            className: 'control-btn',
            title: 'Play/Pause'
        }, '▶️');

        const volumeBtn = Utils.DOM.create('button', {
            className: 'control-btn',
            title: 'Mute/Unmute'
        }, '🔊');

        const fullscreenBtn = Utils.DOM.create('button', {
            className: 'control-btn',
            title: 'Fullscreen'
        }, '⛶');

        const removeBtn = Utils.DOM.create('button', {
            className: 'control-btn',
            title: 'Remove video'
        }, '✕');

        controlButtons.appendChild(playBtn);
        controlButtons.appendChild(volumeBtn);
        controlButtons.appendChild(fullscreenBtn);
        controlButtons.appendChild(removeBtn);
        controls.appendChild(controlButtons);

        // Add elements to container
        container.appendChild(header);
        container.appendChild(video);
        container.appendChild(controls);

        // Add event listeners
        this.setupVideoEventListeners(container, video, playBtn, volumeBtn, fullscreenBtn, removeBtn, focusBtn);

        return container;
    }

    /**
     * Setup event listeners for video container
     */
    setupVideoEventListeners(container, video, playBtn, volumeBtn, fullscreenBtn, removeBtn, focusBtn) {
        // Play/Pause button
        Utils.DOM.addEvent(playBtn, 'click', (e) => {
            e.stopPropagation();
            this.togglePlayPause(video);
        });

        // Volume button
        Utils.DOM.addEvent(volumeBtn, 'click', (e) => {
            e.stopPropagation();
            this.toggleMute(video, volumeBtn);
        });

        // Fullscreen button
        Utils.DOM.addEvent(fullscreenBtn, 'click', (e) => {
            e.stopPropagation();
            this.toggleFullscreen(video);
        });

        // Remove button
        Utils.DOM.addEvent(removeBtn, 'click', (e) => {
            e.stopPropagation();
            this.removeVideo(container.id);
        });

        // Focus button
        Utils.DOM.addEvent(focusBtn, 'click', (e) => {
            e.stopPropagation();
            this.toggleFocus(container);
        });

        // Video events
        Utils.DOM.addEvent(video, 'error', (e) => {
            Utils.ErrorHandler.handleVideoError(e, container);
        });

        Utils.DOM.addEvent(video, 'loadedmetadata', () => {
            this.updateVideoInfo(video, container);
        });

        // Show/hide controls on hover
        Utils.DOM.addEvent(container, 'mouseenter', () => {
            controls.classList.add('show');
        });

        Utils.DOM.addEvent(container, 'mouseleave', () => {
            controls.classList.remove('show');
        });
    }

    /**
     * Toggle play/pause for video
     * @param {HTMLVideoElement} video - Video element
     */
    togglePlayPause(video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    /**
     * Toggle mute for video
     * @param {HTMLVideoElement} video - Video element
     * @param {HTMLElement} volumeBtn - Volume button
     */
    toggleMute(video, volumeBtn) {
        video.muted = !video.muted;
        volumeBtn.textContent = video.muted ? '🔇' : '🔊';
    }

    /**
     * Toggle fullscreen for video
     * @param {HTMLVideoElement} video - Video element
     */
    toggleFullscreen(video) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            video.requestFullscreen();
        }
    }

    /**
     * Toggle focus mode for video container
     * @param {HTMLElement} container - Video container
     */
    toggleFocus(container) {
        container.classList.toggle('focused');
    }

    /**
     * Remove video from grid
     * @param {string} containerId - Container ID
     */
    removeVideo(containerId) {
        const videoIndex = this.videos.findIndex(video => video.id === containerId);
        
        if (videoIndex !== -1) {
            this.videos.splice(videoIndex, 1);
            const container = Utils.DOM.getById(containerId);
            
            if (container) {
                container.remove();
            }
            this.updateGridLayout();
            this.saveState();
        }
    }

    /**
     * Update video information display
     * @param {HTMLVideoElement} video - Video element
     * @param {HTMLElement} container - Video container
     */
    updateVideoInfo(video, container) {
        const duration = Utils.VideoUtils.formatDuration(video.duration);
        const title = container.querySelector('.video-title');
        if (title) {
            title.textContent = `${title.textContent} (${duration})`;
        }
    }

    /**
     * Update grid layout based on current layout setting
     */
    updateGridLayout() {
        const videoGrid = Utils.DOM.getById('video-grid');
        if (!videoGrid) return;

        // Remove existing layout classes
        videoGrid.classList.remove('layout-1x1', 'layout-2x2', 'layout-3x3', 'layout-4x4');
        
        // Add current layout class
        videoGrid.classList.add(`layout-${this.currentLayout}`);

        // Show empty state if no videos
        if (this.videos.length === 0) {
            videoGrid.classList.add('empty');
            videoGrid.innerHTML = `
                <div class="empty-message">
                    <h3>Chưa có video nào</h3>
                    <p>Chọn video từ danh sách bên trái để bắt đầu xem</p>
                </div>
            `;
        } else {
            videoGrid.classList.remove('empty');
        }
    }

    /**
     * Synchronize all videos (play/pause/stop)
     * @param {string} action - Action to perform ('play', 'pause', 'stop')
     */
    synchronizeVideos(action) {
        this.videos.forEach(videoData => {
            const video = videoData.video;
            switch (action) {
                case 'play':
                    video.play();
                    break;
                case 'pause':
                    video.pause();
                    break;
                case 'stop':
                    video.pause();
                    video.currentTime = 0;
                    break;
            }
        });
    }

    /**
     * Setup event listeners for controls
     */
    setupEventListeners() {
        // Add video button
        const addVideoBtn = Utils.DOM.getById('add-video-btn');
        if (addVideoBtn) {
            Utils.DOM.addEvent(addVideoBtn, 'click', () => {
                const selector = Utils.DOM.getById('video-selector');
                const selectedVideo = selector.value;
                this.addVideo(selectedVideo);
            });
        }

        // Grid layout selector
        const gridLayout = Utils.DOM.getById('grid-layout');
        if (gridLayout) {
            Utils.DOM.addEvent(gridLayout, 'change', (e) => {
                this.currentLayout = e.target.value;
                this.updateGridLayout();
                this.saveState();
            });
        }

        // Sync controls
        const syncPlay = Utils.DOM.getById('sync-play');
        const syncPause = Utils.DOM.getById('sync-pause');
        const syncStop = Utils.DOM.getById('sync-stop');

        if (syncPlay) {
            Utils.DOM.addEvent(syncPlay, 'click', () => {
                this.synchronizeVideos('play');
            });
        }

        if (syncPause) {
            Utils.DOM.addEvent(syncPause, 'click', () => {
                this.synchronizeVideos('pause');
            });
        }

        if (syncStop) {
            Utils.DOM.addEvent(syncStop, 'click', () => {
                this.synchronizeVideos('stop');
            });
        }
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
        const state = {
            videos: this.videos.map(video => ({
                id: video.id,
                filename: video.filename
            })),
            layout: this.currentLayout
        };
        Utils.Storage.set('videoManagerState', state);
    }

    /**
     * Load saved state from localStorage
     */
    loadSavedState() {
        const state = Utils.Storage.get('videoManagerState', null);
        if (state) {
            this.currentLayout = state.layout || '2x2';
            
            // Restore videos
            state.videos.forEach(videoData => {
                this.addVideo(videoData.filename);
            });
        }
    }

    /**
     * Get current videos
     * @returns {Array} Array of video objects
     */
    getVideos() {
        return this.videos;
    }

    /**
     * Get available videos
     * @returns {Array} Array of available video filenames
     */
    getAvailableVideos() {
        return this.availableVideos;
    }
}

// Create global instance
window.videoManager = new VideoManager(); 