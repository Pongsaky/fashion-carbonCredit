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
                            <input type="checkbox" name="net-zero" class="net-zero" checked=%neutral_mark disabled>
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
            .replace("%neutral_mark", neutral_mark)
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

            checkouts.forEach((checkout) => {

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

                // Add checkout product
                HTML_render += getOrderProductHTML(checkout['id'], checkout['shop_id'], checkout['product_name'],
                    JSON.parse(checkout['product_image'])[1].replace(/"/g, ""),
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

            cartArea.querySelectorAll(".amount-group").forEach(amountDiv => {
                const amount = parseInt(amountDiv.querySelector("input").value);

                const productInCart = amountDiv.closest(".product-in-cart")
                const price = productInCart.querySelector(".price").innerText
                let total_price = parseInt(price.split(" ")[0]) * amount

                productInCart.innerHTML = productInCart.innerHTML.replace("%total-product", amount).replace("%total-price", total_price)
            })
            
        }) 

        document.getElementById("cart").addEventListener("click", (event) => {
                // console.log("HEELL")
                const target = event.target;

                const cart = target.closest(".cart")

                let totalItem = 0
                let totalProductPrice = 0

                // console.log(cart.querySelectorAll(".conclude"))
                cart.querySelectorAll(".conclude").forEach((conclude) => {
                    totalItem += parseInt(conclude.querySelector(".total-product > span").innerText)
                    totalProductPrice += parseInt(conclude.querySelector(".total-price > span").innerText)
                })

                let ccPrice = totalItem * 0.2
                let orderPrice = totalProductPrice + ccPrice

                const footer = document.querySelector(".footer")
                footer.querySelector(".product-price > span").innerText = totalProductPrice
                footer.querySelector(".cc-support > span").innerText = ccPrice
                footer.querySelector(".total-order > span").innerText = orderPrice
        });

    })

    
}


function purchase(productSelected) {
    const purchaseBtn = document.getElementById("purchase-btn");
    var user_id = document.getElementById("user_id_placeholder").dataset.userId;

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

            fetch('/checkout', {
                method: "POST", 
                body: JSON.stringify({
                    user_id : user_id,
                    data: productSelected
                })
            }).then((res) => {
                if (res.ok) window.location.href = "/"
            })

            // if (response.ok) window.location.href = "/"
        })
    })

}
