// Product Manager - Handles all product operations
class ProductManager {
    constructor() {
        this.defaultProducts = [];
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

    getAllProducts() {
        const adminProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const deletedIds = this.getDeletedProducts();
        
        // Filter out deleted default products
        const activeDefaultProducts = this.defaultProducts
            .filter(p => !deletedIds.includes(p.id))
            .map(p => ({ ...p, isDefault: true }));
        
        // Merge and prioritize admin products (they can override defaults with same ID)
        const productMap = new Map();
        
        // Add default products first
        activeDefaultProducts.forEach(product => {
            productMap.set(product.id, product);
        });
        
        // Override with admin products if they have same ID or add new ones
        adminProducts.forEach(product => {
            if (product.originalId) {
                // Admin product that was edited from default - remove the original default
                productMap.delete(product.originalId);
            }
            // Only add if not deleted
            if (!deletedIds.includes(product.id)) {
                productMap.set(product.id, { ...product, isDefault: false });
            }
        });
        
        return Array.from(productMap.values());
    }

    saveProduct(product) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // If editing a default product, mark it
        if (product.isDefault && product.id) {
            product.originalId = product.id;
            product.id = `admin-${Date.now()}`;
        }
        
        // Ensure category is lowercase for consistency
        if (product.category) {
            product.category = product.category.toLowerCase();
        }
        
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        
        console.log('Product saved:', {
            id: product.id,
            type: product.type,
            category: product.category,
            isDefault: product.isDefault,
            totalProducts: products.length
        });
    }

    updateProduct(productId, updatedData) {
        // Check if it's a default product
        const defaultProduct = this.defaultProducts.find(p => p.id === productId);
        
        if (defaultProduct) {
            // Create a new admin product based on default
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
        
        // Update existing admin product
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const index = products.findIndex(p => p.id === productId || p.originalId === productId);
        
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            localStorage.setItem('products', JSON.stringify(products));
            return true;
        }
        
        return false;
    }

    deleteProduct(productId, isDefault = false) {
        if (isDefault) {
            // For default products, we mark them as deleted in localStorage
            const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
            if (!deletedProducts.includes(productId)) {
                deletedProducts.push(productId);
                localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
            }
            return true;
        } else {
            // For admin products, remove from localStorage
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const filtered = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(filtered));
            return true;
        }
    }

    getDeletedProducts() {
        return JSON.parse(localStorage.getItem('deletedProducts') || '[]');
    }

    isProductDeleted(productId) {
        return this.getDeletedProducts().includes(productId);
    }

    getFilteredProducts() {
        const allProducts = this.getAllProducts();
        const deletedIds = this.getDeletedProducts();
        return allProducts.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(p.originalId));
    }

    getProductsByCategory(category) {
        return this.getFilteredProducts().filter(p => p.category === category);
    }

    getProductById(productId) {
        // First check admin products
        const adminProducts = JSON.parse(localStorage.getItem('products') || '[]');
        let product = adminProducts.find(p => p.id === productId || p.originalId === productId);
        
        // If not found, check default products
        if (!product) {
            product = this.defaultProducts.find(p => p.id === productId);
            if (product) {
                return { ...product, isDefault: true };
            }
        }
        
        return product;
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.ProductManager = ProductManager;
}

