// main.js

var user_id = document.getElementById("user_id_placeholder").dataset.userId
var shopContainer = document.getElementById('shop-group')

const shop_style = ["Vintage", "Modern", "Minimalist"]

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", async function () {
    // Fetch product data from the backend API
    const response = await fetch(`/service/fetch-other-shop/${user_id}`, {
        method: "GET",
        headers: { "Content-type": "application/json" }
    });

    const shops = await response.json();
    console.log(shops)

    // console.log(shopContainer.innerHMTL)
    console.log(shopContainer)

    // Create HTML elements to display each product
    shops.forEach(shop => {
        let first_price_range = getRandomInt(240, 400);
        let second_price_range = getRandomInt(first_price_range, 600)
        let shop_template = `<div class="shop" data-shop-id=${shop['id']}>
                <div class="shop-img-wrapper">
                    <img src="${shop['shop_image'].replace(/"/g, "")}" alt="T-shirt-preview">
                </div>
                <div class="shop-desc">
                    <h1 class="shop-name">${shop['name']}</h1>
                    <div class="category-group">
                        <span class="category">${shop_style[getRandomInt(0, shop_style.length-1)]}</span>
                    </div>
                    <h3 class="price"><span>${first_price_range} - ${second_price_range}</span> THB</h3>
                    <div class="star-group">
                        <div class="star">00000</div>
                        <span class="user-rating">4,789 +</span>
                    </div>
                </div>
            </div>`

        shopContainer.innerHTML += shop_template
    });
});

// Click shop element to Product page's Shop

document.getElementById("shop-group").addEventListener("click", (event) => {
    // console.log(event.target)
    const shopID = event.target.closest(".shop").dataset.shopId;
    console.log(shopID)
    if (shopID) {
        window.location.href = `/select_product?shop_id=${shopID}`;
    }

})

