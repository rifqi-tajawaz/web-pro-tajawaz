'use strict';

/* ================================================================
 * DYNAMIC COMPONENT LOADING
 * ================================================================
 * Purpose: Memuat komponen HTML reusable secara dinamis
 * Dependencies: jQuery, window.SITE_BASE_URL
 * ================================================================ */

const baseUrl = window.SITE_BASE_URL || './';

const components = [];

if (document.getElementById('header')) components.push({ id: '#header', url: 'components/header.html' });
if (document.getElementById('footer')) components.push({ id: '#footer', url: 'components/footer.html' });
if (document.getElementById('sidebar')) components.push({ id: '#sidebar', url: 'components/sidebar.html' });
if (document.getElementById('edit-sidebar')) components.push({ id: '#edit-sidebar', url: 'components/sidebar.html' });
if (document.getElementById('search-form-container')) components.push({ id: '#search-form-container', url: 'components/search-form.html' });

/**
 * Fetch Component
 */
const fetchComponent = (comp) => {
  return fetch(`${baseUrl}${comp.url}`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${comp.url}`);
      return res.text();
    })
    .then(html => ({ id: comp.id, html }))
    .catch(err => {
      console.error(`Component load error: ${comp.url}`, err);
      return null;
    });
};

Promise.all(components.map(fetchComponent))
  .then((results) => {
    const adjustPaths = (html, baseUrl) => {
      return html
        .replace(/src="assets\//g, `src="${baseUrl}assets/`)
        .replace(/src="\.\/assets\//g, `src="${baseUrl}assets/`)
        .replace(/href="assets\//g, `href="${baseUrl}assets/`)
        .replace(/href="\.\/"/g, `href="${baseUrl}`)
        .replace(/action="\.\/"/g, `action="${baseUrl}`);
    };

    results.forEach(result => {
      if (result && result.html) {
        $(result.id).html(adjustPaths(result.html, baseUrl));
      }
    });
  })
  .then(() => {
    initBootstrapDropdowns();
    initBannerVideo();
    initNavLink();

    if ($('.nav-btn').length) initSidebar();
    if ($('.content-edit').length) initEditSidebar();
    if ($('.sidebar-dropdown-btn').length) initSidebarDropdown();

    initCounter();
    initThemeSwitch();

    const lightMode = localStorage.getItem('lightmode') === 'active';
    if (lightMode) {
      $('body').addClass('lightmode');
    } else {
      $('body').removeClass('lightmode');
    }

    if ($('.search-btn').length) initSearchBar();

    if (typeof initSubmitContact === 'function') {
      initSubmitContact();
    }
    if (typeof initSubmitNewsletter === 'function') {
      initSubmitNewsletter();
    }
    initAnimateData();

    // Initialize logos based on current theme
    if (typeof updateLogos === 'function') {
      updateLogos(lightMode);
    }
  })
  .catch(err => console.error('Component initialization error:', err));

/* ================================================================
 * YOUTUBE BANNER VIDEO
 * ================================================================ */

function initBannerVideo() {
  if (!document.getElementById('banner-video-background')) return;

  let player;
  const $tag = $('<script>', {
    src: 'https://www.youtube.com/iframe_api',
  });
  $('script').first().before($tag);

  window.onYouTubeIframeAPIReady = function () {
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
    if(event && event.target && typeof event.target.playVideo === 'function') {
      event.target.playVideo();
    }
    setYoutubeSize();
    $(window).on('resize', setYoutubeSize);
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED && player && typeof player.playVideo === 'function') {
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

    if (player && typeof player.getIframe === 'function') {
      const iframe = player.getIframe();
      if (iframe) {
        $(iframe).width(newWidth).height(newHeight);
      }
    }
  }
}

/* ================================================================
 * THEME SWITCHER
 * ================================================================ */

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
  
  // Update logos based on theme
  if (typeof updateLogos === 'function') {
    updateLogos(isLight);
  }
}

/* ================================================================
 * BOOTSTRAP DROPDOWNS
 * ================================================================ */

function initBootstrapDropdowns() {
  const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
  if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
    dropdownElementList.map(function (dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl);
    });
  }
}

/* ================================================================
 * NUMBER COUNTER ANIMATION
 * ================================================================ */

function initCounter() {
  const $counters = $('.counter');
  if ($counters.length === 0) return;

  function animateCount(el, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

  if ('IntersectionObserver' in window) {
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
      { threshold: 0.5 }
    );

    $counters.each(function () {
      observer.observe(this);
    });
  }
}

/* ================================================================
 * ACTIVE NAVIGATION LINKS
 * ================================================================ */

function initNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  $('.navbar-nav .nav-link').each(function () {
    const href = $(this).attr('href');
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

/* ================================================================
 * SIDEBAR LOGIC
 * ================================================================ */

function initSidebar() {
  const $menuBtn = $('.nav-btn');
  const $closeBtn = $('.close-btn');
  const $overlay = $('.sidebar-overlay');
  const $sidebar = $('.sidebar');

  if (!$menuBtn.length || !$sidebar.length) return;

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

  if (!$contentBtn.length || !$sidebar.length) return;

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

/* ================================================================
 * SEARCH BAR
 * ================================================================ */

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

  if (window.location.pathname.includes('pages/search.html')) {
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
        console.error('Search error:', error);
        $resultContainer.html('<p>An error occurred while searching. Please try again.</p>');
      });

  } else {
    $resultTitle.text('Enter search keywords to see results.');
  }
}

/* ================================================================
 * SCROLL ANIMATION
 * ================================================================ */

function initAnimateData() {
  const $elements = $('[data-animate]');
  if ($elements.length === 0) return;

  if ('IntersectionObserver' in window) {
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
      { threshold: 0.1 }
    );
    $elements.each(function () {
      observer.observe(this);
    });
  } else {
      $elements.each(function() {
          $(this).addClass($(this).data('animate')).css('opacity', 1);
      });
  }
}
