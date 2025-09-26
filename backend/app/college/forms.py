from flask_wtf import FlaskForm
from wtforms import StringField, ValidationError, validators, SubmitField, BooleanField
from .model import Colleges

def code_not_ditto(form, field) :
    if (Colleges.check_code_exists(field.data) and form.hidden.data != field.data) :
        raise ValidationError("college code alr exists")

class CollegeForm(FlaskForm) :
    hidden = StringField()
    code = StringField(validators=[validators.DataRequired(), code_not_ditto])
    name = StringField(validators=[validators.DataRequired(), validators.Length(min=7)])
    
