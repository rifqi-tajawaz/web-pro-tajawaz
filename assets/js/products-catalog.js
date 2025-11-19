/**
 * TAJAWAZ SOLUTIONS - PRODUCTS CATALOG
 * Professional & iOS Safari Compatible
 * Clean implementation without complex animations
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    PRODUCTS_PER_PAGE: 9,
    DEBOUNCE_DELAY: 300,
    FADE_DURATION: 300
  };

  // State
  let state = {
    currentPage: 1,
    currentFilter: 'Semua',
    currentSearch: '',
    isLoading: false
  };

  // DOM Elements
  let elements = {};

  /**
   * Initialize application
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  }

  /**
   * Initialize app after DOM is ready
   */
  function initApp() {
    // Cache DOM elements
    cacheElements();

    // Validate required elements
    if (!elements.productsContainer) {
      console.error('Products container not found');
      return;
    }

    // Show loading skeleton
    showLoadingSkeleton();

    // Wait for products data
    waitForProductsData();
  }

  /**
   * Cache DOM elements
   */
  function cacheElements() {
    elements = {
      productsContainer: document.getElementById('products-digital-container'),
      filterButtons: document.querySelectorAll('[data-filter]'),
      searchInput: document.getElementById('product-digital-search'),
      loadMoreBtn: document.getElementById('load-more-btn-product-digital'),
      resultsCount: document.getElementById('results-count-product-digital')
    };
  }

  /**
   * Wait for products data to be available
   */
  function waitForProductsData() {
    let attempts = 0;
    const maxAttempts = 50;

    const checkInterval = setInterval(function() {
      attempts++;

      // Debug logging
      if (attempts === 1) {
        console.log('Waiting for products data...');
      }

      if (typeof window.productsData !== 'undefined' && Array.isArray(window.productsData)) {
        console.log('Products data found! Total products:', window.productsData.length);
        clearInterval(checkInterval);
        startApp();
      } else if (attempts >= maxAttempts) {
        console.error('Failed to load products data after', maxAttempts, 'attempts');
        console.error('window.productsData type:', typeof window.productsData);
        clearInterval(checkInterval);
        showError('Gagal memuat data produk. Silakan refresh halaman.');
      }
    }, 100);
  }

  /**
   * Start the application
   */
  function startApp() {
    setupEventListeners();
    renderProducts();
  }

  /**
   * Setup all event listeners
   */
  function setupEventListeners() {
    // Filter buttons
    if (elements.filterButtons) {
      elements.filterButtons.forEach(function(button) {
        button.addEventListener('click', handleFilterClick);
      });
    }

    // Search input
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', debounce(handleSearch, CONFIG.DEBOUNCE_DELAY));
    }

    // Load more button
    if (elements.loadMoreBtn) {
      elements.loadMoreBtn.addEventListener('click', handleLoadMore);
    }
  }

  /**
   * Handle filter button click
   */
  function handleFilterClick(e) {
    e.preventDefault();

    // Update active state
    elements.filterButtons.forEach(function(btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    this.classList.add('active');
    this.setAttribute('aria-pressed', 'true');

    // Update state
    state.currentFilter = this.getAttribute('data-filter');
    state.currentPage = 1;

    // Render products
    renderProducts();

    // Analytics
    trackEvent('filter_products', { category: state.currentFilter });
  }

  /**
   * Handle search input
   */
  function handleSearch(e) {
    state.currentSearch = e.target.value.trim();
    state.currentPage = 1;
    renderProducts();

    // Analytics
    if (state.currentSearch) {
      trackEvent('search_products', { term: state.currentSearch });
    }
  }

  /**
   * Handle load more button click
   */
  function handleLoadMore(e) {
    e.preventDefault();

    if (state.isLoading) return;

    state.isLoading = true;
    showLoadingButton();

    setTimeout(function() {
      state.currentPage++;
      state.isLoading = false;
      renderProducts();

      // Analytics
      trackEvent('load_more_products', { page: state.currentPage });
    }, 500);
  }

  /**
   * Show loading skeleton
   */
  function showLoadingSkeleton() {
    if (!elements.productsContainer) return;

    const skeletonCards = [];
    for (let i = 0; i < 6; i++) {
      skeletonCards.push(createSkeletonCard());
    }

    elements.productsContainer.innerHTML = skeletonCards.join('');

    if (elements.resultsCount) {
      elements.resultsCount.textContent = 'Memuat produk...';
    }
  }

  /**
   * Create skeleton card HTML
   */
  function createSkeletonCard() {
    return `
      <div class="skeleton-card">
        <div class="skeleton-image skeleton-loader"></div>
        <div class="skeleton-category skeleton-loader"></div>
        <div class="skeleton-title skeleton-loader"></div>
        <div class="skeleton-description skeleton-loader"></div>
        <div class="skeleton-description skeleton-loader"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; gap: 1rem;">
          <div class="skeleton-price skeleton-loader"></div>
          <div class="skeleton-button skeleton-loader" style="flex: 1;"></div>
        </div>
      </div>
    `;
  }

  /**
   * Show loading state on button
   */
  function showLoadingButton() {
    if (!elements.loadMoreBtn) return;

    elements.loadMoreBtn.innerHTML = `
      <span class="btn-title">
        <span>Memuat...</span>
      </span>
      <span class="icon-circle">
        <i class="fa-solid fa-spinner fa-spin"></i>
      </span>
    `;
    elements.loadMoreBtn.disabled = true;
  }

  /**
   * Show error message
   */
  function showError(message) {
    if (!elements.productsContainer) return;

    elements.productsContainer.innerHTML = `
      <div class="no-results-product-digital animate-fade-in">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <h4>Error</h4>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Render products based on current state
   */
  function renderProducts() {
    if (!elements.productsContainer) return;

    // Validate products data
    if (typeof window.productsData === 'undefined' || !Array.isArray(window.productsData)) {
      console.error('Products data validation failed');
      showError('Data produk tidak tersedia');
      return;
    }

    console.log('Rendering products - Filter:', state.currentFilter, 'Search:', state.currentSearch);

    // Get filtered products
    const filteredProducts = getFilteredProducts();
    console.log('Filtered products count:', filteredProducts.length);

    // Calculate pagination
    const startIndex = 0;
    const endIndex = state.currentPage * CONFIG.PRODUCTS_PER_PAGE;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredProducts.length;

    // Update results count
    updateResultsCount(productsToShow.length, filteredProducts.length);

    // Fade out animation
    fadeOut(elements.productsContainer, function() {
      // Clear container
      elements.productsContainer.innerHTML = '';

      // Render products or no results
      if (productsToShow.length === 0) {
        renderNoResults();
      } else {
        renderProductCards(productsToShow);
      }

      // Update load more button
      updateLoadMoreButton(hasMore, filteredProducts.length - endIndex);

      // Fade in animation
      fadeIn(elements.productsContainer);
    });
  }

  /**
   * Get filtered products
   */
  function getFilteredProducts() {
    let filtered = window.productsData.slice();

    // Filter by category
    if (state.currentFilter !== 'Semua') {
      filtered = filtered.filter(function(product) {
        return product.category === state.currentFilter;
      });
    }

    // Filter by search
    if (state.currentSearch) {
      const searchLower = state.currentSearch.toLowerCase();
      filtered = filtered.filter(function(product) {
        return product.title.toLowerCase().indexOf(searchLower) !== -1 ||
               product.description.toLowerCase().indexOf(searchLower) !== -1 ||
               product.tags.some(function(tag) {
                 return tag.toLowerCase().indexOf(searchLower) !== -1;
               });
      });
    }

    return filtered;
  }

  /**
   * Update results count
   */
  function updateResultsCount(showing, total) {
    if (!elements.resultsCount) return;

    elements.resultsCount.textContent = 'Menampilkan ' + showing + ' dari ' + total + ' produk';
  }

  /**
   * Render no results message
   */
  function renderNoResults() {
    elements.productsContainer.innerHTML = `
      <div class="no-results-product-digital animate-fade-in" data-testid="no-results-product-digital">
        <i class="fa-solid fa-box-open"></i>
        <h4>Tidak Ada Produk Ditemukan</h4>
        <p>Coba ubah filter atau kata kunci pencarian</p>
      </div>
    `;
  }

  /**
   * Render product cards
   */
  function renderProductCards(products) {
    const cardsHtml = products.map(function(product) {
      return createProductCard(product);
    }).join('');

    elements.productsContainer.innerHTML = cardsHtml;
  }

  /**
   * Create product card HTML
   */
  function createProductCard(product) {
    const badgeHtml = product.badge ?
      '<span class="product-digital-badge" data-testid="product-digital-badge-' + product.id + '">' +
      escapeHtml(product.badge) + '</span>' : '';

    const originalPriceHtml = product.originalPrice ?
      '<span class="original-price" data-testid="product-digital-original-price-' + product.id + '">' +
      escapeHtml(product.originalPrice) + '</span>' : '';

    return `
      <div class="product-digital-card animate-fade-in"
           data-testid="product-digital-card-${product.id}"
           data-product-id="${product.id}">
        ${badgeHtml}
        <div class="product-digital-image">
          <img
            src="${escapeHtml(product.image)}"
            alt="${escapeHtml(product.title)}"
            loading="lazy"
            width="600"
            height="400"
            data-testid="product-digital-image-${product.id}"
          >
        </div>
        <div class="product-digital-content">
          <div class="product-digital-category" data-category="${escapeHtml(product.category)}" data-testid="product-digital-category-${product.id}">
            ${escapeHtml(product.category)}
          </div>
          <h4 data-testid="product-digital-title-${product.id}">${escapeHtml(product.title)}</h4>
          <p data-testid="product-digital-description-${product.id}">${escapeHtml(product.description)}</p>
          <div class="product-digital-footer">
            <div class="product-digital-price" data-testid="product-digital-price-${product.id}">
              ${originalPriceHtml}
              <span class="current-price" data-testid="product-digital-current-price-${product.id}">${escapeHtml(product.price)}</span>
            </div>
            <a href="${escapeHtml(product.link)}"
               class="btn btn-accent"
               data-testid="product-digital-cta-${product.id}"
               aria-label="Lihat detail ${escapeHtml(product.title)}">
              <div class="btn-title">
                <span>Lihat Detail</span>
              </div>
              <div class="icon-circle">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Update load more button
   */
  function updateLoadMoreButton(hasMore, remaining) {
    if (!elements.loadMoreBtn) return;

    if (hasMore) {
      elements.loadMoreBtn.style.display = 'inline-flex';
      elements.loadMoreBtn.disabled = false;
      elements.loadMoreBtn.innerHTML = `
        <span class="btn-title">
          <span>Tampilkan Lebih Banyak (${remaining})</span>
        </span>
        <span class="icon-circle">
          <i class="fa-solid fa-arrow-down"></i>
        </span>
      `;
    } else {
      elements.loadMoreBtn.style.display = 'none';
    }
  }

  /**
   * Fade out animation
   */
  function fadeOut(element, callback) {
    element.style.opacity = '0';
    element.style.transition = 'opacity ' + CONFIG.FADE_DURATION + 'ms ease';

    setTimeout(callback, CONFIG.FADE_DURATION);
  }

  /**
   * Fade in animation
   */
  function fadeIn(element) {
    setTimeout(function() {
      element.style.opacity = '1';
    }, 50);
  }

  /**
   * Debounce function
   */
  function debounce(func, delay) {
    let timeoutId;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function() {
        func.apply(context, args);
      }, delay);
    };
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  /**
   * Track analytics event
   */
  function trackEvent(eventName, params) {
    // Analytics tracking removed
  }

  // Initialize app
  init();

})();