/* ================================================================
 * SWIPER INITIALIZATION
 * ================================================================
 * Purpose: Inisialisasi Swiper carousels untuk partner dan testimonial
 * 
 * Instances:
 * - swiperPartner: Partner logos carousel
 * - swiperTestimonial: Testimonial cards carousel
 * 
 * Dependencies: Swiper.js library, jQuery
 * ================================================================ */

/**
 * Partner Swiper
 * Purpose: Carousel untuk logo partner dengan autoplay dan responsive breakpoints
 */
$(function(){
   var swiperPartner = new Swiper('.swiper.swiperPartner',{
        autoplay: {
            delay: 5000,
        },
        speed: 1000,
        slidesPerView: 6,
        spaceBetween: 20,
        loop: true,
        hasNavigation: true,
        grabCursor: true,
        breakpoints: {
            1025: {
                slidesPerView: 6
            },
            767: {
                slidesPerView: 4
            },
            230: {
                slidesPerView: 3
            }
        },
        pagination: {
        enabled: true,
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        },
   });
});

/**
 * Testimonial Swiper
 * Purpose: Carousel untuk testimonial cards dengan responsive layout
 */
$(function(){
    var swiperTestimonial = new Swiper('.swiper.swiperTestimonial',{
        autoplay: {
            delay: 5000,
        },
        speed: 1000,
        slidesPerView: 3,
        spaceBetween: 50,
        loop: true,
        hasNavigation: true,
        grabCursor: true,
        breakpoints: {
            1025:{
                slidesPerView: 3,
            },
            769:{
                slidesPerView: 2
            },
            319: {
                slidesPerView: 1,
            },
        },
    });
});
