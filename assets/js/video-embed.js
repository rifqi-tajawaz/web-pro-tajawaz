$(function() {
  try {
    const $openModalButtons = $('.request-loader');
    const $overlay = $('#modal-overlay');
    const $closeModal = $('.my-close');
    const $videoFrame = $('#my-video-frame');

    // Check if this page has video modal functionality
    if (!$overlay.length || !$videoFrame.length) {
      // Silently return if modal elements don't exist (not all pages have video)
      return;
    }

    if (!$openModalButtons.length) {
      // Silently return if modal exists but no trigger buttons found
      return;
    }

    $openModalButtons.on('click', function(e) {
      try {
        e.preventDefault();
        const videoUrl = $(this).attr('data-video');
        if (!videoUrl) {
          // Silently return if video URL not found
          return;
        }
        // Delay loading iframe to prevent immediate tracking requests
        setTimeout(function() {
          $videoFrame.attr('src', videoUrl);
        }, 100);
        $overlay.css('display', 'flex').attr('aria-hidden', 'false');
      } catch (err) {
        // Silently handle video opening errors
      }
    });

    $closeModal.on('click', function(e) {
      e.preventDefault();
      closeVideoModal();
    });

    $overlay.on('click', function(e) {
      if (e.target === this) {
        closeVideoModal();
      }
    });

    // Keyboard accessibility - close on ESC
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && $overlay.is(':visible')) {
        closeVideoModal();
      }
    });

    function closeVideoModal() {
      // Clear iframe src first to stop video and prevent further tracking
      $videoFrame.attr('src', "");
      setTimeout(function() {
        $overlay.hide().attr('aria-hidden', 'true');
      }, 50);
    }
  } catch (err) {
    // Silently handle initialization errors
  }
});