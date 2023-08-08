var total_product_price = 0;
var total_all_item = 0;
var total_cc_price = 0;
var total_cc_item = 0;

function fetchSelectedProduct(productSelected) {
    // console.log(productSelected)
    const header_template = `<div class="cart-group">
                            <div class="shop-header">
                                <h2 class="shop-name">%shop_name</h2>
                            </div>
                         `

    const orderProduct_template = `<div class="product-in-cart cart-table-row" data-order-id=%order_id data-shop-id=%shop_id>


                <div class="product-detail">
                    <div class="product-img-wrapper">
                        <img src=%product_image alt="product-image">
                    </div>
                    <div class="product-desc">
                        <h1 class="product-name">%product_name</h1>
                        $category-group
                        
                        <div class="net-zero-check">
                            <input type="checkbox" name="net-zero" class="net-zero" %neutral_mark disabled>
                            <label for="net-zero" class="net-zero-label">Net-Zero</label>
                        </div>
                    </div>
                </div>

                <div class="price-per-item">
                    <h3 class="price">
                        <span>300</span> THB
                    </h3>
                </div>

                $amount-size
                
                <div class="conclude">
                    <h5 class="total-product"><span>%total-product</span> Item</h5>
                    <h5 class="total-price"><span>%total-price</span> THB</h5>
                </div>
            </div>`

    function getHeaderHTML(shop_name) {
        return header_template.replace("%shop_name", shop_name)
    }

    function getOrderProductHTML(order_id, shop_id, product_name, product_image, neutral_mark, categoryHTML, sizeHTML) {
        // select property
        return orderProduct_template.replace("%order_id", order_id)
            .replace('%shop_id', shop_id)
            .replace("%product_image", product_image)
            .replace("%product_name", product_name)
            .replace("%neutral_mark", (neutral_mark == 1) ? "checked" : "")
            .replace("$category-group", categoryHTML)
            .replace("$amount-size", sizeHTML)
    }

    function getCategoryHTML(select_property, property_template) {
        // console.log(select_property)
        const categoryGroup = document.createElement("div");
        categoryGroup.classList.add("category-group")

        Object.entries(select_property).forEach(entry => {
            const [key, value] = entry;
            const childCategory = document.createElement("span");
            childCategory.classList.add("category")

            // Encode from select_property to Text for category
            // console.log(property_template[key][value])
            childCategory.innerHTML = property_template[key][value]
            categoryGroup.appendChild(childCategory)
        })
        // return Category HTML and replace it
        return categoryGroup.outerHTML
    }

    function getSizeHTML(select_property) {
        // console.log(select_property)
        const amountDiv = document.createElement("div");
        amountDiv.classList.add("amount")

        Object.entries(select_property['size']).forEach(entry => {
            const [size, size_amount] = entry;
            if (size_amount > 0) {
                // console.log(key, value)
                const sizeDiv = document.createElement("div");
                sizeDiv.classList.add("amount-per-size")

                const childSpan = document.createElement("span");
                childSpan.classList.add("size")
                childSpan.innerHTML = size

                const childDiv = document.createElement("div");
                childDiv.classList.add("amount-group")
                childDiv.innerHTML = `<input type="number" name="${size}-amount" id="${size}-amount" class="amount-number-input" value="${size_amount}" readonly>`

                sizeDiv.appendChild(childSpan)
                sizeDiv.appendChild(childDiv)

                amountDiv.appendChild(sizeDiv)
            }
        })
        // return Category HTML and replace it
        return amountDiv.outerHTML
    }

    document.addEventListener("DOMContentLoaded", async () => {
        // Set Template property
        console.log(productSelected)

        const cartArea = document.getElementById("cart")
        const propertyResponse = await fetch("/type/1", { method: "GET" })
        const type_res = await propertyResponse.json()
        const property_template = JSON.parse(type_res['property'])
        property_template["sleeve"] = property_template['sleeve-length']

        // Fetch Order DB
        Object.entries(productSelected).forEach(async (entry) => {
            const [key, value] = entry
            let orderList = []

            for (data of value) {
                orderList.push(data['orderId'])
            }


            const response = await fetch(`/service/fetch-checkout/`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body : JSON.stringify(orderList)
            })

            const checkouts = await response.json()
            let index = -1;
            let i = 0;

            let HTML_render = ``
            const pricePerItem = 300;

            checkouts.forEach(async (checkout) => {

                console.log(checkout)

                if (index !== checkout['shop_id']) {

                    if (i != 0) HTML_render += '</div>'
                    // Add header when shop change
                    HTML_render += getHeaderHTML(checkout['shop_name'])
                    index = checkout['shop_id']
                }

                // Add catrgory
                let categoryHTML = getCategoryHTML(JSON.parse(checkout['select_property']), property_template)

                // Add size amount
                let sizeHTML = getSizeHTML(JSON.parse(checkout['select_property']))

                let HTML_image
                if (checkout['order_image']) {
                    // console.log("HELLO")
                    HTML_image = checkout['order_image'].replace(/"/g, "")
                } else {
                    HTML_image = JSON.parse(checkout['product_image'])[1].replace(/"/g, "")
                }

                // Add checkout product
                HTML_render += getOrderProductHTML(checkout['id'], checkout['shop_id'], checkout['product_name'],
                    HTML_image,
                    checkout['neutral_mark'], categoryHTML, sizeHTML)


                i += 1
                // This if have problem in case of have two shop
                // put </div> only last order but when shop change?
                if (i == checkout.length) {
                    HTML_render += '</div>'
                }

            })
            

            cartArea.innerHTML += HTML_render

            // Change total product and total price

            cartArea.querySelectorAll(".amount").forEach( async amountDiv => {
                let total_price = 0;
                let total_item = 0;
                const productInCart = amountDiv.closest(".product-in-cart")
                console.log(amountDiv)
                console.log(productInCart)

                amountDiv.querySelectorAll(".amount-per-size").forEach((amountPerSize) => {
                    const amount = parseInt(amountPerSize.querySelector("input").value);
                    const price = productInCart.querySelector(".price > span").innerText

                    total_item += amount
                    total_price += parseInt(price.split(" ")[0]) * amount
                })

                total_all_item += total_item
                total_product_price += total_price

                if (productInCart.querySelector("input[name='net-zero']").checked) {
                    total_cc_item += total_item
                }

                productInCart.innerHTML = productInCart.innerHTML.replace("%total-product", total_item).replace("%total-price", total_price)
            })
            
            // console.log(total_all_item)
            // console.log(total_product_price)
            // console.log(total_cc_price)

            // Update footer price

            const footer = document.querySelector(".footer")
            total_cc_price = total_cc_item * 0.2
            footer.querySelector(".product-price > span").innerText = total_product_price
            footer.querySelector(".cc-support > span").innerText = total_cc_price
            footer.querySelector(".total-order > span").innerText = total_product_price + total_cc_price

        })

    })
    
}

function purchase(productSelected) {
    const purchaseBtn = document.getElementById("purchase-btn");
    var user_id = document.getElementById("user_id_placeholder").dataset.userId;
    let product_price = parseInt(document.querySelector(".product-price > span").innerText)
    let cc_price = parseInt(document.querySelector(".cc-support > span").innerText)

    purchaseBtn.addEventListener("click", async () => {
        Object.entries(productSelected).forEach(async (entry) => {
            const [key, value] = entry
            let orderList = []

            for (data of value) {
                orderList.push(data['orderId'])
            }
            // Update status
            const response = await fetch(`/order/update_status/`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    orderList: orderList,
                    status: 1,
                })
            })
            // Insert checkoutDB

            console.log(JSON.stringify({
                    user_id : user_id,
                    data: productSelected,
                    product_price: total_product_price,
                    cc_price: total_cc_price
                }))

            fetch('/checkout/', {
                method: "POST",
                headers : {
                    "Content-type" : "application/json"
                },
                body: JSON.stringify({
                    user_id : user_id,
                    data: productSelected,
                    product_price: total_product_price,
                    cc_price: total_cc_price
                })
            }).then((res) => {
                if (res.ok) window.location.href = "/?success=1"
            })

            if (response.ok) window.location.href = "/"
        })
    })

}
