$(document).ready(function () {
    Promise.all([
        fetch("/partials/header.html").then(res => res.text()),
        fetch("/partials/footer.html").then(res => res.text()),
        fetch("/partials/sidebar.html").then(res => res.text()),
        fetch("/partials/search-form.html").then(res => res.text())
    ])
    .then(([headerHTML, footerHTML, sidebarHTML, searchHTML]) => {
        $("#header").html(headerHTML);
        $("#footer").html(footerHTML);
        $("#sidebar").html(sidebarHTML);
        $("#edit-sidebar").html(sidebarHTML);
        $("#search-form-container").html(searchHTML);
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
        initSubmitContact();
        initSubmitNewsletter();
        initAnimateData();
    });
});

function initBannerVideo() {
    var player;
    if ($('#banner-video-background').length === 0) return;

    var tag = $('<script>', { src: "https://www.youtube.com/iframe_api" });
    $('script').first().before(tag);

    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('banner-video-background', {
            videoId: 'P68V3iH4TeE',
            playerVars: {
                'autoplay': 1, 'controls': 0, 'mute': 1, 'loop': 1,
                'playlist': 'P68V3iH4TeE', 'showinfo': 0, 'rel': 0,
                'enablejsapi': 1, 'disablekb': 1, 'modestbranding': 1,
                'iv_load_policy': 3, 'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
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
        var $container = $('.banner-video-container');
        var containerWidth = $container.outerWidth();
        var containerHeight = $container.outerHeight();
        var aspectRatio = 16 / 9;
        var newWidth, newHeight;

        if (containerWidth / containerHeight > aspectRatio) {
            newWidth = containerWidth;
            newHeight = containerWidth / aspectRatio;
        } else {
            newWidth = containerHeight * aspectRatio;
            newHeight = containerHeight;
        }

        if (player && player.getIframe) {
            $(player.getIframe()).width(newWidth).height(newHeight);
        }
    }
}

function initThemeSwitch() {
    const assetsBasePath = '/assets/';
    let lightMode = localStorage.getItem('lightmode') === 'active';

    const updateLogos = () => {
        const isLight = $('body').hasClass('lightmode');
        const siteLogoSrc = isLight ? `${assetsBasePath}images/marko-logo-dark.png` : `${assetsBasePath}images/marko-logo.png`;
        $('.site-logo').attr('src', siteLogoSrc);

        $('.partner-logo').each(function () {
            const $img = $(this);
            let src = $img.attr('src');
            if(src) {
                if (isLight) {
                    if (!src.includes('-dark')) {
                        $img.attr('src', src.replace('.png', '-dark.png'));
                    }
                } else {
                    $img.attr('src', src.replace('-dark.png', '.png'));
                }
            }
        });
    };

    if (lightMode) {
        $('body').addClass('lightmode');
    }
    
    // Initial call after a short delay to ensure header is loaded
    setTimeout(updateLogos, 100);

    $('#themeSwitch').on('click', function () {
        $('body').toggleClass('lightmode');
        lightMode = $('body').hasClass('lightmode');
        localStorage.setItem('lightmode', lightMode ? 'active' : 'inactive');
        
        updateLogos();

        const iconClass = lightMode ? 'fa-sun' : 'fa-moon';
        $('#themeIcon').removeClass('fa-sun fa-moon').addClass(iconClass);
    });
    
    const observer = new MutationObserver(updateLogos);
    observer.observe(document.getElementById('header'), { childList: true, subtree: true });
}

function initCounter() {
    var $counters = $(".counter");
    if($counters.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var $counter = $(entry.target);
                updateCount($counter);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    $counters.each(function() {
        observer.observe(this);
    });

    function updateCount($counter) {
        var target = +$counter.data("target");
        var count = +$counter.text().replace("+", "");
        var duration = 2000; 
        var steps = 60;
        var increment = Math.max(1, Math.ceil(target / steps));
        var delay = Math.floor(duration / (target / increment));

        if (count < target) {
            var nextCount = Math.min(target, count + increment);
            $counter.text(nextCount);
            setTimeout(() => updateCount($counter), delay);
        } else {
            $counter.text(target);
        }
    }
}

function initNavLink() {
    const currentUrl = window.location.pathname;
    $(".navbar-nav a").each(function() {
        const linkPath = new URL(this.href).pathname;
        if (linkPath === currentUrl) {
            $(this).addClass("active");
            if ($(this).hasClass('dropdown-item')) {
                $(this).closest(".dropdown").find(".nav-link.dropdown-toggle").addClass("active");
            }
        }
    });
}

function initAnimateData() {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add(entry.target.getAttribute('data-animate'));
                    entry.target.style.opacity = 1;
                    observer.unobserve(entry.target);
                }, delay);
            }
        });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));    
}

function initSidebar() {
    $(document).on('click', '.nav-btn', function() {
      $('.sidebar-overlay, .sidebar').addClass('active');
    });
  
    $(document).on('click', '.close-btn, .sidebar-overlay', function() {
      $('.sidebar-overlay, .sidebar').removeClass('active');
    });
}

function initEditSidebar() {
    $(document).on('click', '.content-edit', function() {
        $('.content-edit-sidebar, .content-overlay').addClass('active');
    });

    $(document).on('click', '.close-btn-second, .content-overlay', function() {
        $('.content-edit-sidebar, .content-overlay').removeClass('active');
    });
}

function initSidebarDropdown() {
    $(document).on("click", ".sidebar-dropdown-btn", function() {
        const $dropdownMenu = $(this).parent().next(".sidebar-dropdown-menu");
        $(".sidebar-dropdown-menu").not($dropdownMenu).removeClass("active");
        $dropdownMenu.toggleClass("active");
    });
}

function initSearchBar() {
    $(document).on("click", ".search-btn", () => $(".search-overlay").addClass("active"));
    $(document).on("click", ".search-close", () => $(".search-overlay").removeClass("active"));
    $(document).on("click", ".search-overlay", function(e) {
      if ($(e.target).is(this)) $(this).removeClass("active");
    });

    $(document).on('submit', '#search-form-container form', function(e) {
        e.preventDefault();
        const keyword = $(this).find('input[name="q"]').val();
        window.location.href = `/pages/search.html?q=${encodeURIComponent(keyword)}`;
    });
}

function initSubmitContact() { /* Placeholder */ }
function initSubmitNewsletter() { /* Placeholder */ }


$(document).ready(function(){
    // This part is for the search results page only
    if ($("#search-results").length > 0) {
        const data = [
            { title: "Home", url: "/index.html", description: "Amplify Your Brand with Cutting-Edge Digital Marketing..." },
            { title: "About", url: "/pages/about.html", description: "About Marko Home / About Us..." },
            { title: "Services", url: "/pages/service.html", description: "Our Services Home / Services..." },
            { title: "Single Services", url: "/pages/single_services.html", description: "Social Media Marketing Home / Services Details..." },
            { title: "Case Studies", url: "/pages/case_studies.html", description: "Case Studies Home / Case Studies..." },
            { title: "Our Team", url: "/pages/team.html", description: "Meet Our Team Home / Our Team..." },
            { title: "Partnership", url: "/pages/partnership.html", description: "Partnership Home / Partnership..." },
            { title: "Pricing Plan", url: "/pages/pricing.html", description: "Pricing Plan Home / Pricing Plan..." },
            { title: "Testimonial", url: "/pages/testimonial.html", description: "Testimonials Home / Testimonials..." },
            { title: "FAQs", url: "/pages/faq.html", description: "Simple, Direct, and Friendly Home / FAQ..." },
            { title: "Error 404", url: "/pages/404_page.html", description: "404 Oops! Page Not Found..." },
            { title: "Blog", url: "/pages/blog.html", description: "Our Blog Home / Blog..." },
            { title: "Single Post", url: "/pages/single_post.html", description: "Growth Strategies for Digital Businesses..." },
            { title: "Contact Us", url: "/pages/contact.html", description: "Contact Us Home / Contact Us..." },
        ];

        const params = new URLSearchParams(window.location.search);
        const keyword = params.get("q");

        const $resultContainer = $("#search-results");
        const $resultTitle = $("#result-title");

        if (keyword) {
            $resultTitle.text(`Search Result for "${keyword}"`);
            
            // Basic filtering (can be replaced with Fuse.js if that library is available)
            const results = data.filter(item =>
                (item.title && item.title.toLowerCase().includes(keyword.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(keyword.toLowerCase()))
            );

            if (results.length > 0) {
                results.forEach(item => {
                    const $div = $("<div>").addClass("result").html(`
                        <a href="${item.url}"><h2>${item.title}</h2></a>
                        <p>${item.description}</p>
                    `);
                    $resultContainer.append($div);
                });
            } else {
                $resultContainer.html(`<p>No results found for "${keyword}".</p>`);
            }
        } else if ($resultContainer.length > 0){
            $resultTitle.text("Please enter a keyword to search.");
        }
    }
});
