// Animation utilities and effects for the portfolio

class AnimationController {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.observers = new Map();
        this.init();
    }

    init() {
        this.createIntersectionObservers();
        this.initParallaxEffects();
        this.initHoverAnimations();
        this.bindEvents();
    }

    createIntersectionObservers() {
        // Main scroll reveal observer
        const scrollRevealObserver = new IntersectionObserver(
            (entries) => this.handleScrollReveal(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Stagger animation observer
        const staggerObserver = new IntersectionObserver(
            (entries) => this.handleStaggerAnimation(entries),
            {
                threshold: 0.2,
                rootMargin: '0px 0px -30px 0px'
            }
        );

        // Store observers
        this.observers.set('scrollReveal', scrollRevealObserver);
        this.observers.set('stagger', staggerObserver);

        // Observe elements
        this.observeElements();
    }

    observeElements() {
        // Elements for scroll reveal
        const scrollElements = document.querySelectorAll(`
            .timeline-item,
            .project-card,
            .skill-item,
            .contact-item,
            .stat-item
        `);

        scrollElements.forEach(el => {
            this.observers.get('scrollReveal').observe(el);
        });

        // Elements for stagger animation
        const staggerContainers = document.querySelectorAll(`
            .skills-grid,
            .projects-grid,
            .contact-items
        `);

        staggerContainers.forEach(container => {
            this.observers.get('stagger').observe(container);
        });
    }

    handleScrollReveal(entries) {
        if (this.isReducedMotion) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateElement(entry.target);
            }
        });
    }

    handleStaggerAnimation(entries) {
        if (this.isReducedMotion) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.staggerChildren(entry.target);
            }
        });
    }

    animateElement(element) {
        // Determine animation type based on element
        let animationClass = 'fade-in-up';

        if (element.classList.contains('timeline-item')) {
            animationClass = element.classList.contains('left') ? 'slide-in-left' : 'slide-in-right';
        } else if (element.classList.contains('project-card')) {
            animationClass = 'scale-in';
        } else if (element.classList.contains('stat-item')) {
            animationClass = 'fade-in-up';
            this.animateCounter(element);
        }

        element.classList.add(animationClass);

        // Special handling for skill bars
        if (element.classList.contains('skill-item')) {
            this.animateSkillBar(element);
        }
    }

    staggerChildren(container) {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('stagger-animation', 'animate');
            }, index * 100);
        });
    }

    animateCounter(statElement) {
        const numberElement = statElement.querySelector('.stat-number');
        if (!numberElement || numberElement.classList.contains('animated')) return;

        const target = parseInt(numberElement.getAttribute('data-target')) || 0;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const animate = () => {
            current += step;
            if (current >= target) {
                current = target;
                numberElement.textContent = target;
                numberElement.classList.add('animated');
                return;
            }
            numberElement.textContent = Math.floor(current);
            requestAnimationFrame(animate);
        };

        animate();
    }

    animateSkillBar(skillElement) {
        const progressBar = skillElement.querySelector('.skill-progress');
        if (!progressBar) return;

        const progress = progressBar.getAttribute('data-progress') || '0';
        
        setTimeout(() => {
            progressBar.style.width = progress + '%';
            progressBar.classList.add('animate');
        }, 300);
    }

    initParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.hero-image, .about-image');
        
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16);

        window.addEventListener('scroll', handleParallax);
    }

    initHoverAnimations() {
        // Add hover classes to interactive elements
        const hoverElements = document.querySelectorAll(`
            .btn,
            .project-card,
            .social-link,
            .hero-social-link,
            .nav-link
        `);

        hoverElements.forEach(element => {
            element.classList.add('hover-lift');
        });

        // Special glow effects
        const glowElements = document.querySelectorAll(`
            .hero-social-link,
            .social-link,
            .btn-secondary
        `);

        glowElements.forEach(element => {
            element.classList.add('hover-glow');
        });
    }

    bindEvents() {
        // Typing animation restart on focus
        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            this.initAdvancedTypingAnimation(typingElement);
        }

        // Particle effects on mouse move
        this.initMouseParticles();

        // Page transition effects
        this.initPageTransitions();
    }

    initAdvancedTypingAnimation(element) {
        const texts = [
            'Technical Specialist',
            'Software Engineer', 
            'ADAS Expert',
            'Innovation Leader',
            'Problem Solver',
            'Tech Enthusiast'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let speed = 100;

        const type = () => {
            if (this.isReducedMotion) {
                element.textContent = texts[0];
                return;
            }

            const currentText = texts[textIndex];

            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                speed = 50;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                speed = Math.random() * 100 + 50; // Variable speed for natural feel
            }

            if (!isDeleting && charIndex === currentText.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                speed = 500;
            }

            setTimeout(type, speed);
        };

        type();
    }

    initMouseParticles() {
        if (this.isReducedMotion) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        
        document.body.appendChild(canvas);

        let particles = [];
        let mouse = { x: 0, y: 0 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = (x, y) => {
            return {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: Math.random() * 0.02 + 0.01
            };
        };

        const updateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles = particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= particle.decay;

                ctx.globalAlpha = particle.life;
                ctx.fillStyle = '#d946ef';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                ctx.fill();

                return particle.life > 0;
            });

            requestAnimationFrame(updateParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        updateParticles();

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            if (Math.random() < 0.1) {
                particles.push(createParticle(mouse.x, mouse.y));
            }
        });
    }

    initPageTransitions() {
        // Add loading animation
        document.body.classList.add('page-transition');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
        });

        // Handle navigation transitions
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isReducedMotion) return;
                
                // Add transition effect
                const targetSection = document.querySelector(link.getAttribute('href'));
                if (targetSection) {
                    targetSection.classList.add('section-entering');
                    setTimeout(() => {
                        targetSection.classList.remove('section-entering');
                    }, 600);
                }
            });
        });
    }
}

// Text reveal animation for long content
class TextReveal {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            delay: options.delay || 50,
            animationClass: options.animationClass || 'char-reveal',
            ...options
        };
        this.init();
    }

    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.wrapChars();
        this.observe();
    }

    wrapChars() {
        const text = this.element.textContent;
        const chars = text.split('').map(char => 
            char === ' ' ? '<span class="char"> </span>' : `<span class="char">${char}</span>`
        ).join('');
        
        this.element.innerHTML = chars;
    }

    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateChars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animateChars() {
        const chars = this.element.querySelectorAll('.char');
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.classList.add(this.options.animationClass);
            }, index * this.options.delay);
        });
    }
}

// Magnetic hover effect for buttons
class MagneticEffect {
    constructor(element, strength = 0.3) {
        this.element = element;
        this.strength = strength;
        this.boundingRect = element.getBoundingClientRect();
        this.init();
    }

    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.element.addEventListener('mouseenter', () => this.bindMouseMove());
        this.element.addEventListener('mouseleave', () => this.resetPosition());
        window.addEventListener('resize', () => this.updateBoundingRect());
    }

    bindMouseMove() {
        this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(e) {
        const { left, top, width, height } = this.boundingRect;
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const deltaX = (e.clientX - centerX) * this.strength;
        const deltaY = (e.clientY - centerY) * this.strength;
        
        this.element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    resetPosition() {
        this.element.removeEventListener('mousemove', this.handleMouseMove);
        this.element.style.transform = 'translate(0px, 0px)';
    }

    updateBoundingRect() {
        this.boundingRect = this.element.getBoundingClientRect();
    }
}

// Performance utilities
function throttle(func, limit) {
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

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Main animation controller
    const animationController = new AnimationController();

    // Initialize text reveal for specific elements
    const textRevealElements = document.querySelectorAll('.hero-description, .timeline-content p');
    textRevealElements.forEach(element => {
        new TextReveal(element);
    });

    // Initialize magnetic effects for buttons
    const magneticElements = document.querySelectorAll('.btn, .hero-social-link');
    magneticElements.forEach(element => {
        new MagneticEffect(element);
    });

    // Add CSS for animations if not already present
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .char {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease;
            }
            
            .char.char-reveal {
                opacity: 1;
                transform: translateY(0);
            }
            
            .section-entering {
                transform: translateY(20px);
                opacity: 0.8;
                transition: all 0.6s ease;
            }
            
            .page-transition {
                opacity: 0;
                transform: translateY(20px);
            }
            
            .page-transition.loaded {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.8s ease;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, TextReveal, MagneticEffect };
}
