from flask import Blueprint

college_bp = Blueprint('college', __name__, url_prefix='/api/college')


from . import controller