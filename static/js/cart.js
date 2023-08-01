// fetch orderDB
var user_id = document.getElementById("user_id_placeholder").dataset.userId;

const header_template = `<div class="cart-group">
                            <div class="shop-header">
                                <div class="check-box">
                                    <input type="checkbox" name="select-shop" id="select-shop" class="select-checkbox">
                                </div>
                                <h2 class="shop-name">ToodDum Shop</h2>
                            </div>
                         `
// %shop_name

const orderProduct_template = `<div class="product-in-cart cart-table-row">
                <div class="check-box">
                    <input type="checkbox" name="select-product" class="select-checkbox">
                </div>
                <div class="product-detail">
                    <div class="product-img-wrapper">
                        <img src="/static/image/t-shirt.png" alt="product-image">
                    </div>
                    <div class="product-desc">
                        <h1 class="product-name">Product Name</h1>
                        <div class="category-group">
                            <span class="category">V-shirt</span>
                            <span class="category">Short</span>
                            <span class="category">Street Fasion</span>
                            <span class="category">Oversized</span>
                        </div>
                        <div class="net-zero-check">
                            <input type="checkbox" name="net-zero" class="net-zero">
                            <label for="net-zero" class="net-zero-label">Net-Zero</label>
                        </div>
                    </div>
                </div>
                <div class="price-per-item">
                    <h3 class="price">
                        <span>300-450</span> THB
                    </h3>
                </div>
                <div class="amount">
                    <div class="amount-per-size">
                        <span class="size">XS</span>
                        <div class="amount-group">
                            <button type="button" class="amount-btn minus-btn">-</button>
                            <input type="number" name="xs-amount" id="xs-amount" class="amount-number-input" value="1">
                            <button type="button" class="amount-btn plus-btn">+</button>
                        </div>
                    </div>
                    <div class="amount-per-size">
                        <span class="size">S</span>
                        <div class="amount-group">
                            <button type="button" class="amount-btn minus-btn">-</button>
                            <input type="number" name="xs-amount" id="s-amount" class="amount-number-input" value="1">
                            <button type="button" class="amount-btn plus-btn">+</button>
                        </div>
                    </div>
                    <div class="amount-per-size">
                        <span class="size">M</span>
                        <div class="amount-group">
                            <button type="button" class="amount-btn minus-btn">-</button>
                            <input type="number" name="m-amount" id="s-amount" class="amount-number-input" value="1">
                            <button type="button" class="amount-btn plus-btn">+</button>
                        </div>
                    </div>
                </div>
                <div class="conclude">
                    <h5 class="total-product"><span>100</span> Item</h5>
                    <h5 class="total-price"><span>4,250</span> THB</h5>
                </div>
            </div>`

function getHeaderHTML(shop_name) {
    return header_template.replace("%shop_name", shop_name)
}

function getOrderProductHTML() {
    return orderProduct_template
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}

const cartArea = document.getElementById("cart")

document.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch(`/service/fetch-order/${user_id}`)
    const orders = await response.json()

    let index = -1;
    let i = 0;

    let HTML_render = ``
    // console.log(cartArea.innerHTML)

    orders.forEach((order) => {
        // console.log(order)
        if (index !== order['shop_id']) {
            // Add header when shop change
            HTML_render += getHeaderHTML(order['name'])
            index = order['shop_id']
        }

        // Add order product
        HTML_render += getOrderProductHTML()
        i += 1
        if (i == orders.length) {
            HTML_render += '</div>'
            // console.log("Hello")
        }
        // console.log(i)
    })
    // console.log(HTML_render)
    cartArea.innerHTML += HTML_render

    var select_checkboxs = document.querySelectorAll(".select-checkbox:not(#select-all)");
    select_checkboxs.forEach(select_checkbox => {
        select_checkbox.addEventListener("click", () => {
            let shop = select_checkbox.parentElement.parentElement.parentElement;
            if (select_checkbox.checked === false) {
                shop.querySelector("#select-shop").checked = false;
                select_all_checkbox.checked = false;
            }
            let checkbox_in_shop = shop.querySelectorAll("input[name='select-product']")
            if (allTrue(checkbox_in_shop)) {
                shop.querySelector("#select-shop").checked = true;
            }
            if (allTrue(select_checkboxs)) {
                select_all_checkbox.checked = true;
            }
        })
    })

    console.log(select_checkboxs)
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

    // select-shop-checkbox
    let select_shop_checkboxs = document.querySelectorAll("input[name='select-shop']");

    select_shop_checkboxs.forEach(select_shop_checkbox => {
        select_shop_checkbox.addEventListener("click", () => {
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
            }
            else {
                for (const select_product_checkbox of select_product_checkboxs) {
                    select_product_checkbox.checked = false;
                }
            }
        })
    })

    function allTrue(arr) {
        for (const i of arr) {
            if (i.checked == false) return false;
        }

        return true;
    }

    // select-all-checkbox
    let select_all_checkbox = document.getElementById("select-all");
    select_all_checkbox.addEventListener("click", () => {

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
    })

    // Check update price
    var allPrice = 0;
    var allItems = 0;
    var countCheckBox = 0;

    document.getElementById("cart").addEventListener("click", (event) => {
        const target = event.target;

        if (target.tagName === "INPUT" && target.type === "checkbox") {

            // Uncheck
            if (!target.checked && target.id !== "select-all") {

                console.log(target)
                if (target.id == "select-shop") {
                    let cartGroup_element = target.closest(".cart-group")
                    cartGroup_element.querySelectorAll(".product-in-cart").forEach((product_element) => {
                        let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                        let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                        allPrice -= price;
                        allItems -= total_product;
                        countCheckBox -= 1
                    })
                } else {
                    let product_element = target.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    allPrice -= price;
                    allItems -= total_product;
                    countCheckBox -= 1
                }


            } else {
                // Check
                if (target.id !== "select-shop" && target.id !== "select-all") {
                    let product_element = target.closest(".product-in-cart")
                    let price = parseInt((product_element.querySelector(".conclude .total-price span").innerHTML).replace(/,/g, ''))
                    let total_product = parseInt(product_element.querySelector(".conclude .total-product span").innerHTML)

                    // console.log("HELLO")

                    allPrice += price;
                    allItems += total_product;
                    countCheckBox += 1
                }
            }

            // Update Price
            document.getElementById("sum-item").querySelector("span").innerText = addCommasToNumber(allItems)
            document.getElementById("sum-price").querySelector("span").innerText = addCommasToNumber(allPrice)

        }
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
})

