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

document.addEventListener(("DOMContentLoaded"), async () => {

    // Update main page content
    const numberCCField = document.getElementById("number-cc")
    const costCCField = document.getElementById("cost-cc")
    const numberProductField = document.getElementById("cost-product")

    const orderRes = await fetch("/order/", {
        method : "GET"
    })

    const orders = await orderRes.json() 

    let productNumber = 0;
    let pricePerItem = 300;
    let ccNumber = 0;
    let ccPrice = 0;

    Object.entries(orders).forEach((entry) => {
        [orderID, value] = entry
        // console.log(value)

        if (value['status'] == 1) {
            // process size data
            const select_property = JSON.parse(value["select_property"])
            const fabricType = select_property['fabric']
            // console.log(select_property)
            const isNetZero = value['neutral_mark']

            Object.entries(select_property['size']).forEach((size_entry) => {
                const [sizeName, sizeAmount] = size_entry

                productNumber += parseInt(sizeAmount)

                if (isNetZero == 1) {

                    if (fabricType == 0) {
                        ccNumber += 6 * parseInt(sizeAmount)
                        ccPrice += 6 * parseInt(sizeAmount) * 0.1
                    }

                    if (fabricType == 1) {
                        ccNumber += 11.7 * parseInt(sizeAmount)
                        ccPrice += 11.7 * parseInt(sizeAmount) * 0.1
                    }

                }
            })
        }
    })

    numberCCField.innerText = ccNumber.toFixed(2)
    costCCField.innerText = ccPrice.toFixed(2)
    numberProductField.innerText = productNumber * pricePerItem

})
