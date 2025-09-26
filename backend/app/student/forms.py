from flask_wtf import FlaskForm
from wtforms import StringField, ValidationError, validators, IntegerField, RadioField
from .model import Students
from ..program.model import Programs

def id_not_ditto(form, field) :
    if (Students.check_id_exists(field.data) and field.data != form.hidden.data) :
        raise ValidationError("student id alr exists")

def program_exists(form, field) :
    if (not Programs.check_code_exists(field.data) and field.data is not None) :
        raise ValidationError("program code doesnt exist")

def convert_to_None(value) :
    return None if value.strip() == "" else value.strip()

class StudentForm(FlaskForm) :
    hidden = StringField()
    id = StringField(validators=[validators.DataRequired(), validators.Length(min=9, max= 9, message="must be exactly 9 characters"), id_not_ditto])
    first_name = StringField(validators=[validators.DataRequired(), validators.Length(min=2)])
    last_name = StringField(validators=[validators.DataRequired(), validators.Length(min=2)])
    gender = RadioField(validators=[validators.DataRequired()], choices=[("m", "male"), ("f", "female")])
    year_level = IntegerField(validators=[validators.DataRequired(), validators.NumberRange(min=1, max = 5)])
    program_code = StringField(validators=[program_exists], filters=[convert_to_None])