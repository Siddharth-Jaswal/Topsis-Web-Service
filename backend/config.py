import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    UPLOAD_FOLDER = "backend/uploads"
    RESULT_FOLDER = "backend/results"
