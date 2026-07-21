from flask import Blueprint

portal_bp = Blueprint('portal_bp', __name__)

from . import routes
