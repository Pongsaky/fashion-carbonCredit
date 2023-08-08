// fetch orderDB
var user_id = document.getElementById("user_id_placeholder").dataset.userId;

const header_template = `<div class="cart-group">
                            <div class="shop-header">
                                <div class="check-box">
                                    <input type="checkbox" name="select-shop" id="select-shop" class="select-checkbox">
                                </div>
                                <h2 class="shop-name">%shop_name</h2>
                            </div>
                         `

const orderProduct_template = `<div class="product-in-cart cart-table-row" data-order-id=%order_id data-shop-id=%shop_id data-index=%index>
                <div class="check-box">
                    <input type="checkbox" name="select-product" class="select-checkbox">
                </div>

                <div class="product-detail">
                    <div class="product-img-wrapper">
                        <img src=%product_image alt="product-image">
                    </div>
                    <div class="product-desc">
                        <h1 class="product-name">%product_name</h1>
                        $category-group
                        
                        <div class="net-zero-check">
                            <input type="checkbox" name="net-zero" class="net-zero" %neutral_mark>
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

function getOrderProductHTML(order_id, shop_id, product_name, product_image, neutral_mark, categoryHTML, sizeHTML, index) {
    // select property
    return orderProduct_template.replace("%order_id", order_id)
                                .replace('%shop_id', shop_id)
                                .replace("%product_image", product_image)
                                .replace("%product_name", product_name)
                                .replace("%neutral_mark", (neutral_mark == 1) ? "checked" : "")
                                .replace("$category-group", categoryHTML)
                                .replace("$amount-size", sizeHTML)
                                .replace("%index", index)
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

        if (property_template[key][value] != undefined){
            childCategory.innerHTML = property_template[key][value]
            categoryGroup.appendChild(childCategory)
        }
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
        // console.log(size, size_amount)
        if (size_amount > 0) {
            // console.log(key, value)
            const sizeDiv = document.createElement("div");
            sizeDiv.classList.add("amount-per-size")

            const childSpan = document.createElement("span");
            childSpan.classList.add("size")
            childSpan.innerHTML = size

            const childDiv = document.createElement("div");
            childDiv.classList.add("amount-group")
            childDiv.innerHTML = `  <button type="button" class="amount-btn minus-btn">-</button>
                                <input type="number" name="${size}-amount" id="${size}-amount" class="amount-number-input" value="${size_amount}">
                                <button type="button" class="amount-btn plus-btn">+</button>`

            sizeDiv.appendChild(childSpan)
            sizeDiv.appendChild(childDiv)

            amountDiv.appendChild(sizeDiv)
        }
    })
    // return Category HTML and replace it
    return amountDiv.outerHTML
}

const cartArea = document.getElementById("cart")

document.addEventListener("DOMContentLoaded", async () => {

    // Set Template property
    const propertyResponse = await fetch("/type/1", { method: "GET" })
    const type_res = await propertyResponse.json()
    const property_template = JSON.parse(type_res['property'])
    property_template["sleeve"] = property_template['sleeve-length']

    // Fetch Order DB
    const response = await fetch(`/service/fetch-order/${user_id}`)
    const orders = await response.json()
    // console.log(orders)

    let index = -1;
    let i = 0;

    let HTML_render = ``
    const pricePerItem = 300;

    orders.forEach((order) => {

        console.log(order)

        if (index !== order['shop_id']) {

            if (i != 0) HTML_render += '</div>'
            // Add header when shop change
            HTML_render += getHeaderHTML(order['shop_name'])
            index = order['shop_id']
        }

        // Add catrgory
        let categoryHTML = getCategoryHTML(JSON.parse(order['select_property']), property_template)

        // Add size amount
        let sizeHTML = getSizeHTML(JSON.parse(order['select_property']))

        let HTML_image
        if (order['order_image']) {
            // console.log("HELLO")
            HTML_image = order['order_image'].replace(/"/g, "")
        } else {
            HTML_image = JSON.parse(order['product_image'])[1].replace(/"/g, "")
        }

        // Add order product 
        HTML_render += getOrderProductHTML(order['id'], order['shop_id'], order['product_name'], 
                                            HTML_image, 
                                            order['neutral_mark'], categoryHTML, sizeHTML, i)


        i += 1
        // This if have problem in case of have two shop
        // put </div> only last order but when shop change?
        if (i == orders.length) {
            HTML_render += '</div>'
        }
        
    })

    cartArea.innerHTML += HTML_render

    // Change total product and total price

    cartArea.querySelectorAll(".amount").forEach(amountDiv => {
        let total_price = 0;
        let total_item = 0;
        const productInCart = amountDiv.closest(".product-in-cart")

        amountDiv.querySelectorAll(".amount-per-size").forEach((amountPerSize) => {
            const amount = parseInt(amountPerSize.querySelector("input").value);
            const price = productInCart.querySelector(".price > span").innerText

            total_item += amount
            total_price += parseInt(price.split(" ")[0]) * amount
        })
        

        productInCart.innerHTML = productInCart.innerHTML.replace("%total-product", total_item).replace("%total-price", total_price)
    })

    document.getElementById("cart").addEventListener("click", (event) => {
        const target = event.target;

        if (target.tagName === "INPUT" && target.type === "checkbox" && !(target.className).includes("net-zero")) {
            // click select-product
            if (target.name === "select-product") {

                // Uncheck
                if (!target.checked) {
                    let product_element = target.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    allPrice -= price;
                    allItems -= total_product;
                } else {
                    let product_element = target.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    // console.log("HELLO")

                    allPrice += price;
                    allItems += total_product;
                }
            }

            else if (target.id == "select-shop") selcetShopCheckbox();
            else if (target.id == "select-all") selectAllCheckbox();

        } else if ((target.className).includes("amount-btn")) {

            if ((target.className).includes("plus-btn")) {

                let parent = target.parentElement;
                let amount = parent.children[1];
                amount.value = (parseInt(amount.value) + 1).toString()

                // Update Price
                // product in cart part
                let productInCart = target.closest(".product-in-cart")
                const pricePerItem = productInCart.querySelector(".price > span")
                let totalProduct = productInCart.querySelector(".total-product > span")
                let totalPrice = productInCart.querySelector(".total-price > span")

                let current_price = parseInt(totalPrice.innerText)
                let current_item = parseInt(totalProduct.innerText)

                totalProduct.innerText = current_item + 1
                totalPrice.innerHTML = current_price + parseInt(pricePerItem.innerText)

                // console.log((productInCart.querySelector("input[type='checkbox']")).checked == 1)
                if ((productInCart.querySelector("input[type='checkbox']")).checked == 1) {
                    allItems += 1
                    allPrice += 1 * parseInt(pricePerItem.innerText)
                }

            } else {

                let parent = target.parentElement;
                let amount = parent.children[1];
                if (amount.value > 1) amount.value -= 1

                // Update Price
                // product in cart part
                let productInCart = target.closest(".product-in-cart")
                const pricePerItem = productInCart.querySelector(".price > span")
                let totalProduct = productInCart.querySelector(".total-product > span")
                let totalPrice = productInCart.querySelector(".total-price > span")

                let current_price = parseInt(totalPrice.innerText)
                let current_item = parseInt(totalProduct.innerText)

                totalProduct.innerText = current_item - 1
                totalPrice.innerHTML = current_price - parseInt(pricePerItem.innerText)

                if ((productInCart.querySelector("input[type='checkbox']")).checked == 1) {
                    allItems -= 1
                    allPrice -= 1 * parseInt(pricePerItem.innerText)
                }

            } 
        } else if ((target.className).includes("net-zero")) {
            
        }

        // Update Price
        document.getElementById("sum-item").querySelector("span").innerText = addCommasToNumber(allItems)
        document.getElementById("sum-price").querySelector("span").innerText = addCommasToNumber(allPrice)
        checkAllCheckbox();
        // console.log(allPrice, allItems)
    })

    // order Btn to checkout page

    const orderBtn = document.getElementById("order-btn")

    orderBtn.addEventListener("click", async () => {
        let allCheckbox_checked = document.querySelectorAll(".select-checkbox:not(#select-all):not(#select-shop):checked");
        // console.log(allCheckbox_checked);

        let orderData = {};

        allCheckbox_checked.forEach(checkbox_checked => {
            let subObj = {}
            // Find product element
            let productInCart = checkbox_checked.closest(".product-in-cart")
            const product_shopID = productInCart.dataset.shopId;
            const product_orderID = productInCart.dataset.orderId;
            const product_index = productInCart.dataset.index

            if (!(product_shopID in orderData)) orderData[product_shopID] = []

            subObj['orderId'] = product_orderID
            subObj['net-zero'] = productInCart.querySelector("input[name='net-zero']").checked
            subObj['pricePerItem'] = parseInt(productInCart.querySelector(".price > span").innerText)

            const sizeObj = {}
            productInCart.querySelectorAll(".amount-per-size").forEach((sizeDiv) => {
                let size = sizeDiv.querySelector("span").innerText;
                let amount = parseInt(sizeDiv.querySelector("input").value);
                sizeObj[size] = amount
            })

            subObj["size"] = sizeObj

            orderData[product_shopID].push(subObj)
            // Send data in form [ {option each product} ] After add with js in checkout page

            // Update Net-zero and amount size
            let update_property = JSON.parse(orders[product_index]['select_property'])
            update_property["size"] = subObj["size"]
            console.log(update_property)

            orders[product_index]['neutral_mark'] = subObj["net-zero"]
            orders[product_index]['select_property'] = update_property

            // Re stucture of orders
            const order_col = ["user_id", "product_id", "select_property", "neutral_mark", "status", "order_image"]
            const filteredObj = Object.fromEntries(Object.entries(orders[product_index]).filter(([key, value]) => order_col.includes(key)));
            filteredObj["user_id"] = user_id
            console.log(JSON.stringify(filteredObj))
            const res = fetch(`/order/${product_orderID}`, {
                method : "PUT",
                headers : {"Content-type" : "application/json"},
                body: JSON.stringify(filteredObj)
            })

            // if (res.ok) console.log(`Updated ${product_orderID} successfully`)
        })

        const response = await fetch("/checkout", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(orderData)
        })

        if (response.ok) {
            window.location.href = "/checkout"
        }

        console.log(orderData)
    })

})

// Select check box part

// console.log(select_checkboxs)


function allTrue(arr) {
    for (const i of arr) {
        if (i.checked == false) return false;
    }

    return true;
}

function selcetShopCheckbox() {
    // select-shop-checkbox
    let select_shop_checkboxs = document.querySelectorAll("input[name='select-shop']");
    select_shop_checkboxs.forEach(select_shop_checkbox => {
        // select_shop_checkbox.addEventListener("click", () => {
        let shop = select_shop_checkbox.parentElement.parentElement.parentElement; // div.cart-group
        let select_product_checkboxs = shop.querySelectorAll("input[name='select-product']")

        if (select_shop_checkbox.checked === true) {
            for (const select_product_checkbox of select_product_checkboxs) {

                if (select_product_checkbox.checked === false) {
                    let product_element = select_product_checkbox.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    allPrice += price;
                    allItems += total_product;

                    select_product_checkbox.checked = true;
                }
            }
        } else {
            for (const select_product_checkbox of select_product_checkboxs) {

                if (select_product_checkbox.checked === true) {
                    let product_element = select_product_checkbox.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    allPrice -= price;
                    allItems -= total_product;

                    select_product_checkbox.checked = false;
                }

            }
        }
        // })
    })
}

function selectAllCheckbox() {
    // select-all-checkbox
    let select_all_checkbox = document.getElementById("select-all");
    let select_checkboxs = document.querySelectorAll(".select-checkbox:not(#select-all)");

    // select_all_checkbox.addEventListener("click", () => {

        if (select_all_checkbox.checked === true) {
            for (const select_checkbox of select_checkboxs) {
                // select_checkbox.checked = true;
                if (select_checkbox.checked === false && select_checkbox.id !== "select-shop") {
                    // console.log(select_checkbox)
                    let product_element = select_checkbox.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    allPrice += price;
                    allItems += total_product;

                }
                select_checkbox.checked = true;

            }
        } else {
            for (const select_checkbox of select_checkboxs) {
                if (select_checkbox.checked === true && select_checkbox.id !== "select-shop") {
                    // console.log(select_checkbox)
                    let product_element = select_checkbox.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    allPrice -= price;
                    allItems -= total_product;
                }
                select_checkbox.checked = false;
            }
        }
    // })
}

function checkAllCheckbox() {
    let select_all_checkbox = document.getElementById("select-all");
    let select_checkboxs = document.querySelectorAll(".select-checkbox:not(#select-all)");
    // console.log(select_checkboxs)

    select_checkboxs.forEach(select_checkbox => {
        // select_checkbox.addEventListener("click", () => {
            // 
            let shop = select_checkbox.closest(".cart-group");
            // console.log(shop)
            // if (select_checkbox.checked === false) {
            //     shop.querySelector("#select-shop").checked = false;
            //     select_all_checkbox.checked = false;
            // }
            // check Selcet-shop
            let checkbox_in_shop = shop.querySelectorAll("input[name='select-product']")
            if (allTrue(checkbox_in_shop)) {
                shop.querySelector("#select-shop").checked = true;
            } else {
                shop.querySelector("#select-shop").checked = false;
            }

            // check Selcet-all
            if (allTrue(select_checkboxs)) {
                select_all_checkbox.checked = true;
            } else {
                select_all_checkbox.checked = false;
            }
        // })
    })
}


// Check update price
var allPrice = 0;
var allItems = 0;

function addCommasToNumber(number) {
    // Convert the number to a string
    let numberString = number.toString();

    // Split the string into integer and decimal parts (if any)
    const [integerPart, decimalPart] = numberString.split(".");

    // Add commas to the integer part
    const numberWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // If there is a decimal part, combine it with the integer part
    if (decimalPart) {
        return numberWithCommas + "." + decimalPart;
    } else {
        return numberWithCommas;
    }
}

