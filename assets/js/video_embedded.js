/**
 * ============================================================================
 * VIDEO_EMBEDDED.JS - Logika Modal Video
 * ============================================================================
 *
 * @description
 * Skrip ini menangani fungsionalitas untuk membuka dan menutup modal yang
 * berisi video YouTube yang di-embed.
 *
 * @dependensi jQuery
 * ============================================================================
 */

'use strict';

$(function () {
  const $openModalButtons = $('.request-loader');
  const $overlay = $('#modal-overlay');
  const $closeModalButton = $('.my-close');
  const $videoFrame = $('#my-video-frame');

  /**
   * Membuka modal dan memuat video.
   * @param {string} videoUrl - URL video YouTube yang akan dimuat.
   */
  function openModal(videoUrl) {
    // Menambahkan parameter autoplay ke URL video
    const autoplayUrl = videoUrl.includes('?') ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`;
    $videoFrame.attr('src', autoplayUrl);
    $overlay.css('display', 'flex');
  }

  /**
   * Menutup modal dan menghentikan video.
   */
  function closeModal() {
    $overlay.hide();
    // Mengosongkan src akan menghentikan pemutaran video
    $videoFrame.attr('src', '');
  }

  // Event listener untuk tombol buka modal
  $openModalButtons.on('click', function () {
    const videoUrl = $(this).data('video');
    if (videoUrl) {
      openModal(videoUrl);
    }
  });

  // Event listener untuk tombol tutup modal
  $closeModalButton.on('click', closeModal);

  // Event listener untuk menutup modal saat mengklik di luar konten
  $overlay.on('click', function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Event listener untuk menutup modal dengan tombol Escape
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $overlay.is(':visible')) {
      closeModal();
    }
  });
});
