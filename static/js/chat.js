// Fetch Shop from database

const chatSelectArea = document.getElementById("chat-select")
const chat_select_template = `<div class="chat" data-shop-id=%shop_id data-user-shop-id=%user_shop_id>
                <div class="sender-logo"></div>
                <div class="sender-chat-group">
                    <div class="left">
                        <h3 class="sender-name">%shop_name</h3>
                        <h4 class="last-text">Hi, How was our shirt product...</h4>
                    </div>
                    <div class="right">
                        <h5 class="chat-date">07/12</h5>
                        <span class="notification chat-notification">5</span>
                    </div>
                </div>
            </div>`

var user_id = document.getElementById("user_id_placeholder").dataset.userId
var isShop = document.getElementById("is_shop_placeholder").dataset.isShop
console.log(isShop)

var socketObj = {}

if (isShop == 0) {
    // fetch shop chat
    fetch(`/service/fetch-other-shop/${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(res => res.json())
        .then(shops => {
            JSON.parse(JSON.stringify(shops)).forEach(shop => {
                console.log(shop);
                document.getElementsByClassName("shop-name").innerHTML = shop['name']
                chatSelectArea.innerHTML += chat_select_template.replace("%shop_id", shop['id'])
                    .replace("%shop_name", shop['name'])
                    .replace("%user_shop_id", shop['user_id'])
                socket = startWebSocket(user_id, shop['user_id'], shop['id'])
            });
        })
} else {
    // fetch user chat
    let shop_id = document.getElementById("shop_id_placeholder").dataset.shopId
    console.log(shop_id)

    fetch(`/service/fetch-other-user/${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(res => res.json())
        .then(users => {
            JSON.parse(JSON.stringify(users)).forEach(user => {
                console.log(user);
                document.getElementsByClassName("shop-name").innerHTML = user['username']
                chatSelectArea.innerHTML += chat_select_template.replace("%shop_id", user['id'])
                    .replace("%shop_name", user['username'])
                socket = startWebSocket(user['id'], user_id, shop_id) // user['id']
            });
        })
}


// Show Chat and available shop text on Chat area
const chatArea = document.getElementById("chat-area")
const availableChat = document.getElementById("availableChat")
const childChats = chatArea.querySelectorAll("div")

const currentChat = document.getElementsByClassName("current-chat")

if (currentChat.length == 0) {
    if (availableChat.classList.contains("hidden")) {

        childChats.forEach((childChat) => {
            childChat.classList.remove("hidden")
        })

    } else {
        childChats.forEach((childChat) => {
            childChat.classList.add("hidden")
        })
    }
} else {
    console.log("Chat Selecttion")
}


// Selected chat
chatSelectArea.addEventListener("click", (event) => {
    // Current Chat
    let currentChatSelector = document.querySelector(".current-chat")
    if (currentChatSelector) currentChatSelector.classList.remove("current-chat")

    // Add shop name

    const chat = event.target.closest(".chat");
    chat.classList.add("current-chat")
    document.querySelector(".shop-name").innerHTML = chat.querySelector(".sender-name").innerText

    // Remove .hidden
    let chatArea = document.getElementById("chat-area")
    let childChats = chatArea.querySelectorAll("div")

    childChats.forEach((childChat) => {
        childChat.classList.remove("hidden")
    })

    // Get history chat
    
    if (isShop == 0) {
        let shopID = chat.dataset.shopId;
        let user_shop_id = chat.dataset.userShopId;

        getHistoryChat(user_id, user_shop_id, shopID)
        socket = startWebSocket(user_id, user_shop_id, shopID)
        sendMessage(user_id, user_shop_id, shopID, isShop)
    } else {
        let userID = chat.dataset.shopId;
        let shop_id = document.getElementById("shop_id_placeholder").dataset.shopId

        getHistoryChat(userID, user_id, shop_id)
        socket = startWebSocket(userID, user_id, shop_id)
        sendMessage(userID, user_id, shop_id, isShop)
    }
    
    chat_space.innerHTML = ""
})

// Show history chat of selected shop chat
function getHistoryChat(user_id, user_shop_id, shop_id) {
    // Add history chat
    fetch(`/service/fetch-chat/${user_id}/${user_shop_id}/${shop_id}`, {
        method: "GET",
        headers: { "Content-type": "application/json" }
    })
        .then(res => res.json())
        .then(chats => {
            chats.forEach(chat => {
                
                // console.log(chat)
                if (isShop == 0) {
                    let node = addMessageToChat(chat.text, chat.isShop)
                    chat_space.appendChild(node);
                } else {
                    if (chat.isShop == 0) {
                        let node = addMessageToChat(chat.text, 1)
                        chat_space.appendChild(node);
                    } else {
                        let node = addMessageToChat(chat.text, 0)
                        chat_space.appendChild(node);
                    }
                }

            });
        })
}

// Send message
let send_btn = document.getElementById("send-text-btn");
let chat_space = document.querySelector(".chat-space")
var shop_name = document.getElementById("shop-name")

function addMessageToChat(text, chat_type) {
    let logo_class = ['user-logo', 'shop-logo']
    let node_class = ['sender-me', 'sender-shop']

    let node = document.createElement("div");
    node.classList.add("text-group", node_class[chat_type])

    let first_child = document.createElement("div");
    first_child.classList.add(logo_class[chat_type])

    let second_child = document.createElement("span")
    second_child.classList.add("text")
    second_child.innerText = text

    node.appendChild(first_child)
    node.appendChild(second_child)

    return node;
}

function sendMessage(user_id, user_shop_id, shop_id, isShop) {

    let text_input = document.getElementById("sending-text-input");

    text_input.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            send_btn.click()
        }
    })

    send_btn.addEventListener("click", () => {
        if (text_input.value !== "") {
            message = text_input.value;
            if (message) {
                // send message
                addMessageToDB(user_id, user_shop_id, shop_id, message, isShop)
                socket.send(message);
                text_input.value = ""
            }
        }
    })
}

function createWebSocketConnection(socketURL, user_id, user_shop_id, shop_id, isShop) {
    let wsURL = `${socketURL}/${user_id}/${user_shop_id}/${shop_id}/${isShop}`
    let socket;
    if (!(wsURL in socketObj)) {
        socket = new WebSocket(wsURL);
        socketObj[wsURL] = socket;
        // console.log(socket)
    } else {
        socket = socketObj[wsURL];
    }
    // Receive message
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message.isShop)
        if (message.isShop == isShop) {

            let node = addMessageToChat(message.text, 0)
            chat_space.appendChild(node)
        } else {
            let node = addMessageToChat(message.text, 1)
            chat_space.appendChild(node)
        }

        chat_space.scrollTo(0, chat_space.scrollHeight)
    }

    return socket
}

function startWebSocket(user_id, user_shop_id, shop_id) {
    // Websocket
    const port = 8000;

    const socketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socketURL = `${socketProtocol}//${window.location.hostname}:${port}/ws`;

    // own_text : 0 = right side, 1 = left side

    const socket = createWebSocketConnection(socketURL, user_id, user_shop_id, shop_id, isShop)

    // Combine websocket and send message

    return socket
}

chat_space.scrollTo(0, chat_space.scrollHeight)


// Database

function addMessageToDB(user_id, user_shop_id, shop_id, text, isShop) {
    data = {
        "user_id": user_id,
        "user_shop_id": user_shop_id,
        "shop_id": shop_id,
        "text": text,
        "isShop": isShop
    }

    fetch("/chat/", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}