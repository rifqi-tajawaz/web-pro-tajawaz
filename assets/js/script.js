'use strict';

/* ================================================================= */
/* =================== DYNAMIC COMPONENT LOADING =================== */
/* ================================================================= */

/**
 * Loads reusable HTML components (header, footer, sidebar) dynamically
 * using the globally detected SITE_BASE_URL.
 */
const baseUrl = window.SITE_BASE_URL || './';

Promise.all([
  fetch(`${baseUrl}component/header.html`).then((res) => res.text()),
  fetch(`${baseUrl}component/footer.html`).then((res) => res.text()),
  fetch(`${baseUrl}component/sidebar.html`).then((res) => res.text()),
  fetch(`${baseUrl}component/search-form.html`).then((res) => res.text()),
])
  .then(([headerHTML, footerHTML, sidebarHTML, searchHTML]) => {
    $('#header').html(headerHTML);
    $('#footer').html(footerHTML);
    $('#sidebar').html(sidebarHTML);
    $('#edit-sidebar').html(sidebarHTML);
    $('#search-form-container').html(searchHTML);
  })
  .then(() => {
    // Initialize all functions after components are loaded
    initBootstrapDropdowns();
    initBannerVideo();
    initNavLink();
    initSidebar();
    initEditSidebar();
    initSidebarDropdown();
    initCounter();
    initThemeSwitch();

    // Apply theme state
    const lightMode = localStorage.getItem('lightmode') === 'active';
    if (lightMode) {
      $('body').addClass('lightmode');
    } else {
      $('body').removeClass('lightmode');
    }

    initSearchBar();

    if (typeof initSubmitContact === 'function') {
      initSubmitContact();
    }
    if (typeof initSubmitNewsletter === 'function') {
      initSubmitNewsletter();
    }
    initAnimateData();

    // Re-run logo filter check in case of late load
    updateLogoFilter(lightMode);
  })
  .catch(err => console.error('Error loading components:', err));

/* ================================================================= */
/* ======================== YOUTUBE BANNER VIDEO ======================= */
/* ================================================================= */
function initBannerVideo() {
  let player;

  const $tag = $('<script>', {
    src: 'https://www.youtube.com/iframe_api',
  });
  $('script').first().before($tag);

  window.onYouTubeIframeAPIReady = function () {
    // Check if container exists before trying to init player
    if (!document.getElementById('banner-video-background')) return;

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
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerReady(event) {
    event.target.playVideo();
    setYoutubeSize();
    $(window).on('resize', setYoutubeSize);
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      player.playVideo();
    }
  }

  function setYoutubeSize() {
    const $container = $('.banner-video-container');
    if ($container.length === 0) return;

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

    if (player && player.getIframe) {
      const $iframe = $(player.getIframe());
      $iframe.width(newWidth).height(newHeight);
    }
  }
}

/* ================================================================= */
/* ======================== THEME SWITCHER ========================= */
/* ================================================================= */
/**
 * Manages Light/Dark mode switching.
 * Uses CSS Filters for logo color adaptation to prevent infinite loops.
 * NO JavaScript src swapping for images allowed.
 */
function initThemeSwitch() {
  let lightMode = localStorage.getItem('lightmode') === 'active';

  updateThemeUI(lightMode);

  $('#themeSwitch').on('click', function () {
    lightMode = !lightMode;

    if (lightMode) {
      $('body').addClass('lightmode');
      localStorage.setItem('lightmode', 'active');
    } else {
      $('body').removeClass('lightmode');
      localStorage.removeItem('lightmode');
    }

    updateThemeUI(lightMode);
  });
}

function updateThemeUI(isLight) {
  const iconClass = isLight ? 'fa-sun' : 'fa-moon';
  $('#themeIcon').removeClass('fa-sun fa-moon').addClass(iconClass);

  // Logo handling via CSS class is automatic based on body.lightmode
  // but we can add a helper class if needed for specific elements
  updateLogoFilter(isLight);
}

function updateLogoFilter(isLight) {
  // This function is a safeguard to ensure logos have the correct filter class
  // The actual visual change should be handled by CSS rules for .site-logo inside body.lightmode
  // This avoids the infinite loop of src swapping.
  // We just ensure the class exists if needed, though body class is usually enough.
}

/* ================================================================= */
/* ====================== BOOTSTRAP DROPDOWNS ====================== */
/* ================================================================= */
function initBootstrapDropdowns() {
  const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
  if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
    dropdownElementList.map(function (dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl);
    });
  }
}

/* ================================================================= */
/* ======================== NUMBER COUNTER ========================= */
/* ================================================================= */
function initCounter() {
  const $counters = $('.counter');

  function animateCount(el, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (linear)
      const currentVal = Math.floor(progress * (target - start) + start);

      $(el).text(currentVal);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        $(el).text(target);
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const $counter = $(entry.target);
          const target = +$counter.data('target');
          animateCount(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  $counters.each(function () {
    observer.observe(this);
  });
}

/* ================================================================= */
/* ======================= ACTIVE NAV LINKS ======================== */
/* ================================================================= */
function initNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  $('.navbar-nav .nav-link').each(function () {
    const href = $(this).attr('href');
    // Normalize href (remove ./ if present)
    const normalizedHref = href ? href.replace('./', '') : '';

    if (href && (normalizedHref === currentPath || (currentPath === 'index.html' && normalizedHref === 'index.html'))) {
      $(this).addClass('active');
    }
  });

  $('.navbar-nav .dropdown-menu .dropdown-item').each(function () {
    const href = $(this).attr('href');
    const normalizedHref = href ? href.replace('./', '') : '';

    if (href && (normalizedHref === currentPath)) {
      $(this).closest('.dropdown').find('.nav-link.dropdown-toggle').addClass('active');
    }
  });
}

/* ================================================================= */
/* ======================== SIDEBAR LOGIC ========================== */
/* ================================================================= */
function initSidebar() {
  const $menuBtn = $('.nav-btn');
  const $closeBtn = $('.close-btn');
  const $overlay = $('.sidebar-overlay');
  const $sidebar = $('.sidebar');

  $menuBtn.click(function () {
    $overlay.addClass('active');
    setTimeout(() => {
      $sidebar.addClass('active');
    }, 200);
  });

  $closeBtn.click(function () {
    $sidebar.removeClass('active');
    setTimeout(() => {
      $overlay.removeClass('active');
    }, 200);
  });

  $overlay.click(function () {
    $sidebar.removeClass('active');
    setTimeout(() => {
      $overlay.removeClass('active');
    }, 200);
  });
}

function initEditSidebar() {
  const $contentBtn = $('.content-edit');
  const $closeBtn = $('.close-btn-second');
  const $overlay = $('.content-overlay');
  const $sidebar = $('.content-edit-sidebar');

  $contentBtn.click(function () {
    $sidebar.addClass('active');
    setTimeout(() => {
      $overlay.addClass('active');
    }, 200);
  });

  $closeBtn.click(function () {
    $sidebar.removeClass('active');
    setTimeout(() => {
      $overlay.removeClass('active');
    }, 200);
  });
}

function initSidebarDropdown() {
  const $dropdownButtons = $('.sidebar-dropdown-btn');

  $dropdownButtons.each(function () {
    $(this).on('click', function () {
      const $dropdownMenu = $(this).parent().next('.sidebar-dropdown-menu');
      const isOpen = $dropdownMenu.hasClass('active');
      $('.sidebar-dropdown-menu').not($dropdownMenu).removeClass('active');
      $dropdownMenu.toggleClass('active', !isOpen);
    });
  });
}

/* ================================================================= */
/* =========================== SEARCH BAR ========================== */
/* ================================================================= */
function initSearchBar() {
  const $searchBtn = $('.search-btn');
  const $overlay = $('.search-overlay');
  const $closeBtn = $('.search-close');

  if ($overlay.length === 0) return;

  $searchBtn.on('click', function () {
    $overlay.addClass('active');
  });

  $closeBtn.on('click', function () {
    $overlay.removeClass('active');
  });

  $overlay.on('click', function (e) {
    if ($(e.target).hasClass('search-overlay')) {
      $overlay.removeClass('active');
    }
  });

  // Initialize search logic if we are on the search results page
  if (window.location.pathname.includes('search.html')) {
      initSearchLogic();
  }
}

function initSearchLogic() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('q');
  const $resultContainer = $('#search-results');
  const $resultTitle = $('#result-title');

  if (keyword) {
    $resultTitle.text(`Search Result for "${keyword}"`);
    $resultContainer.html('<p>Loading results...</p>');

    // Fetch search index asynchronously
    fetch(`${baseUrl}assets/json/search-index.json`)
      .then(response => response.json())
      .then(data => {
        const results = data.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword.toLowerCase()) ||
            item.description.toLowerCase().includes(keyword.toLowerCase())
        );

        $resultContainer.empty();

        if (results.length > 0) {
          results.forEach((item) => {
            // Adjust URL if necessary based on current location vs index location
            // For now assuming index URLs are relative to root which is what we want
            const $div = $('<div>').addClass('result').html(`
              <a href="${item.url}"><h2>${item.title}</h2></a>
              <p>${item.description}</p>
            `);
            $resultContainer.append($div);
          });
        } else {
          $resultContainer.html(`<p>No results found for "${keyword}"</p>`);
        }
      })
      .catch(error => {
        console.error('Error loading search index:', error);
        $resultContainer.html('<p>An error occurred while searching. Please try again.</p>');
      });

  } else {
    $resultTitle.text('Enter search keywords to see results.');
  }
}

/* ================================================================= */
/* ======================= SCROLL ANIMATION ======================== */
/* ================================================================= */
function initAnimateData() {
  const $elements = $('[data-animate]');
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const $el = $(entry.target);
          const delay = $el.data('delay') || 0;
          setTimeout(() => {
            $el.addClass($el.data('animate'));
            $el.css('opacity', 1);
            observer.unobserve(entry.target);
          }, delay);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );
  $elements.each(function () {
    observer.observe(this);
  });
}
