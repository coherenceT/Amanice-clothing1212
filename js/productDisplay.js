// Product Display - Handles displaying products on the store page
class ProductDisplay {
    constructor() {
        this.productManager = new ProductManager();
        this.init();
    }

    async init() {
        // Wait for default products to load
        await this.productManager.loadDefaultProducts();
        console.log('ProductDisplay initialized, loading products...');
        await this.loadProducts();
        console.log('Products loaded successfully');
    }

    async loadProducts() {
        console.log('\n🚀 Starting loadProducts()...');
        
        // Wait a tiny bit to ensure DOM is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Make sure default products are loaded
        await this.productManager.loadDefaultProducts();
        console.log(`📚 Default products loaded: ${this.productManager.defaultProducts.length}`);
        
        // Get ALL products (default + admin-added)
        const products = this.productManager.getAllProducts();
        
        console.log(`📦 Total products loaded: ${products.length}`);
        console.log(`👤 Admin products in localStorage: ${JSON.parse(localStorage.getItem('products') || '[]').length}`);
        console.log(`🗑️  Deleted products: ${JSON.parse(localStorage.getItem('deletedProducts') || '[]').length}`);
        
        // Group products by category - normalize to lowercase for matching
        // Use the EXACT same logic for all categories
        const menProducts = products.filter(p => {
            const category = String(p.category || '').toLowerCase().trim();
            return category === 'men';
        });
        
        const womenProducts = products.filter(p => {
            const category = String(p.category || '').toLowerCase().trim();
            return category === 'women';
        });
        
        const kidsProducts = products.filter(p => {
            const category = String(p.category || '').toLowerCase().trim();
            return category === 'kids';
        });

        console.log(`\n📊 Categorized products:`);
        console.log(`  👔 Men's: ${menProducts.length} products`);
        console.log(`  👚 Women's: ${womenProducts.length} products`);
        console.log(`  👶 Kids: ${kidsProducts.length} products`);

        // Update featured products - pass all products to find sneakers and kids packs
        if (products.length > 0) {
            this.updateFeaturedProducts(products);
        }

        // Update category sections - this ensures ALL products (default + admin-added) appear in their correct category
        // Use EXACT same approach for all categories
        console.log(`\n🔄 Updating category sections...`);
        this.updateCategorySection('men', menProducts);
        this.updateCategorySection('women', womenProducts);
        this.updateCategorySection('kids', kidsProducts);

        // Create dynamic product detail modals
        this.createProductDetailModals(products);
        
        console.log(`\n✅ loadProducts() completed!\n`);
    }

    updateFeaturedProducts(products) {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;

        // Get sneakers for both men and women
        const menSneakers = products.find(p => {
            const isSneaker = p.isShoe === true || (p.type && (p.type.toLowerCase().includes('sneaker') || p.type.toLowerCase().includes('takkies')));
            return isSneaker && p.category === 'men';
        });

        const womenSneakers = products.find(p => {
            const isSneaker = p.isShoe === true || (p.type && (p.type.toLowerCase().includes('sneaker') || p.type.toLowerCase().includes('takkies')));
            return isSneaker && p.category === 'women';
        });

        // Get kids packs
        const kidsPacks = products.find(p => {
            return p.type && (p.type.toLowerCase().includes('kids clothing pack') || 
                             p.type.toLowerCase().includes('kids pack') || 
                             p.type.toLowerCase().includes('clothing pack')) &&
                   p.category === 'kids';
        });

        // Build featured products array
        const featuredItems = [];
        
        // Add men's sneakers
        if (menSneakers) {
            featuredItems.push({
                title: "Men's Sneakers",
                image: menSneakers.image || "Assets/images/Mens sneakers.jpg",
                description: menSneakers.description || "Stylish and comfortable sneakers for men in various sizes and styles.",
                price: menSneakers.priceRange || "R100 - R790",
                link: "sneakers.html"
            });
        } else {
            // Default men's sneakers
            featuredItems.push({
                title: "Men's Sneakers",
                image: "Assets/images/Mens sneakers.jpg",
                description: "Stylish and comfortable sneakers for men in various sizes and styles.",
                price: "R100 - R790",
                link: "sneakers.html"
            });
        }

        // Add women's sneakers
        if (womenSneakers) {
            featuredItems.push({
                title: "Women's Sneakers",
                image: womenSneakers.image || "Assets/images/Ladies takkies.jpg",
                description: womenSneakers.description || "Trendy sneakers for women in all sizes and colors.",
                price: womenSneakers.priceRange || "R100 - R590",
                link: "sneakers.html"
            });
        } else {
            // Default women's sneakers
            featuredItems.push({
                title: "Women's Sneakers",
                image: "Assets/images/Ladies takkies.jpg",
                description: "Trendy sneakers for women in all sizes and colors.",
                price: "R100 - R590",
                link: "sneakers.html"
            });
        }

        // Add kids packs
        if (kidsPacks) {
            featuredItems.push({
                title: "Kids Clothing Packs",
                image: kidsPacks.image || "Assets/images/Kids packs 1.jpg",
                description: kidsPacks.description || "Complete outfits for children aged 0-14 years. Each pack contains 5-7 items depending on sizes and ages.",
                price: kidsPacks.priceRange || "R120",
                link: "kids-packs.html"
            });
        } else {
            // Default kids packs
            featuredItems.push({
                title: "Kids Clothing Packs",
                image: "Assets/images/Kids packs 1.jpg",
                description: "Complete outfits for children aged 0-14 years. Each pack contains 5-7 items depending on sizes and ages.",
                price: "R120",
                link: "kids-packs.html"
            });
        }

        // Update featured grid
        featuredGrid.innerHTML = featuredItems.map(item => {
            return `
                <div class="featured-card">
                    <a href="${item.link}" style="text-decoration: none; color: inherit; display: block;">
                        <img src="${item.image}" alt="${item.title}" class="featured-image">
                        <div class="featured-info">
                            <h3 class="featured-name">${item.title}</h3>
                            <p class="featured-description">${item.description}</p>
                            <div class="featured-price">${item.price}</div>
                            <button class="add-to-cart-btn" onclick="event.preventDefault(); window.location.href='${item.link}'; return false;" style="cursor: pointer; width: 100%;">
                                ${item.link === 'sneakers.html' ? 'View All Sneakers' : 'View All Packs'}
                            </button>
                        </div>
                    </a>
                </div>
            `;
        }).join('');
    }

    updateRecentlyAdded(products) {
        const recentlyAddedSection = document.getElementById('recently-added');
        const recentlyAddedGrid = document.getElementById('recentlyAddedGrid');
        
        if (!recentlyAddedSection || !recentlyAddedGrid) return;

        // Filter products that have dateAdded and sort by most recent
        const recentProducts = products
            .filter(p => p.dateAdded && !p.isDefault)
            .sort((a, b) => {
                const dateA = new Date(a.dateAdded);
                const dateB = new Date(b.dateAdded);
                return dateB - dateA; // Most recent first
            })
            .slice(0, 6); // Show only the 6 most recent

        // Hide section if no recently added products
        if (recentProducts.length === 0) {
            recentlyAddedSection.style.display = 'none';
            return;
        }

        // Show section
        recentlyAddedSection.style.display = 'block';

        // Display recently added products
        recentlyAddedGrid.innerHTML = recentProducts.map(product => {
            const priceDisplay = product.priceRange || (product.price ? `R${product.price.toFixed(2)}` : 'Price on request');
            const productId = `product-${product.id}`;
            
            // Get stock info
            let stockInfo = '';
            if (product.isShoe && product.shoeSizes && product.shoeSizes.length > 0) {
                const totalStock = product.shoeSizes.reduce((sum, size) => sum + (size.qty || 0), 0);
                stockInfo = `${totalStock} available`;
            } else {
                stockInfo = `${product.stockQuantity || 0} available`;
            }

            return `
                <div class="recently-added-card" onclick="document.getElementById('${productId}')?.classList.add('active')">
                    <img src="${product.image}" alt="${product.type}" class="recently-added-image">
                    <div class="recently-added-info">
                        <h3 class="featured-name">${product.type}</h3>
                        <p class="featured-description">${product.description || `${product.category.charAt(0).toUpperCase() + product.category.slice(1)}'s ${product.type}`}</p>
                        <div class="featured-price">${priceDisplay}</div>
                        <small style="color: #666; display: block; margin-top: 0.5rem;">Stock: ${stockInfo}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCategorySection(category, products) {
        console.log(`\n🔍 Starting updateCategorySection for: ${category}`);
        console.log(`📦 Received ${products.length} products to process`);
        
        const categoryCards = document.querySelectorAll('.category-card');
        console.log(`🎴 Found ${categoryCards.length} category cards`);
        
        let categoryCard = null;
        // More flexible matching for men's section
        let searchTexts = [];
        if (category === 'men') {
            searchTexts = ["men's", "men", "male"];
        } else if (category === 'women') {
            searchTexts = ["women's", "women", "female"];
        } else {
            searchTexts = ["kids", "kid"];
        }
        
        categoryCards.forEach((card, index) => {
            const titleElement = card.querySelector('.category-title');
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                console.log(`  Card ${index}: "${title}"`);
                
                // Check against all possible search texts
                const matches = searchTexts.some(text => title.includes(text));
                if (matches) {
                    categoryCard = card;
                    console.log(`✅ Found matching category card for "${category}"`);
                }
            }
        });

        if (!categoryCard) {
            console.error(`❌ Category card not found for: ${category} (searched for: ${searchTexts.join(', ')})`);
            const availableCards = Array.from(categoryCards).map(c => c.querySelector('.category-title')?.textContent);
            console.log('Available category cards:', availableCards);
            
            // Try direct index access as fallback - MEN'S IS FIRST (index 0)
            if (category === 'men' && categoryCards.length >= 1) {
                categoryCard = categoryCards[0];
                console.log(`⚠️  Using fallback: First category card (index 0) for men's`);
            } else if (category === 'women' && categoryCards.length >= 2) {
                categoryCard = categoryCards[1];
                console.log(`⚠️  Using fallback: Second category card (index 1) for women's`);
            } else if (category === 'kids' && categoryCards.length >= 3) {
                categoryCard = categoryCards[2];
                console.log(`⚠️  Using fallback: Third category card (index 2) for kids`);
            }
            
            if (!categoryCard) {
                console.error(`❌❌ Could not find category card even with fallback`);
                return;
            }
        }

        const categoryItems = categoryCard.querySelector('.category-items');
        if (!categoryItems) {
            console.error(`❌ Category items list not found for: ${category}`);
            return;
        }

        console.log(`✅ Category items list found, starting with ${categoryItems.children.length} items`);
        this.processCategoryProducts(category, products, categoryItems);
    }
    
    processCategoryProducts(category, products, categoryItems) {

        // Debug: Log products being processed
        console.log(`📋 Processing ${products.length} products for ${category}:`, products.map(p => ({ 
            id: p.id, 
            type: p.type, 
            category: p.category, 
            isDefault: p.isDefault 
        })));

        // Separate sneakers, kids packs, and regular products
        // Use more robust category matching
        const regularProducts = products.filter(p => {
            // Make sure category matches (case-insensitive, flexible)
            const productCategory = String(p.category || '').toLowerCase().trim();
            const targetCategory = String(category).toLowerCase().trim();
            
            // More flexible matching
            const categoryMatch = productCategory === targetCategory || 
                                 productCategory.startsWith(targetCategory) ||
                                 targetCategory.startsWith(productCategory);
            
            if (!categoryMatch) {
                console.log(`  ⏭️  Skipping ${p.type} - category mismatch: "${productCategory}" !== "${targetCategory}"`);
                return false;
            }
            
            const isSneaker = p.isShoe === true || (p.type && (p.type.toLowerCase().includes('sneaker') || p.type.toLowerCase().includes('takkies')));
            const isKidsPack = p.type && (p.type.toLowerCase().includes('kids clothing pack') || p.type.toLowerCase().includes('kids pack') || p.type.toLowerCase().includes('clothing pack'));
            
            if (isSneaker || isKidsPack) {
                console.log(`  ⏭️  Skipping ${p.type} - isSneaker: ${isSneaker}, isKidsPack: ${isKidsPack}`);
                return false;
            }
            
            return true;
        });
        
        console.log(`✅ Filtered to ${regularProducts.length} regular products for ${category}:`, regularProducts.map(p => `${p.type} (${p.isDefault ? 'default' : 'admin'})`));

        // Check if we need to add sneakers link
        const hasSneakers = category === 'men' || category === 'women';
        const hasKidsPacks = category === 'kids';

        // Clear ALL existing items (including static HTML ones) and rebuild with ALL products (default + admin-added)
        // IMPORTANT: Only clear once, at the beginning
        categoryItems.innerHTML = '';
        console.log(`🧹 Cleared category items for ${category}, now processing ${regularProducts.length} products`);

        // If no products for this category, show a message
        if (regularProducts.length === 0) {
            const emptyLi = document.createElement('li');
            emptyLi.innerHTML = '<span style="color: #666; font-style: italic;">No products in this category yet.</span>';
            categoryItems.appendChild(emptyLi);
            
            // Still add sneakers/kids packs links even if no regular products
            if (hasSneakers && (category === 'men' || category === 'women')) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="sneakers.html" class="product-link">Sneakers</a>`;
                categoryItems.appendChild(li);
            }
            if (hasKidsPacks && category === 'kids') {
                const li = document.createElement('li');
                li.innerHTML = `<a href="kids-packs.html" class="product-link">Kids Clothing Packs</a>`;
                categoryItems.appendChild(li);
            }
            console.log(`⚠️  No regular products found for ${category}, showing empty message`);
            return;
        }

        // Group products by type (normalize type names for grouping)
        const productsByType = new Map();
        
        regularProducts.forEach(product => {
            // Normalize type name (trim, but keep original for display)
            const normalizedType = (product.type || '').trim();
            
            if (!normalizedType) {
                console.warn(`⚠️  Product ${product.id} has no type, skipping`);
                return;
            }
            
            if (!productsByType.has(normalizedType)) {
                productsByType.set(normalizedType, []);
                console.log(`  📦 Created new type group: "${normalizedType}"`);
            }
            productsByType.get(normalizedType).push(product);
            console.log(`  📝 Added "${product.type}" (${product.isDefault ? 'default' : 'admin'}) to type group "${normalizedType}"`);
        });

        console.log(`📊 Grouped into ${productsByType.size} unique types:`, Array.from(productsByType.keys()));

        // Sort types alphabetically
        const sortedTypes = Array.from(productsByType.keys()).sort((a, b) => a.localeCompare(b));

        console.log(`🔤 Sorted ${sortedTypes.length} types alphabetically:`, sortedTypes);

        // Add product type links - each type shows all products of that type
        sortedTypes.forEach((typeName, index) => {
            const productsOfType = productsByType.get(typeName);
            const defaultProducts = productsOfType.filter(p => p.isDefault);
            const adminProducts = productsOfType.filter(p => !p.isDefault);
            const totalCount = productsOfType.length;
            
            // Create link to product type page showing all products of this type
            const li = document.createElement('li');
            
            // URL encode the type name for the link
            const encodedType = encodeURIComponent(typeName);
            li.innerHTML = `<a href="product-type.html?type=${encodedType}&category=${category}" class="product-link">${typeName}</a>`;
            categoryItems.appendChild(li);
            
            console.log(`  ✅ [${index + 1}/${sortedTypes.length}] Added "${typeName}" to ${category} section: ${defaultProducts.length} default + ${adminProducts.length} admin-added = ${totalCount} total`);
            console.log(`     DOM element created and appended. Current list length: ${categoryItems.children.length}`);
        });
        
        console.log(`✅ Finished adding ${sortedTypes.length} product types to ${category} section`);
        console.log(`📋 Final category items count: ${categoryItems.children.length}`);

        // Add sneakers link for men's and women's categories (always show at the end)
        if (hasSneakers && (category === 'men' || category === 'women')) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="sneakers.html" class="product-link">Sneakers</a>`;
            categoryItems.appendChild(li);
        }

        // Add kids packs link for kids category (always show at the end)
        if (hasKidsPacks && category === 'kids') {
            const li = document.createElement('li');
            li.innerHTML = `<a href="kids-packs.html" class="product-link">Kids Clothing Packs</a>`;
            categoryItems.appendChild(li);
        }
    }

    createProductDetailModals(products) {
        // This function is kept for backwards compatibility but product links now go to product.html pages
        // Modals are no longer created dynamically - all products link to dedicated pages
    }

    // Public method to refresh products (can be called after adding new products)
    async refresh() {
        await this.loadProducts();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.productDisplay = new ProductDisplay();
        setupAutoRefresh();
    });
} else {
    window.productDisplay = new ProductDisplay();
    setupAutoRefresh();
}

function setupAutoRefresh() {
    // Listen for storage changes to auto-refresh when products are added (cross-tab sync)
    window.addEventListener('storage', () => {
        if (window.productDisplay) {
            console.log('Storage event detected, refreshing products...');
            window.productDisplay.refresh();
        }
    });
    
    // Listen for custom events (same-tab updates)
    window.addEventListener('productsUpdated', () => {
        if (window.productDisplay) {
            console.log('Products updated event detected, refreshing...');
            window.productDisplay.refresh();
        }
    });
    
    // Refresh when page becomes visible (in case products were added in another tab)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.productDisplay) {
            console.log('Page visible, refreshing products...');
            window.productDisplay.refresh();
        }
    });
    
    // Poll for localStorage changes every 2 seconds (more frequent for better responsiveness)
    let lastProductsHash = '';
    setInterval(() => {
        try {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const deleted = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
            const currentHash = JSON.stringify({ products: products.length, deleted: deleted.length });
            
            if (lastProductsHash && lastProductsHash !== currentHash && window.productDisplay) {
                console.log('Product change detected via polling, refreshing...');
                window.productDisplay.refresh();
            }
            lastProductsHash = currentHash;
        } catch (e) {
            console.error('Error checking for product updates:', e);
        }
    }, 2000);
    
    // Also refresh on page focus (when user switches back to tab)
    window.addEventListener('focus', () => {
        if (window.productDisplay) {
            console.log('Page focused, refreshing products...');
            window.productDisplay.refresh();
        }
    });
}

