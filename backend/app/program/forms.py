from flask_wtf import FlaskForm
from wtforms import StringField,ValidationError, validators, SubmitField, BooleanField
from .model import Programs
from ..college.model import Colleges

def code_not_ditto(form, field) :
    if (Programs.check_code_exists(field.data) and field.data != form.hidden.data) :
        raise ValidationError("program code alr exists")

def college_exists(form, field) :
    if (not Colleges.check_code_exists(field.data) and field.data is not None) :
        raise ValidationError("college code doesnt exist")

def convert_to_None(value) :
    return None if value.strip() == "" else value.strip()

class ProgramForm(FlaskForm) :
    hidden = StringField()
    code = StringField(validators=[validators.DataRequired(), code_not_ditto])
    name = StringField(validators=[validators.DataRequired(), validators.Length(min=7)])
    college_code = StringField(validators=[college_exists], filters=[convert_to_None])

