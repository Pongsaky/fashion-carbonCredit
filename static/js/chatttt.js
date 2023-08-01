// Send message
let send_btn = document.getElementById("send-text-btn");
let text_input = document.getElementById("sending-text-input");
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

function addMessageToDB(user_id, user_shop_id, shop_id, text, isShop) {
    data = {
        "user_id": user_id,
        "user_shop_id": user_shop_id,
        "shop_id": shop_id,
        "text": text,
        "isShop": isShop
    }

    fetch("/chat/", {
        method : "POST",
        headers : {
            "Content-type": "application/json"
        },
        body : JSON.stringify(data)
    })
        .then(res => res.json())
}

// Websocket
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user_id = urlParams.get("user_id")
const user_shop_id = urlParams.get("user_shop_id")
const shop_id = urlParams.get("shop_id")
const isShop = urlParams.get("isShop")
const port = 3000;


if (isShop == 0) {
    fetch(`/shop/${shop_id}`, { method: "GET", headers: { "Content-type": "application/json" } })
        .then(res => res.json())
        .then(shop => {
            console.log(shop['name'])
            shop_name.innerText = shop['name']
        })
} else {
    fetch(`/user/${user_id}`, { method: "GET", headers: { "Content-type": "application/json" } })
        .then(res => res.json())
        .then(user => {
            console.log(user['firstname'])
            shop_name.innerText = user['firstname']
        })
}


const socketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socketURL = `${socketProtocol}//${window.location.hostname}:${port}/ws`;

// own_text : 0 = right side, 1 = left side
function createWebSocketConnection(user_id, user_shop_id, shop_id, isShop) {
    const socket = new WebSocket(`${socketURL}/${user_id}/${user_shop_id}/${shop_id}/${isShop}`);

    // Receive message
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message.text)
        if (message.isShop == isShop) {
            
            let node = addMessageToChat(message.text, 0)
            chat_space.appendChild(node)
        } else {
            let node = addMessageToChat(message.text, 1)
            chat_space.appendChild(node)
        }
        
        chat_space.scrollTo(0, chat_space.scrollHeight)
    }

    return socket;
}

const socket = createWebSocketConnection(user_id, user_shop_id, shop_id, urlParams.get("isShop"))
// const shopSocket = createWebSocketConnection(user_id, shop_id, 1)

// Combine websocket and send message

chat_space.scrollTo(0, chat_space.scrollHeight)

send_btn.addEventListener("click", () => {
    if (text_input.value !== "") {
        message = text_input.value;
        if (message) {
            // send message
            addMessageToDB(user_id, user_shop_id, shop_id, message, urlParams.get("isShop"))
            socket.send(message);
            text_input.value = ""
        }
    }
})

text_input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        send_btn.click()
    }
})

// Add history chat
fetch(`/service/fetch-chat/${user_id}/${user_shop_id}/${shop_id}`, {
    method : "GET",
    headers : {"Content-type" : "application/json"}
})
    .then(res => res.json())
    .then(chats => {
        chats.forEach(chat => {
            if (isShop==0) {
                let node = addMessageToChat(chat.text, chat.isShop)
                chat_space.appendChild(node);
            } else {
                if (chat.isShop==0) {
                    let node = addMessageToChat(chat.text, 1)
                    chat_space.appendChild(node);
                } else {
                    let node = addMessageToChat(chat.text, 0)
                    chat_space.appendChild(node);
                }
                
            }
            
        });
    })