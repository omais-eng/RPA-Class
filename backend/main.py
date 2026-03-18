from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from claude import generate_study_material

app = FastAPI(title="Study Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    input: str


@app.post("/generate")
def generate(request: GenerateRequest):
    if not request.input.strip():
        raise HTTPException(status_code=400, detail="Input cannot be empty.")

    try:
        result = generate_study_material(request.input)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate study material: {str(e)}")


@app.get("/health")
def health():
    return {"status": "ok"}
