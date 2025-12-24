// Configuration
const WHATSAPP_CONFIG = {
    ownerNumber: '+917979914985', // Replace with actual owner's WhatsApp number
    businessName: 'Memory & More'
};

// Mobile debugging function
function logMobileDebug(message, data = null) {
    console.log(`[MOBILE DEBUG] ${message}`, data);
    
    // Also log to a visible element for mobile debugging if in debug mode
    if (window.location.hash.includes('debug') || localStorage.getItem('debug') === 'true') {
        let debugElement = document.getElementById('mobile-debug');
        if (!debugElement) {
            debugElement = document.createElement('div');
            debugElement.id = 'mobile-debug';
            debugElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                font-size: 12px;
                z-index: 99999;
                max-height: 200px;
                overflow-y: auto;
                font-family: monospace;
            `;
            document.body.appendChild(debugElement);
        }
        debugElement.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`;
        if (data) {
            debugElement.innerHTML += `<div style="margin-left: 20px;">${JSON.stringify(data, null, 2)}</div>`;
        }
        debugElement.scrollTop = debugElement.scrollHeight;
    }
}

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}

function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    mobileBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close mobile menu when clicking on backdrop
mobileBackdrop.addEventListener('click', closeMenu);

// Close mobile menu when clicking close button
mobileMenuClose.addEventListener('click', closeMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', closeMenu));

// Product Card Interactions
class ProductCardManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.initWishlistButtons();
        this.initBuyNowButtons();
    }
    
    initWishlistButtons() {
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const heart = btn.querySelector('i');
                const isLiked = heart.classList.contains('fas');
                
                if (isLiked) {
                    heart.classList.remove('fas');
                    heart.classList.add('far');
                    btn.style.background = 'rgba(255, 255, 255, 0.9)';
                    btn.style.color = '#666';
                } else {
                    heart.classList.remove('far');
                    heart.classList.add('fas');
                    btn.style.background = '#ff6b6b';
                    btn.style.color = 'white';
                    
                    // Add a nice animation
                    btn.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1.1)';
                    }, 150);
                }
            });
        });
    }
    
    initBuyNowButtons() {
        const buyNowBtns = document.querySelectorAll('.buy-now-btn');
        logMobileDebug(`Found ${buyNowBtns.length} buy now buttons`);
        
        buyNowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                logMobileDebug('Buy now button clicked');
                
                // Get product info with fallbacks for different card structures
                const productCard = btn.closest('.category-item, .product-card, .card, .carousel-card');
                if (!productCard) {
                    logMobileDebug('ERROR: Product card not found');
                    console.error('Product card not found');
                    return;
                }
                
                logMobileDebug('Found product card', {
                    className: productCard.className,
                    tagName: productCard.tagName
                });
                
                // Enhanced selectors for product name with better mobile compatibility
                const productNameElement = productCard.querySelector('.product-info h4') || 
                                         productCard.querySelector('h4') || 
                                         productCard.querySelector('.product-title') || 
                                         productCard.querySelector('.card-title') ||
                                         productCard.querySelector('.card-header h4') ||
                                         productCard.querySelector('h3') ||
                                         productCard.querySelector('.title');
                
                // Enhanced selectors for product description with better mobile compatibility
                const productDescriptionElement = productCard.querySelector('.product-info p') || 
                                                 productCard.querySelector('.product-description') || 
                                                 productCard.querySelector('.card-description p') ||
                                                 productCard.querySelector('.card-header .product-info p') ||
                                                 productCard.querySelector('.description') ||
                                                 productCard.querySelector('p:not(.price):not(.original-price):not(.discounted-price)');
                
                // Extract text content with better error handling
                let productName = 'Product';
                let productDescription = 'Premium resin art creation';
                
                if (productNameElement) {
                    productName = productNameElement.textContent || productNameElement.innerText || 'Product';
                    productName = productName.trim();
                }
                
                if (productDescriptionElement) {
                    productDescription = productDescriptionElement.textContent || productDescriptionElement.innerText || 'Premium resin art creation';
                    productDescription = productDescription.trim();
                }
                
                logMobileDebug('Extracted product data', {
                    productName,
                    productDescription,
                    hasNameElement: !!productNameElement,
                    hasDescElement: !!productDescriptionElement
                });
                
                // Enhanced price selectors with better mobile compatibility
                const originalPriceElement = productCard.querySelector('.original-price') || 
                                           productCard.querySelector('.price.original') ||
                                           productCard.querySelector('.was-price') ||
                                           productCard.querySelector('.old-price');
                                           
                const discountedPriceElement = productCard.querySelector('.discounted-price') || 
                                             productCard.querySelector('.price:not(.original):not(.was-price):not(.old-price)') || 
                                             productCard.querySelector('.current-price') ||
                                             productCard.querySelector('.sale-price') ||
                                             productCard.querySelector('.now-price');
                
                let originalPrice = '';
                let discountedPrice = '';
                
                if (originalPriceElement) {
                    originalPrice = (originalPriceElement.textContent || originalPriceElement.innerText || '').trim();
                }
                
                if (discountedPriceElement) {
                    discountedPrice = (discountedPriceElement.textContent || discountedPriceElement.innerText || '').trim();
                }
                
                // Enhanced image selector with better mobile compatibility
                const productImage = productCard.querySelector('.image-placeholder img') || 
                                   productCard.querySelector('.product-image img') || 
                                   productCard.querySelector('.card-image img') ||
                                   productCard.querySelector('img') ||
                                   productCard.querySelector('.image img');
                                   
                let imageUrl = '';
                if (productImage) {
                    imageUrl = productImage.src || productImage.getAttribute('src') || '';
                }
                
                logMobileDebug('Extracted price and image data', {
                    originalPrice,
                    discountedPrice,
                    imageUrl: imageUrl.substring(0, 100) + '...',
                    hasPriceElements: {
                        original: !!originalPriceElement,
                        discounted: !!discountedPriceElement
                    },
                    hasImage: !!productImage
                });
                
                // Create WhatsApp message
                this.shareOnWhatsApp(productName, productDescription, originalPrice, discountedPrice, imageUrl);
                
                // Visual feedback
                btn.innerHTML = '<i class="fab fa-whatsapp"></i> Sending...';
                btn.style.background = '#25d366';
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Buy Now';
                    btn.style.background = '';
                }, 2000);
            });
        });
    }
    
    shareOnWhatsApp(productName, productDescription, originalPrice, discountedPrice, imageUrl) {
        // Owner's WhatsApp number from configuration
        const ownerWhatsAppNumber = WHATSAPP_CONFIG.ownerNumber;
        
        // Debug log all parameters
        logMobileDebug('ShareOnWhatsApp called', {
            productName,
            productDescription,
            originalPrice,
            discountedPrice,
            imageUrl: imageUrl ? imageUrl.substring(0, 100) + '...' : 'No image',
            ownerWhatsAppNumber
        });
        
        // Clean and validate product data
        const cleanProductName = productName && productName.trim() ? productName.trim() : 'Product';
        const cleanProductDescription = productDescription && productDescription.trim() ? productDescription.trim() : 'Premium resin art creation';
        const cleanOriginalPrice = originalPrice && originalPrice.trim() ? originalPrice.trim() : '';
        const cleanDiscountedPrice = discountedPrice && discountedPrice.trim() ? discountedPrice.trim() : '';
        
        logMobileDebug('Cleaned product data', {
            cleanProductName,
            cleanProductDescription,
            cleanOriginalPrice,
            cleanDiscountedPrice
        });
        
        // Construct the message with mobile-friendly formatting
        let message = `Hi! I'm interested in this product from ${WHATSAPP_CONFIG.businessName}:%0A%0A`;
        message += `Product: ${cleanProductName}%0A`;
        message += `Description: ${cleanProductDescription}%0A`;
        
        if (cleanOriginalPrice && cleanDiscountedPrice) {
            message += `Price: ${cleanDiscountedPrice}`;
            if (cleanOriginalPrice !== cleanDiscountedPrice) {
                message += ` (was ${cleanOriginalPrice})`;
            }
            message += `%0A`;
        } else if (cleanDiscountedPrice) {
            message += `Price: ${cleanDiscountedPrice}%0A`;
        }
        
        // Convert relative image URLs to absolute URLs for mobile compatibility
        if (imageUrl) {
            let fullImageUrl = imageUrl;
            if (imageUrl.startsWith('./') || imageUrl.startsWith('../') || (!imageUrl.startsWith('http') && !imageUrl.startsWith('//'))) {
                // Make relative URLs absolute
                fullImageUrl = window.location.origin + '/' + imageUrl.replace(/^\.\//, '');
            }
            message += `Image: ${fullImageUrl}%0A`;
        }
        
        message += `%0APlease provide more details about availability and ordering process.`;
        
        logMobileDebug('Final message constructed', {
            message: message.substring(0, 200) + '...',
            messageLength: message.length
        });
        
        // Clean phone number (remove all non-digit characters)
        const cleanPhoneNumber = ownerWhatsAppNumber.replace(/[^\d]/g, '');
        
        // Create WhatsApp URL - use pre-encoded message for better mobile compatibility
        const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${message}`;
        
        logMobileDebug('WhatsApp URL created', {
            url: whatsappUrl.substring(0, 150) + '...',
            urlLength: whatsappUrl.length,
            cleanPhoneNumber
        });
        
        // Check if URL is too long (mobile WhatsApp has limitations)
        if (whatsappUrl.length > 2048) {
            logMobileDebug('URL too long, using shorter version');
            console.warn('WhatsApp URL might be too long for mobile devices');
            // Create shorter message for mobile
            const shortMessage = `Hi! I'm interested in: ${cleanProductName}%0APrice: ${cleanDiscountedPrice}%0A%0APlease provide more details.`;
            const shortUrl = `https://wa.me/${cleanPhoneNumber}?text=${shortMessage}`;
            logMobileDebug('Short URL created', {
                shortUrl: shortUrl.substring(0, 150) + '...',
                shortUrlLength: shortUrl.length
            });
            window.open(shortUrl, '_blank');
        } else {
            logMobileDebug('Opening WhatsApp with full URL');
            // Open WhatsApp in new tab/window
            window.open(whatsappUrl, '_blank');
        }
        
        // Log completion
        logMobileDebug('WhatsApp sharing completed successfully');
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-btn');
        this.mobileSearchIcon = document.querySelector('.mobile-search-icon');
        this.init();
    }
    
    init() {
        if (this.searchInput && this.searchBtn) {
            this.searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch();
            });
            
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
        }
        
        if (this.mobileSearchIcon) {
            this.mobileSearchIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMobileSearch();
            });
        }
    }
    
    performSearch() {
        const query = this.searchInput ? this.searchInput.value.trim() : '';
        if (query) {
            console.log('Searching for:', query);
            // Here you would typically filter products or redirect to search results
            // For now, we'll just show an alert
            alert(`Searching for: "${query}"`);
            // You can implement actual search logic here
            this.filterProducts(query);
        }
    }
    
    filterProducts(query) {
        // This is a placeholder for product filtering logic
        // You would implement actual product filtering based on your data structure
        const products = document.querySelectorAll('.category-item, .carousel-card');
        products.forEach(product => {
            const title = product.querySelector('h4, .card-title')?.textContent.toLowerCase() || '';
            const description = product.querySelector('p, .card-description')?.textContent.toLowerCase() || '';
            
            if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
                product.style.display = 'block';
                product.style.opacity = '1';
            } else {
                product.style.opacity = '0.3';
            }
        });
    }
    
    showMobileSearch() {
        // Create a mobile search overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-search-overlay';
        overlay.innerHTML = `
            <div class="mobile-search-container">
                <div class="mobile-search-header">
                    <button class="close-search">&times;</button>
                    <h3>Search Products</h3>
                </div>
                <div class="mobile-search-box">
                    <input type="text" class="mobile-search-input" placeholder="Search products..." autofocus>
                    <button class="mobile-search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners for mobile search
        const mobileInput = overlay.querySelector('.mobile-search-input');
        const mobileBtn = overlay.querySelector('.mobile-search-btn');
        const closeBtn = overlay.querySelector('.close-search');
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        mobileBtn.addEventListener('click', () => {
            const query = mobileInput.value.trim();
            if (query) {
                this.filterProducts(query);
                document.body.removeChild(overlay);
            }
        });
        
        mobileInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = mobileInput.value.trim();
                if (query) {
                    this.filterProducts(query);
                    document.body.removeChild(overlay);
                }
            }
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero Carousel Functionality
class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.cards = document.querySelectorAll('.carousel-card');
        this.track = document.querySelector('.carousel-track');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlideElement = document.querySelector('.current-slide');
        this.totalSlidesElement = document.querySelector('.total-slides');
        this.totalCards = this.cards.length;
        this.autoSlideInterval = null;
        this.cardWidth = 0;
        this.gap = 32; // 2rem in pixels
        this.cardsPerView = this.getCardsPerView();
        
        this.init();
    }
    
    init() {
        this.calculateCardWidth();
        this.updateTotalSlides();
        this.bindEvents();
        // Removed auto-slide functionality
        
        // Reset any existing transforms to allow native scrolling
        if (this.track) {
            this.track.style.transform = '';
        }
        
        this.updateCarousel();
        
        // Recalculate on window resize
        window.addEventListener('resize', () => {
            this.calculateCardWidth();
            this.cardsPerView = this.getCardsPerView();
            // Reset transform on resize too
            if (this.track) {
                this.track.style.transform = '';
            }
            this.updateCarousel();
        });
    }
    
    getCardsPerView() {
        if (window.innerWidth <= 480) return 1.1;
        if (window.innerWidth <= 768) return 1.25;
        if (window.innerWidth <= 1200) return 2.2;
        return 2.5;
    }
    
    calculateCardWidth() {
        if (this.cards.length > 0) {
            const containerWidth = this.track.parentElement.offsetWidth - 40; // minus padding
            this.cardWidth = (containerWidth / this.cardsPerView) - this.gap + (this.gap / this.cardsPerView);
        }
    }
    
    updateTotalSlides() {
        // Calculate how many slides we actually need - more restrictive for mobile
        let maxSlides;
        if (this.cardsPerView >= this.totalCards) {
            // If we can see all cards at once, only need 1 slide
            maxSlides = 1;
        } else if (window.innerWidth <= 768) {
            // Mobile/tablet: be more restrictive to prevent excessive scrolling
            maxSlides = Math.max(1, this.totalCards - 2);
        } else {
            // Desktop: use the regular calculation
            const visibleCards = Math.floor(this.cardsPerView);
            maxSlides = Math.max(1, this.totalCards - Math.floor(this.cardsPerView) + 0.5);
        }
        
        if (this.totalSlidesElement) {
            this.totalSlidesElement.textContent = maxSlides;
        }
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Removed auto-slide hover events since auto-slide is disabled
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = false;
            // Removed auto-slide stop since auto-slide is disabled
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const diffX = Math.abs(currentX - startX);
                const diffY = Math.abs(currentY - startY);
                
                if (diffX > diffY && diffX > 10) {
                    isDragging = true;
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
            // Removed auto-slide restart since auto-slide is disabled
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);
            
            if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    updateCarousel() {
        // Native scrolling is now handled by CSS - no need for JavaScript transforms
        // Calculate the maximum slide position with mobile-optimized logic
        let maxSlide;
        if (this.cardsPerView >= this.totalCards) {
            maxSlide = 0; // Can see all cards, no sliding needed
        } else if (window.innerWidth <= 768) {
            // Mobile/tablet: be more restrictive to prevent excessive scrolling
            maxSlide = Math.max(0, this.totalCards - 2);
        } else {
            // Desktop: use the regular calculation
            const visibleCards = Math.floor(this.cardsPerView);
            maxSlide = Math.max(0, this.totalCards - visibleCards);
        }
        
        this.currentSlide = Math.min(this.currentSlide, maxSlide);
        
        // Calculate the translate distance for scroll position instead of transform
        let scrollX = this.currentSlide * (this.cardWidth + this.gap);
        
        // Restrict scrollX for mobile screens to prevent excessive scrolling
        if (window.innerWidth <= 768) {
            scrollX = Math.min(scrollX, 500); // Don't go beyond 500px on mobile
        }

        // Use smooth scrolling instead of transform
        const container = this.track.parentElement;
        if (container) {
            container.scrollTo({
                left: scrollX,
                behavior: 'smooth'
            });
        }
        
        // Update slide indicator
        if (this.currentSlideElement) {
            this.currentSlideElement.textContent = this.currentSlide + 1;
        }
        
        // Update button states
        this.updateButtonStates();
        
        // Add animation class to visible cards
        this.animateVisibleCards();
    }
    
    updateButtonStates() {
        // Hide both arrows - carousel is scroll-only
        this.prevBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
    }
    
    animateVisibleCards() {
        this.cards.forEach((card, index) => {
            const isVisible = index >= this.currentSlide && index < this.currentSlide + Math.ceil(this.cardsPerView);
            
            if (isVisible) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    nextSlide() {
        // Use the same mobile-optimized calculation for max slide
        let maxSlide;
        if (this.cardsPerView >= this.totalCards) {
            maxSlide = 0;
        } else if (window.innerWidth <= 768) {
            // Mobile/tablet: be more restrictive
            maxSlide = Math.max(0, this.totalCards - 2);
        } else {
            // Desktop: use the regular calculation
            const visibleCards = Math.floor(this.cardsPerView);
            maxSlide = Math.max(0, this.totalCards - visibleCards);
        }
        
        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
        }
        // Removed the loop back to start to prevent extra slides
        
        this.updateCarousel();
        // Removed auto-slide reset since auto-slide is disabled
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
        }
        // Removed the loop to end to prevent positioning issues
        
        this.updateCarousel();
        // Removed auto-slide reset since auto-slide is disabled
    }
    
    goToSlide(index) {
        const maxSlide = Math.max(0, this.totalCards - Math.floor(this.cardsPerView));
        this.currentSlide = Math.min(Math.max(0, index), maxSlide);
        this.updateCarousel();
        // Removed auto-slide reset since auto-slide is disabled
    }
    
    // Auto-slide methods disabled - carousel is now manual only
    /*
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Changed to 4 seconds for better user experience
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        setTimeout(() => {
            this.startAutoSlide();
        }, 1000); // Wait 1 second before restarting auto-slide
    }
    */
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel();
    
    // Initialize category navigation
    initCategoryNavigation();
    
    // Mobile-specific optimizations
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile for better performance
        document.documentElement.style.setProperty('--animation-duration', '2s');
        
        // Add viewport meta tag adjustment for mobile
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Optimize scroll behavior for mobile
        document.body.style.overscrollBehavior = 'none';
        
        // Add mobile-specific classes
        document.body.classList.add('mobile-device');
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Recalculate carousel dimensions after orientation change
            const carousel = document.querySelector('.carousel-container');
            if (carousel) {
                carousel.style.height = 'auto';
                setTimeout(() => {
                    carousel.style.height = '';
                }, 100);
            }
        }, 100);
    });
    
    // Optimize for devices with limited memory
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        // Reduce floating animations on low-memory devices
        const floatingElements = document.querySelectorAll('.floating-elements');
        floatingElements.forEach(el => {
            el.style.opacity = '0.3';
        });
    }
    
    // Add intersection observer for better performance - DISABLED to prevent unwanted carousel animations
    /*
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Carousel is visible, ensure animations are running
                const carousel = entry.target.querySelector('.hero-carousel');
                if (carousel && !carousel.classList.contains('active')) {
                    carousel.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        carouselObserver.observe(heroSection);
    }
    */
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Category Section Animations - COMPLETELY DISABLED
/*
function animateOnScroll() {
    // Only animate category items, not carousel/hero section
    const categoryItems = document.querySelectorAll('.category-item:not(.hero .category-item), .workshop-item, .gift-set-item');
    
    categoryItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (itemTop < windowHeight * 0.8) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
}
*/

// Initialize category items for animation - COMPLETELY DISABLED
/*
document.addEventListener('DOMContentLoaded', () => {
    // Only apply animations to category items, not carousel/hero section
    const categoryItems = document.querySelectorAll('.category-item:not(.hero .category-item), .workshop-item, .gift-set-item');
    
    categoryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial animation check
    animateOnScroll();
});
*/

// Add scroll listener for animations - DISABLED
// window.addEventListener('scroll', animateOnScroll);

// Enhanced category item interactions - DISABLED TO PREVENT UNWANTED TRANSFORMS
/*
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});
*/

// Add loading animation for category images - DISABLED
/*
document.querySelectorAll('.category-item').forEach(item => {
    const img = item.querySelector('img');
    if (img) {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Set initial state
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }
});
*/

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !service || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    this.reset();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Append to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Scroll animations for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
    
    // Don't animate hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }
});

// Add hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('featured')) {
            this.style.transform = 'scale(1.05)';
        } else {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Add click interactions for category items
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function() {
        const overlay = this.querySelector('.overlay');
        if (overlay) {
            // Add a subtle pulse effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

// Add parallax effect for hero section - DISABLED TO PREVENT UNWANTED MOVEMENT
/*
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});
*/

// Testimonials carousel (if you want to add auto-rotation)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    if (testimonials.length > 0) {
        testimonials.forEach((testimonial, index) => {
            testimonial.style.opacity = index === currentTestimonial ? '1' : '0.7';
            testimonial.style.transform = index === currentTestimonial ? 'scale(1.05)' : 'scale(1)';
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }
}

// Start testimonial rotation
setInterval(rotateTestimonials, 4000);

// Add click-to-copy functionality for contact info
document.querySelectorAll('.contact-item').forEach(item => {
    const emailElement = item.querySelector('p');
    if (emailElement && emailElement.textContent.includes('@')) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            navigator.clipboard.writeText(emailElement.textContent.trim()).then(() => {
                showNotification('Email copied to clipboard!', 'success');
            });
        });
    }
});

// Add typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Add dynamic background color change based on scroll
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const hue = Math.floor(scrollPercent * 3.6); // 0-360 degrees
    document.documentElement.style.setProperty('--dynamic-hue', hue);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    // Your scroll handler code here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeFilter = document.querySelector('.filter-btn.active');
        const allFilters = document.querySelectorAll('.filter-btn');
        let currentIndex = Array.from(allFilters).indexOf(activeFilter);
        
        if (e.key === 'ArrowLeft') {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : allFilters.length - 1;
        } else {
            currentIndex = currentIndex < allFilters.length - 1 ? currentIndex + 1 : 0;
        }
        
        allFilters[currentIndex].click();
    }
});

// Category Navigation Functionality
function initCategoryNavigation() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            categoryItems.forEach(categoryItem => {
                categoryItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get category name
            const categoryNameElement = item.querySelector('.category-name');
            const categoryName = categoryNameElement ? categoryNameElement.textContent : 'Category';
            
            // Here you can add logic to filter carousel content based on category
            console.log(`Selected category: ${categoryName}`);
            
            // Add visual feedback
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateY(-2px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = '';
            }
        });
    });
    
    // Make category navigation scrollable on mobile
    const categoryNav = document.querySelector('.category-navigation');
    if (categoryNav && window.innerWidth <= 480) {
        // Enable horizontal scrolling on mobile
        let isScrolling = false;
        
        categoryNav.addEventListener('touchstart', () => {
            isScrolling = true;
        });
        
        categoryNav.addEventListener('touchend', () => {
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile debugging
    if (isMobileDevice()) {
        logMobileDebug('Mobile device detected', {
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        });
        
        // Enable debug mode on mobile with special URL parameter or localStorage
        if (window.location.hash.includes('debug') || localStorage.getItem('debug') === 'true') {
            logMobileDebug('Debug mode enabled for mobile');
            // Add debug button to enable/disable debugging
            const debugToggle = document.createElement('button');
            debugToggle.innerHTML = 'Toggle Debug';
            debugToggle.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 99998;
                background: #007bff;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
            `;
            debugToggle.addEventListener('click', () => {
                const debugElement = document.getElementById('mobile-debug');
                if (debugElement) {
                    debugElement.style.display = debugElement.style.display === 'none' ? 'block' : 'none';
                }
            });
            document.body.appendChild(debugToggle);
        }
    }
    
    new SearchManager();
    new ProductCardManager();
});

console.log('🎨 Memory & More website loaded successfully!');
