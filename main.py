from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from backend.routers.db import productDB, user, shopDB, order, review, chatDB, service, product_type
from backend.routers.web import login, main, select_chat_shop, chat, select_chat_user, edit_user_profile, logout, select_product, shop, product

from starlette.middleware.sessions import SessionMiddleware
from typing import List

SECRET_KEY = "mysecretkey"

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.mount("/static", StaticFiles(directory="static"), name="static")
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

# Render web page
app.include_router(login.router)
app.include_router(main.router)
app.include_router(select_chat_shop.router)
app.include_router(select_chat_user.router)
app.include_router(chat.router)
app.include_router(edit_user_profile.router)
app.include_router(logout.router)
app.include_router(select_product.router)
app.include_router(shop.router)
app.include_router(product.router)
# app.include_router(chat_ws.router)

# Track active WebSocket connections
active_connections: List[WebSocket] = []

# Dictionary to store private chat rooms
private_rooms = []

# List to store chat messages
chat_messages: dict = {}

@app.websocket("/ws/{user_id}/{user_shop_id}/{shop_id}/{isShop}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, user_shop_id: int, shop_id: int, isShop :int):
    await websocket.accept()
    active_connections.append(websocket)

    # Add user and shop to the private room
    room_id = f"{user_id}{user_shop_id}{shop_id}-{user_shop_id}{shop_id}{user_id}"
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
            message = {'user_id': user_id, 'user_shop_id':user_shop_id, 'shop_id': shop_id, "text": data, 'isShop': isShop}
            chat_messages[room_id].append(message)
            # print("Chat message ", chat_messages[room_id])
            # Save the message in your database or data store
            # Here we just print the message for demonstration purposes
            # print(f"Message from {user_id} to {shop_id}: {message['text']}")

            # Display chat when typing
            for conn in active_connections:
                # print(conn.path_params['user_id'])

                # Check connection with private room
                if f"{conn.path_params['user_id']}{conn.path_params['user_shop_id']}{conn.path_params['shop_id']}-{conn.path_params['user_shop_id']}{conn.path_params['shop_id']}{conn.path_params['user_id']}" in private_rooms:
                    # Send message
                    await conn.send_json(message)

    except WebSocketDisconnect:
        active_connections.remove(websocket)
        if room_id in private_rooms:
            private_rooms.remove(room_id)