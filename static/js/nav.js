$(document).ready(function () {
    $('.user-dropdown').click(function () {
        $(this).toggleClass('active');
    });

    // Close the dropdown when clicking outside of it
    $(document).click(function (event) {
        if (!$(event.target).closest('.user-dropdown').length) {
            $('.user-dropdown').removeClass('active');
        }
    });
});