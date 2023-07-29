const queryString = window.location.search;
console.log("Query String :", queryString)

const urlParams = new URLSearchParams(queryString);

// const user_id = prompt("Enter your user ID:");
const user_id = urlParams.get("user_id"); // Replace with the user's ID
const shop_id = urlParams.get("shop_id"); // Replace with the shop's ID

console.log("User_id : ", user_id)
console.log("Shop_id : ", shop_id)

// document.getElementById("user-name").innerHTML = user_id;
// document.getElementById("shop-name").innerHTML = shop_id;

const socketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socketURL = `${socketProtocol}//${window.location.hostname}:3000/ws`;

// Function to add a new message to the chat window
function addMessageToChat(message, isShop) {
    const messagesDiv = isShop ? document.getElementById("shopMessages") : document.getElementById("userMessages");
    messagesDiv.innerHTML += `<p><strong>${message.own_text ? message.shop_id : message.user_id}:</strong> ${message.text}</p>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Function to create a WebSocket connection
// own_text : 0 = right side, 1 = left side
function createWebSocketConnection(user_id, shop_id, own_text) {
    const socket = new WebSocket(`${socketURL}/${user_id}/${shop_id}/${own_text}`);

    socket.onmessage = (event) => {
        console.log("Event data ", event)
        const message = JSON.parse(event.data);
        console.log(message)
        addMessageToChat(message, isShop);
    };

    return socket;
}

const userSocket = createWebSocketConnection("PongPong", "EIEIEIE", 0);
const shopSocket = createWebSocketConnection("PongPong", "shop_id", 1);

// User send message
document.getElementById("sendButtonUser").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInputUser");
    const message = messageInput.value.trim();
    if (message) {
        userSocket.send(message);
        messageInput.value = "";
    }
});

// Shop send message
document.getElementById("sendButtonShop").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInputShop");
    const message = messageInput.value.trim();
    if (message) {
        shopSocket.send(message);
        messageInput.value = "";
    }
});
