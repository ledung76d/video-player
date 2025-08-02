/**
 * Grid Manager - Handles grid layout and drag & drop functionality
 */

class GridManager {
    constructor() {
        this.isDragging = false;
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.dropZones = [];
        
        this.init();
    }

    /**
     * Initialize grid manager
     */
    init() {
        this.setupDragAndDrop();
        this.setupResizeHandles();
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        const videoGrid = Utils.DOM.getById('video-grid');
        if (!videoGrid) return;

        // Make grid a drop zone
        this.addDropZone(videoGrid);

        // Listen for video container creation
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        node.classList && 
                        node.classList.contains('video-container')) {
                        this.makeDraggable(node);
                    }
                });
            });
        });

        observer.observe(videoGrid, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Make an element draggable
     * @param {HTMLElement} element - Element to make draggable
     */
    makeDraggable(element) {
        element.draggable = true;
        
        Utils.DOM.addEvent(element, 'dragstart', (e) => {
            this.handleDragStart(e, element);
        });

        Utils.DOM.addEvent(element, 'dragend', (e) => {
            this.handleDragEnd(e, element);
        });

        Utils.DOM.addEvent(element, 'dragenter', (e) => {
            this.handleDragEnter(e, element);
        });

        Utils.DOM.addEvent(element, 'dragleave', (e) => {
            this.handleDragLeave(e, element);
        });

        Utils.DOM.addEvent(element, 'dragover', (e) => {
            this.handleDragOver(e, element);
        });

        Utils.DOM.addEvent(element, 'drop', (e) => {
            this.handleDrop(e, element);
        });
    }

    /**
     * Add drop zone functionality to element
     * @param {HTMLElement} element - Element to make a drop zone
     */
    addDropZone(element) {
        this.dropZones.push(element);
        
        Utils.DOM.addEvent(element, 'dragenter', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });

        Utils.DOM.addEvent(element, 'dragleave', (e) => {
            e.preventDefault();
            if (!element.contains(e.relatedTarget)) {
                element.classList.remove('drag-over');
            }
        });

        Utils.DOM.addEvent(element, 'dragover', (e) => {
            e.preventDefault();
        });

        Utils.DOM.addEvent(element, 'drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            this.handleDrop(e, element);
        });
    }

    /**
     * Handle drag start event
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} element - Dragged element
     */
    handleDragStart(e, element) {
        this.isDragging = true;
        this.draggedElement = element;
        element.classList.add('dragging');
        
        // Set drag image
        const rect = element.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.outerHTML);
    }

    /**
     * Handle drag end event
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} element - Dragged element
     */
    handleDragEnd(e, element) {
        this.isDragging = false;
        this.draggedElement = null;
        element.classList.remove('dragging');
        
        // Remove drag-over class from all drop zones
        this.dropZones.forEach(zone => {
            zone.classList.remove('drag-over');
        });
    }

    /**
     * Handle drag enter event
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} element - Target element
     */
    handleDragEnter(e, element) {
        e.preventDefault();
        if (element !== this.draggedElement) {
            element.classList.add('drag-over');
        }
    }

    /**
     * Handle drag leave event
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} element - Target element
     */
    handleDragLeave(e, element) {
        e.preventDefault();
        if (!element.contains(e.relatedTarget)) {
            element.classList.remove('drag-over');
        }
    }

    /**
     * Handle drag over event
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} element - Target element
     */
    handleDragOver(e, element) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle drop event
     * @param {DragEvent} e - Drop event
     * @param {HTMLElement} targetElement - Target element
     */
    handleDrop(e, targetElement) {
        e.preventDefault();
        
        if (!this.draggedElement || this.draggedElement === targetElement) {
            return;
        }

        const videoGrid = Utils.DOM.getById('video-grid');
        if (!videoGrid) return;

        // Get drop position
        const dropPosition = this.getDropPosition(e, targetElement, videoGrid);
        
        // Reorder elements
        this.reorderElements(this.draggedElement, dropPosition);
        
        // Update video manager state
        if (window.videoManager) {
            window.videoManager.saveState();
        }
    }

    /**
     * Get drop position relative to target element
     * @param {DragEvent} e - Drop event
     * @param {HTMLElement} targetElement - Target element
     * @param {HTMLElement} grid - Video grid
     * @returns {Object} Drop position information
     */
    getDropPosition(e, targetElement, grid) {
        const rect = targetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        return {
            x: e.clientX < centerX ? 'before' : 'after',
            y: e.clientY < centerY ? 'before' : 'after',
            target: targetElement
        };
    }

    /**
     * Reorder elements in grid
     * @param {HTMLElement} draggedElement - Dragged element
     * @param {Object} position - Drop position
     */
    reorderElements(draggedElement, position) {
        const videoGrid = Utils.DOM.getById('video-grid');
        if (!videoGrid) return;

        const targetElement = position.target;
        
        if (position.x === 'before' && position.y === 'before') {
            videoGrid.insertBefore(draggedElement, targetElement);
        } else {
            videoGrid.insertBefore(draggedElement, targetElement.nextSibling);
        }
    }

    /**
     * Setup resize handles for video containers
     */
    setupResizeHandles() {
        // This will be implemented in Phase 2
        // For now, we'll add basic resize functionality
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        node.classList && 
                        node.classList.contains('video-container')) {
                        this.addResizeHandles(node);
                    }
                });
            });
        });

        const videoGrid = Utils.DOM.getById('video-grid');
        if (videoGrid) {
            observer.observe(videoGrid, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Add resize handles to video container
     * @param {HTMLElement} container - Video container
     */
    addResizeHandles(container) {
        const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        handles.forEach(position => {
            const handle = Utils.DOM.create('div', {
                className: `resize-handle ${position}`
            });
            
            Utils.DOM.addEvent(handle, 'mousedown', (e) => {
                this.startResize(e, container, position);
            });
            
            container.appendChild(handle);
        });
    }

    /**
     * Start resize operation
     * @param {MouseEvent} e - Mouse event
     * @param {HTMLElement} container - Video container
     * @param {string} position - Resize handle position
     */
    startResize(e, container, position) {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = container.offsetWidth;
        const startHeight = container.offsetHeight;
        
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            
            switch (position) {
                case 'top-left':
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight - deltaY;
                    break;
                case 'top-right':
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight - deltaY;
                    break;
                case 'bottom-left':
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight + deltaY;
                    break;
                case 'bottom-right':
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight + deltaY;
                    break;
            }
            
            // Apply minimum size constraints
            newWidth = Math.max(200, newWidth);
            newHeight = Math.max(150, newHeight);
            
            container.style.width = `${newWidth}px`;
            container.style.height = `${newHeight}px`;
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        Utils.DOM.addEvent(document, 'keydown', (e) => {
            this.handleKeyboardShortcut(e);
        });
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcut(e) {
        // Only handle shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case 'Escape':
                // Exit fullscreen or focus mode
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                this.exitFocusMode();
                break;
                
            case ' ':
                // Space bar - play/pause all videos
                e.preventDefault();
                if (window.videoManager) {
                    window.videoManager.synchronizeVideos('play');
                }
                break;
                
            case 's':
                // S key - stop all videos
                if (window.videoManager) {
                    window.videoManager.synchronizeVideos('stop');
                }
                break;
                
            case 'm':
                // M key - mute/unmute all videos
                this.toggleMuteAll();
                break;
        }
    }

    /**
     * Exit focus mode for all video containers
     */
    exitFocusMode() {
        const focusedContainers = document.querySelectorAll('.video-container.focused');
        focusedContainers.forEach(container => {
            container.classList.remove('focused');
        });
    }

    /**
     * Toggle mute for all videos
     */
    toggleMuteAll() {
        if (!window.videoManager) return;
        
        const videos = window.videoManager.getVideos();
        if (videos.length === 0) return;
        
        const firstVideo = videos[0].video;
        const shouldMute = !firstVideo.muted;
        
        videos.forEach(videoData => {
            videoData.video.muted = shouldMute;
        });
    }

    /**
     * Get grid layout information
     * @returns {Object} Grid layout info
     */
    getGridInfo() {
        const videoGrid = Utils.DOM.getById('video-grid');
        if (!videoGrid) return null;
        
        const videos = videoGrid.querySelectorAll('.video-container');
        const layout = videoGrid.className.match(/layout-(\d+x\d+)/);
        
        return {
            layout: layout ? layout[1] : '2x2',
            videoCount: videos.length,
            gridElement: videoGrid
        };
    }

    /**
     * Update grid layout
     * @param {string} layout - New layout (1x1, 2x2, 3x3, 4x4)
     */
    updateLayout(layout) {
        const videoGrid = Utils.DOM.getById('video-grid');
        if (!videoGrid) return;
        
        // Remove existing layout classes
        videoGrid.classList.remove('layout-1x1', 'layout-2x2', 'layout-3x3', 'layout-4x4');
        
        // Add new layout class
        videoGrid.classList.add(`layout-${layout}`);
    }

    /**
     * Get current grid state for saving
     * @returns {Object} Grid state
     */
    getState() {
        const gridInfo = this.getGridInfo();
        if (!gridInfo) return null;
        
        const videos = gridInfo.gridElement.querySelectorAll('.video-container');
        const videoOrder = Array.from(videos).map(container => container.id);
        
        return {
            layout: gridInfo.layout,
            videoOrder: videoOrder
        };
    }

    /**
     * Restore grid state
     * @param {Object} state - Grid state to restore
     */
    restoreState(state) {
        if (!state) return;
        
        this.updateLayout(state.layout);
        
        // Restore video order if needed
        if (state.videoOrder && window.videoManager) {
            // This will be handled by video manager
        }
    }
}

// Create global instance
window.gridManager = new GridManager(); 