from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/ai/chat")
def chat(request: ChatRequest):
    # Placeholder AI response
    reply = f"Echo from Python AI: {request.message}"
    return {"reply": reply}
