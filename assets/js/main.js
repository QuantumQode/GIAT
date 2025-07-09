/**
 * GIAT Ltd - Main JavaScript File
 * Handles all shared functionality across the website
 */

// ===== DOM ELEMENTS =====
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

// ===== MOBILE MENU FUNCTIONALITY =====
function initializeMobileMenu() {
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FADE-IN ANIMATIONS =====
function initializeFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        element.classList.add('opacity-0');
        fadeInObserver.observe(element);
    });
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateRequiredField(value) {
    return value && value.trim().length > 0;
}

// ===== CONTACT FORM HANDLING =====
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide any existing messages
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData);
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'industry', 'inquiryType', 'message'];
        const isValid = requiredFields.every(field => validateRequiredField(formObject[field]));
        
        if (!isValid) {
            if (errorMessage) errorMessage.style.display = 'block';
            return;
        }
        
        // Validate email
        if (!validateEmail(formObject.email)) {
            if (errorMessage) errorMessage.style.display = 'block';
            return;
        }
        
        // Simulate form submission (replace with actual backend integration)
        setTimeout(() => {
            if (successMessage) {
                successMessage.style.display = 'block';
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        }, 1000);
    });
}

// ===== FORM FIELD FOCUS EFFECTS =====
function initializeFormFocusEffects() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('ring-2', 'ring-electric-blue', 'ring-opacity-20');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('ring-2', 'ring-electric-blue', 'ring-opacity-20');
        });
    });
}

// ===== UTILITY FUNCTIONS =====
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

// ===== SCROLL EVENT HANDLERS =====
const handleScroll = throttle(() => {
    // Add scroll-based functionality here if needed
    // Example: Header background change on scroll
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('bg-white/95', 'backdrop-blur-sm');
        } else {
            header.classList.remove('bg-white/95', 'backdrop-blur-sm');
        }
    }
}, 100);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeFadeInAnimations();
    initializeContactForm();
    initializeFormFocusEffects();
    initializeCarousels();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    console.log('GIAT Website - All functionality initialized');
});

// ===== CAROUSEL FUNCTIONALITY =====
// Global carousel state
const carouselStates = {};

function initializeCarousels() {
    const carousels = document.querySelectorAll('.carousel-track');
    
    carousels.forEach(carousel => {
        const carouselId = carousel.id;
        carouselStates[carouselId] = {
            currentSlide: 0,
            totalSlides: carousel.children.length
        };
        
        // Initialize dots
        updateCarouselDots(carouselId);
    });
}

function changeSlide(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel || !carouselStates[carouselId]) return;
    
    const state = carouselStates[carouselId];
    let newSlide = state.currentSlide + direction;
    
    // Handle wrap-around
    if (newSlide < 0) {
        newSlide = state.totalSlides - 1;
    } else if (newSlide >= state.totalSlides) {
        newSlide = 0;
    }
    
    goToSlide(carouselId, newSlide);
}

function goToSlide(carouselId, slideIndex) {
    const carousel = document.getElementById(carouselId);
    if (!carousel || !carouselStates[carouselId]) return;
    
    const state = carouselStates[carouselId];
    if (slideIndex < 0 || slideIndex >= state.totalSlides) return;
    
    // Update current slide
    state.currentSlide = slideIndex;
    
    // Move carousel track
    const translateX = -slideIndex * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    updateCarouselDots(carouselId);
}

function updateCarouselDots(carouselId) {
    const state = carouselStates[carouselId];
    if (!state) return;
    
    const carousel = document.getElementById(carouselId);
    const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
    
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === state.currentSlide) {
                dot.classList.add('bg-opacity-100');
                dot.classList.remove('bg-opacity-50');
            } else {
                dot.classList.remove('bg-opacity-100');
                dot.classList.add('bg-opacity-50');
            }
        });
    }
}

// Auto-advance carousels (optional)
function startCarouselAutoAdvance() {
    setInterval(() => {
        Object.keys(carouselStates).forEach(carouselId => {
            const state = carouselStates[carouselId];
            if (state) {
                changeSlide(carouselId, 1);
            }
        });
    }, 5000); // Change slide every 5 seconds
}

// ===== EXPORT FOR MODULE USE (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeMobileMenu,
        initializeSmoothScrolling,
        initializeFadeInAnimations,
        initializeContactForm,
        validateEmail,
        validateRequiredField,
        debounce,
        throttle
    };
} 