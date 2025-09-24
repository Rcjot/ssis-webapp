from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, SubmitField, BooleanField


class UserForm(FlaskForm) :

    username = StringField(validators=[validators.DataRequired(), validators.Length(min=3, max=20)])
    email = StringField(validators=[validators.Length(min=10, max=50)])
    password = PasswordField(validators=[validators.DataRequired(), validators.EqualTo('confirm')])
    confirm = PasswordField(validators=[validators.DataRequired()])

class LoginForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired()])
    password = PasswordField(validators=[validators.DataRequired()])
    # remember_me for persists add later