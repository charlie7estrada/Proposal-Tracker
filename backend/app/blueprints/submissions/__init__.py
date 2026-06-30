from flask import Blueprint

submissions_bp = Blueprint('submissions_bp', __name__)

from . import routes

