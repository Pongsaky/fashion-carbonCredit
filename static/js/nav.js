let user_icon_btn = document.querySelector(".user-icon-btn");


user_icon_btn.addEventListener("click", () => {
    document.querySelector(".user-menu").classList.toggle("show")
})

// Add dropdown profile
document.addEventListener("DOMContentLoaded", async () => {

    var user_id = document.getElementById("user_id_placeholder").dataset.userId
    var isShop = document.getElementById("is_shop_placeholder").dataset.isShop

    if (isShop == 1) var shop_id = document.getElementById("shop_id_placeholder").dataset.shopId

    const shopDropMenu = document.querySelector(".account-menu")
    const shopDrop_template =   `<li class="profile-dropdown" id=%shop-profile><a onclick="setIsShop(1, %shop_id)" data-shop-id=%shop_id><img src="%shop_img">%shop_name</a></li>`

    const response = await fetch(`/service/fetch-shop/${user_id}`, {method : "GET"})
    let shops = await response.json()
    // console.log(shops)
    let index=0
    shops.forEach((shop, i) => {
        if (index == 0) shopDropMenu.innerHTML += `<li class="profile-dropdown" id="user-profile"><a onclick="setIsShop(0)"><img src="${shop['user_image'].replace(/"/g, "") }">${shop['username']}</a></li>`

        shopDropMenu.innerHTML += shopDrop_template.replaceAll("%shop_id", shop['id'])
                                                   .replace("%shop_img", shop['shop_image'].replace(/"/g, ""))
                                                   .replace("%shop_name", shop['name'])
                                                   .replace("%shop-profile", `shop-profile-${shop['id']}`)
        index+=1
    })

    if (isShop==0) document.querySelector("#user-profile").classList.add("current-profile")
    else {
        // console.log(document.querySelector(`#shop-profile-${shop_id}`))
        document.querySelector(`#shop-profile-${shop_id}`).classList.add("current-profile")
    }
})

async function setIsShop(isShop, shop_id=-1) {
    if (isShop==0) {
        response = await fetch(`/set-isShop?isShop=${isShop}`, {
            method: "POST",
            headers: { "Content-type": "applicatio  n/json" },
        })
    } else {
        response = await fetch(`/set-isShop?isShop=${isShop}&shop_id=${shop_id}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
        })
    }
    

    if (response.ok) window.location.href = "/";
}

