// Mobile-specific functionality and responsive behavior

class MobileManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.menuOpen = false;
        
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initTouchGestures();
        this.initMobileOptimizations();
        this.handleOrientationChange();
        this.optimizeForTouch();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    detectTablet() {
        return /iPad|Android|webOS|BlackBerry|IEMobile/i.test(navigator.userAgent) &&
               (window.innerWidth > 768 && window.innerWidth <= 1024);
    }

    initMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!mobileToggle || !navMenu) return;

        // Toggle mobile menu
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.menuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.menuOpen && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle resize events
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && this.menuOpen) {
                this.closeMobileMenu();
            }
        }, 250));
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const toggleIcon = document.querySelector('#mobile-menu-toggle i');

        if (this.menuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const toggleIcon = document.querySelector('#mobile-menu-toggle i');
        
        navMenu.classList.add('active');
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-times');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        this.menuOpen = true;

        // Add stagger animation to menu items
        const menuItems = navMenu.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('mobile-menu-item-animate');
        });
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const toggleIcon = document.querySelector('#mobile-menu-toggle i');
        
        navMenu.classList.remove('active');
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        this.menuOpen = false;

        // Remove animation classes
        const menuItems = navMenu.querySelectorAll('.nav-link');
        menuItems.forEach(item => {
            item.style.animationDelay = '';
            item.classList.remove('mobile-menu-item-animate');
        });
    }

    initTouchGestures() {
        if (!this.isMobile) return;

        // Swipe gestures for navigation
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture();
        }, { passive: true });

        // Pull to refresh prevention on overscroll
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && e.touches[0].clientY > this.touchStartY) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    handleSwipeGesture() {
        const swipeDistance = this.touchStartY - this.touchEndY;
        const minSwipeDistance = 50;

        // Vertical swipes for section navigation
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe up - next section
                this.navigateToNextSection();
            } else {
                // Swipe down - previous section
                this.navigateToPreviousSection();
            }
        }
    }

    navigateToNextSection() {
        const sections = document.querySelectorAll('section[id]');
        const currentSection = this.getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            this.scrollToSection(nextSection.id);
        }
    }

    navigateToPreviousSection() {
        const sections = document.querySelectorAll('section[id]');
        const currentSection = this.getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        if (currentIndex > 0) {
            const previousSection = sections[currentIndex - 1];
            this.scrollToSection(previousSection.id);
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                return section.id;
            }
        }
        
        return sections[0].id;
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    initMobileOptimizations() {
        if (!this.isMobile) return;

        // Optimize images for mobile
        this.optimizeImages();

        // Reduce animation complexity on mobile
        this.optimizeAnimations();

        // Add mobile-specific classes
        document.body.classList.add('mobile-device');
        if (this.isTablet) {
            document.body.classList.add('tablet-device');
        }

        // Optimize scroll performance
        this.optimizeScrolling();
    }

    optimizeImages() {
        // Lazy load images below the fold
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeAnimations() {
        // Reduce motion for better performance on mobile
        const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (this.isMobile || preferReducedMotion.matches) {
            // Disable complex animations
            const style = document.createElement('style');
            style.textContent = `
                .particle-effect::before {
                    display: none;
                }
                
                .hero-image::before {
                    animation-duration: 10s;
                }
                
                .typing-text {
                    animation-duration: 0.5s;
                }
                
                @media (max-width: 768px) {
                    * {
                        animation-duration: 0.3s !important;
                        transition-duration: 0.3s !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    optimizeScrolling() {
        // Use passive listeners for better scroll performance
        let isScrolling = false;

        const handleScroll = () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    // Scroll-dependent updates here
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Smooth scrolling polyfill for older browsers
        if (!('scrollBehavior' in document.documentElement.style)) {
            this.addSmoothScrollPolyfill();
        }
    }

    addSmoothScrollPolyfill() {
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - 80;
                    this.smoothScrollTo(targetPosition, 600);
                }
            });
        });
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Close mobile menu on orientation change
            if (this.menuOpen) {
                this.closeMobileMenu();
            }

            // Recalculate dimensions after orientation change
            setTimeout(() => {
                this.isMobile = this.detectMobile();
                this.isTablet = this.detectTablet();
                
                // Trigger resize event for other components
                window.dispatchEvent(new Event('resize'));
            }, 100);
        });
    }

    optimizeForTouch() {
        if (!this.isMobile) return;

        // Add touch-friendly styles
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            @media (hover: none) and (pointer: coarse) {
                .btn, .nav-link, .project-card, .social-link, .hero-social-link {
                    -webkit-tap-highlight-color: rgba(217, 70, 239, 0.3);
                    min-height: 44px;
                    min-width: 44px;
                }
                
                .btn {
                    padding: 1rem 2rem;
                }
                
                .nav-link {
                    padding: 1rem;
                    display: block;
                }
                
                /* Remove hover effects on touch devices */
                .btn:hover,
                .project-card:hover,
                .social-link:hover,
                .hero-social-link:hover {
                    transform: none;
                }
                
                /* Add active states for touch feedback */
                .btn:active,
                .social-link:active,
                .hero-social-link:active {
                    transform: scale(0.95);
                    transition: transform 0.1s ease;
                }
            }
            
            /* Mobile menu animations */
            .mobile-menu-item-animate {
                animation: slideInFromRight 0.3s ease forwards;
            }
            
            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(touchStyle);

        // Enhanced touch feedback
        this.addTouchFeedback();
    }

    addTouchFeedback() {
        const touchElements = document.querySelectorAll('.btn, .social-link, .hero-social-link, .project-card');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });

        // Add CSS for touch feedback
        const feedbackStyle = document.createElement('style');
        feedbackStyle.textContent = `
            .touch-active {
                opacity: 0.8;
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(feedbackStyle);
    }

    // Utility methods
    getViewportHeight() {
        return window.innerHeight || document.documentElement.clientHeight;
    }

    getViewportWidth() {
        return window.innerWidth || document.documentElement.clientWidth;
    }

    isLandscape() {
        return this.getViewportWidth() > this.getViewportHeight();
    }

    isPortrait() {
        return this.getViewportHeight() > this.getViewportWidth();
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize mobile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const mobileManager = new MobileManager();

    // Add mobile-specific event listeners
    if (mobileManager.isMobile) {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Handle iOS Safari bottom bar
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', debounce(setViewportHeight, 250));
    }

    // Global mobile manager instance
    window.mobileManager = mobileManager;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileManager;
}
