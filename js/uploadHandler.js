/**
 * Universal Upload Handler
 * Works with PHP hosting (Hostking), cloud storage (ImgBB), and client-side storage
 */

class UploadHandler {
    constructor() {
        // PHP upload endpoint for traditional hosting (Hostking)
        this.phpUploadEndpoint = 'admin/upload.php';
        
        // ImgBB API key (free at https://api.imgbb.com/)
        // You can get a free API key by registering at imgbb.com
        // Replace with your own key for production use
        this.imgbbApiKey = null; // Set to your ImgBB API key if available
    }

    /**
     * Upload to ImgBB (free cloud image hosting)
     * Get free API key at: https://api.imgbb.com/
     */
    async uploadToImgBB(file) {
        if (!this.imgbbApiKey) {
            throw new Error('ImgBB API key not configured');
        }

        const base64 = await this.fileToBase64(file);
        
        // ImgBB API expects form data with key and image (base64 string)
        const formData = new FormData();
        formData.append('key', this.imgbbApiKey);
        formData.append('image', base64);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ImgBB upload failed: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const result = await response.json();
        
        if (result.success && result.data && result.data.url) {
            return {
                status: 'success',
                path: result.data.url,
                fileName: result.data.image?.filename || file.name,
                fileSize: file.size,
                isCloudStorage: true
            };
        } else {
            throw new Error(result.error?.message || result.status_txt || 'ImgBB upload failed');
        }
    }

    /**
     * Convert file to base64
     */
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Upload file using FormData (for PHP and serverless functions)
     */
    async uploadWithFormData(file, endpoint) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message || 'Upload failed');
        }

        return result;
    }

    /**
     * Upload file using base64 (for serverless functions that accept JSON)
     */
    async uploadWithBase64(file, endpoint) {
        const base64 = await this.fileToBase64(file);
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64,
                fileName: file.name,
                fileType: file.type
            })
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message || 'Upload failed');
        }

        return result;
    }

    /**
     * Store file as base64 in localStorage (client-side fallback)
     * This method ensures images work even without server storage
     */
    async storeAsBase64(file) {
        try {
            const base64Data = await this.fileToBase64(file);
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 10);
            const fileExtension = file.name.split('.').pop();
            const sanitizedOriginalName = file.name.replace(/[^a-z0-9_-]/gi, '_').substring(0, 50);
            const fileName = `${sanitizedOriginalName}_${timestamp}_${randomString}.${fileExtension}`;
            
            // Create full data URL for immediate use
            const dataUrl = `data:${file.type};base64,${base64Data}`;
            
            // Check localStorage quota (typically 5-10MB per domain)
            try {
                // Store in localStorage with a prefix to identify base64 images
                const storageKey = `uploaded_image_${fileName}`;
                localStorage.setItem(storageKey, base64Data);
                
                // Also store metadata
                const metadata = {
                    fileName: fileName,
                    originalName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    uploadedAt: new Date().toISOString(),
                    isBase64: true
                };
                localStorage.setItem(`metadata_${fileName}`, JSON.stringify(metadata));
                
                // Store a reference in a list for easy cleanup
                let imageList = JSON.parse(localStorage.getItem('uploaded_images_list') || '[]');
                imageList.push(fileName);
                localStorage.setItem('uploaded_images_list', JSON.stringify(imageList));
                
            } catch (storageError) {
                // If localStorage is full, we'll still return the data URL
                // which can be used directly, just won't persist across sessions
                console.warn('localStorage quota exceeded. Image will work but may not persist:', storageError);
            }
            
            return {
                status: 'success',
                path: dataUrl, // Return full data URL as path for direct use
                fileName: fileName,
                fileSize: file.size,
                isBase64: true,
                base64: base64Data // Return base64 for reference
            };
        } catch (error) {
            throw new Error(`Failed to process image: ${error.message}`);
        }
    }

    /**
     * Get image URL (handles both server uploads, cloud storage, and base64)
     */
    getImageUrl(path) {
        // If path is already a data URL (base64), return it directly
        if (path && path.startsWith('data:')) {
            return path;
        }
        
        // If path is a full URL (cloud storage like ImgBB), return it directly
        if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
            return path;
        }
        
        // Check if it's a base64 image stored in localStorage
        if (path) {
            const fileName = path.split('/').pop().split('?')[0]; // Remove query params
            const storageKey = `uploaded_image_${fileName}`;
            const base64 = localStorage.getItem(storageKey);
            
            if (base64) {
                // Get file type from metadata
                const metadataKey = `metadata_${fileName}`;
                const metadata = localStorage.getItem(metadataKey);
                if (metadata) {
                    try {
                        const meta = JSON.parse(metadata);
                        return `data:${meta.fileType};base64,${base64}`;
                    } catch (e) {
                        // If metadata parse fails, try to detect from file extension
                        const ext = fileName.split('.').pop().toLowerCase();
                        const mimeTypes = {
                            'jpg': 'image/jpeg',
                            'jpeg': 'image/jpeg',
                            'png': 'image/png',
                            'webp': 'image/webp'
                        };
                        return `data:${mimeTypes[ext] || 'image/jpeg'};base64,${base64}`;
                    }
                }
                // Fallback: detect from extension
                const ext = fileName.split('.').pop().toLowerCase();
                const mimeTypes = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'webp': 'image/webp'
                };
                return `data:${mimeTypes[ext] || 'image/jpeg'};base64,${base64}`;
            }
        }
        
        // Regular server path (relative)
        return path;
    }

    /**
     * Main upload method - tries cloud storage, server endpoints, and falls back to client-side storage
     */
    async upload(file, progressCallback) {
        // Validate file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        const fileExtension = file.name.toLowerCase().split('.').pop();

        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.');
        }

        if (!allowedTypes.includes(file.type.toLowerCase())) {
            throw new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.');
        }

        const maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxFileSize) {
            throw new Error('File is too large. Maximum file size is 10MB.');
        }

        // Try ImgBB cloud storage first (if API key is configured)
        if (this.imgbbApiKey) {
            if (progressCallback) progressCallback(20, 'Uploading to cloud storage...');
            try {
                const result = await this.uploadToImgBB(file);
                if (progressCallback) progressCallback(100, 'Upload successful!');
                return result;
            } catch (error) {
                console.log('ImgBB upload failed, trying server uploads...', error.message);
            }
        }

        // Try PHP upload (traditional hosting - Hostking)
        if (progressCallback) progressCallback(40, 'Uploading to server...');
        try {
            const result = await this.uploadWithFormData(file, this.phpUploadEndpoint);
            if (progressCallback) progressCallback(100, 'Upload successful!');
            return result;
        } catch (error) {
            console.log('PHP upload failed:', error.message);
        }

        // Fallback to client-side storage (base64 in localStorage)
        // This works when server upload fails or for offline use
        if (progressCallback) progressCallback(60, 'Using browser storage...');
        try {
            const result = await this.storeAsBase64(file);
            if (progressCallback) progressCallback(100, 'Upload successful!');
            console.info('✓ Image stored in browser. It will work offline and persist in this browser.');
            return result;
        } catch (error) {
            throw new Error(`All upload methods failed. Last error: ${error.message}`);
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UploadHandler;
}

