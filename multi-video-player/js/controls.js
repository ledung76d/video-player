/**
 * Controls - Handles UI controls and settings
 */

class Controls {
    constructor() {
        this.settings = {
            autoPlay: false,
            loop: false,
            volume: 0.5,
            playbackRate: 1.0,
            theme: 'light'
        };
        
        this.init();
    }

    /**
     * Initialize controls
     */
    init() {
        this.loadSettings();
        this.setupThemeToggle();
        this.setupSettingsModal();
        this.setupGlobalControls();
        this.restoreToggleStates();
    }

    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
        const themeToggle = Utils.DOM.getById('theme-toggle');
        if (themeToggle) {
            Utils.DOM.addEvent(themeToggle, 'click', () => {
                Utils.Theme.toggle();
            });
        }
    }

    /**
     * Setup settings modal
     */
    setupSettingsModal() {
        const settingsBtn = Utils.DOM.getById('settings-btn');
        if (settingsBtn) {
            Utils.DOM.addEvent(settingsBtn, 'click', () => {
                this.showSettingsModal();
            });
        }
    }

    /**
     * Setup global controls
     */
    setupGlobalControls() {
        // Add keyboard shortcuts info
        this.addKeyboardShortcutsInfo();
        
        // Add volume control
        this.setupVolumeControl();
        
        // Add playback rate control
        this.setupPlaybackRateControl();
        
        // Setup toggle controls
        this.setupToggleControls();
    }

    /**
     * Show settings modal
     */
    showSettingsModal() {
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        
        // Focus first input
        const firstInput = modal.querySelector('input, select');
        if (firstInput) {
            firstInput.focus();
        }
    }

    /**
     * Create settings modal
     * @returns {HTMLElement} Modal element
     */
    createSettingsModal() {
        const modal = Utils.DOM.create('div', {
            className: 'modal-overlay'
        });

        const modalContent = Utils.DOM.create('div', {
            className: 'modal-content'
        });

        const header = Utils.DOM.create('div', {
            className: 'modal-header'
        });

        const title = Utils.DOM.create('h2', {}, 'Cài đặt');
        const closeBtn = Utils.DOM.create('button', {
            className: 'modal-close'
        }, '✕');

        header.appendChild(title);
        header.appendChild(closeBtn);

        const body = Utils.DOM.create('div', {
            className: 'modal-body'
        });

        // Settings form
        const form = Utils.DOM.create('form', {
            className: 'settings-form'
        });

        // Auto play setting
        const autoPlayGroup = this.createSettingGroup(
            'Tự động phát',
            'checkbox',
            'autoPlay',
            this.settings.autoPlay,
            'Tự động phát video khi thêm vào grid'
        );

        // Loop setting
        const loopGroup = this.createSettingGroup(
            'Lặp lại',
            'checkbox',
            'loop',
            this.settings.loop,
            'Lặp lại video khi kết thúc'
        );

        // Volume setting
        const volumeGroup = this.createSettingGroup(
            'Âm lượng mặc định',
            'range',
            'volume',
            this.settings.volume,
            'Âm lượng mặc định cho video mới',
            { min: 0, max: 1, step: 0.1 }
        );

        // Playback rate setting
        const playbackRateGroup = this.createSettingGroup(
            'Tốc độ phát mặc định',
            'select',
            'playbackRate',
            this.settings.playbackRate,
            'Tốc độ phát mặc định cho video mới',
            {
                options: [
                    { value: 0.25, label: '0.25x' },
                    { value: 0.5, label: '0.5x' },
                    { value: 0.75, label: '0.75x' },
                    { value: 1.0, label: '1.0x (Bình thường)' },
                    { value: 1.25, label: '1.25x' },
                    { value: 1.5, label: '1.5x' },
                    { value: 2.0, label: '2.0x' }
                ]
            }
        );

        // Theme setting
        const themeGroup = this.createSettingGroup(
            'Giao diện',
            'select',
            'theme',
            this.settings.theme,
            'Chọn giao diện sáng hoặc tối',
            {
                options: [
                    { value: 'light', label: 'Sáng' },
                    { value: 'dark', label: 'Tối' }
                ]
            }
        );

        // Buttons
        const buttons = Utils.DOM.create('div', {
            className: 'modal-buttons'
        });

        const saveBtn = Utils.DOM.create('button', {
            type: 'submit',
            className: 'btn btn-primary'
        }, 'Lưu');

        const cancelBtn = Utils.DOM.create('button', {
            type: 'button',
            className: 'btn btn-secondary'
        }, 'Hủy');

        buttons.appendChild(saveBtn);
        buttons.appendChild(cancelBtn);

        // Add all elements to form
        form.appendChild(autoPlayGroup);
        form.appendChild(loopGroup);
        form.appendChild(volumeGroup);
        form.appendChild(playbackRateGroup);
        form.appendChild(themeGroup);
        form.appendChild(buttons);

        body.appendChild(form);
        modalContent.appendChild(header);
        modalContent.appendChild(body);
        modal.appendChild(modalContent);

        // Add event listeners
        Utils.DOM.addEvent(closeBtn, 'click', () => {
            this.closeModal(modal);
        });

        Utils.DOM.addEvent(cancelBtn, 'click', () => {
            this.closeModal(modal);
        });

        Utils.DOM.addEvent(form, 'submit', (e) => {
            e.preventDefault();
            this.saveSettings(form);
            this.closeModal(modal);
        });

        // Close modal when clicking overlay
        Utils.DOM.addEvent(modal, 'click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        return modal;
    }

    /**
     * Create a setting group
     * @param {string} label - Setting label
     * @param {string} type - Input type
     * @param {string} name - Setting name
     * @param {any} value - Current value
     * @param {string} description - Setting description
     * @param {Object} options - Additional options
     * @returns {HTMLElement} Setting group element
     */
    createSettingGroup(label, type, name, value, description, options = {}) {
        const group = Utils.DOM.create('div', {
            className: 'setting-group'
        });

        const labelElement = Utils.DOM.create('label', {
            className: 'setting-label'
        }, label);

        const descriptionElement = Utils.DOM.create('div', {
            className: 'setting-description'
        }, description);

        let input;

        switch (type) {
            case 'checkbox':
                input = Utils.DOM.create('input', {
                    type: 'checkbox',
                    name: name,
                    checked: value
                });
                break;

            case 'range':
                input = Utils.DOM.create('input', {
                    type: 'range',
                    name: name,
                    value: value,
                    min: options.min || 0,
                    max: options.max || 100,
                    step: options.step || 1
                });
                break;

            case 'select':
                input = Utils.DOM.create('select', {
                    name: name
                });

                options.options.forEach(option => {
                    const optionElement = Utils.DOM.create('option', {
                        value: option.value,
                        selected: option.value == value
                    }, option.label);
                    input.appendChild(optionElement);
                });
                break;

            default:
                input = Utils.DOM.create('input', {
                    type: type,
                    name: name,
                    value: value
                });
        }

        group.appendChild(labelElement);
        group.appendChild(input);
        group.appendChild(descriptionElement);

        return group;
    }

    /**
     * Save settings from form
     * @param {HTMLFormElement} form - Settings form
     */
    saveSettings(form) {
        const formData = new FormData(form);
        
        this.settings.autoPlay = formData.get('autoPlay') === 'on';
        this.settings.loop = formData.get('loop') === 'on';
        this.settings.volume = parseFloat(formData.get('volume'));
        this.settings.playbackRate = parseFloat(formData.get('playbackRate'));
        this.settings.theme = formData.get('theme');

        // Apply theme
        if (this.settings.theme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }

        // Save to localStorage
        Utils.Storage.set('appSettings', this.settings);

        // Apply settings to existing videos
        this.applySettingsToVideos();

        // Show success message
        this.showMessage('Cài đặt đã được lưu thành công!', 'success');
    }

    /**
     * Apply settings to existing videos
     */
    applySettingsToVideos() {
        if (!window.videoManager) return;

        const videos = window.videoManager.getVideos();
        videos.forEach(videoData => {
            const video = videoData.video;
            
            video.volume = this.settings.volume;
            video.playbackRate = this.settings.playbackRate;
            video.loop = this.settings.loop;
        });
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const savedSettings = Utils.Storage.get('appSettings', null);
        if (savedSettings) {
            this.settings = { ...this.settings, ...savedSettings };
        }
    }

    /**
     * Close modal
     * @param {HTMLElement} modal - Modal element
     */
    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    /**
     * Show message
     * @param {string} message - Message to show
     * @param {string} type - Message type ('success', 'error', 'info')
     */
    showMessage(message, type = 'info') {
        const messageElement = Utils.DOM.create('div', {
            className: `message message-${type}`
        }, message);

        document.body.appendChild(messageElement);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    /**
     * Add keyboard shortcuts info
     */
    addKeyboardShortcutsInfo() {
        const shortcutsInfo = `
            <div class="sidebar-section">
                <h3>Phím tắt</h3>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Space</kbd> - Phát/Tạm dừng tất cả
                    </div>
                    <div class="shortcut-item">
                        <kbd>S</kbd> - Dừng tất cả
                    </div>
                    <div class="shortcut-item">
                        <kbd>M</kbd> - Tắt/Bật âm thanh
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd> - Thoát fullscreen
                    </div>
                </div>
            </div>
        `;

        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.insertAdjacentHTML('beforeend', shortcutsInfo);
        }
    }

    /**
     * Setup volume control
     */
    setupVolumeControl() {
        // This will be implemented in Phase 2
        // For now, volume is controlled through video's native controls
    }

    /**
     * Setup playback rate control
     */
    setupPlaybackRateControl() {
        // This will be implemented in Phase 2
        // For now, playback rate is controlled through video's native controls
    }

    /**
     * Get current settings
     * @returns {Object} Current settings
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Setup toggle controls for navbar
     */
    setupToggleControls() {
        // Toggle navbar button
        const toggleNavbarBtn = Utils.DOM.getById('toggle-navbar');
        if (toggleNavbarBtn) {
            Utils.DOM.addEvent(toggleNavbarBtn, 'click', () => {
                this.toggleNavbar();
            });
        }

        // Floating toggle button
        const floatingToggleBtn = Utils.DOM.getById('floating-toggle');
        if (floatingToggleBtn) {
            Utils.DOM.addEvent(floatingToggleBtn, 'click', () => {
                this.toggleNavbar();
            });
        }

        // Add keyboard shortcut for toggle
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'n') {
                    e.preventDefault();
                    this.toggleNavbar();
                }
            }
        });
    }

    /**
     * Toggle navbar visibility (header + sidebar)
     */
    toggleNavbar() {
        const header = Utils.DOM.getById('header');
        const sidebar = Utils.DOM.getById('sidebar');
        const mainContent = document.querySelector('.main-content');
        const videoSection = document.querySelector('.video-section');
        const toggleBtn = Utils.DOM.getById('toggle-navbar');
        const floatingToggleBtn = Utils.DOM.getById('floating-toggle');
        
        if (header && sidebar && mainContent && videoSection) {
            const isHidden = header.classList.contains('hidden');
            
            // Toggle header and sidebar
            header.classList.toggle('hidden');
            sidebar.classList.toggle('hidden');
            
            // Toggle main content and video section
            mainContent.classList.toggle('navbar-hidden');
            videoSection.classList.toggle('fullscreen');
            
            // Update button text
            if (toggleBtn) {
                toggleBtn.textContent = isHidden ? '☰' : '✕';
            }
            
            // Show/hide floating toggle button
            if (floatingToggleBtn) {
                if (isHidden) {
                    // Navbar sẽ hiện -> ẩn floating button
                    floatingToggleBtn.classList.remove('show');
                } else {
                    // Navbar sẽ ẩn -> hiện floating button
                    floatingToggleBtn.classList.add('show');
                }
            }
            
            // Save state
            Utils.Storage.set('navbarHidden', !isHidden);
        }
    }

    /**
     * Restore toggle states on page load
     */
    restoreToggleStates() {
        // Restore navbar state
        const navbarHidden = Utils.Storage.get('navbarHidden', false);
        if (navbarHidden) {
            const header = Utils.DOM.getById('header');
            const sidebar = Utils.DOM.getById('sidebar');
            const mainContent = document.querySelector('.main-content');
            const videoSection = document.querySelector('.video-section');
            const toggleBtn = Utils.DOM.getById('toggle-navbar');
            const floatingToggleBtn = Utils.DOM.getById('floating-toggle');
            
            if (header && sidebar && mainContent && videoSection) {
                header.classList.add('hidden');
                sidebar.classList.add('hidden');
                mainContent.classList.add('navbar-hidden');
                videoSection.classList.add('fullscreen');
                if (toggleBtn) {
                    toggleBtn.textContent = '☰';
                }
                if (floatingToggleBtn) {
                    floatingToggleBtn.classList.add('show');
                }
            }
        }
    }

    /**
     * Update setting
     * @param {string} key - Setting key
     * @param {any} value - New value
     */
    updateSetting(key, value) {
        this.settings[key] = value;
        Utils.Storage.set('appSettings', this.settings);
    }
}

// Add modal styles
const modalStyles = `
<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: var(--bg-secondary);
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
    margin: 0;
    color: var(--text-primary);
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 0.5rem;
}

.modal-close:hover {
    color: var(--text-primary);
}

.modal-body {
    padding: 1.5rem;
}

.setting-group {
    margin-bottom: 1.5rem;
}

.setting-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.setting-description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

.setting-group input,
.setting-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.setting-group input:focus,
.setting-group select:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

.shortcuts-list {
    font-size: 0.9rem;
}

.shortcut-item {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

kbd {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
    font-family: monospace;
}

.message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    color: white;
    z-index: 1001;
    animation: slideIn 0.3s ease;
}

.message-success {
    background: var(--success-color);
}

.message-error {
    background: var(--danger-color);
}

.message-info {
    background: var(--info-color);
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

// Add styles to document
document.head.insertAdjacentHTML('beforeend', modalStyles);

// Create global instance
window.controls = new Controls(); 