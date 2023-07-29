from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Cookie, Form
from fastapi.responses import HTMLResponse, RedirectResponse

from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

import secrets

app = FastAPI()

# Secret key for session encryption (replace with a stronger key in production)
SECRET_KEY = "mysecretkey"

# Set up SessionMiddleware
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# Mount the static files directory to serve the frontend
app.mount("/static", StaticFiles(directory="static"), name="static")

# Create a templates directory and load Jinja2 templates from it
templates = Jinja2Templates(directory="templates")

# Track active WebSocket connections
active_connections: List[WebSocket] = []

# Dictionary to store private chat rooms
private_rooms = {}

# List to store chat messages
chat_messages: dict = {}

@app.websocket("/ws/{user_id}/{shop_id}/{own_text}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, shop_id: str, own_text: int):
    await websocket.accept()
    active_connections.append(websocket)

    # Add user and shop to the private room
    room_id = f"{user_id}_{shop_id}"
    private_rooms[room_id] = (user_id, shop_id)

    if not room_id in chat_messages:
        chat_messages[room_id] = [] # Add message of room_id

    try:
        print(private_rooms)
        # History chat (Insert chatDB)
        # for message in chat_messages[room_id]:
        #     await websocket.send_json({'sender_id': message['sender_id'], "text": message['text']})

        while True:
            data = await websocket.receive_text()
            message = {'user_id': user_id, 'shop_id': shop_id, "text": data, 'own_text': own_text}
            chat_messages[room_id].append(message)
            print("Chat message ", chat_messages[room_id])
            # Save the message in your database or data store
            # Here we just print the message for demonstration purposes
            print(f"Message from {user_id} to {shop_id}: {message['text']}")

            # Display chat when typing
            for conn in active_connections:
                # print(conn.path_params['user_id'])

                # Check connection with private room
                if (conn.path_params['user_id'],conn.path_params['shop_id']) == private_rooms[room_id]:
                    await conn.send_json(message)

    except WebSocketDisconnect:
        active_connections.remove(websocket)
        if room_id in private_rooms:
            private_rooms.pop(room_id)

# Route for the login page
@app.get("/", response_class=HTMLResponse)
async def get_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Route to handle login form submission
@app.post("/", response_class=HTMLResponse)
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    # Check username and password (you can implement your authentication logic here)
    # For simplicity, let's assume the username and password are valid
    # In a real-world application, you should validate the credentials against a database

    # Set the user_id in the session
    # user_id = secrets.token_hex(16)  # Generate a random user_id
    request.session["user_id"] = username

    # Redirect to the main page after successful login
    return RedirectResponse(url="/main", status_code=302)

# Route for the shop selection page
@app.get("/main", response_class=HTMLResponse)
async def get_main_page(request :Request):
    # Set session
    user_id = request.session.get("user_id")
    if not user_id:
        # If user is not authenticated, redirect to the login page
        return RedirectResponse(url="/login", status_code=302)
    return templates.TemplateResponse("main.html", {"request": request, "user_id": user_id})

# Route for the shop selection page
@app.get("/select_shop", response_class=HTMLResponse)
async def get_shop_selection(request: Request):
    user_id = request.session.get("user_id")
    return templates.TemplateResponse("shop.html", {"request" : request, "user_id": user_id})

# Route for the chat page
@app.get("/chat", response_class=HTMLResponse)
async def get_chat(request:Request, shop_id: str):
    user_id = request.session.get("user_id")
    return templates.TemplateResponse("chat.html", {"request": request, "user_id":user_id, "shop_id": shop_id})