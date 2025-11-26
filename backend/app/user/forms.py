from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, BooleanField, ValidationError
from wtforms.validators import Regexp
from .model import Users

def username_not_ditto(form, field) :
    if( Users.check_username_exists(field.data)) :
        raise ValidationError('username alr exists')



class UserForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired(), validators.Length(min=3, max=20), Regexp(r'^\S+$', message="cannot contain spaces"), username_not_ditto], filters=[lambda x : x.strip() if x else x])
    email = StringField(validators=[validators.Length(min=10, max=50)])
    password = PasswordField(validators=[validators.DataRequired(), validators.Length(min=10, message="at least 10 characters please"),
        Regexp(r'.*[a-z].*', message="at least one lowercase letter please"),
        Regexp(r'.*[A-Z].*', message="at least one uppercase letter please"),
        Regexp(r'.*\d.*', message="at least one number please"),
        Regexp(r'.*[!@#$%^&*(),.?":{}|<>].*', message="at least one special character please"),
                                         ])
    confirm = PasswordField(validators=[validators.DataRequired(),  validators.EqualTo('password')])

class LoginForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired()])
    password = PasswordField(validators=[validators.DataRequired()])
    remember = BooleanField()
