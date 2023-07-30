const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var shop_id = urlParams.get("shop_id")
var product_container = document.getElementById("product-group")
var product_message = document.getElementById("product-message")

// fetch product and show
document.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(`service/fetch-product/${shop_id}`, {
        method : "GET",
        headers : {"Content-type" : "application/json"}
    })

    const products = await response.json()

    if (products.length == 0) {
        product_message.innerHTML = "This shop have not product yet"
    }
    
    products.forEach(product => {
        let product_template = `<div class="product" data-product-id=${product['id']}>
                <div class="product-img-wrapper">
                    <img src="/static/image/t-shirt.png" alt="T-shirt-preview">
                </div>
                <div class="product-desc">
                    <h1 class="product-name">${product['name']}</h1>
                    <h2 class="shop-name">By Tanuson</h2>
                    <div class="category-group">
                        <span class="category">V-shirt</span>
                        <span class="category">Short</span>
                        <span class="category">White</span>
                        <span class="category">Street Fasion</span>
                        <span class="category">Oversized</span>
                        <span class="category">Velvet</span>
                    </div>
                    <h3 class="price"><span>350 - 450</span> THB</h3>
                    <div class="star-group">
                        <div class="star">00000</div>
                        <span class="user-rating">4,789 +</span>
                    </div>

                    <button type="button" class="add-btn">Add +</button>
                </div>
            </div>`

        product_container.innerHTML += product_template;
    })
})

// Click shop element to Product page's Shop

document.getElementById("product-group").addEventListener("click", (event) => {
    // console.log(event.target)
    const productID = event.target.closest(".product").dataset.productId;
    console.log(productID)
    if (productID) {
        window.location.href = `/product?product_id=${productID}`;
    }

})
