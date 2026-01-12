// ===== COMMON FUNCTIONS FOR ALL PAGES =====

// Toggle mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    const btn = document.querySelector('.mobile-menu-btn i');
    
    nav.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        btn.classList.remove('fa-bars');
        btn.classList.add('fa-times');
    } else {
        btn.classList.remove('fa-times');
        btn.classList.add('fa-bars');
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (linkPage === 'index.html' && currentPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#!')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    setupSmoothScrolling();
    
    // Setup mobile menu button if exists
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('.main-nav');
            const btn = document.querySelector('.mobile-menu-btn i');
            
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                btn.classList.remove('fa-times');
                btn.classList.add('fa-bars');
            }
        });
    });
});

// ===== IMAGE UPLOAD FUNCTIONS (for gallery page) =====
let uploadedImages = JSON.parse(localStorage.getItem('ghanaai_images') || '[]');

function displayGalleryImages() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (uploadedImages.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--light-gray);">
                <i class="fas fa-images" style="font-size: 50px; margin-bottom: 20px; color: var(--gold);"></i>
                <h3 style="margin-bottom: 10px;">No Images Yet</h3>
                <p>Upload your first image using the upload button above</p>
            </div>
        `;
        return;
    }
    
    uploadedImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'card gallery-item';
        item.innerHTML = `
            <div style="height: 200px; overflow: hidden;">
                <img src="${image.dataUrl}" alt="${image.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin-bottom: 5px;">${image.name}</h4>
                        <p style="color: var(--light-gray); font-size: 12px;">
                            ${(image.size / 1024 / 1024).toFixed(2)} MB • 
                            ${new Date(image.uploaded).toLocaleDateString()}
                        </p>
                    </div>
                    <button onclick="deleteImage(${index})" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function uploadImages(files) {
    const progress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progress) {
        progress.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting upload...';
    }
    
    let uploadedCount = 0;
    const totalFiles = files.length;
    
    Array.from(files).forEach((file, index) => {
        // Validate file
        if (!isValidImage(file)) {
            alert(`Skipping "${file.name}": ${getFileError(file)}`);
            uploadedCount++;
            updateProgress();
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedCount++;
            
            uploadedImages.push({
                id: Date.now() + index,
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: e.target.result,
                uploaded: new Date().toISOString()
            });
            
            localStorage.setItem('ghanaai_images', JSON.stringify(uploadedImages));
            
            if (typeof displayGalleryImages === 'function') {
                displayGalleryImages();
            }
            
            updateProgress();
            
            if (uploadedCount === totalFiles) {
                setTimeout(() => {
                    if (progress) {
                        progress.style.display = 'none';
                        progressFill.style.width = '0%';
                    }
                    alert(`${totalFiles} image(s) uploaded successfully!`);
                }, 1000);
            }
        };
        
        reader.readAsDataURL(file);
    });
    
    function updateProgress() {
        if (!progress) return;
        const percent = (uploadedCount / totalFiles) * 100;
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `Uploaded ${uploadedCount} of ${totalFiles} images`;
    }
}

function isValidImage(file) {
    const MAX_SIZE = 5 * 1024 * 1024;
    const VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!VALID_TYPES.includes(file.type)) return false;
    if (file.size > MAX_SIZE) return false;
    
    return true;
}

function getFileError(file) {
    const MAX_SIZE = 5 * 1024 * 1024;
    const VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!VALID_TYPES.includes(file.type)) {
        return 'Invalid file type. Please use JPG, PNG, GIF, or WebP.';
    }
    if (file.size > MAX_SIZE) {
        return 'File too large. Maximum size is 5MB.';
    }
    return 'Unknown error';
}

function deleteImage(index) {
    if (confirm('Are you sure you want to delete this image?')) {
        uploadedImages.splice(index, 1);
        localStorage.setItem('ghanaai_images', JSON.stringify(uploadedImages));
        displayGalleryImages();
        alert('Image deleted successfully!');
    }
}

// ===== BLOG FUNCTIONS (for blog page) =====
let blogPosts = JSON.parse(localStorage.getItem('ghanaai_blog') || '[]');

function displayBlogPosts() {
    const container = document.getElementById('blogContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (blogPosts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--light-gray);">
                <i class="fas fa-newspaper" style="font-size: 50px; margin-bottom: 20px; color: var(--gold);"></i>
                <h3 style="margin-bottom: 10px;">No Blog Posts Yet</h3>
                <p>Create your first blog post in the admin section</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    blogPosts.forEach(post => {
        const postHTML = `
            <div class="card">
                <div style="height: 200px; background: var(--gold); display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-${getCategoryIcon(post.category)}" style="font-size: 60px; color: rgba(10, 10, 10, 0.7);"></i>
                </div>
                <div style="padding: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="color: var(--gold); font-weight: bold;">${post.category}</span>
                        <span style="color: var(--light-gray); font-size: 14px;">${formatDate(post.date)}</span>
                    </div>
                    <h3 style="margin-bottom: 15px; font-size: 22px;">${post.title}</h3>
                    <p style="color: var(--light-gray); margin-bottom: 20px;">${post.content.substring(0, 150)}...</p>
                    <a href="blog-single.html?id=${post.id}" class="btn" style="display: inline-block;">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        container.innerHTML += postHTML;
    });
}

function getCategoryIcon(category) {
    const icons = {
        'technology': 'key',
        'education': 'graduation-cap',
        'announcements': 'bullhorn'
    };
    return icons[category] || 'newspaper';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== DRAG & DROP FUNCTIONALITY =====
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--gold)';
            uploadArea.style.background = 'rgba(212, 175, 55, 0.1)';
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--medium-gray)';
            uploadArea.style.background = '';
        }, false);
    });
    
    uploadArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        uploadImages(files);
    });
}
