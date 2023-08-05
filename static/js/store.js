var shop_id = document.getElementById("shop_id_placeholder").dataset.shopId
var product_container = document.getElementById("product-group")
var product_message = document.getElementById("product-message")

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.get("success") == 1) {
    document.querySelector(".dialogue").classList.add("success")
}

// fetch product and show
document.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(`service/fetch-product/${shop_id}`, {
        method: "GET",
        headers: { "Content-type": "application/json" }
    })

    const products = await response.json()
    console.log(products)

    if (products.length == 0) {
        product_message.innerHTML = "This shop have not product yet"
    }

    // Test only

    const product_name = ["T-shirt-1", "T-shirt-2", "T-shirt-3"]
    const shop_img = ["/static/image/preview-product/green-shirt.jpg", "/static/image/preview-product/polyester-shirt.jpg", "/static/image/preview-product/mint-shirt.jpg"]
    const description = ["A classic and versatile wardrobe staple, this cotton T-shirt offers unbeatable comfort and breathability. Crafted from 100% natural cotton fibers, it provides a soft and smooth texture against the skin, making it ideal for everyday wear. Whether you're heading to the gym or just relaxing with friends, this cotton T-shirt will keep you cool and comfortable throughout the day.",
        "Designed for active individuals, this polyester performance T-shirt is engineered to wick away moisture and promote quick drying. The lightweight and durable fabric ensure a snug fit without restricting movement, making it perfect for sports and outdoor activities. Its moisture-wicking properties keep you dry and comfortable even during intense workouts or hot weather.",
        "ndulge in the luxurious softness of a modal T-shirt. Made from sustainably sourced beech tree pulp, modal fabric offers excellent draping and a silky-smooth texture. It is known for its ability to resist shrinking, fading, and pilling, ensuring your T-shirt remains in top-notch condition for a long time."]

    // Test only


    products.forEach((product, n) => {
        let product_template = `<div class="product" data-product-id=${product['id']}>
                <div class="product-img-wrapper">
                    <img src="${JSON.parse(product['product_image'])["1"].replace(/"/g, "") }" alt="T-shirt-preview">
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

                </div>
            </div>`

        // <button button type = "button" class="add-btn" id = "add-btn" > Add +</button >

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

const addProductBtn = document.getElementById("add-product-btn")

addProductBtn.addEventListener("click", () => {
    window.location.href = "/add_product"
})