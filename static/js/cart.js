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

const orderProduct_template = `<div class="product-in-cart cart-table-row" data-order-id=%order_id>
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
                            <input type="checkbox" name="net-zero" class="net-zero" checked=%neutral_mark>
                            <label for="net-zero" class="net-zero-label">Net-Zero</label>
                        </div>
                    </div>
                </div>

                <div class="price-per-item">
                    <h3 class="price">
                        <span>300-450</span> THB
                    </h3>
                </div>

                $amount-size
                
                <div class="conclude">
                    <h5 class="total-product"><span>100</span> Item</h5>
                    <h5 class="total-price"><span>4,250</span> THB</h5>
                </div>
            </div>`

function getHeaderHTML(shop_name) {
    return header_template.replace("%shop_name", shop_name)
}

function getOrderProductHTML(order_id, product_name, product_image, neutral_mark, categoryHTML, sizeHTML) {
    // select property
    return orderProduct_template.replace("%order_id", order_id)
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

function getSizeHTML(select_property, property_template) {
    // console.log(select_property)
    const amountDiv = document.createElement("div");
    amountDiv.classList.add("amount")

    console.log(select_property['size'])

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
    console.log(orders)

    let index = -1;
    let i = 0;

    let HTML_render = ``
    // console.log(cartArea.innerHTML)

    orders.forEach((order) => {

        // console.log(order)

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

        // Add order product 
        HTML_render += getOrderProductHTML(order['id'], order['product_name'], 
                                            JSON.parse(order['product_image'])[1].replace(/"/g, ""), 
                                            order['neutral_mark'], categoryHTML, sizeHTML)


        i += 1
        // This if have problem in case of have two shop
        // put </div> only last order but when shop change?
        if (i == orders.length) {
            HTML_render += '</div>'
        }
        
    })

    cartArea.innerHTML += HTML_render
})

// Select check box part

// console.log(select_checkboxs)
let plus_btns = document.querySelectorAll(".plus-btn");
let minus_btns = document.querySelectorAll(".minus-btn");

plus_btns.forEach(plus_btn => {
    plus_btn.addEventListener("click", () => {
        let parent = plus_btn.parentElement;
        let amount = parent.children[1];
        amount.value = (parseInt(amount.value) + 1).toString()
    })
})

minus_btns.forEach(minus_btn => {
    minus_btn.addEventListener("click", () => {
        let parent = minus_btn.parentElement;
        let amount = parent.children[1];
        if (amount.value > 1) amount.value -= 1
    })
})

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

document.getElementById("cart").addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName === "INPUT" && target.type === "checkbox") {
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

        }
        
        // Update Price
        document.getElementById("sum-item").querySelector("span").innerText = addCommasToNumber(allItems)
        document.getElementById("sum-price").querySelector("span").innerText = addCommasToNumber(allPrice)
        checkAllCheckbox();
        // console.log(allPrice, allItems)
    })

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

// order Btn to checkout page

const orderBtn = document.getElementById("order-btn")

orderBtn.addEventListener("click", () => {
    let allCheckbox_checked = document.querySelectorAll(".select-checkbox:not(#select-all):not(#select-shop):checked");
    // console.log(allCheckbox_checked);

    let orderData = [];

    allCheckbox_checked.forEach(checkbox_checked => {
        // Find product element
        let product = checkbox_checked.closest(".product-in-cart")
        console.log(product)
        // console.log(checkbox_checked)

        // Find Shop element
        let shop = checkbox_checked.closest(".cart-group").querySelector(".shop-header")
        console.log(shop)

        // Send data in form [ {option each product} ] After add with js in checkout page
        
    })
})