from flask import Flask 
from config import SECRET_KEY, DATABASE_URL
from . import database
from flask_cors import CORS


def create_app() :
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY = SECRET_KEY,
        DATABASE_URL = DATABASE_URL
    )

    cors = CORS(app, origins="*")

    database.init_app(app)

    @app.route("/")
    def hello_world():
        return {
            "Home" : "Hello SSIS!"
        }

    from .user import user_bp
    app.register_blueprint(user_bp)

    from .student import student_bp
    app.register_blueprint(student_bp)

    from .program import program_bp
    app.register_blueprint(program_bp)

    from .college import college_bp
    app.register_blueprint(college_bp)


    return app