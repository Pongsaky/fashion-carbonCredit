// add_shop.js
document.addEventListener("DOMContentLoaded", function () {
    const addShopForm = document.getElementById("add_shop_form");
    const userShopsList = document.getElementById("user_shops_list");
    const addShopMessage = document.getElementById("add_shop_message");
    var user_id = document.getElementById("user_id_placeholder").dataset.userId;

    // Add shop
    addShopForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        const formData = new FormData(addShopForm);

        const data = {
            "user_id" : user_id,
            "name": formData.get('shop_name'),
            "shop_image": "https://storage.googleapis.com/carboncredit/coalla_logo.png"
        }

        console.log(data)
    
        // Make a POST request to the backend to add the shop
        fetch("/shop/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                addShopMessage.textContent = data['msg'];
                addShopMessage.style.color = "green";
            })
            .catch(error => {
                addShopMessage.textContent = "Error adding shop. Please try again.";
                addShopMessage.style.color = "red";
                console.error("Error adding shop:", error);
            });
        });
    

    // Function to display user's existing shops on the page
    function displayUserShops() {
        userShopsList.innerHTML = "<h2>Your Shops:</h2><ul>";

        fetch(`/service/fetch-shop/${user_id}`, {
            method : "GET",
            headers : {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(user_shops => {
                console.log(user_shops)
                user_shops.forEach(shop => {
                    userShopsList.innerHTML += `<li data-shop-id=${shop.id}>${shop.name}</li>`;
                })
            })

        userShopsList.innerHTML += "</ul>";
    }

    // Initial display of user's shops
    displayUserShops();

    document.getElementById("user_shops_list").addEventListener("click", (event) => {
        const shopID = event.target.dataset.shopId;
        if (shopID) {
            window.location.href = `/select_chat_user?shop_id=${shopID}`; // own_text 1 = shop
            // window.location.href = `/chat?shop_id=${shopID}&user_id=${user_id}&isShop=1`; // own_text 1 = shop
        }
    });
});
