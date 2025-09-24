from . import user_bp
from . import model
from .forms import LoginForm, UserForm
from flask import current_app, jsonify, request, session
from flask_login import login_user, logout_user, login_required, current_user
from .model import Users
from flask_wtf.csrf import generate_csrf

@user_bp.route("/user")
def add_user() :
    user = model.Users()
    user.add()
    return({"successful": True})

@user_bp.route("register", methods=["POST"])
def register_user() :
    data = request.get_json()
    # form = UserForm(request.form)
    form = UserForm(data=data)
    # print(form.username, form.password, form.email, form.csrf_token.data)
    if form.validate() :
        new_user = Users(username=form.username.data, password=form.password.data, email=form.email.data)
        new_user.add()

        return jsonify(success=True)
    
    return jsonify(success=False, message="Something went wrong registering", error = [form.username.errors, form.email.errors, form.password.errors, form.confirm.errors]), 400

@user_bp.route("/login", methods=["POST"])
def signin_user() :
    data = request.get_json()

    form = LoginForm(data=data)

    if form.validate() :
        user = model.Users.get_by_username(form.username.data)
        
        if user and user.check_password(form.password.data) :
            login_user(user)
            return jsonify(success=True, user=user.get_json())
        
    return jsonify(success=False, message="Something went wrong registering", error = [form.username.errors, form.email.errors, form.password.errors, form.confirm.errors]), 400
    
@user_bp.route("/logout")
@login_required
def logout():
    logout_user()
    print(session)
    return jsonify(success=True)


@user_bp.route("/protected") 
@login_required
def test_auth() :
    print(session)
    return jsonify(auth=True, user = current_user.get_json())

@user_bp.route('/session')
def get_session() :
    print(session)
    return jsonify(success=True)

@user_bp.route("/csrf") 
def get_csrf() :
    response = jsonify(detail="success")
    response.headers.set("X-CSRFToken", generate_csrf())

    return response