// Add information for updating profile
var user_id = document.getElementById("user_id_placeholder").dataset.userId;
var isShop = document.getElementById("is_shop_placeholder").dataset.isShop;

if (isShop == 0) {
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
    })

    // Update information
    document.getElementById("edit-profile-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Upload profile image first
        let fileInput = document.getElementById("profile-image-upload");
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
        console.log(JSON.stringify(data))

        // Make a POST request to the /login endpoint
        const response = fetch(`/user/${user_id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data),
        })

        if (response.status === 200) {
            // If login successful, redirect to the main page
            let edit_warning_element = document.getElementById("edit-warning");
            edit_warning_element.style.color = "green"
            edit_warning_element.innerHTML = "Update user profile sucessfully";
        }
    });

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

                console.log(shop_image)
                document.getElementById("profile-image").src = shop_image
            })
    })

    // Update information (Except Profile image)
    document.getElementById("edit-shop-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Upload profile image first
        let fileInput = document.getElementById("profile-image-upload");
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
            "user_id" : user_id,
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
            let edit_warning_element = document.getElementById("edit-warning");
            edit_warning_element.style.color = "green"
            edit_warning_element.innerHTML = "Update user profile sucessfully";
        }
    });
}

// JavaScript function to trigger the file input on "Upload Image" click
document.getElementById("upload-text").addEventListener("click", function () {
    console.log("Clicked")
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
            document.getElementById("profile-image").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


