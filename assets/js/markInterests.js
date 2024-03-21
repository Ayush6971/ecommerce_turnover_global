$(document).ready(function () {
    let currentPage = 1;
    let totalPages = null;
    function fetchCategories(page) {
        $.ajax({
            url: '/userCategories/categories',
            method: 'GET',
            data: { page: page },
            success: function (response) {
                $('#categories-list').empty();

                response?.categories?.forEach(category => {
                    const checkedAttribute = category.checked ? 'checked' : ''; // Determine if checkbox should be checked
                    $('#categories-list').append(`
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="category" value="${category.id}" ${checkedAttribute}>
                            <label class="form-check-label" for="${category.id}">
                                ${category.name}
                            </label>
                        </div>
                    `);
                });

                currentPage = response.currentPage;
                totalPages = response.totalPages;

                $('#prev-page').toggleClass('disabled', currentPage === 1);
                $('#next-page').toggleClass('disabled', currentPage === response.totalPages);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching categories:', error);
            }
        });
    }

    fetchCategories(currentPage);

    $('#prev-page').on('click', function (event) {
        event.preventDefault();
        if (currentPage > 1) {
            fetchCategories(currentPage - 1);
        }
    });

    $('#next-page').on('click', function (event) {
        event.preventDefault();
        if (currentPage < totalPages) {
            fetchCategories(currentPage + 1);
        }
    });


    $(document).on("change", "input[name='category']", function (event) {
        event.preventDefault();
        const categoryId = $(this).val();

        $.ajax({
            url: '/userCategories/add-remove-category',
            method: 'POST',
            data: { categoryId },
            success: function (response) {
                const successMessage = response.message || 'An error occurred during saving the category';
                const flashMessage = `<div class="alert alert-success flash-message">${successMessage}</div>`;
                $('#categories-list').before(flashMessage);
                $('.flash-message').delay(2000).last().fadeOut();
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.responseJSON.message || 'An error occurred during saving the category';
                const flashMessage = `<div class="alert alert-danger flash-message">${errorMessage}</div>`;
                $('#categories-list').before(flashMessage);
                $('.flash-message').delay(2000).last().fadeOut();
            }
        });
    });

    $('#logout-button').click(function () {
        $.ajax({
            url: '/auth/logout',
            method: 'GET',
            success: function (response) {
                window.location.href = '/auth/login';
            },
            error: function (xhr, status, error) {
                console.error('Error logging out:', error);
            }
        });
    });

});
