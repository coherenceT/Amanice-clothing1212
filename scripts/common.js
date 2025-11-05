// Common utility functions used across all pages

// Navigation toggle for mobile
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
}

// Product detail modal handlers
function initProductDetails() {
    // Product detail functionality using event delegation
    document.addEventListener('click', function(e) {
        const productLink = e.target.closest('.product-link');
        if (productLink) {
            e.preventDefault();
            const productId = productLink.getAttribute('data-product');
            
            if (productId) {
                // Hide all product details
                document.querySelectorAll('.product-detail').forEach(detail => {
                    detail.classList.remove('active');
                });
                
                // Show the selected product detail
                const productDetail = document.getElementById(productId);
                if (productDetail) {
                    productDetail.classList.add('active');
                } else {
                    alert('Product details coming soon!');
                }
            }
        }
    });

    // Close product detail using event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('.close-detail')) {
            const button = e.target.closest('.close-detail');
            const productDetail = button.closest('.product-detail');
            if (productDetail) {
                productDetail.classList.remove('active');
            }
        }
    });

    // Close product detail when clicking outside
    document.querySelectorAll('.product-detail').forEach(detail => {
        detail.addEventListener('click', function(e) {
            if (e.target === detail) {
                detail.classList.remove('active');
            }
        });
    });
}

// Initialize common functions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMobileNavigation();
        initSmoothScrolling();
        initProductDetails();
    });
} else {
    initMobileNavigation();
    initSmoothScrolling();
    initProductDetails();
}

