/* ===================================
   UTILITY FUNCTIONS - HAMZA WEBSITE
   Helper functions and utilities
   =================================== */

// Utility class for common functions
class Utils {
    // Device detection
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    
    static isDesktop() {
        return window.innerWidth > 1024;
    }
    
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Performance utilities
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // DOM utilities
    static createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }
    
    static getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    }
    
    static isElementInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    }
    
    // Animation utilities
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    static easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Storage utilities
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
            return false;
        }
    }
    
    static getFromLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to get from localStorage:', error);
            return defaultValue;
        }
    }
    
    // URL utilities
    static getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    static updateQueryParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.replaceState({}, '', url);
    }
    
    // Validation utilities
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    
    // Math utilities
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Date utilities
    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }
    
    static timeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, seconds] of Object.entries(intervals)) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        
        return 'Just now';
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }
    
    init() {
        this.measurePageLoad();
        this.measureScrollPerformance();
    }
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart
            };
            
            console.log('Page Load Metrics:', this.metrics.pageLoad);
        });
    }
    
    measureScrollPerformance() {
        let scrollCount = 0;
        let lastScrollTime = performance.now();
        
        const scrollHandler = Utils.throttle(() => {
            scrollCount++;
            const currentTime = performance.now();
            const timeDiff = currentTime - lastScrollTime;
            
            if (timeDiff > 16.67) { // More than 60fps
                console.warn('Scroll performance issue detected');
            }
            
            lastScrollTime = currentTime;
        }, 16);
        
        window.addEventListener('scroll', scrollHandler);
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Accessibility utilities
class AccessibilityHelper {
    static init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }
    
    static setupKeyboardNavigation() {
        // Tab navigation for custom elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals or menus
                const openModals = document.querySelectorAll('.modal.active, .lightbox.active');
                openModals.forEach(modal => {
                    modal.classList.remove('active');
                });
                
                // Close mobile menu
                const mobileMenu = document.querySelector('.nav-menu.active');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    document.querySelector('.hamburger').classList.remove('active');
                }
            }
        });
    }
    
    static setupFocusManagement() {
        // Focus trap for modals
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.active, .lightbox.active');
                if (modal) {
                    const focusable = modal.querySelectorAll(focusableElements);
                    const firstFocusable = focusable[0];
                    const lastFocusable = focusable[focusable.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }
    
    static setupScreenReaderSupport() {
        // Add ARIA labels to interactive elements
        const interactiveElements = document.querySelectorAll('button:not([aria-label]), a:not([aria-label])');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                const className = element.className;
                if (className.includes('social')) {
                    element.setAttribute('aria-label', 'Social media link');
                } else if (className.includes('close')) {
                    element.setAttribute('aria-label', 'Close');
                } else if (className.includes('menu')) {
                    element.setAttribute('aria-label', 'Menu');
                }
            }
        });
        
        // Announce page changes to screen readers
        this.announcePageChanges();
    }
    
    static announcePageChanges() {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);
        
        // Announce section changes
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const sectionName = link.textContent;
                setTimeout(() => {
                    announcer.textContent = `Navigated to ${sectionName} section`;
                }, 500);
            });
        });
    }
}

// Error handling and logging
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.init();
    }
    
    init() {
        window.addEventListener('error', (e) => {
            this.logError({
                type: 'JavaScript Error',
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error ? e.error.stack : null,
                timestamp: new Date().toISOString()
            });
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.logError({
                type: 'Unhandled Promise Rejection',
                message: e.reason.message || e.reason,
                stack: e.reason.stack,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    logError(error) {
        this.errors.push(error);
        console.error('Error logged:', error);
        
        // In production, you might want to send errors to a logging service
        // this.sendToLoggingService(error);
    }
    
    getErrors() {
        return this.errors;
    }
    
    clearErrors() {
        this.errors = [];
    }
}

// Initialize utilities when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize accessibility features
    AccessibilityHelper.init();
    
    // Initialize performance monitoring
    window.performanceMonitor = new PerformanceMonitor();
    
    // Initialize error handling
    window.errorHandler = new ErrorHandler();
    
    // Add utility classes to global scope
    window.Utils = Utils;
    
    console.log('Utilities initialized successfully');
});

// Export utilities for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, PerformanceMonitor, AccessibilityHelper, ErrorHandler };
}

