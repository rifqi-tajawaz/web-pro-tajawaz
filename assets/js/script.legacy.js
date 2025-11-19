/**
 * Main Script - Tajawaz Solutions
 * Handles component loading, animations, and core functionality
 */

// Load Components (Header, Footer, Sidebar, Search)
Promise.all([
  fetch('./components/header.html').then((e) => e.text()),
  fetch('./components/footer.html').then((e) => e.text()),
  fetch('./components/sidebar.html').then((e) => e.text()),
  fetch('./components/search-form.html').then((e) => e.text()),
])
  .then(([e, t, n, s]) => {
    $('#header').html(e);
    $('#footer').html(t);
    $('#sidebar').html(n);
    $('#edit-sidebar').html(n);
    $('#search-form-container').html(s);
  })
  .then(() => {
    initBannerVideo();
    initNavLink();
    initSidebar();
    initEditSidebar();
    initSidebarDropdown();
    initCounter();
    initThemeSwitch();
    initSearchBar();
    initAnimateData();
  });

// Initialize Banner Video (YouTube)
function initBannerVideo() {
  var player;
  var script = $('<script>', { src: 'https://www.youtube.com/iframe_api' });
  $('script').first().before(script);

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
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerReady(event) {
    event.target.playVideo();
    resizeVideo();
    $(window).on('resize', resizeVideo);
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      player.playVideo();
    }
  }

  function resizeVideo() {
    var container = $('.banner-video-container');
    var containerWidth = container.outerWidth();
    var containerHeight = container.outerHeight();
    var aspectRatio = 16 / 9;
    var videoWidth, videoHeight;

    if (containerWidth / containerHeight > aspectRatio) {
      videoWidth = containerWidth;
      videoHeight = containerWidth / aspectRatio;
    } else {
      videoWidth = containerHeight * aspectRatio;
      videoHeight = containerHeight;
    }

    if (player && player.getIframe) {
      var iframe = $(player.getIframe());
      iframe.width(videoWidth).height(videoHeight);
    }
  }
}

// Initialize Theme Switcher (Dark/Light Mode)
function initThemeSwitch() {
  let isDarkMode = false;

  if (localStorage.getItem('lightmode') === 'active') {
    isDarkMode = true;
    $('body').addClass('lightmode');
  }

  const updateTheme = () => {
    const logo = $('.site-logo');
    const partnerLogos = $('.partner-logo');

    if (isDarkMode) {
      $('body').addClass('lightmode');
      localStorage.setItem('lightmode', 'active');
      logo.attr('src', '/assets/images/logos/brand/dark-mode.svg');

      partnerLogos.each(function () {
        const img = $(this);
        const src = img.attr('src');
        if (!src.includes('-dark')) {
          img.attr('src', src.replace('.svg', '-dark.svg'));
        }
      });
    } else {
      $('body').removeClass('lightmode');
      localStorage.removeItem('lightmode');
      logo.attr('src', '/assets/images/logos/brand/light-mode.svg');

      partnerLogos.each(function () {
        const img = $(this);
        const src = img.attr('src');
        img.attr('src', src.replace('-dark.svg', '.svg'));
      });
    }
  };

  updateTheme();

  const observer = new MutationObserver(() => {
    updateTheme();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  $('#themeSwitch').on('click', function () {
    isDarkMode = !isDarkMode;
    updateTheme();
    const iconClass = isDarkMode ? 'fa-sun' : 'fa-moon';
    $('#themeIcon').removeClass('fa-sun fa-moon').addClass(iconClass);
  });
}

$(document).ready(function () {
  initThemeSwitch();
});

// Initialize Counter Animations
function initCounter() {
  var observer;
  var counters = $('.counter');

  function animateCounter(counter) {
    var target = +counter.data('target');
    var current = +counter.text().replace('+', '');
    var duration = 2000;
    var fps = 60;
    var increment = Math.max(1, Math.ceil(target / fps));
    var interval = Math.floor(duration / (target / increment));

    if (current < target) {
      var newValue = Math.min(target, current + increment);
      counter.text(newValue);
      setTimeout(function () {
        animateCounter(counter);
      }, interval);
    } else {
      counter.text(target);
    }
  }

  observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var counter = $(entry.target);
          animateCounter(counter);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.each(function () {
    observer.observe(this);
  });
}

// Initialize Active Nav Links
function initNavLink() {
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

// Initialize Scroll Animations
$(function () {
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add(entry.target.getAttribute('data-animate'));
            entry.target.style.opacity = 1;
            observer.unobserve(entry.target);
          }, delay);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => observer.observe(element));
});

// Initialize Mobile Sidebar
function initSidebar() {
  const navBtn = $('.nav-btn');
  const closeBtn = $('.close-btn');
  const overlay = $('.sidebar-overlay');
  const sidebar = $('.sidebar');

  navBtn.click(function () {
    overlay.addClass('active');
    setTimeout(() => {
      sidebar.addClass('active');
    }, 200);
  });

  closeBtn.click(function () {
    sidebar.removeClass('active');
    setTimeout(() => {
      overlay.removeClass('active');
    }, 200);
  });

  overlay.click(function () {
    sidebar.removeClass('active');
    setTimeout(() => {
      overlay.removeClass('active');
    }, 200);
  });
}

// Initialize Edit Sidebar
function initEditSidebar() {
  const editBtn = $('.content-edit');
  const closeBtn = $('.close-btn-second');
  const overlay = $('.content-overlay');
  const sidebar = $('.content-edit-sidebar');

  editBtn.click(function () {
    sidebar.addClass('active');
    setTimeout(() => {
      overlay.addClass('active');
    }, 200);
  });

  closeBtn.click(function () {
    sidebar.removeClass('active');
    setTimeout(() => {
      overlay.removeClass('active');
    }, 200);
  });
}

// Initialize Sidebar Dropdown
function initSidebarDropdown() {
  const dropdownBtns = $('.sidebar-dropdown-btn');

  dropdownBtns.each(function () {
    $(this).on('click', function () {
      const menu = $(this).parent().next('.sidebar-dropdown-menu');
      const isActive = menu.hasClass('active');

      $('.sidebar-dropdown-menu').not(menu).removeClass('active');
      menu.toggleClass('active', !isActive);
    });
  });
}

// Initialize Search Bar
function initSearchBar() {
  const searchBtn = $('.search-btn');
  const overlay = $('.search-overlay');
  const closeBtn = $('.search-close');

  if (overlay.length === 0) return;

  searchBtn.on('click', function () {
    overlay.addClass('active');
  });

  closeBtn.on('click', function () {
    overlay.removeClass('active');
  });

  overlay.on('click', function (e) {
    if ($(e.target).hasClass('search-overlay')) {
      overlay.removeClass('active');
    }
  });
}

// Search Functionality - Updated Data for Tajawaz Solutions
$(document).ready(function () {
  const searchData = [
    {
      title: 'Beranda',
      description:
        'Tajawaz Solutions - Ekosistem bisnis lengkap untuk entrepreneur. Program mentorship, konsultasi bisnis, tools praktis, dan komunitas aktif untuk kebebasan finansial Anda.',
      url: 'index.html',
    },
    {
      title: 'Tentang Kami',
      description:
        'Tentang Tajawaz Solutions - Seni Melampaui Nilai. Kami memberdayakan entrepreneur dari berbagai latar belakang untuk mencapai kebebasan finansial melalui ekosistem bisnis terintegrasi.',
      url: 'tentang-kami.html',
    },
    {
      title: 'Layanan Kami',
      description:
        'Program & Solusi Bisnis Tajawaz - Mentorship bisnis, konsultasi strategis, blueprint eksekusi, pengelolaan aset, dan komunitas entrepreneur aktif.',
      url: 'service.html',
    },
    {
      title: 'Detail Layanan',
      description:
        'Program Mentorship Bisnis Tajawaz - Bimbingan personal dari praktisi berpengalaman, strategi profitabilitas terukur, dan eksekusi bisnis nyata.',
      url: 'single_services.html',
    },
    {
      title: 'Produk Digital',
      description:
        'Produk Digital Tajawaz - E-book bisnis, course online, template profesional, tools praktis, dan bundle lengkap untuk entrepreneur.',
      url: 'products-digital.html',
    },
    {
      title: 'Studi Kasus',
      description:
        'Cerita Sukses Alumni Tajawaz - Lihat bagaimana entrepreneur seperti Anda mencapai kesuksesan dengan program Tajawaz Solutions.',
      url: 'case_studies.html',
    },
    {
      title: 'Tim Mentor',
      description:
        'Tim Mentor Tajawaz - Praktisi berpengalaman yang siap membimbing perjalanan bisnis Anda menuju kesuksesan.',
      url: 'team.html',
    },
    {
      title: 'Kemitraan',
      description:
        'Kemitraan Strategis Tajawaz - Bergabung dengan ekosistem bisnis yang telah membantu ratusan entrepreneur mencapai kebebasan finansial.',
      url: 'partnership.html',
    },
    {
      title: 'Paket Program',
      description:
        'Paket Program Tajawaz - Pilihan program fleksibel untuk setiap tahap perjalanan bisnis Anda, dari pemula hingga scale-up.',
      url: 'pricing.html',
    },
    {
      title: 'Testimoni',
      description:
        'Testimoni Alumni Tajawaz - Dengar langsung dari entrepreneur yang telah berhasil dengan bimbingan Tajawaz Solutions.',
      url: 'testimonial.html',
    },
    {
      title: 'FAQ',
      description:
        'Frequently Asked Questions - Pertanyaan umum tentang program, layanan, dan ekosistem Tajawaz Solutions.',
      url: 'faq.html',
    },
    {
      title: 'Blog',
      description:
        'Jurnal Bisnis Tajawaz - Insights praktis, strategi bisnis, dan tips dari praktisi untuk entrepreneur Indonesia.',
      url: 'blog.html',
    },
    {
      title: 'Artikel',
      description:
        'Artikel Lengkap - Strategi growth, tips profitabilitas, dan insight bisnis dari ekosistem Tajawaz Solutions.',
      url: 'single_post.html',
    },
    {
      title: 'Hubungi Kami',
      description:
        'Hubungi Tajawaz Solutions - Mulai perjalanan menuju kebebasan finansial Anda. Konsultasi gratis tersedia.',
      url: 'contact.html',
    },
    {
      title: 'Bio',
      description:
        'Profil Founder - Perjalanan dan visi di balik Tajawaz Solutions dalam memberdayakan entrepreneur Indonesia.',
      url: 'bio.html',
    },
  ];

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');
  const resultsContainer = $('#search-results');
  const resultTitle = $('#result-title');

  if (searchQuery) {
    resultTitle.text(`Hasil Pencarian untuk "${searchQuery}"`);

    const results = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (results.length > 0) {
      results.forEach((result) => {
        const resultDiv = $('<div>').addClass('result').html(`
          <a href="${result.url}"><h2>${result.title}</h2></a>
          <p>${result.description}</p>
        `);
        resultsContainer.append(resultDiv);
      });
    } else {
      resultsContainer.html(`<p>Tidak ada hasil ditemukan untuk kata kunci tersebut.</p>`);
    }
  } else {
    resultTitle.text('Masukkan kata kunci pencarian.');
  }
});

// Initialize Animation Data
function initAnimateData() {
  const animatedElements = $('[data-animate]');
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = $(entry.target);
          const delay = element.data('delay') || 0;

          setTimeout(() => {
            element.addClass(element.data('animate'));
            element.css('opacity', 1);
            observer.unobserve(entry.target);
          }, delay);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.each(function () {
    observer.observe(this);
  });
}
