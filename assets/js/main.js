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
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    console.log('GIAT Website - All functionality initialized');
});

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