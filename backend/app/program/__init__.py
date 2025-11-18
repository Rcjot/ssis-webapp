from flask import Blueprint

program_bp = Blueprint('program', __name__, url_prefix="/api/program")

from . import controller