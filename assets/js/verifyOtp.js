$(document).ready(function () {
    $('#verify-form').submit(function (event) {
        event.preventDefault();

        $('#verify-button').prop('disabled', true);

        const email = $('#email').val();
        const otp = $('#otp').val();

        $.ajax({
            url: '/auth/verify',
            method: 'POST',
            data: { email, otp },
            success: function (response) {
                window.location.href = '/auth/login'
            },
            error: function (xhr, status, error) {
                console.error('Email verification failed:', error);
                const errorMessage = xhr.responseJSON.message || 'An error occurred during login';
                const flashMessage = `<div class="alert alert-danger" id="flash-message">${errorMessage}</div>`;
                $('#verify-form').before(flashMessage);
            },
            complete: function () {
                $('#verify-button').prop('disabled', false);
            }
        });
    });
});
