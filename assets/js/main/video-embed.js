/* ================================================================
 * VIDEO EMBED MODAL
 * ================================================================
 * Purpose: Modal player untuk embedded video (YouTube, Vimeo)
 * 
 * Features:
 * - Lazy loading video iframe
 * - Keyboard accessibility (ESC to close)
 * - Auto-stop video on close
 * 
 * Dependencies: jQuery
 * ================================================================ */

$(function() {
  try {
    const $openModalButtons = $('.request-loader');
    const $overlay = $('#modal-overlay');
    const $closeModal = $('.my-close');
    const $videoFrame = $('#my-video-frame');

    if (!$overlay.length || !$videoFrame.length) {
      return;
    }

    if (!$openModalButtons.length) {
      return;
    }

    /**
     * Open Modal Handler
     * Purpose: Load dan display video modal dengan delay untuk performance
     */
    $openModalButtons.on('click', function(e) {
      try {
        e.preventDefault();
        const videoUrl = $(this).attr('data-video');
        if (!videoUrl) {
          return;
        }
        setTimeout(function() {
          $videoFrame.attr('src', videoUrl);
        }, 100);
        $overlay.css('display', 'flex').attr('aria-hidden', 'false');
      } catch (err) {
        // Silent error handling
      }
    });

    /**
     * Close Modal Handler
     * Purpose: Tutup modal dan stop video playback
     */
    $closeModal.on('click', function(e) {
      e.preventDefault();
      closeVideoModal();
    });

    $overlay.on('click', function(e) {
      if (e.target === this) {
        closeVideoModal();
      }
    });

    /**
     * Keyboard Accessibility
     * Purpose: Close modal dengan ESC key
     */
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && $overlay.is(':visible')) {
        closeVideoModal();
      }
    });

    /**
     * Close Video Modal Function
     * Purpose: Clear iframe source dan hide overlay
     */
    function closeVideoModal() {
      $videoFrame.attr('src', "");
      setTimeout(function() {
        $overlay.hide().attr('aria-hidden', 'true');
      }, 50);
    }
  } catch (err) {
    // Silent error handling
  }
});
