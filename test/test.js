// For client 1:
const ws1 = new WebSocket("ws://127.0.0.1:8000/ws/1");
ws1.onmessage = (event) => console.log("Client 1 received:", event.data);
ws1.send("Hello from client 1!");

// For client 2:
const ws2 = new WebSocket("ws://127.0.0.1:8000/ws/2");
ws2.onmessage = (event) => console.log("Client 2 received:", event.data);
ws2.send("Hello from client 2!");
