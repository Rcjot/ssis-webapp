from . import user_bp
from . import model
from .forms import LoginForm, UserForm
from flask import current_app, jsonify, request, session
from flask_login import login_user, logout_user, login_required, current_user
from .model import Users
from flask_wtf.csrf import generate_csrf

@user_bp.route("/user") # is this used?
def add_user() :
    user = model.Users()
    user.add()
    return({"successful": True})

@user_bp.route("/signup", methods=["POST"])
def signup_user() :
    data = request.get_json()

    form = UserForm(data=data)
    validated = form.validate()
    error = {"username" :form.username.errors,
             "email" : form.email.errors, 
             "password" : form.password.errors, 
             "confirm" : form.confirm.errors
             }

    if validated :
        new_user = Users(username=form.username.data, password=form.password.data, email=form.email.data)

        new_user.add()

        return jsonify(success=True)
    
    return jsonify(success=False,
                   message="Something went wrong signup",
                   error =error
                   ), 400

@user_bp.route("/login", methods=["POST"])
def signin_user() :
    data = request.get_json()

    form = LoginForm(data=data)

    if form.validate() :
        user = model.Users.get_by_username(form.username.data)
        error = {
            "username" : "",
            "password" : ""
        }
        if not user :
            error["username"] = "no such user"
            return jsonify(success=False, 
                           message="usernameError occurred", 
                           error=error
                           ), 401
        if user.check_password(form.password.data) :
            login_user(user, remember=form.remember.data)
            return jsonify(success=True, user=user.get_json()), 200
        else :
            error["password"]="incorrect password"
            return jsonify(success=False,
                           message="passwordError occurred",
                           error=error
                           ), 401
    error["username"] = form.username.errors
    error["password"] = form.password.errors

    return jsonify(success=False,
                   message="Something went wrong registering",
                   error=error
                   ), 400
    
@user_bp.route("/logout")
@login_required
def logout():
    logout_user()
    print(session)
    return jsonify(success=True)


@user_bp.route("/protected") # for testing
@login_required
def test_auth() :
    print(session)
    return jsonify(auth=True, user = current_user.get_json())

@user_bp.route('/session') # for testing
def get_session() :

    print(session)
    print(request.cookies.get("session"))
    response = jsonify(success=True)
    response.headers.set("X-CSRFToken", generate_csrf())
    return response

@user_bp.route("/csrf") 
def get_csrf() :
    if current_user.is_authenticated:
        status = "authenticated"
        user = current_user.get_json()
    else :
        status = "unauthenticated"
        user = None

    response = jsonify(detail="success", status=status, user=user )
    response.headers.set("X-CSRFToken", generate_csrf())
    return response