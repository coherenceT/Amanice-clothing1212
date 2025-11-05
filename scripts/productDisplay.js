// Product Display - Handles displaying products on the store page
class ProductDisplay {
    constructor() {
        this.productManager = new ProductManager();
        this.init();
    }

    async init() {
        // Wait for default products to load
        await this.productManager.loadDefaultProducts();
        this.loadProducts();
    }

    loadProducts() {
        const products = this.productManager.getFilteredProducts();
        
        if (products.length === 0) {
            return; // Keep default products if no products available
        }

        // Group products by category
        const menProducts = products.filter(p => p.category === 'men');
        const womenProducts = products.filter(p => p.category === 'women');
        const kidsProducts = products.filter(p => p.category === 'kids');

        // Update featured products (show first 3 from all categories - can be customized)
        // Only update if there are products, otherwise keep default featured
        if (products.length > 0) {
            this.updateFeaturedProducts(products.slice(0, 3));
        }

        // Update category sections - this ensures ALL products appear in their correct category
        this.updateCategorySection('men', menProducts);
        this.updateCategorySection('women', womenProducts);
        this.updateCategorySection('kids', kidsProducts);

        // Create dynamic product detail modals
        this.createProductDetailModals(products);
    }

    updateFeaturedProducts(products) {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid || products.length === 0) return;

        // Filter out sneakers and kids packs from featured (they have their own pages)
        const featuredProducts = products.filter(p => {
            const isSneaker = p.isShoe === true || (p.type && (p.type.toLowerCase().includes('sneaker') || p.type.toLowerCase().includes('takkies')));
            const isKidsPack = p.type && (p.type.toLowerCase().includes('kids clothing pack') || p.type.toLowerCase().includes('kids pack') || p.type.toLowerCase().includes('clothing pack'));
            return !isSneaker && !isKidsPack;
        }).slice(0, 3);

        // If we have less than 3, keep default featured products
        if (featuredProducts.length === 0) {
            return; // Keep default featured products
        }

        featuredGrid.innerHTML = featuredProducts.map(product => {
            const priceDisplay = product.priceRange || `R${product.price.toFixed(2)}`;

            return `
                <div class="featured-card">
                    <img src="${product.image}" alt="${product.type}" class="featured-image">
                    <div class="featured-info">
                        <h3 class="featured-name">${product.type}</h3>
                        <p class="featured-description">${product.description || `${product.category.charAt(0).toUpperCase() + product.category.slice(1)}'s ${product.type}`}</p>
                        <div class="featured-price">${priceDisplay}</div>
                        <button class="add-to-cart-btn" data-name="${product.type}" data-price-range="${priceDisplay}">Add to Cart</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCategorySection(category, products) {
        const categoryCards = document.querySelectorAll('.category-card');
        let categoryCard = null;
        
        categoryCards.forEach(card => {
            const title = card.querySelector('.category-title').textContent.toLowerCase();
            if (title.includes(category === 'men' ? "men's" : category === 'women' ? "women's" : "kids")) {
                categoryCard = card;
            }
        });

        if (!categoryCard) return;

        const categoryItems = categoryCard.querySelector('.category-items');
        if (!categoryItems) return;

        // Clear existing items and add ALL products for this category
        categoryItems.innerHTML = '';

        // If no products for this category, show a message
        if (products.length === 0) {
            categoryItems.innerHTML = '<li style="color: #666; font-style: italic;">No products in this category yet.</li>';
            return;
        }

        // Separate sneakers, kids packs, and regular products
        const regularProducts = products.filter(p => {
            const isSneaker = p.isShoe === true || (p.type && (p.type.toLowerCase().includes('sneaker') || p.type.toLowerCase().includes('takkies')));
            const isKidsPack = p.type && (p.type.toLowerCase().includes('kids clothing pack') || p.type.toLowerCase().includes('kids pack') || p.type.toLowerCase().includes('clothing pack'));
            return !isSneaker && !isKidsPack;
        });

        // Check if we need to add sneakers link
        const hasSneakers = category === 'men' || category === 'women';
        const hasKidsPacks = category === 'kids';

        // Add regular products - ALL products in this category
        regularProducts.forEach(product => {
            const li = document.createElement('li');
            const productId = `product-${product.id}`;
            li.innerHTML = `<a href="#" class="product-link" data-product="${productId}">${product.type}${product.size ? ` - ${product.size}` : ''}</a>`;
            categoryItems.appendChild(li);
        });

        // Add sneakers link for men's and women's categories
        if (hasSneakers) {
            const sneakersExist = products.some(p => {
                const isSneaker = p.isShoe === true || (p.type && (p.type.toLowerCase().includes('sneaker') || p.type.toLowerCase().includes('takkies')));
                return isSneaker && p.category === category;
            });
            
            if (sneakersExist || category === 'men' || category === 'women') {
                const li = document.createElement('li');
                li.innerHTML = `<a href="sneakers.html" class="product-link">Sneakers</a>`;
                categoryItems.appendChild(li);
            }
        }

        // Add kids packs link for kids category
        if (hasKidsPacks) {
            const packsExist = products.some(p => {
                const isPack = p.type && (p.type.toLowerCase().includes('kids clothing pack') || p.type.toLowerCase().includes('kids pack') || p.type.toLowerCase().includes('clothing pack'));
                return isPack && p.category === 'kids';
            });
            
            if (packsExist) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="kids-packs.html" class="product-link">Kids Clothing Packs</a>`;
                categoryItems.appendChild(li);
            }
        }
    }

    createProductDetailModals(products) {
        // Remove existing dynamic product modals
        document.querySelectorAll('.dynamic-product-detail').forEach(el => el.remove());

        products.forEach(product => {
            const modalId = `product-${product.id}`;
            const modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'product-detail dynamic-product-detail';

            let stockInfo = '';
            if (product.isShoe && product.shoeSizes && product.shoeSizes.length > 0) {
                stockInfo = product.shoeSizes.map(shoe => 
                    `<p><strong>${shoe.brand}</strong> - Size ${shoe.size}: ${shoe.qty} available</p>`
                ).join('');
            } else {
                stockInfo = `<p><strong>Stock Available:</strong> ${product.stockQuantity || 0}</p>`;
            }

            const priceDisplay = product.priceRange || `R${product.price.toFixed(2)}`;

            modal.innerHTML = `
                <div class="product-detail-content">
                    <div class="product-detail-header">
                        <h3 class="product-detail-title">${product.type}</h3>
                        <button class="close-detail">&times;</button>
                    </div>
                    <div class="product-detail-body">
                        <img src="${product.image}" alt="${product.type}" class="product-detail-image">
                        <div class="product-detail-info">
                            <div class="product-detail-features">
                                <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                                <p><strong>Gender:</strong> ${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}</p>
                                ${product.size ? `<p><strong>Size:</strong> ${product.size}</p>` : ''}
                                ${product.isShoe && product.shoeBrand ? `<p><strong>Brand:</strong> ${product.shoeBrand}</p>` : ''}
                                ${product.description ? `<p>${product.description}</p>` : ''}
                                ${stockInfo ? `<div style="margin-top: 1rem;">${stockInfo}</div>` : ''}
                                ${product.stockNumber ? `<p><strong>Stock #:</strong> ${product.stockNumber}</p>` : ''}
                            </div>
                            <div class="price-range">Price: ${priceDisplay}</div>
                            <button class="add-to-cart-btn" data-name="${product.type}" data-price-range="${priceDisplay}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
        });
    }

    // Public method to refresh products (can be called after adding new products)
    refresh() {
        this.loadProducts();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.productDisplay = new ProductDisplay();
        
        // Listen for storage changes to auto-refresh when products are added
        window.addEventListener('storage', () => {
            if (window.productDisplay) {
                window.productDisplay.refresh();
            }
        });
    });
} else {
    window.productDisplay = new ProductDisplay();
    
    // Listen for storage changes to auto-refresh when products are added
    window.addEventListener('storage', () => {
        if (window.productDisplay) {
            window.productDisplay.refresh();
        }
    });
}

// Also refresh when page becomes visible (in case products were added in another tab)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.productDisplay) {
        window.productDisplay.refresh();
    }
});

