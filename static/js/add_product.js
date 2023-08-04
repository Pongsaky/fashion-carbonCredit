let addProduct_btn = document.querySelector("#add-product-btn")
var user_id = document.getElementById("user_id_placeholder").dataset.userId
var shop_id = document.getElementById("shop_id_placeholder").dataset.shopId

addProduct_btn.addEventListener("click", async () => {
    // Upload profile image first
    let fileInput = document.getElementById("profile-image-upload");
    let file = fileInput.files[0];
    var product_image = undefined;

    if (file) {
        const formData = new FormData();
        formData.append('file', file)

        const response = await fetch("/service/single-uploadfile/", {
            method: "POST",
            body: formData
        })

        if (response.ok) {
            product_image = await response.text();
            console.log("File uploaded: ", product_image);
        }
    }

    product_image = typeof product_image === 'undefined' ? "https://storage.googleapis.com/carboncredit/coalla_logo.png" : product_image

    console.log(product_image)
    // Get Data from input of shop
    const productName = document.querySelector(".product-name").value
    const select_property = shop_selection();

    // fetch to insert product
    const data = {
        shop_id: shop_id,
        name: productName,
        product_type: 1,
        product_property: select_property,
        description : "",
        product_image: { "1": product_image.replace(/"/g, "") }
    }

    console.log(JSON.stringify(data))
    const response = await fetch('/product/', {
        method : "POST",
        headers : {"Content-type" : "application/json"},
        body : JSON.stringify(data)
    })

    if (response.ok) window.location.href = "/store?success=1"

})

function shop_selection() {
    let checkbox_inputs = document.querySelectorAll("input[type='checkbox']")
    let shop_option = { size: [], color: [], fabric: [], neckline: [], sleeve: [], fit: [] }

    checkbox_inputs.forEach(checkbox_input => {
        const key = checkbox_input.attributes?.name.value;
        if (checkbox_input.checked === true) {
            shop_option[key].push(1);
        }
        else {
            shop_option[key].push(0);
        }
    })

    return shop_option;
}

// JavaScript function to trigger the file input on "Upload Image" click
document.getElementById("upload-text").addEventListener("click", function () {
    document.getElementById("profile-image-upload").click();
});

// JavaScript function to update the profile image on file selection
document.getElementById("profile-image-upload").addEventListener("change", function () {
    let fileInput = document.getElementById("profile-image-upload");
    let file = fileInput.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            // Display the selected image as the profile image
            document.getElementById("product-image").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
