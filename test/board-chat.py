from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

# Mount the static files directory to serve the frontend
app.mount("/static", StaticFiles(directory="static"), name="static")

# Track active WebSocket connections
active_connections: List[WebSocket] = []

# List to store chat messages
chat_messages: List[dict] = []

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    active_connections.append(websocket)

    try:
        # Send the chat history to the new user
        for message in chat_messages:
            await websocket.send_json(message)

        while True:
            data = await websocket.receive_text()
            message = {"user_id": user_id, "text": data}
            chat_messages.append(message)

            for connection in active_connections:
                await connection.send_json(message)
    except WebSocketDisconnect:
        active_connections.remove(websocket)