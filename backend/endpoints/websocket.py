import uuid
from typing import Annotated
from fastapi import (
    APIRouter, WebSocket, WebSocketDisconnect, 
    Cookie, WebSocketException, status, HTTPException
)
from hooks.websocket import ConnectionManager
from auth import get_current_user
from loguru import logger

router = APIRouter()

connection_manager = ConnectionManager()
token_to_user_id = {}


@router.get("/ws/get_user_token", status_code=200)
async def get_ws_user_token(userToken: Annotated[str, Cookie()]):
    try:
        if not userToken:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No token received.",
            )
        user = await get_current_user(userToken) 
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed."
            )
        if user.id:
            token = str(uuid.uuid4()).replace("-", "")
            token_to_user_id[token] = str(user.id)
            return {
                "token": token
            }
        
    except Exception as e:
        logger.error(f"Unable to get Websocket token due to: {e}")



@router.websocket("/ws/notifications")
async def connect_notifications_websocket(
    websocket: WebSocket,
):
    is_verfified = False
    try:
        await websocket.accept()
        while True:
            text = await websocket.receive_text()
            if not is_verfified:
                #print("token received: ", token)
                #print("current token dict: ", token_to_user_id)
                if text in token_to_user_id:
                    user_id = token_to_user_id.get(text)
                    await connection_manager.connect(websocket, user_id)
                    print("connect() method called.")
                    is_verfified = True
            
        
    except WebSocketDisconnect:
        await connection_manager.disconnect(websocket)
