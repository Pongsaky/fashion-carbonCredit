from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.schema import Chat
from typing import List

router = APIRouter(
    prefix='/ws',
    tags=['webSocket']
                   )

# Track active WebSocket connections
active_connections: List[WebSocket] = []

# Dictionary to store private chat rooms
private_rooms = {}

# List to store chat messages
chat_messages: dict = {}

@router.websocket("/ws/{user_id}/{shop_id}/{own_text}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, shop_id: str, own_text: str):
    if not 'private_rooms' in locals():
        private_rooms = {}
    
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
