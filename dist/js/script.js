// Mobile Navigation Toggle
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Toggle Nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Smooth Scrolling for Anchor Links
const smoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', clickHandler);
    }
    
    function clickHandler(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        if (href === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}

// Filter Functionality for Mentors and Resources Pages
const filterItems = () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const items = document.querySelectorAll('.filterable-item');
    
    if (filterButtons.length && items.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Show/hide items based on filter
                items.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 500);
                    }
                });
            });
        });
    }
}

// Search Functionality
const searchFunctionality = () => {
    const searchInput = document.querySelector('.search-input');
    const searchableItems = document.querySelectorAll('.searchable-item');
    
    if (searchInput && searchableItems.length) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    }
}

// Form Validation
const validateForm = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Remove error message if it exists
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            if (!valid) {
                e.preventDefault();
            } else {
                // For demo purposes, prevent actual form submission and show success message
                e.preventDefault();
                form.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank you!</h3><p>Your message has been sent successfully. We will get back to you soon.</p></div>';
            }
        });
    });
}

// Scroll Animations
const scrollAnimations = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const checkPosition = () => {
        elements.forEach(element => {
            const positionFromTop = element.getBoundingClientRect().top;
            
            if (positionFromTop - window.innerHeight <= 0) {
                element.classList.add('fade-in');
            }
        });
    }
    
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);
    
    // Check position initially
    checkPosition();
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    smoothScroll();
    filterItems();
    searchFunctionality();
    validateForm();
    scrollAnimations();
});