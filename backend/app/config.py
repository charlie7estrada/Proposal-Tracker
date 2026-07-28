import os
from pathlib import Path

from dotenv import load_dotenv

# backend/ directory: .env, the dev SQLite file, and uploads live here
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / '.env')


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # Local SQLite by default; set DATABASE_URL for Postgres
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', f"sqlite:///{BASE_DIR / 'proposal_tracker.db'}"
    )

    # The only origin allowed to call this API from a browser
    FRONTEND_ORIGIN = os.environ.get('FRONTEND_ORIGIN', 'http://localhost:3100')

    # Uploaded proposal files are stored on disk outside any web root and
    # only served back through the authenticated download endpoint
    UPLOAD_DIR = Path(os.environ.get('UPLOAD_DIR', BASE_DIR / 'uploads'))

    # Flask rejects request bodies larger than this with a 413
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_UPLOAD_MB', '10')) * 1024 * 1024
