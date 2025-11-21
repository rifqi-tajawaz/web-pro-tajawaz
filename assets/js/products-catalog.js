
/**
 * Product Catalog Logic
 * Handles rendering, filtering, and searching of digital products.
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('products-digital-container');
    const searchInput = document.getElementById('product-digital-search');
    const filterButtons = document.querySelectorAll('.filter-btn-product-digital');
    const resultsCount = document.getElementById('results-count-product-digital');
    const loadMoreBtn = document.getElementById('load-more-btn-product-digital');

    let currentFilter = 'Semua';
    let currentSearch = '';
    let visibleCount = 6; // Initial number of items to show
    const loadIncrement = 3;

    // Check if productsData is available
    if (typeof productsData === 'undefined') {
        console.error("productsData is not defined. Make sure products-data.js is loaded.");
        container.innerHTML = '<p class="text-center">Gagal memuat produk. Silakan coba lagi nanti.</p>';
        return;
    }

    function renderProducts() {
        // Filter data
        let filteredData = productsData.filter(product => {
            const matchesCategory = currentFilter === 'Semua' || product.category === currentFilter;
            const matchesSearch = product.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                                  product.description.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // Update results count text
        resultsCount.textContent = `Menampilkan ${Math.min(visibleCount, filteredData.length)} dari ${filteredData.length} produk`;

        // Slice for pagination
        const paginatedData = filteredData.slice(0, visibleCount);

        // Clear container
        container.innerHTML = '';

        if (paginatedData.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="d-flex flex-column align-items-center gspace-2">
                        <i class="fa-solid fa-box-open fa-3x" style="color: var(--text-color);"></i>
                        <p>Tidak ada produk yang ditemukan.</p>
                    </div>
                </div>
            `;
            loadMoreBtn.classList.add('load-more-btn-hidden');
            return;
        }

        // Render items
        paginatedData.forEach(product => {
            const cardHTML = `
                <div class="card card-product-digital animate-box animated animate__fadeInUp">
                    <div class="card-header-custom">
                        <div class="product-icon">
                            <i class="${product.icon}"></i>
                        </div>
                        <span class="product-price">${product.price}</span>
                    </div>
                    <h4>${product.title}</h4>
                    <p>${product.description}</p>
                    <a href="./contact.html" class="btn btn-accent">
                        <div class="btn-title">
                            <span>Beli Sekarang</span>
                        </div>
                        <div class="icon-circle">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </div>
                    </a>
                </div>
            `;

            // Create wrapper div for grid column if using bootstrap grid directly in container
            // But here we are using css grid on the container itself, so direct children are items.
            // Wait, the CSS uses grid-template-columns. So we just append the card directly?
            // The CSS .products-digital-grid { display: grid ... } handles the layout.
            // So we append the card div directly.

            // However, standard template uses Bootstrap cols.
            // Let's check style.css usage. The template uses .row > .col > .card.
            // My new CSS .products-digital-grid uses standard CSS Grid.
            // This is cleaner for "Loading More" than Bootstrap rows which need wrapping.
            // So I will inject the card DIV directly into the container.

            container.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Handle Load More Button visibility
        if (visibleCount >= filteredData.length) {
            loadMoreBtn.classList.add('load-more-btn-hidden');
        } else {
            loadMoreBtn.classList.remove('load-more-btn-hidden');
        }

        // Re-trigger animations (simple hack for existing scroll logic if needed,
        // but here we just add the class directly so they fade in immediately or via css animation)
    }

    // Event Listeners

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            // Update state
            currentFilter = btn.getAttribute('data-filter');
            visibleCount = 6; // Reset pagination
            renderProducts();
        });
    });

    // Search Input
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        visibleCount = 6; // Reset pagination
        renderProducts();
    });

    // Load More
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += loadIncrement;
        renderProducts();
    });

    // Initial Render
    renderProducts();
});
