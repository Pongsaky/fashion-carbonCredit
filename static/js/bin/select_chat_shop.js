// Fetch Shop from database

var shopList = document.getElementById("shopList")
var user_id = document.getElementById("user_id_placeholder").dataset.userId

fetch(`/service/fetch-other-shop/${user_id}`, {
        method : "GET",
        headers : {"Content-Type": "application/json"}
    })
    .then(res => res.json())
    .then(shops => {
        JSON.parse(JSON.stringify(shops)).forEach(shop => {
            console.log(shop);
            let node = document.createElement("li");
            node.setAttribute("data-shop-id", shop.id)
            node.innerHTML = "Shop : " + shop.name;
            shopList.appendChild(node);
        });
    })

document.getElementById("shopList").addEventListener("click", (event) => {
    const shopID = event.target.dataset.shopId;
    fetch(`/shop/${shopID}`, {
        method: "GET",
        headers: {"Content-type": "application/json"}
    }).then(res => res.json())
      .then(shop => {
          if (shopID) {
              window.location.href = `/chat?shop_id=${shopID}&user_id=${user_id}&user_shop_id=${shop['user_id']}&isShop=0`;
          }
      })
    
});