/* ===================================
   ANIMATIONS JAVASCRIPT - HAMZA WEBSITE
   Advanced animations and effects
   =================================== */

// Animation utilities and advanced effects
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.initParticleSystem();
        this.initTextAnimations();
        this.initHoverEffects();
    }
    
    // Setup intersection observers for scroll animations
    setupIntersectionObservers() {
        const options = {
            threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
            rootMargin: '-50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, options);
        
        // Observe elements with animation attributes
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.set('scroll', observer);
    }
    
    // Trigger animations based on element and visibility
    triggerAnimation(element, ratio) {
        const animationType = element.getAttribute('data-animate');
        const delay = parseInt(element.getAttribute('data-delay')) || 0;
        
        setTimeout(() => {
            switch(animationType) {
                case 'fadeInUp':
                    this.fadeInUp(element);
                    break;
                case 'slideInLeft':
                    this.slideInLeft(element);
                    break;
                case 'slideInRight':
                    this.slideInRight(element);
                    break;
                case 'scaleIn':
                    this.scaleIn(element);
                    break;
                case 'rotateIn':
                    this.rotateIn(element);
                    break;
                default:
                    this.fadeInUp(element);
            }
        }, delay);
    }
    
    // Animation methods
    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    slideInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    slideInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    rotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-10deg) scale(0.8)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }
    
    // Particle system for background effects
    initParticleSystem() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return; // Skip particles for users who prefer reduced motion
        }
        
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-bg';
        heroSection.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(particleContainer);
            }, i * 200);
        }
        
        // Continuously create new particles
        setInterval(() => {
            if (particleContainer.children.length < 20) {
                this.createParticle(particleContainer);
            }
        }, 1000);
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and properties
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 15000);
    }
    
    // Text animations
    initTextAnimations() {
        this.setupTypewriterEffect();
        this.setupCounterAnimations();
    }
    
    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--accent-gold)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRightColor = 
                            element.style.borderRightColor === 'transparent' ? 
                            'var(--accent-gold)' : 'transparent';
                    }, 750);
                }
            }, 100);
        });
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, target, duration);
                        observer.unobserve(counter);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }
    
    animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Advanced hover effects
    initHoverEffects() {
        this.setupMagneticEffect();
        this.setupRippleEffect();
        this.setupTiltEffect();
    }
    
    setupMagneticEffect() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 0.3;
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    setupRippleEffect() {
        const rippleElements = document.querySelectorAll('.ripple-effect');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 215, 0, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x - 10}px;
                    top: ${y - 10}px;
                    width: 20px;
                    height: 20px;
                `;
                
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt-effect');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }
    
    // Utility method to check if animations should be reduced
    shouldReduceMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    // Clean up method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.animations.clear();
        this.observers.clear();
    }
}

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.setupScrollTriggers();
        this.bindScrollEvents();
    }
    
    setupScrollTriggers() {
        // Elements that should animate on scroll
        const animatedElements = document.querySelectorAll(`
            .timeline-item,
            .value-item,
            .social-item,
            .quote-card,
            .blog-post,
            .gallery-item,
            .portfolio-item,
            .contact-item
        `);
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transitionDelay = `${index * 0.1}s`;
            
            this.elements.push({
                element,
                animated: false
            });
        });
    }
    
    bindScrollEvents() {
        const handleScroll = () => {
            this.elements.forEach(item => {
                if (!item.animated && this.isElementInViewport(item.element)) {
                    item.element.style.opacity = '1';
                    item.element.style.transform = 'translateY(0)';
                    item.animated = true;
                }
            });
        };
        
        window.addEventListener('scroll', this.throttle(handleScroll, 16));
        handleScroll(); // Check initial state
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight * 0.8 &&
            rect.bottom > 0
        );
    }
    
    throttle(func, limit) {
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
}

// Initialize animation systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if motion is not reduced
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.animationManager = new AnimationManager();
        window.scrollAnimations = new ScrollAnimations();
    }
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .ripple-effect {
            position: relative;
            overflow: hidden;
        }
        
        .magnetic {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .tilt-effect {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.animationManager) {
        window.animationManager.destroy();
    }
});

