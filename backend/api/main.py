from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from pydantic import BaseModel

from .gemini import GeminiClient

app = FastAPI()

class Resume(BaseModel):
    file: UploadFile

@app.post("/resume")
async def submit_resume(resume_file: UploadFile) -> JSONResponse:
    if not resume_file.content_type == "application/pdf":
        raise HTTPException(400, detail = "API only accepts PDF files for now!")
    
    client = GeminiClient()

    # TODO: this will change to a dictionary later
    data = client.send_resume("test test")

    return {
        "test": data.text
    }