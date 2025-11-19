/**
 * ============================================================================
 * SWIPER-SCRIPT.JS - Inisialisasi Swiper Sliders
 * ============================================================================
 *
 * @description
 * Skrip ini menginisialisasi semua slider Swiper.js yang digunakan di website,
 * termasuk slider untuk partner logo dan testimonial.
 *
 * @dependensi Swiper.js
 * ============================================================================
 */

'use strict';

$(function () {
  /**
   * Inisialisasi Swiper untuk slider logo partner.
   * Slider ini akan berputar otomatis (autoplay) dan bersifat loop.
   */
  if ($('.swiper.swiperPartner').length) {
    const swiperPartner = new Swiper('.swiper.swiperPartner', {
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        230: {
          slidesPerView: 3,
        },
        767: {
          slidesPerView: 4,
        },
        1025: {
          slidesPerView: 6,
        },
      },
      grabCursor: true,
      loop: true,
      pagination: {
        clickable: true,
        el: '.swiper-pagination',
        enabled: true,
        type: 'bullets',
      },
      slidesPerView: 6,
      spaceBetween: 20,
      speed: 1000,
    });
  }

  /**
   * Inisialisasi Swiper untuk slider testimonial.
   * Slider ini akan berputar otomatis (autoplay) dan bersifat loop.
   */
  if ($('.swiper.swiperTestimonial').length) {
    const swiperTestimonial = new Swiper('.swiper.swiperTestimonial', {
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        319: {
          slidesPerView: 1,
        },
        769: {
          slidesPerView: 2,
        },
        1025: {
          slidesPerView: 3,
        },
      },
      grabCursor: true,
      loop: true,
      slidesPerView: 3,
      spaceBetween: 50,
      speed: 1000,
    });
  }
});
