from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from backend.routers.db import (productDB, user, shopDB, order, review, 
                                chatDB, service, product_type, checkoutDB)
from backend.routers.web import (edit_profile, sign_in_up, main, select_chat_shop, 
                                 chat, select_chat_user, logout, select_product, 
                                 set_isShop, shop, product, cart, profile, dashboard,
                                 checkout, receipt, about, support, store, add_product)

from starlette.middleware.sessions import SessionMiddleware
from typing import List, Dict

SECRET_KEY = "mysecretkey"

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/dashboard-template", StaticFiles(directory="dashboard-template"), name="dashboard-template")
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclduing DB API router
app.include_router(user.router)
app.include_router(shopDB.router)
app.include_router(productDB.router)
app.include_router(order.router)
app.include_router(review.router)
app.include_router(chatDB.router)
app.include_router(product_type.router)
app.include_router(service.router)
app.include_router(checkoutDB.router)

# Render web page
app.include_router(sign_in_up.router)
app.include_router(main.router)
app.include_router(select_chat_shop.router)
app.include_router(select_chat_user.router)
app.include_router(chat.router)
app.include_router(edit_profile.router)
app.include_router(logout.router)
app.include_router(select_product.router)
app.include_router(shop.router)
app.include_router(product.router)
app.include_router(set_isShop.router)
app.include_router(cart.router)
app.include_router(profile.router)
app.include_router(dashboard.router)
app.include_router(checkout.router)
app.include_router(receipt.router)
app.include_router(about.router)
app.include_router(support.router)
app.include_router(store.router)
app.include_router(add_product.router)

# Track active WebSocket connections
active_connections: Dict[str, WebSocket] = {}

# Dictionary to store private chat rooms
private_rooms = []

# List to store chat messages
chat_messages: dict = {}

@app.websocket("/ws/{user_id}/{user_shop_id}/{shop_id}/{isShop}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, user_shop_id: int, shop_id: int, isShop :int):

    await websocket.accept()

    # Add user and shop to the private room
    room_id = f"{user_id}{user_shop_id}{shop_id}-{user_shop_id}{shop_id}{user_id}"

    room_id_conn = room_id + "-" + str(isShop)

    active_connections[room_id_conn] = websocket # room_id + isShop

    if not room_id in private_rooms:
        private_rooms.append(room_id)

    if not room_id in chat_messages:
        chat_messages[room_id] = [] # Add message of room_id

    try:
        print(private_rooms)
        # History chat (Insert chatDB)
        # for message in chat_messages[room_id]:
        #     await websocket.send_json({'sender_id': message['sender_id'], "text": message['text']})

        while True:
            data = await websocket.receive_text()
            message = {'user_id': user_id, 'user_shop_id':user_shop_id, 'shop_id': shop_id, "text": data, "isShop": isShop}
            chat_messages[room_id].append(message)
            # print("Chat message ", chat_messages[room_id])
            # Save the message in your database or data store
            # Here we just print the message for demonstration purposes
            # print(f"Message from {user_id} to {shop_id}: {message['text']}")

            # Send the message to all connected WebSockets in the same chat room
            for conn_room_id, conn in active_connections.items():
                if conn_room_id[:-2] == room_id:
                    # message['isShop'] = int(conn_room_id[-1])
                    print(conn_room_id, message)
                    await conn.send_json(message)

    except WebSocketDisconnect:
        active_connections.pop(room_id, None)
        if room_id in private_rooms:
            private_rooms.remove(room_id)

# Serial number process
# import hashlib
# from backend.database.connectDB import orderDB

# class HashSerialGenerator:
#     def __init__(self):
#         self.order_to_serial = {}

#         # set order_to_serial
#         orderRes = orderDB().select_all()

#         for key, value in orderRes.items():
#             print(key, value)

#     def generate_serial_number(self, order_id):
#         # Use SHA-256 hash function to create the serial number
#         hash_object = hashlib.sha256(str(order_id).encode())
#         serial_number = 'CL-' + hash_object.hexdigest()[:6]

#         # Store the mapping of order ID to serial number in the lookup table
#         self.order_to_serial[order_id] = serial_number

#         return serial_number

#     def get_serial_number_by_order_id(self, order_id):
#         return self.order_to_serial.get(order_id)
    
#     def get_orderRes(self):
#         return self.orderRes

# # Example usage:
# order_ids = [1, 2, 3, 4]

# # Create the hash serial number generator
# serial_generator = HashSerialGenerator()

# print(serial_generator.get_orderRes())

# # Convert order IDs to unique serial numbers
# unique_serial_numbers = [serial_generator.generate_serial_number(order_id) for order_id in order_ids]

# # Print the result
# print(unique_serial_numbers)

# # Retrieve serial numbers from order IDs
# for order_id in order_ids:
#     serial_number = serial_generator.get_serial_number_by_order_id(order_id)
#     print(f"Order ID: {order_id}, Serial Number: {serial_number}")