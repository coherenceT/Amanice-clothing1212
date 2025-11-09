// Product Manager - Handles all product operations
// Now uses MySQL database via PHP API endpoints instead of localStorage
class ProductManager {
    constructor() {
        this.defaultProducts = [];
        this.dbProducts = [];
        this.loadDefaultProducts();
    }

    async loadDefaultProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            this.defaultProducts = data.products || [];
        } catch (error) {
            console.error('Error loading default products:', error);
            this.defaultProducts = [];
        }
    }

    /**
     * Fetch all products from database
     * Returns both default products (from JSON) and database products
     */
    async getAllProducts() {
        try {
            // Fetch products from database
            const response = await fetch('/admin/getProducts.php');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const dbProducts = await response.json();
            this.dbProducts = Array.isArray(dbProducts) ? dbProducts : [];
            
            // Load default products if not already loaded
            if (this.defaultProducts.length === 0) {
                await this.loadDefaultProducts();
            }
            
            // Get deleted default products from localStorage (for backward compatibility)
            const deletedIds = this.getDeletedProducts();
            
            // Filter out deleted default products
            const activeDefaultProducts = this.defaultProducts
                .filter(p => !deletedIds.includes(p.id))
                .map(p => ({ ...p, isDefault: true }));
            
            // Merge database products and default products
            // Database products take precedence (they override defaults with same ID)
            const productMap = new Map();
            
            // Add default products first
            activeDefaultProducts.forEach(product => {
                productMap.set(product.id, product);
            });
            
            // Add/override with database products
            this.dbProducts.forEach(product => {
                // Convert database ID to string for consistency
                product.id = String(product.id);
                product.isDefault = false;
                productMap.set(product.id, product);
            });
            
            return Array.from(productMap.values());
            
        } catch (error) {
            console.error('Error fetching products from database:', error);
            
            // Fallback to localStorage if database fails (for backward compatibility)
            console.warn('Falling back to localStorage...');
            const adminProducts = JSON.parse(localStorage.getItem('products') || '[]');
            const deletedIds = this.getDeletedProducts();
            
            const activeDefaultProducts = this.defaultProducts
                .filter(p => !deletedIds.includes(p.id))
                .map(p => ({ ...p, isDefault: true }));
            
            const productMap = new Map();
            activeDefaultProducts.forEach(product => {
                productMap.set(product.id, product);
            });
            
            adminProducts.forEach(product => {
                if (!deletedIds.includes(product.id)) {
                    productMap.set(product.id, { ...product, isDefault: false });
                }
            });
            
            return Array.from(productMap.values());
        }
    }

    /**
     * Save a new product to the database
     * @param {Object} product - Product object to save
     * @returns {Promise} Promise that resolves when product is saved
     */
    async saveProduct(product) {
        try {
            // Ensure category is lowercase for consistency
            if (product.category) {
                product.category = product.category.toLowerCase();
            }
            
            // Prepare product data for API
            const productData = {
                type: product.type || '',
                category: product.category || '',
                price: product.price || null,
                priceRange: product.priceRange || '',
                description: product.description || '',
                image: product.image || product.imagePath || product.imageURL || '',
                stockQuantity: product.stockQuantity || 0,
                stockNumber: product.stockNumber || '',
                gender: product.gender || '',
                size: product.size || '',
                isShoe: product.isShoe || false,
                shoeBrand: product.shoeBrand || null,
                shoeSizes: product.shoeSizes || []
            };
            
            // Send to API
            const response = await fetch('/admin/saveProduct.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                console.log('Product saved to database:', {
                    id: result.id,
                    type: product.type,
                    category: product.category
                });
                
                // Update local cache
                product.id = String(result.id);
                this.dbProducts.push(product);
                
                return result;
            } else {
                throw new Error(result.message || 'Failed to save product');
            }
            
        } catch (error) {
            console.error('Error saving product to database:', error);
            
            // Fallback to localStorage if database fails
            console.warn('Falling back to localStorage...');
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            
            if (product.isDefault && product.id) {
                product.originalId = product.id;
                product.id = `admin-${Date.now()}`;
            }
            
            if (product.category) {
                product.category = product.category.toLowerCase();
            }
            
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
            
            throw error; // Re-throw so caller knows it failed
        }
    }

    /**
     * Update an existing product in the database
     * @param {string|number} productId - Product ID to update
     * @param {Object} updatedData - Data to update
     * @returns {Promise<boolean>} Promise that resolves to true if updated successfully
     */
    async updateProduct(productId, updatedData) {
        try {
            // Check if it's a default product (from JSON)
            const defaultProduct = this.defaultProducts.find(p => p.id === productId);
            
            if (defaultProduct) {
                // For default products, create a new database product
                const newProduct = {
                    ...defaultProduct,
                    ...updatedData,
                    isDefault: false
                };
                
                // Remove isDefault and id from updatedData before saving
                delete newProduct.isDefault;
                delete newProduct.id;
                
                // Save as new product
                await this.saveProduct(newProduct);
                return true;
            }
            
            // Check if product exists in database
            const dbProduct = this.dbProducts.find(p => String(p.id) === String(productId));
            
            if (!dbProduct) {
                console.warn('Product not found in database:', productId);
                return false;
            }
            
            // Prepare update data
            const updateData = {
                id: productId,
                ...updatedData
            };
            
            // Ensure category is lowercase if provided
            if (updateData.category) {
                updateData.category = updateData.category.toLowerCase();
            }
            
            // Send to API
            const response = await fetch('/admin/updateProduct.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                console.log('Product updated in database:', productId);
                
                // Update local cache
                const index = this.dbProducts.findIndex(p => String(p.id) === String(productId));
                if (index !== -1) {
                    this.dbProducts[index] = { ...this.dbProducts[index], ...updatedData };
                }
                
                return true;
            } else {
                throw new Error(result.message || 'Failed to update product');
            }
            
        } catch (error) {
            console.error('Error updating product in database:', error);
            
            // Fallback to localStorage if database fails
            console.warn('Falling back to localStorage...');
            const defaultProduct = this.defaultProducts.find(p => p.id === productId);
            
            if (defaultProduct) {
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                const newProduct = {
                    ...defaultProduct,
                    ...updatedData,
                    id: `admin-${Date.now()}`,
                    originalId: productId,
                    isDefault: false
                };
                products.push(newProduct);
                localStorage.setItem('products', JSON.stringify(products));
                return true;
            }
            
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const index = products.findIndex(p => p.id === productId || p.originalId === productId);
            
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedData };
                localStorage.setItem('products', JSON.stringify(products));
                return true;
            }
            
            return false;
        }
    }

    /**
     * Delete a product from the database
     * @param {string|number} productId - Product ID to delete
     * @param {boolean} isDefault - Whether this is a default product (from JSON)
     * @returns {Promise<boolean>} Promise that resolves to true if deleted successfully
     */
    async deleteProduct(productId, isDefault = false) {
        try {
            if (isDefault) {
                // For default products, mark as deleted in localStorage (backward compatibility)
                const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
                if (!deletedProducts.includes(productId)) {
                    deletedProducts.push(productId);
                    localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
                }
                return true;
            }
            
            // Check if product exists in database
            const dbProduct = this.dbProducts.find(p => String(p.id) === String(productId));
            
            if (!dbProduct) {
                // Try localStorage fallback
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                const filtered = products.filter(p => p.id !== productId);
                localStorage.setItem('products', JSON.stringify(filtered));
                return true;
            }
            
            // Delete from database
            const response = await fetch('/admin/deleteProduct.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: productId })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                console.log('Product deleted from database:', productId);
                
                // Remove from local cache
                this.dbProducts = this.dbProducts.filter(p => String(p.id) !== String(productId));
                
                return true;
            } else {
                throw new Error(result.message || 'Failed to delete product');
            }
            
        } catch (error) {
            console.error('Error deleting product from database:', error);
            
            // Fallback to localStorage if database fails
            console.warn('Falling back to localStorage...');
            if (isDefault) {
                const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
                if (!deletedProducts.includes(productId)) {
                    deletedProducts.push(productId);
                    localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
                }
                return true;
            } else {
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                const filtered = products.filter(p => p.id !== productId);
                localStorage.setItem('products', JSON.stringify(filtered));
                return true;
            }
        }
    }

    getDeletedProducts() {
        return JSON.parse(localStorage.getItem('deletedProducts') || '[]');
    }

    isProductDeleted(productId) {
        return this.getDeletedProducts().includes(productId);
    }

    async getFilteredProducts() {
        const allProducts = await this.getAllProducts();
        const deletedIds = this.getDeletedProducts();
        return allProducts.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(p.originalId));
    }

    async getProductsByCategory(category) {
        const filtered = await this.getFilteredProducts();
        return filtered.filter(p => p.category === category);
    }

    /**
     * Get a product by ID
     * Checks both database and default products
     * @param {string|number} productId - Product ID to find
     * @returns {Object|null} Product object or null if not found
     */
    async getProductById(productId) {
        try {
            // Refresh products from database
            await this.getAllProducts();
            
            // Check database products first
            const dbProduct = this.dbProducts.find(p => String(p.id) === String(productId));
            if (dbProduct) {
                return { ...dbProduct, isDefault: false };
            }
            
            // Check default products
            const defaultProduct = this.defaultProducts.find(p => p.id === productId);
            if (defaultProduct) {
                return { ...defaultProduct, isDefault: true };
            }
            
            // Fallback to localStorage
            const adminProducts = JSON.parse(localStorage.getItem('products') || '[]');
            const product = adminProducts.find(p => p.id === productId || p.originalId === productId);
            
            return product || null;
            
        } catch (error) {
            console.error('Error getting product by ID:', error);
            
            // Fallback to localStorage
            const adminProducts = JSON.parse(localStorage.getItem('products') || '[]');
            let product = adminProducts.find(p => p.id === productId || p.originalId === productId);
            
            if (!product) {
                product = this.defaultProducts.find(p => p.id === productId);
                if (product) {
                    return { ...product, isDefault: true };
                }
            }
            
            return product || null;
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.ProductManager = ProductManager;
}

