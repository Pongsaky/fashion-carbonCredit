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
                select_product_checkbox.checked = true;
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
            select_checkbox.checked = true;
        }
    }
    else {
        for (const select_checkbox of select_checkboxs) {
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