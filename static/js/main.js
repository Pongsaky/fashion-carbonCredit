const swiper = new Swiper('.swiper', {
    // Optional parameters
    loop: true,
    autoplay: {
        delay: 7000,
        disableOnInteraction: false
    },

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },


});

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

if (urlParams.get("success") == 1) {
    console.log("HEE")
    document.querySelector(".dialogue").classList.add("success")
}