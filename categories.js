// Categories page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCategories();
    initializeFilters();
    initializePriceSlider();
    initializeProductActions();
    initializeViewToggle();
    initializeSorting();
    initializeLoadMore();
});

// Initialize categories functionality
function initializeCategories() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            navMenu?.classList.remove('active');
            hamburger?.classList.remove('active');
        }
    });
}

// Initialize filter functionality
function initializeFilters() {
    const filterOptions = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const clearFilters = document.querySelector('.clear-filters');
    const productCards = document.querySelectorAll('.product-card');

    // Filter by category
    filterOptions.forEach(filter => {
        filter.addEventListener('change', function() {
            filterProducts();
            updateProductCount();
        });
    });

    // Clear all filters
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            filterOptions.forEach(filter => {
                if (!filter.parentElement.textContent.includes('All Categories')) {
                    filter.checked = false;
                }
            });
            filterProducts();
            updateProductCount();
        });
    }

    function filterProducts() {
        const activeFilters = Array.from(filterOptions)
            .filter(filter => filter.checked && !filter.parentElement.textContent.includes('All Categories'))
            .map(filter => {
                const text = filter.parentElement.textContent.toLowerCase();
                if (text.includes('keychains')) return 'keychains';
                if (text.includes('varmala')) return 'varmala';
                if (text.includes('wall clocks')) return 'clocks';
                if (text.includes('home decor')) return 'home-decor';
                if (text.includes('gift sets')) return 'gift-sets';
                if (text.includes('workshops')) return 'workshops';
                return '';
            })
            .filter(filter => filter);

        const allCategoriesChecked = document.querySelector('.filter-option input[type="checkbox"]').checked;

        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = allCategoriesChecked || activeFilters.length === 0 || activeFilters.includes(category);
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-card[style*="display: block"], .product-card:not([style*="display: none"])').length;
        const productCount = document.querySelector('.product-count');
        if (productCount) {
            productCount.textContent = `(${visibleProducts} items)`;
        }
    }
}

// Initialize price slider
function initializePriceSlider() {
    const minThumb = document.querySelector('.min-thumb');
    const maxThumb = document.querySelector('.max-thumb');
    const sliderTrack = document.querySelector('.slider-track');
    const sliderRange = document.querySelector('.slider-range');
    const minInput = document.querySelector('.price-input:first-child');
    const maxInput = document.querySelector('.price-input:last-child');

    if (!minThumb || !maxThumb) return;

    let isDragging = false;
    let activeThumb = null;

    const minPrice = 0;
    const maxPrice = 5000;

    function updateSlider() {
        const minVal = parseInt(minInput.value) || minPrice;
        const maxVal = parseInt(maxInput.value) || maxPrice;
        
        const minPercent = ((minVal - minPrice) / (maxPrice - minPrice)) * 100;
        const maxPercent = ((maxVal - minPrice) / (maxPrice - minPrice)) * 100;

        minThumb.style.left = minPercent + '%';
        maxThumb.style.left = maxPercent + '%';
        
        sliderRange.style.left = minPercent + '%';
        sliderRange.style.width = (maxPercent - minPercent) + '%';
    }

    function handleMouseDown(e, thumb) {
        isDragging = true;
        activeThumb = thumb;
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!isDragging || !activeThumb) return;

        const rect = sliderTrack.getBoundingClientRect();
        const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
        const value = Math.round((percent / 100) * (maxPrice - minPrice) + minPrice);

        if (activeThumb === minThumb) {
            minInput.value = Math.min(value, parseInt(maxInput.value) - 100);
        } else {
            maxInput.value = Math.max(value, parseInt(minInput.value) + 100);
        }

        updateSlider();
    }

    function handleMouseUp() {
        isDragging = false;
        activeThumb = null;
    }

    minThumb.addEventListener('mousedown', (e) => handleMouseDown(e, minThumb));
    maxThumb.addEventListener('mousedown', (e) => handleMouseDown(e, maxThumb));
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    minInput.addEventListener('input', updateSlider);
    maxInput.addEventListener('input', updateSlider);

    updateSlider();
}

// Initialize product actions (wishlist, quick view, compare)
function initializeProductActions() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const compareBtns = document.querySelectorAll('.compare-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            // Add animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);

            // Show notification
            showNotification('Added to wishlist!');
        });
    });

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Quick view coming soon!');
        });
    });

    compareBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Added to compare!');
        });
    });

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productTitle = this.closest('.product-card').querySelector('.product-title').textContent;
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Added!';
                this.style.background = '#4CAF50';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                    this.disabled = false;
                }, 1500);
            }, 800);

            showNotification(`${productTitle} added to cart!`);
            updateCartBadge();
        });
    });
}

// Initialize view toggle (grid/list view)
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.querySelector('.products-grid');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const view = this.getAttribute('data-view');
            if (productsGrid) {
                productsGrid.className = view === 'list' ? 'products-grid list-view' : 'products-grid';
            }
        });
    });
}

// Initialize sorting functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sort-select');
    const productCards = document.querySelectorAll('.product-card');

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productsArray = Array.from(productCards);
            const container = document.querySelector('.products-grid');

            productsArray.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        return getPrice(a) - getPrice(b);
                    case 'price-high':
                        return getPrice(b) - getPrice(a);
                    case 'rating':
                        return getRating(b) - getRating(a);
                    case 'newest':
                        return Math.random() - 0.5; // Random for demo
                    default:
                        return 0;
                }
            });

            // Re-append sorted elements
            productsArray.forEach(card => {
                container.appendChild(card);
                card.style.animation = 'fadeIn 0.5s ease-in';
            });
        });
    }

    function getPrice(card) {
        const priceText = card.querySelector('.price').textContent;
        return parseInt(priceText.replace(/[₹,]/g, ''));
    }

    function getRating(card) {
        const filledStars = card.querySelectorAll('.stars .fas.fa-star').length;
        return filledStars;
    }
}

// Initialize load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const showingText = document.querySelector('.showing-text');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;

            setTimeout(() => {
                // Simulate loading more products
                const currentCount = document.querySelectorAll('.product-card').length;
                const newCount = Math.min(currentCount + 6, 48);
                
                if (showingText) {
                    showingText.textContent = `Showing ${newCount} of 48 products`;
                }

                this.innerHTML = originalText;
                this.disabled = false;

                if (newCount >= 48) {
                    this.style.display = 'none';
                    showingText.textContent = 'All products loaded';
                }

                showNotification('More products loaded!');
            }, 1000);
        });
    }
}

// Utility functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updateCartBadge() {
    const cartBadge = document.querySelector('.nav-icon .icon-badge');
    if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        
        // Add animation
        cartBadge.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 200);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
