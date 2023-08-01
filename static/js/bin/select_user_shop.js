// Fetch Shop from database

var userList = document.getElementById("userList")
var user_id = document.getElementById("user_id_placeholder").dataset.userId

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const shop_id = urlParams.get("shop_id")

fetch(`/service/fetch-other-user/${user_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
})
    .then(res => res.json())
    .then(users => {
        JSON.parse(JSON.stringify(users)).forEach(user => {
            console.log(user);
            let node = document.createElement("li");
            node.setAttribute("data-user-id", user.id)
            node.innerHTML = "User : " + user.firstname;
            userList.appendChild(node);
        });
    })

document.getElementById("userList").addEventListener("click", (event) => {
    const userID = event.target.dataset.userId;

    if (userID) {
        window.location.href = `/chat?shop_id=${shop_id}&user_id=${userID}&user_shop_id=${user_id}&isShop=1`;
    }
});