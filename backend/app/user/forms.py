from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, BooleanField, ValidationError
from .model import Users

def username_not_ditto(form, field) :
    if( Users.check_username_exists(field.data)) :
        raise ValidationError('username alr exists')

class UserForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired(), validators.Length(min=3, max=20), username_not_ditto])
    email = StringField(validators=[validators.Length(min=10, max=50)])
    password = PasswordField(validators=[validators.DataRequired()])
    confirm = PasswordField(validators=[validators.DataRequired(),  validators.EqualTo('password')])

class LoginForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired()])
    password = PasswordField(validators=[validators.DataRequired()])
    remember = BooleanField()