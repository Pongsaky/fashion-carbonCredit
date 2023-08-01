var user_id = document.getElementById("user_id_placeholder").dataset.userId

$(document).ready(function () {
    $('.user-dropdown').click(function (event) {
        event.stopPropagation();
        $(this).toggleClass('active');
        $('.shop-dropdown-menu').removeClass('show');
    });

    $('.shop-dropdown').click(function (event) {
        event.stopPropagation();
        $(this).toggleClass('active');
        $('.user-menu').removeClass('active');
    });

    // Close the drop-downs when clicking outside of them
    $(document).click(function () {
        $('.user-dropdown').removeClass('active');
        $('.shop-dropdown').removeClass('active');
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    const shopDropMenu = document.querySelector(".shop-dropdown-menu")
    const shopDrop_template =   `<li><a onclick="setIsShop(1)" data-shop-id=%shop_id><img src="%shop_img"><p>%shop_name</p></a></li>`

    const response = await fetch(`/service/fetch-shop/${user_id}`, {method : "GET"})
    let shops = await response.json()

    shops.forEach(shop => {
        console.log(shop)
        shopDropMenu.innerHTML += shopDrop_template.replace("%shop_id", shop['id'])
                                                   .replace("%shop_img", shop['shop_image'].replace(/"/g, ""))
                                                   .replace("%shop_name", shop['name'])
    })

})

async function setIsShop(isShop) {
    response = await fetch(`/set-isShop?isShop=${isShop}`, {
        method : "POST",
        headers : {"Content-type" : "application/json"},
    })

    if (response.ok) window.location.href = "/";
}

