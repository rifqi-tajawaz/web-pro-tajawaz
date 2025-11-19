/**
 * ============================================================================
 * SCRIPT.JS - Skrip Utama Website
 * ============================================================================
 *
 * @description
 * Skrip ini menangani fungsionalitas utama di seluruh website, termasuk:
 * - Memuat komponen template (header, footer, sidebar).
 * - Inisialisasi library pihak ketiga (Bootstrap Dropdowns).
 * - Mengelola interaksi UI seperti navigasi, tema, dan modal.
 * - Menjalankan animasi saat elemen masuk ke viewport.
 * - Meng-handle logika pencarian pada halaman `search.html`.
 *
 * @author     Jules
 * @version    2.0.0
 * @since      2025-11-19
 * ============================================================================
 */

'use strict';

/**
 * ============================================================================
 * FUNGSI UTAMA & INISIALISASI
 * ============================================================================
 */

/**
 * Fungsi utama yang dieksekusi setelah DOM selesai dimuat.
 * Menginisialisasi semua fungsionalitas website.
 */
function main() {
  loadComponents()
    .then(() => {
      initComponents();
      initEventListeners();
    })
    .catch((error) => {
      console.error('Error loading components:', error);
    });
}

/**
 * Memuat komponen HTML reusable (header, footer, dll.) ke dalam halaman.
 * @returns {Promise<void>} Promise yang resolve setelah semua komponen dimuat.
 */
async function loadComponents() {
  const components = [
    { id: '#header', url: './component/header.html' },
    { id: '#footer', url: './component/footer.html' },
    { id: '#sidebar', url: './component/sidebar.html' },
    { id: '#edit-sidebar', url: './component/sidebar.html' },
    { id: '#search-form-container', url: './component/search-form.html' },
  ];

  try {
    const responses = await Promise.all(components.map((c) => fetch(c.url).then((res) => res.text())));
    responses.forEach((html, index) => {
      $(components[index].id).html(html);
    });
  } catch (error) {
    console.error('Failed to load one or more components:', error);
    throw error; // Re-throw untuk ditangkap oleh pemanggil
  }
}

/**
 * Menginisialisasi semua skrip dan komponen setelah template dimuat.
 */
function initComponents() {
  initBootstrapDropdowns();
  initBannerVideo();
  initNavLinkActiveState();
  initSidebar();
  initEditSidebar();
  initSidebarDropdown();
  initCounterAnimation();
  initThemeSwitch();
  initSearchBar();
  initScrollAnimations();
  handleSearchPage();

  // Inisialisasi kondisional untuk form
  if (typeof initSubmitContact === 'function') initSubmitContact();
  if (typeof initSubmitNewsletter === 'function') initSubmitNewsletter();
}

/**
 * ============================================================================
 * INISIALISASI KOMPONEN & UI
 * ============================================================================
 */

/**
 * Inisialisasi dropdown Bootstrap.
 */
function initBootstrapDropdowns() {
  const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
  if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
    dropdownElementList.map((dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl));
  }
}

/**
 * Inisialisasi video banner YouTube.
 */
function initBannerVideo() {
  if (!$('#banner-video-background').length) return;

  let player;
  const $tag = $('<script>', { src: 'https://www.youtube.com/iframe_api' });
  $('script').first().before($tag);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('banner-video-background', {
      videoId: 'P68V3iH4TeE',
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        loop: 1,
        playlist: 'P68V3iH4TeE',
        showinfo: 0,
        rel: 0,
        enablejsapi: 1,
        disablekb: 1,
        modestbranding: 1,
        iv_load_policy: 3,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          event.target.playVideo();
          setYoutubeSize();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            player.playVideo();
          }
        },
      },
    });
  };

  function setYoutubeSize() {
    const $container = $('.banner-video-container');
    if (!$container.length || !player || !player.getIframe) return;

    const containerWidth = $container.outerWidth();
    const containerHeight = $container.outerHeight();
    const aspectRatio = 16 / 9;
    let newWidth, newHeight;

    if (containerWidth / containerHeight > aspectRatio) {
      newWidth = containerWidth;
      newHeight = containerWidth / aspectRatio;
    } else {
      newWidth = containerHeight * aspectRatio;
      newHeight = containerHeight;
    }
    $(player.getIframe()).width(newWidth).height(newHeight);
  }

  $(window).on('resize', setYoutubeSize);
}

/**
 * Mengatur status aktif pada link navigasi berdasarkan URL saat ini.
 */
function initNavLinkActiveState() {
  const currentUrl = window.location.href;
  $('.navbar-nav .nav-link').each(function () {
    if (this.href === currentUrl) {
      $(this).addClass('active');
    }
  });
  $('.navbar-nav .dropdown-menu .dropdown-item').each(function () {
    if (this.href === currentUrl) {
      $(this).closest('.dropdown').find('.nav-link.dropdown-toggle').addClass('active');
    }
  });
}

/**
 * Inisialisasi fungsionalitas sidebar utama.
 */
function initSidebar() {
  const $menuBtn = $('.nav-btn');
  const $closeBtn = $('.close-btn');
  const $overlay = $('.sidebar-overlay');
  const $sidebar = $('.sidebar');

  if (!$sidebar.length) return;

  $menuBtn.on('click', () => {
    $overlay.addClass('active');
    setTimeout(() => $sidebar.addClass('active'), 200);
  });

  const closeSidebar = () => {
    $sidebar.removeClass('active');
    setTimeout(() => $overlay.removeClass('active'), 200);
  };

  $closeBtn.on('click', closeSidebar);
  $overlay.on('click', closeSidebar);
}

/**
 * Inisialisasi fungsionalitas sidebar edit konten.
 */
function initEditSidebar() {
  const $contentBtn = $('.content-edit');
  const $closeBtn = $('.close-btn-second');
  const $overlay = $('.content-overlay');
  const $sidebar = $('.content-edit-sidebar');

  if (!$sidebar.length) return;

  $contentBtn.on('click', () => {
    $sidebar.addClass('active');
    setTimeout(() => $overlay.addClass('active'), 200);
  });

  $closeBtn.on('click', () => {
    $sidebar.removeClass('active');
    setTimeout(() => $overlay.removeClass('active'), 200);
  });
}

/**
 * Inisialisasi dropdown pada menu sidebar.
 */
function initSidebarDropdown() {
  $('.sidebar-dropdown-btn').on('click', function () {
    const $dropdownMenu = $(this).parent().next('.sidebar-dropdown-menu');
    const isOpen = $dropdownMenu.hasClass('active');
    $('.sidebar-dropdown-menu').removeClass('active');
    $dropdownMenu.toggleClass('active', !isOpen);
  });
}

/**
 * Inisialisasi fungsionalitas search bar overlay.
 */
function initSearchBar() {
  const $searchBtn = $('.search-btn');
  const $overlay = $('.search-overlay');
  const $closeBtn = $('.search-close');

  if (!$overlay.length) return;

  $searchBtn.on('click', () => $overlay.addClass('active'));
  $closeBtn.on('click', () => $overlay.removeClass('active'));
  $overlay.on('click', (e) => {
    if ($(e.target).hasClass('search-overlay')) {
      $overlay.removeClass('active');
    }
  });
}

/**
 * Inisialisasi fungsionalitas ganti tema (dark/light mode).
 */
function initThemeSwitch() {
  let isLightMode = localStorage.getItem('lightmode') === 'active';
  const $body = $('body');
  const $themeIcon = $('#themeIcon');

  const updateTheme = () => {
    $body.toggleClass('lightmode', isLightMode);
    $themeIcon.toggleClass('fa-sun', isLightMode).toggleClass('fa-moon', !isLightMode);

    // Update logos based on theme
    $('.site-logo').each(function() {
      const newSrc = $(this).attr('src').replace(isLightMode ? 'light-mode.svg' : 'dark-mode.svg', isLightMode ? 'dark-mode.svg' : 'light-mode.svg');
      $(this).attr('src', newSrc);
    });

    $('.partner-logo').each(function() {
      const src = $(this).attr('src');
      const newSrc = isLightMode ? src.replace('.png', '-dark.png') : src.replace('-dark.png', '.png');
      if (!src.includes(isLightMode ? '-dark' : '.png.')) $(this).attr('src', newSrc);
    });

    if (isLightMode) {
      localStorage.setItem('lightmode', 'active');
    } else {
      localStorage.removeItem('lightmode');
    }
  };

  // Set initial theme
  updateTheme();

  // Event listener for theme switch button
  $('#themeSwitch').on('click', () => {
    isLightMode = !isLightMode;
    updateTheme();
  });

  // Observer to handle dynamically loaded logos
  const observer = new MutationObserver(updateTheme);
  observer.observe(document.body, { childList: true, subtree: true });
}


/**
 * ============================================================================
 * ANIMASI
 * ============================================================================
 */

/**
 * Inisialisasi animasi scroll menggunakan Intersection Observer.
 * Elemen dengan atribut `data-animate` akan diberi class animasi saat masuk viewport.
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add(entry.target.getAttribute('data-animate'));
            entry.target.style.opacity = 1;
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  animatedElements.forEach((el) => observer.observe(el));
}


/**
 * Inisialisasi animasi counter angka saat elemen masuk viewport.
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.getAttribute('data-target');
          animateCount(el, target);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((counter) => observer.observe(counter));
}

/**
 * Helper untuk animasi counter.
 * @param {HTMLElement} el - Elemen counter.
 * @param {number} target - Angka target.
 */
function animateCount(el, target) {
  let current = 0;
  const duration = 2000;
  const stepTime = 30;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      clearInterval(timer);
      current = target;
    }
    el.innerText = Math.floor(current);
  }, stepTime);
}


/**
 * ============================================================================
 * LOGIKA PENCARIAN
 * ============================================================================
 */

/**
 * Menangani logika pencarian di halaman `search.html`.
 */
function handleSearchPage() {
  if (!$('#search-results').length) return; // Hanya berjalan di halaman pencarian

  const searchData = [
    { title: 'Home', description: 'Ekosistem Bisnis Lengkap...', url: 'index.html' },
    { title: 'About', description: 'Tentang Kami...', url: 'about.html' },
    // Tambahkan data lain sesuai kebutuhan
  ];

  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('q');
  const $resultContainer = $('#search-results');
  const $resultTitle = $('#result-title');

  if (keyword) {
    $resultTitle.text(`Hasil Pencarian untuk "${keyword}"`);
    const results = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (results.length > 0) {
      results.forEach((item) => {
        const resultHtml = `
          <div class="result">
            <a href="${item.url}"><h2>${item.title}</h2></a>
            <p>${item.description}</p>
          </div>`;
        $resultContainer.append(resultHtml);
      });
    } else {
      $resultContainer.html(`<p>Tidak ada hasil untuk kata kunci tersebut.</p>`);
    }
  } else {
    $resultTitle.text('Masukkan kata kunci pencarian.');
  }
}

/**
 * ============================================================================
 * EVENT LISTENERS
 * ============================================================================
 */

/**
 * Menginisialisasi semua event listener global.
 */
function initEventListeners() {
  // Event listener akan ditambahkan di sini jika ada.
  // Fungsionalitas sidebar, search bar, dll. sudah memiliki listener sendiri dalam fungsi inisialisasinya.
}

/**
 * Menunggu DOM siap sebelum menjalankan skrip utama.
 */
$(document).ready(main);
