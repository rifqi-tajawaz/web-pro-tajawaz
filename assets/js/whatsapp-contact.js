/**
 * ============================================================================
 * WHATSAPP-CONTACT.JS - Handler Formulir Kontak ke WhatsApp
 * ============================================================================
 *
 * @description
 * Skrip ini menangani validasi dan pengiriman data dari formulir kontak
 * ke WhatsApp dengan format pesan yang sudah ditentukan.
 *
 * @dependensi Tidak ada (Vanilla JS)
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // ============================================================================
  // KONSTANTA & ELEMEN DOM
  // ============================================================================
  const WHATSAPP_NUMBER = '6281945967926'; // Nomor WhatsApp tujuan
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  if (!contactForm) return;

  // ============================================================================
  // FUNGSI UTAMA
  // ============================================================================

  /**
   * Menangani event submit pada formulir kontak.
   * @param {Event} e - Event object.
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    // Mengambil nilai dari form
    const formData = new FormData(contactForm);
    const firstName = formData.get('first-name').trim();
    const lastName = formData.get('last-name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim();
    const message = formData.get('message').trim();

    // Validasi
    if (!email || !message) {
      showError('Email dan Pesan harus diisi!');
      return;
    }
    if (!isValidEmail(email)) {
      showError('Format email tidak valid!');
      return;
    }

    // Membangun pesan WhatsApp
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Calon Client';
    const whatsappMessage = buildWhatsAppMessage(fullName, email, subject, message);
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Menampilkan pesan sukses dan mengarahkan ke WhatsApp
    showSuccess();
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
      setTimeout(() => {
        contactForm.reset();
        hideMessages();
      }, 1000);
    }, 3000);
  }

  // ============================================================================
  // FUNGSI PEMBANTU (HELPERS)
  // ============================================================================

  /**
   * Membangun string pesan untuk WhatsApp.
   * @param {string} name - Nama lengkap pengirim.
   * @param {string} email - Email pengirim.
   * @param {string} subject - Subjek pesan.
   * @param {string} message - Isi pesan.
   * @returns {string} Pesan yang sudah diformat.
   */
  function buildWhatsAppMessage(name, email, subject, message) {
    const now = new Date().toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta',
    });
    let msg = `*PESAN BARU DARI WEBSITE TAJAWAZ SOLUTIONS*\n\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `👤 *Nama:*\n${name}\n\n`;
    msg += `📧 *Email:*\n${email}\n\n`;
    if (subject) {
      msg += `📌 *Subjek:*\n${subject}\n\n`;
    }
    msg += `💬 *Pesan:*\n${message}\n\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `_Dikirim melalui Form Kontak Website_\n`;
    msg += `_${now}_`;
    return msg;
  }

  /**
   * Memvalidasi format email.
   * @param {string} email - Alamat email.
   * @returns {boolean} `true` jika valid.
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Menampilkan pesan sukses.
   */
  function showSuccess() {
    hideMessages();
    if (successMessage) {
      successMessage.classList.remove('hidden');
      successMessage.style.display = 'flex';
      successMessage.innerHTML = `
        <span class="check-icon"><i class="fa-solid fa-circle-check"></i></span>
        <p>Berhasil! Anda akan diarahkan ke WhatsApp...</p>`;
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Menampilkan pesan error.
   * @param {string} customMessage - Pesan error yang akan ditampilkan.
   */
  function showError(customMessage) {
    hideMessages();
    if (errorMessage) {
      errorMessage.classList.remove('hidden');
      errorMessage.style.display = 'flex';
      errorMessage.innerHTML = `
        <span class="cross-icon"><i class="fa-solid fa-circle-xmark"></i></span>
        <p>${customMessage || 'Oops! Terjadi kesalahan.'}</p>`;
      errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(hideMessages, 5000);
    }
  }

  /**
   * Menyembunyikan semua pesan umpan balik.
   */
  function hideMessages() {
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  contactForm.addEventListener('submit', handleFormSubmit);

  if (emailInput) {
    emailInput.addEventListener('blur', function () {
      this.style.borderColor = this.value && !isValidEmail(this.value) ? '#ef4444' : '';
    });
    emailInput.addEventListener('input', function () {
      this.style.borderColor = '';
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', function () {
      this.style.borderColor = !this.value.trim() ? '#ef4444' : '';
    });
    messageInput.addEventListener('input', function () {
      this.style.borderColor = '';
    });
  }
});
