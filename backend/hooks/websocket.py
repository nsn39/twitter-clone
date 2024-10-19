from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.client_connections = {} 
        self.connections = []
    
    async def connect(self, websocket: WebSocket, user_id: str):
        #client_connection = self.client_connections.get(user_id)
        #if client_connection:
        #    await websocket.close()
        #    raise Exception(f"User: {user_id} already has a setup web-socket connection.")
        
        
        websocket.user_id = user_id
        self.client_connections[user_id] = websocket
        #self.connections.append[websocket]
    
    async def disconnect(self, websocket: WebSocket):
        print("disconnect() called.")
        user_id = websocket.user_id
        if self.client_connections.get(user_id):
            self.client_connections.pop(user_id)
            
    def is_user_online(self, user_id):
        print("Client connections: ", self.client_connections)
        connection =  self.client_connections.get(user_id)
        return True if connection else False
    
    async def broadcast(self, msg: str):
        connections = [connection[1] for connection in self.client_connections.items()]
        for connection in connections:
            await connection.send_text(msg)
    
    async def send_message(self, user_id: str, msg: str):
        connection = self.client_connections.get(user_id)
        if connection:
            await connection.send_text(msg)
        else:
            raise Exception("Unable to send data due to no connection found.")
    
    async def send_json(self, user_id: str, data: dict):
        connection = self.client_connections.get(user_id)
        if connection:
            await connection.send_json(data)
        else:
            raise Exception("Unable to send data due to no connection found.")