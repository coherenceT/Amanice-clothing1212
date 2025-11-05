// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Use event delegation for add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart-btn');
                const name = button.getAttribute('data-name');
                const priceRange = button.getAttribute('data-price-range');
                
                if (name && priceRange) {
                    this.addItem(name, priceRange);
                }
            }
        });

        // Remove item from cart
        const cartItems = document.getElementById('cartItems');
        if (cartItems) {
            cartItems.addEventListener('click', (e) => {
                if (e.target.closest('.remove-item')) {
                    const button = e.target.closest('.remove-item');
                    const index = parseInt(button.getAttribute('data-index'));
                    this.removeItem(index);
                }
            });
        }

        // Cart icon toggle
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                const cartModal = document.getElementById('cartModal');
                if (cartModal) cartModal.classList.add('active');
            });
        }

        // Close cart
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                const cartModal = document.getElementById('cartModal');
                if (cartModal) cartModal.classList.remove('active');
            });
        }

        // Close cart when clicking outside
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.classList.remove('active');
                }
            });
        }

        // Send order via WhatsApp
        const sendOrderBtn = document.getElementById('sendOrderBtn');
        if (sendOrderBtn) {
            sendOrderBtn.addEventListener('click', () => {
                this.sendOrderViaWhatsApp();
            });
        }
    }

    addItem(name, priceRange) {
        this.cart.push({ name, priceRange });
        this.saveCart();
        this.updateCartDisplay();
        
        // Pop animation on cart icon
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.classList.remove('pop');
            cartIcon.offsetWidth; // Force reflow
            cartIcon.classList.add('pop');
        }
        
        // Close product detail modal if open
        const productDetail = document.querySelector('.product-detail.active');
        if (productDetail) {
            productDetail.classList.remove('active');
        }
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
        
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
                return;
            }
            
            this.cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price-range">${item.priceRange}</div>
                    </div>
                    <button class="remove-item" data-index="${index}">&times;</button>
                `;
                cartItems.appendChild(cartItem);
            });
        }
    }

    sendOrderViaWhatsApp() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        let message = "Hi AMA-NICE! I'd like to order the following items:\n\n";
        
        this.cart.forEach(item => {
            message += `• ${item.name} - ${item.priceRange}\n`;
        });
        
        message += "\nPlease let me know about availability and payment details.";
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/27731635803?text=${encodedMessage}`, '_blank');
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Initialize cart when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cart = new ShoppingCart();
    });
} else {
    window.cart = new ShoppingCart();
}

