from flask import Flask, jsonify
from config import SECRET_KEY, DATABASE_URL
from . import database
from flask_cors import CORS
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect, CSRFError

login_manager = LoginManager()


def create_app() :
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY = SECRET_KEY,
        DATABASE_URL = DATABASE_URL,
    )

    cors = CORS(app,
                origins="*", 
                supports_credentials=True,
                expose_headers="X-CSRFToken")

    CSRFProtect(app)
    database.init_app(app)

    login_manager.init_app(app)

    #---- routers
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

    # user loader call back
    @login_manager.user_loader
    def load_user(user_id) :
        from .user import model
        return model.Users.get_by_id(user_id)
    
    @app.errorhandler(CSRFError)
    def handle_csrf_error(e) :
        print(e.description)
        return jsonify(error="CSRF failed", message=e.description), 400

    return app