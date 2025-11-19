/**
 * ============================================================================
 * SUBMIT-FORM.JS - Logika Pengiriman Formulir
 * ============================================================================
 *
 * @description
 * Skrip ini menangani validasi dan umpan balik untuk formulir kontak dan
 * formulir langganan buletin.
 *
 * ============================================================================
 */

'use strict';

/**
 * Memvalidasi format alamat email.
 * @param {string} email - Alamat email yang akan divalidasi.
 * @returns {boolean} `true` jika email valid, `false` jika sebaliknya.
 */
function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

/**
 * Menampilkan pesan umpan balik (sukses atau error) dan menyembunyikannya setelah beberapa saat.
 * @param {jQuery} $messageElement - Elemen pesan yang akan ditampilkan.
 * @param {number} [duration=3000] - Durasi tampilan pesan dalam milidetik.
 */
function showFeedbackMessage($messageElement, duration = 3000) {
  $messageElement.removeClass('hidden');
  setTimeout(() => {
    $messageElement.addClass('hidden');
  }, duration);
}

/**
 * Inisialisasi handler untuk formulir kontak.
 */
function initSubmitContact() {
  $('#contactForm').on('submit', function (event) {
    event.preventDefault();
    const $form = $(this);
    const $email = $('#email');
    const $successMessage = $('#success-message');
    const $errorMessage = $('#error-message');

    if (validateEmail($email.val())) {
      $errorMessage.addClass('hidden');
      showFeedbackMessage($successMessage);
      $form[0].reset();
    } else {
      $successMessage.addClass('hidden');
      showFeedbackMessage($errorMessage);
    }
  });
}

/**
 * Inisialisasi handler untuk formulir langganan buletin.
 */
function initSubmitNewsletter() {
  $('#newsletterForm').on('submit', function (event) {
    event.preventDefault();
    const $form = $(this);
    const $email = $('#newsletter-email');
    const $successMessage = $('#newsletter-success');
    const $errorMessage = $('#newsletter-error');
    const $errorText = $email.next('.error-text');

    const emailValue = $email.val().trim();
    let isValid = true;

    if (!emailValue) {
      $email.addClass('error-border');
      $errorText.removeClass('hidden').text('This field is required');
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      $email.addClass('error-border');
      $errorText.text('Invalid email format').removeClass('hidden');
      isValid = false;
    } else {
      $email.removeClass('error-border');
      $errorText.addClass('hidden');
    }

    if (isValid) {
      showFeedbackMessage($successMessage);
      $form[0].reset();
    } else {
      showFeedbackMessage($errorMessage);
    }
  });
}
