'use strict';

/* ================================================================= */
/* =================== PEMUATAN KOMPONEN DINAMIS =================== */
/* ================================================================= */

/**
 * Helper to detect the repository name dynamically for GitHub Pages.
 * @returns {string} The base path (e.g., "/web-pro-tajawaz" or "")
 */
function getBasePath() {
  const path = window.location.pathname;
  // If deployed in a subdirectory (Project Site), return relative path to root
  // Current strategy is strictly relative paths "./", so this might be less critical
  // unless used for absolute path construction.
  // Returning relative "./" is safest for flat structure.
  return './';
}

/**
 * Memuat komponen HTML reusable (header, footer, sidebar) secara dinamis
 * dan menginisialisasi fungsionalitas utama setelah komponen dimuat.
 */
Promise.all([
  fetch('./component/header.html').then((res) => res.text()),
  fetch('./component/footer.html').then((res) => res.text()),
  fetch('./component/sidebar.html').then((res) => res.text()),
  fetch('./component/search-form.html').then((res) => res.text()),
])
  .then(([headerHTML, footerHTML, sidebarHTML, searchHTML]) => {
    $('#header').html(headerHTML);
    $('#footer').html(footerHTML);
    $('#sidebar').html(sidebarHTML);
    $('#edit-sidebar').html(sidebarHTML);
    $('#search-form-container').html(searchHTML);
  })
  .then(() => {
    // Inisialisasi semua fungsi setelah komponen dimuat
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
  })
  .catch(err => console.error('Error loading components:', err));

/* ================================================================= */
/* ======================== VIDEO BANNER YOUTUBE ======================= */
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
        origin: window.location.origin, // Simplified origin
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
/* ======================== PENGALIH TEMA ========================== */
/* ================================================================= */
/**
 * Mengelola fungsionalitas peralihan tema (light/dark mode),
 * menyimpan preferensi pengguna di localStorage.
 * Uses CSS filters instead of JS image swapping.
 */
function initThemeSwitch() {
  let lightMode = localStorage.getItem('lightmode') === 'active';

  const iconClass = lightMode ? 'fa-sun' : 'fa-moon';
  $('#themeIcon').removeClass('fa-sun fa-moon').addClass(iconClass);

  $('#themeSwitch').on('click', function () {
    lightMode = !lightMode;

    if (lightMode) {
      $('body').addClass('lightmode');
      localStorage.setItem('lightmode', 'active');
    } else {
      $('body').removeClass('lightmode');
      localStorage.removeItem('lightmode');
    }

    const iconClass = lightMode ? 'fa-sun' : 'fa-moon';
    $('#themeIcon').removeClass('fa-sun fa-moon').addClass(iconClass);
  });
}

/* ================================================================= */
/* ====================== DROPDOWN BOOTSTRAP ======================= */
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
/* ======================== PENGHITUNG ANGKA ======================= */
/* ================================================================= */
/**
 * Menginisialisasi penghitung angka dengan requestAnimationFrame for performance.
 */
function initCounter() {
  const $counters = $('.counter');

  function animateCount(el, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (optional, linear for now)
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
/* ================== LINK NAVIGASI AKTIF ================== */
/* ================================================================= */
function initNavLink() {
  // Handle strictly relative paths by comparing simplified pathnames
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  $('.navbar-nav .nav-link').each(function () {
    const href = $(this).attr('href');
    // Simple check: if href ends with the current filename
    if (href && (href === currentPath || href === './' + currentPath || (currentPath === 'index.html' && (href === './' || href === '/')))) {
      $(this).addClass('active');
    }
  });

  $('.navbar-nav .dropdown-menu .dropdown-item').each(function () {
    const href = $(this).attr('href');
    if (href && (href === currentPath || href === './' + currentPath)) {
      $(this).closest('.dropdown').find('.nav-link.dropdown-toggle').addClass('active');
    }
  });
}

/* ================================================================= */
/* ======================== SIDEBAR UTAMA ========================== */
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

/* ================================================================= */
/* ======================== SIDEBAR EDIT =========================== */
/* ================================================================= */
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

/* ================================================================= */
/* ===================== DROPDOWN SIDEBAR ====================== */
/* ================================================================= */
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
/* ======================== KOTAK PENCARIAN ======================== */
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
}

/* ================================================================= */
/* ===================== LOGIKA PENCARIAN ====================== */
/* ================================================================= */
$(document).ready(function () {
  const data = [
    {
      title: 'Home',
      description:
        'Ekosistem Bisnis Lengkap untuk Kebebasan Finansial Anda Saksikan bagaimana alumni Tajawaz Solutions mencapai kesuksesan bisnis dan kebebasan finansial melalui ekosistem pembelajaran, tools praktis, dan peluang bisnis nyata. Tajawaz Solutions adalah ekosistem bisnis lengkap yang memberdayakan entrepreneur dari berbagai latar belakang untuk mencapai kebebasan finansial. Dari program mentorship dan konsultasi, tools praktis, hingga peluang bisnis dan komunitas—semua terintegrasi untuk kesuksesan Anda. Get Started 500+ Alumni Sukses Ready [...]',
      url: './index.html',
    },
    {
      title: 'About',
      description:
        'About Marko Home / About Us 0 + Years of Experience on Digital Marketing Services About Us Who We Are & What Drives Us At Marko, we specialize in crafting innovative digital marketing strategies that drive real business growth. Our expertise ensures your brand stays ahead in the competitive digital landscape. Get to know the [...]',
      url: './about.html',
    },
    {
      title: 'Services',
      description:
        'Our Services Home / Services Our Core Services Digital Solutions That Drive Real Results Social Media Marketing Build brand awareness & engage your audience effectively lorem ipsum dolor sit amet consectetur adip. View Details Content Marketing Build brand awareness & engage your audience effectively lorem ipsum dolor sit amet consectetur adip. View Details PPC Advertising […]',
      url: './service.html',
    },
    {
      title: 'Single Services',
      description:
        'Social Media Marketing Home / Services Details Our Expertise Boost Your Brand with Strategic Social Media Marketing Maximize engagement, build loyal communities, and drive conversions across all major platforms lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Service Overview At Marko, we help brands grow […]',
      url: './single_services.html',
    },
    {
      title: 'Case Studies',
      description:
        "Case Studies Home / Case Studies Case Studies See How We Help Businesses Thrive We don't just talk about results—we deliver them. Here are some of our most impactful case studies showcasing how our digital marketing strategies drive success. More Case Studies Social Influencer Retargeting Google Video Local Community Local Business Digital Transformation 5x ROI […]",
      url: './case_studies.html',
    },
    {
      title: 'Our Team',
      description:
        'Meet Our Team Home / Our Team Case Studies Meet the Minds Behind Your Digital Success Ethan Morales Head of Creative Sophia Zhang Senior SEO Specialist Liam Turner Performance Marketing Lead Olivia Bennett Creative Director Daniel White Client Success Manager Chloe Ramirez Social Media Manager Powering Success for Top Brands Lorem ipsum dolor sit amet, […]',
      url: './team.html',
    },
    {
      title: 'Partnership',
      description:
        "Partnership Home / Partnership Client & Partnership Strong Partnerships, Proven Success See How We Help Brands Grow Transform Your Business with Marko! Take your digital marketing to the next level with data-driven strategies and innovative solutions. Let's create something amazing together! 500+ Alumni Sukses 0 % Improved Project 0 % New Project Social Media Growth […]",
      url: './partnership.html',
    },
    {
      title: 'Pricing Plan',
      description:
        "Pricing Plan Home / Pricing Plan Our Core Services Flexible Pricing Plans for Every Business Let's Find the Right Strategy for You! Book a Free Consultation Starter Perfect for startups & small businesses $99 / Month View Details Basic SEO & Digital Marketing Social Media Management (1 platform) Monthly Performance Report Enterprise Full scale marketing […]",
      url: './pricing.html',
    },
    {
      title: 'Testimonial',
      description:
        "Testimonials Home / Testimonials 500+ Alumni Sukses 0 % Improved Project 0 % New Project Social Media Growth Performance Marketing What Our Client Says Hear from Our Satisfied Clients, Real Success Stories Discover how businesses like yours achieved outstanding growth with Marko's expert digital marketing solutions. Emma Richard CEO Nexatech 'Marko completely transformed our online [...]',",
      url: './testimonial.html',
    },
    {
      title: 'FAQs',
      description:
        "Simple, Direct, and Friendly Home / FAQ Frequently Asked Questions Got Questions? We've Got Answers. What services does Marko offer? We specialize in digital marketing, including branding, social media management, content strategy, paid ads, and analytics-driven campaigns. How long does it take to see results? While some channels like paid ads offer quicker results, most […]",
      url: './faq.html',
    },
    {
      title: 'Error 404',
      description:
        "404 Oops! Page Not Found We couldn't find the page you're looking for. It might have been removed, renamed, or never existed. Back to Home",
      url: './errors/404.html',
    },
    {
      title: 'Blog',
      description:
        'Our Blog Home / Blog Insights & Trends Latest Digital Marketing Strategies & Tips Explore our latest blog articles covering industry trends, expert insights, and actionable strategies to elevate your digital marketing game. View All Articles April 14, 2025 Social Media Mastering Instagram and Facebook Ads Lorem ipsum dolor si consectetur adipiscing elit ut elit […]',
      url: './blog.html',
    },
    {
      title: 'Single Post',
      description:
        "Growth Strategies for Digital Businesses Home / Single Post Recent Blog April 14, 2025 Mastering Instagram and Facebook Ads April 14, 2025 Growth Strategies for Digital Business Transform Your Business with Marko! Take your digital marketing to the next level with data-driven strategies and innovative solutions. Let's create something amazing together! Read More How to […]",
      url: './single_post.html',
    },
    {
      title: 'Contact Us',
      description:
        'Contact Us Home / Contact Us Reach out to us Get in Touch Reach out to us for tailored digital solutions that drive results sollicitudin nec. Phone Number +1 (62) 987 7543 Email Address hello@markoagency.com Office Address Marko HQ - 902 Digital Lane, San Francisco, CA 94110, USA',
      url: './contact.html',
    },
  ];

  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('q');

  const $resultContainer = $('#search-results');
  const $resultTitle = $('#result-title');

  if (keyword) {
    $resultTitle.text(`Search Result for "${keyword}"`);

    const result = data.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (result.length > 0) {
      result.forEach((item) => {
        const $div = $('<div>').addClass('result').html(`
          <a href="${item.url}"><h2>${item.title}</h2></a>
          <p>${item.description}</p>
        `);
        $resultContainer.append($div);
      });
    } else {
      $resultContainer.html(`<p>No results found for "${keyword}"</p>`);
    }
  } else {
    $resultTitle.text('Enter search keywords to see results.');
  }
});

/* ================================================================= */
/* =================== ANIMASI SAAT SCROLL =================== */
/* ================================================================= */
/**
 * Menginisialisasi animasi elemen saat masuk ke viewport menggunakan Intersection Observer.
 * Elemen dengan atribut 'data-animate' akan diberi kelas animasi.
 */
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
