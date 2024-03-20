$(document).ready(function () {
    $('#signup-form').submit(function (event) {
        event.preventDefault();

        $('#signup-form button[type="submit"]').prop('disabled', true);

        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').text('');

        const username = $('#username').val();
        const email = $('#email').val();
        const password = $('#password').val();

        if (!username.trim()) {
            $('#username').addClass('is-invalid');
            $('#username').next('.invalid-feedback').text('Username is required');
            $('#signup-form button[type="submit"]').prop('disabled', false);
            return;
        }

        if (!email.trim()) {
            $('#email').addClass('is-invalid');
            $('#email').next('.invalid-feedback').text('Email is required');
            $('#signup-form button[type="submit"]').prop('disabled', false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#email').addClass('is-invalid');
            $('#email').next('.invalid-feedback').text('Invalid email format');
            $('#signup-form button[type="submit"]').prop('disabled', false);
            return;
        }

        if (!password.trim()) {
            $('#password').addClass('is-invalid');
            $('#password').next('.invalid-feedback').text('Password is required');
            $('#signup-form button[type="submit"]').prop('disabled', false);
            return;
        }

        $.ajax({
            url: '/auth/signUp',
            method: 'POST',
            data: { username, email, password },
            success: function (response) {
                console.log('Sign-up successful:', response);
                // Redirect or show success message as needed
            },
            error: function (xhr, status, error) {
                console.error('Sign-up failed:', error);
                const errorMessage = xhr.responseJSON.message || 'An error occurred during sign-up';
                const flashMessage = `<div class="alert alert-danger" id="flash-message">${errorMessage}</div>`;
                $('#signup-form').before(flashMessage);
            },
            complete: function () {
                $('#signup-form button[type="submit"]').prop('disabled', false);
            }
        });
    });
});
