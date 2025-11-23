/* ================================================================
 * FORM SUBMISSION HANDLERS (PRODUCTION)
 * ================================================================
 * Purpose: Secure form submission with CSRF protection and validation
 * Dependencies: jQuery
 * ================================================================ */

/**
 * Fetch CSRF Token
 * Purpose: Get security token for form submissions
 */
async function getCsrfToken() {
    try {
        const response = await fetch('api/csrf.php');
        const data = await response.json();
        return data.data.csrf_token;
    } catch (error) {
        console.error('CSRF token fetch error:', error);
        return '';
    }
}

/**
 * Initialize Contact Form
 */
function initSubmitContact() {
    $('#contactForm').on('submit', async function (event) {
        event.preventDefault();

        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"]');
        const $successMessage = $('#success-message');
        const $errorMessage = $('#error-message');

        // Reset messages
        $successMessage.addClass('hidden');
        $errorMessage.addClass('hidden');
        $submitBtn.prop('disabled', true).text('Sending...');

        // Client-side Validation
        const formData = new FormData(this);
        const email = formData.get('email');

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            $errorMessage.text('Invalid email format').removeClass('hidden');
            $submitBtn.prop('disabled', false).text('Send Message');
            return;
        }

        // Get CSRF Token
        const csrfToken = await getCsrfToken();
        formData.append('csrf_token', csrfToken);

        try {
            const response = await fetch('api/form-process.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                $successMessage.removeClass('hidden');
                $form[0].reset();
            } else {
                $errorMessage.text(result.message || 'Failed to send message').removeClass('hidden');
            }
        } catch (error) {
            $errorMessage.text('Network error. Please try again.').removeClass('hidden');
        } finally {
            $submitBtn.prop('disabled', false).text('Send Message');

            // Auto-hide messages
            setTimeout(() => {
                $successMessage.addClass('hidden');
                $errorMessage.addClass('hidden');
            }, 5000);
        }
    });
}

/**
 * Initialize Newsletter Form
 */
function initSubmitNewsletter() {
    $('#newsletterForm').on('submit', async function(event) {
        event.preventDefault();

        const $form = $(this);
        const $emailInput = $('#newsletter-email');
        const $successMessage = $('#newsletter-success');
        const $errorMessage = $('#newsletter-error');
        const $errorText = $emailInput.next('.error-text');
        const $submitBtn = $form.find('button[type="submit"]');

        const email = $emailInput.val().trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Validation
        if (!email) {
            $emailInput.addClass('error-border');
            $errorText.removeClass('hidden').text('This field is required');
            return;
        }
        if (!emailPattern.test(email)) {
            $emailInput.addClass('error-border');
            $errorText.removeClass('hidden').text('Invalid email format');
            return;
        }

        $emailInput.removeClass('error-border');
        $errorText.addClass('hidden');
        $submitBtn.prop('disabled', true);

        // Prepare Data
        const formData = new FormData();
        formData.append('email', email);
        const csrfToken = await getCsrfToken();
        formData.append('csrf_token', csrfToken);

        try {
            const response = await fetch('api/newsletter-process.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                $successMessage.removeClass('hidden');
                $form[0].reset();
            } else {
                $errorMessage.removeClass('hidden');
            }
        } catch (error) {
            $errorMessage.removeClass('hidden');
        } finally {
            $submitBtn.prop('disabled', false);
            setTimeout(() => {
                $successMessage.addClass('hidden');
                $errorMessage.addClass('hidden');
            }, 3000);
        }
    });
}
