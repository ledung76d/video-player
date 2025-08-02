/**
 * Utility functions for Multi Video Player
 */

// Local Storage utilities
const Storage = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} value - Data to store
     */
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored data or default value
     */
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

// DOM utilities
const DOM = {
    /**
     * Create element with attributes
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string} textContent - Text content
     * @returns {HTMLElement} Created element
     */
    create: (tag, attributes = {}, textContent = '') => {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    },

    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} Element or null if not found
     */
    getById: (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    },

    /**
     * Add event listener with error handling
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEvent: (element, event, handler, options = {}) => {
        if (element) {
            element.addEventListener(event, handler, options);
        } else {
            console.warn('Cannot add event listener to null element');
        }
    }
};

// Video utilities
const VideoUtils = {
    /**
     * Get video duration in formatted string
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted duration (MM:SS)
     */
    formatDuration: (seconds) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    /**
     * Get video file extension
     * @param {string} filename - Video filename
     * @returns {string} File extension
     */
    getExtension: (filename) => {
        return filename.split('.').pop().toLowerCase();
    },

    /**
     * Check if file is supported video format
     * @param {string} filename - Video filename
     * @returns {boolean} True if supported
     */
    isSupportedVideo: (filename) => {
        const supportedFormats = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv'];
        const extension = VideoUtils.getExtension(filename);
        return supportedFormats.includes(extension);
    },

    /**
     * Get video file size in readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Theme utilities
const Theme = {
    /**
     * Toggle between light and dark theme
     */
    toggle: () => {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            Storage.set('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            Storage.set('theme', 'dark');
        }
        
        // Update theme icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = isDark ? '🌙' : '☀️';
        }
    },

    /**
     * Initialize theme from localStorage
     */
    init: () => {
        const savedTheme = Storage.get('theme', 'light');
        const body = document.body;
        
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(`${savedTheme}-theme`);
        
        // Update theme icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }
};

// Error handling utilities
const ErrorHandler = {
    /**
     * Show error message
     * @param {string} message - Error message
     * @param {HTMLElement} container - Container to show error in
     */
    show: (message, container) => {
        const errorDiv = DOM.create('div', {
            className: 'error'
        }, message);
        
        if (container) {
            container.innerHTML = '';
            container.appendChild(errorDiv);
        }
    },

    /**
     * Show success message
     * @param {string} message - Success message
     * @param {HTMLElement} container - Container to show message in
     */
    showSuccess: (message, container) => {
        const successDiv = DOM.create('div', {
            className: 'success'
        }, message);
        
        if (container) {
            container.innerHTML = '';
            container.appendChild(successDiv);
        }
    },

    /**
     * Handle video loading errors
     * @param {Event} error - Error event
     * @param {HTMLElement} container - Video container
     */
    handleVideoError: (error, container) => {
        console.error('Video loading error:', error);
        
        const errorMessage = DOM.create('div', {
            className: 'video-error'
        }, 'Không thể tải video. Vui lòng kiểm tra file.');
        
        if (container) {
            container.innerHTML = '';
            container.appendChild(errorMessage);
        }
    }
};

// Validation utilities
const Validation = {
    /**
     * Validate video file
     * @param {string} filename - Video filename
     * @returns {Object} Validation result
     */
    validateVideoFile: (filename) => {
        const result = {
            isValid: true,
            errors: []
        };
        
        if (!filename) {
            result.isValid = false;
            result.errors.push('Tên file không được để trống');
        }
        
        if (!VideoUtils.isSupportedVideo(filename)) {
            result.isValid = false;
            result.errors.push('Định dạng video không được hỗ trợ');
        }
        
        return result;
    },

    /**
     * Validate grid layout
     * @param {string} layout - Grid layout string
     * @returns {boolean} True if valid
     */
    validateGridLayout: (layout) => {
        const validLayouts = ['1x1', '2x2', '3x3', '4x4'];
        return validLayouts.includes(layout);
    }
};

// Export utilities for use in other modules
window.Utils = {
    Storage,
    DOM,
    VideoUtils,
    Theme,
    ErrorHandler,
    Validation
}; 