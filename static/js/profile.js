let select_lists = document.querySelectorAll(".select-list");
let my_account = document.querySelector(".my-account")
let purchase_history = document.querySelector(".purchase-history")

select_lists.forEach((select_list, index) => {
    select_list.addEventListener("click", () => {
        select_lists.forEach(e => {
            e.classList.remove("current-list");
        })
        select_list.classList.add("current-list");

        if (index == 0) {
            purchase_history.classList.remove("current-content")
            my_account.classList.add("current-content")
        }
        else if (index == 1) {
            my_account.classList.remove("current-content")
            purchase_history.classList.add("current-content")
        }
    })
})


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

// Click overlay of upload text
// JavaScript function to trigger the file input on "Upload Image" click
document.getElementById("upload-text").addEventListener("click", function () {
    // console.log("Clicked")
    document.getElementById("profile-img-upload").click();
});

// JavaScript function to update the profile image on file selection
document.getElementById("profile-img-upload").addEventListener("change", function () {
    let fileInput = document.getElementById("profile-img-upload");
    let file = fileInput.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            // Display the selected image as the profile image
            document.getElementById("profile-image").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

const editProfileBtn = document.getElementById("edit-profile-btn");
const saveBtn = document.getElementById("submit-user-profile");

editProfileBtn.addEventListener("click", () => {
    document.querySelectorAll("input").forEach((input_element) => {
        input_element.disabled = false;
    })
    // remove hidden class of save btn and hide edit profile btn
    editProfileBtn.classList.add("hidden")
    saveBtn.classList.remove("hidden")
})

var user_id = document.getElementById("user_id_placeholder").dataset.userId;
var isShop = document.getElementById("is_shop_placeholder").dataset.isShop;

function getReceipt(button) {
    // console.log(button)
    const checkoutId = button.dataset.checkoutId
    // console.log(checkoutId)
    window.location.href = `/receipt?checkoutId=${checkoutId}`
}

if (isShop==0) {
    // User profile

    // Fetch userDB to profile page
    var username_field = document.getElementById("username")
    var password_field = document.getElementById("password")
    var email_field = document.getElementById("email")
    var firstname_field = document.getElementById("firstname")
    var lastname_field = document.getElementById("lastname")

    document.addEventListener("DOMContentLoaded", async function () {
        await fetch(`/user/${user_id}`, {
            method: "GET",
            headers: { "Content-type": "application/json" }
        }).then(res => res.json())
            .then(user => {
                let username = user['username'];
                let password = user['password'];
                let email = user['email'];
                let firstname = user['firstname'];
                let lastname = user['lastname'];
                let user_image = user['user_image'];

                username_field.value = username;
                password_field.value = password;
                email_field.value = email;
                firstname_field.value = firstname;
                lastname_field.value = lastname;

                // Remove the double quotes from the user_image URL
                user_image = user_image.replace(/"/g, "");

                document.getElementById("profile-image").src = user_image
            })

        // Purchase History
        
        const orderGroup = document.getElementById("status-order-group")
        const propertyResponse = await fetch("/type/1", { method: "GET" })
        const type_res = await propertyResponse.json()
        const property_template = JSON.parse(type_res['property'])
        property_template["sleeve"] = property_template['sleeve-length']

        const response = await fetch(`/service/fetch-historyPurchase/${user_id}`)
        historyPurchases = await response.json();

        console.log(historyPurchases)

        historyPurchases.forEach(async (hisPurchase, n) => {

            const orderDiv = document.createElement("div")
            orderDiv.classList.add("order-history")

            const orderHeader = document.createElement("div")
            orderHeader.classList.add("order-history-header")

            const orderNum = document.createElement("h2")
            orderNum.innerHTML = `Order #${n+1}`
            orderHeader.appendChild(orderNum)

            // Receipt button
            const receiptBtn = document.createElement("button")
            receiptBtn.classList.add("receipt-btn")
            receiptBtn.innerText = "Receipt"
            receiptBtn.dataset.checkoutId = hisPurchase["id"]
            receiptBtn.onclick = function() {getReceipt(this)}
            orderHeader.appendChild(receiptBtn)

            orderDiv.appendChild(orderHeader)

            // console.log(hisPurchase)
            console.log(JSON.parse(hisPurchase['data']))

            Object.entries(JSON.parse(hisPurchase['data'])).forEach(async (entry) => {

                const cartGroup = document.createElement("div")
                cartGroup.classList.add("cart-group")

                const [key, value] = entry
                let orderList = []

                for (data of value) {
                    orderList.push(data['orderId'])
                }

                // console.log(orderList)

                const response = await fetch(`/service/fetch-checkout/`, {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(orderList)
                })

                const checkouts = await response.json()
                console.log(checkouts)
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

                cartGroup.innerHTML = HTML_render

                cartGroup.querySelectorAll(".amount").forEach(amountDiv => {
                    let total_price = 0;
                    let total_item = 0;
                    const productInCart = amountDiv.closest(".product-in-cart")

                    amountDiv.querySelectorAll(".amount-per-size").forEach((amountPerSize) => {
                        const amount = parseInt(amountPerSize.querySelector("input").value);
                        const price = productInCart.querySelector(".price > span").innerText

                        total_item += amount
                        total_price += parseInt(price.split(" ")[0]) * amount
                    })


                    productInCart.innerHTML = productInCart.innerHTML.replace("%total-product", total_item).replace("%total-price", total_price + total_item * 0.2)
                })

                orderDiv.appendChild(cartGroup)
            })

            orderGroup.appendChild(orderDiv)

        })

    // DOMContentLoaded
    })

    // Update information (Submit Form)
    document.getElementById("edit-user-profile-form").addEventListener("submit", async function (event) {
        
        event.preventDefault(); // Prevent the form from submitting normally

        // Firstly Upload profile image
        let fileInput = document.getElementById("profile-img-upload");
        let file = fileInput.files[0];
        var user_image = undefined;

        if (file) {
            const formData = new FormData();
            formData.append('file', file)

            const response = await fetch("/service/single-uploadfile/", {
                method: "POST",
                body: formData
            })

            if (response.ok) {
                user_image = await response.text();
                console.log("File uploaded: ", user_image);
            }
        }

        // After upload image profile
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email");
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");

        user_image = typeof user_image === 'undefined' ? "https://storage.googleapis.com/carboncredit/coalla_logo.png" : user_image

        data = {
            "username": username,
            "password": password,
            "email": email,
            "firstname": firstname,
            "lastname": lastname,
            "user_image": user_image
        }
        // console.log(JSON.stringify(data))

        // Make a POST request to the /login endpoint
        const response = fetch(`/user/${user_id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data),
        })

        if (response.status == 200) {
            // If login successful, redirect to the main page
            let edit_warning_element = document.getElementById("edit-warning");
            edit_warning_element.style.color = "green"
            edit_warning_element.innerHTML = "Update user profile sucessfully";
            console.log("Update sucessfully")
        }

        // Update save button to edit profile
        document.querySelectorAll("input").forEach((input_element) => {
            input_element.disabled = true;
        })
        saveBtn.classList.add("hidden")
        editProfileBtn.classList.remove("hidden")
    
        
    })

} else {
    let shop_id = document.getElementById("shop_id_placeholder").dataset.shopId;
    let shop_name_field = document.getElementById("shop-name")

    document.addEventListener("DOMContentLoaded", async function () {
        await fetch(`/shop/${shop_id}`, {
            method: "GET",
            headers: { "Content-type": "application/json" }
        }).then(res => res.json())
            .then(shop => {
                let shop_name = shop['name'];
                let shop_image = shop['shop_image']

                shop_name_field.value = shop_name;

                // Remove the double quotes from the user_image URL
                shop_image = shop_image.replace(/"/g, "");

                document.getElementById("profile-image").src = shop_image
            })
    })

    // Update information (Except Profile image)
    document.getElementById("edit-shop-profile-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Upload profile image first
        let fileInput = document.getElementById("profile-img-upload");
        let file = fileInput.files[0];
        let shop_image = undefined;

        if (file) {
            const formData = new FormData();
            formData.append('file', file)

            const response = await fetch("/service/single-uploadfile/", {
                method: "POST",
                body: formData
            })

            if (response.ok) {
                shop_image = await response.text();
                console.log("File uploaded: ", shop_image);
            }
        }

        // After upload image profile
        const formData = new FormData(event.target);
        const shop_name = formData.get("shop-name");

        shop_image = typeof shop_image === 'undefined' ? "https://storage.googleapis.com/carboncredit/coalla_logo.png" : shop_image

        data = {
            "user_id": user_id,
            "name": shop_name,
            "shop_image": shop_image
        }

        // Make a POST request to the /login endpoint
        const response = await fetch(`/shop/${shop_id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data),
        })

        if (response.status === 200) {
            // If login successful, redirect to the main page
            // let edit_warning_element = document.getElementById("edit-warning");
            // edit_warning_element.style.color = "green"
            // edit_warning_element.innerHTML = "Update user profile sucessfully";
            console.log("Update shop profile sucessfully")
        }
        
        // Update save button to edit profile
        document.querySelectorAll("input").forEach((input_element) => {
            input_element.disabled = true;
        })
        saveBtn.classList.add("hidden")
        editProfileBtn.classList.remove("hidden")
    });
}
