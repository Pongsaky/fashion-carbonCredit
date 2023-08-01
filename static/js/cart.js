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


let select_checkboxs = document.querySelectorAll(".select-checkbox:not(#select-all)");
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