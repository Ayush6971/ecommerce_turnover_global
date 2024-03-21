$(document).ready(function () {
    $('#login-form').submit(function (event) {
        event.preventDefault();

        $('#login-form button[type="submit"]').prop('disabled', true);

        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').text('');

        const email = $('#email').val();
        const password = $('#password').val();

        if (!email.trim()) {
            $('#email').addClass('is-invalid');
            $('#email').next('.invalid-feedback').text('Email is required');
            $('#login-form button[type="submit"]').prop('disabled', false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#email').addClass('is-invalid');
            $('#email').next('.invalid-feedback').text('Invalid email format');
            $('#login-form button[type="submit"]').prop('disabled', false);
            return;
        }

        if (!password.trim()) {
            $('#password').addClass('is-invalid');
            $('#password').next('.invalid-feedback').text('Password is required');
            $('#login-form button[type="submit"]').prop('disabled', false);
            return;
        }

        $.ajax({
            url: '/auth/login',
            method: 'POST',
            data: { email, password },
            success: function (response) {
                console.log('Login successful:', response);
                window.location.href = '/userCategories/mark-interests'
            },
            error: function (xhr, status, error) {
                console.error('Login failed:', error);
                const errorMessage = xhr.responseJSON.message || 'An error occurred during login';
                const flashMessage = `<div class="alert alert-danger flash-message">${errorMessage}</div>`;
                $('#login-form').before(flashMessage);
                $('.flash-message').delay(2000).fadeOut('slow');
            },
            complete: function () {
                $('#login-form button[type="submit"]').prop('disabled', false); // Enable submit button after AJAX request completes
            }
        });
    });
});
