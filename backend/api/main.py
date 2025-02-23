from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymupdf

from .gemini import GeminiClient

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class Resume(BaseModel):
    file: UploadFile

@app.post("/resume")
async def submit_resume(resume_file: UploadFile) -> JSONResponse:
    if not resume_file.content_type == "application/pdf":
        raise HTTPException(400, detail = "API only accepts PDF files for now!")

    client = GeminiClient()

    resume_file_bytes = await resume_file.read()

    pdf_document = pymupdf.open(stream = resume_file_bytes, filetype = "pdf")
    resume_string = "\n".join(page.get_text() for page in pdf_document)

    data = client.send_resume(resume_string)

    return data