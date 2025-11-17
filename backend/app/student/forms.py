from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import StringField, ValidationError, validators, IntegerField, RadioField
from .model import Students
from ..program.model import Programs
import re
from datetime import datetime

def id_not_ditto(form, field) :
    if (Students.check_id_exists(field.data) and field.data != form.hidden) :
        raise ValidationError("student id alr exists")

def program_exists(form, field) :
    if (not Programs.check_code_exists(field.data) and field.data is not None) :
        raise ValidationError("program code doesnt exist")

def correct_format(form, field) :
    pattern = r'^[0-9]{4}-[0-9]{4}$'
    if (not re.fullmatch(pattern, field.data)) :
        raise ValidationError("must match format YYYY-NNNN")
    year = int(field.data[:4])
    if (year < 1968 or year > datetime.now().year ) :
        raise ValidationError("must be a valid year")


def convert_to_None(value) :
    return None if value.strip() == "" else value.strip()

def is_image(form, field) :
    file = field.data

    if not file :
        return
    if not file.mimetype.startswith("image/") :
        raise ValidationError("file must be an image!")

class StudentForm(FlaskForm) :
    hidden = StringField()
    id = StringField(validators=[validators.DataRequired(), validators.Length(min=9, max= 9, message="must be exactly 9 characters"), id_not_ditto, correct_format])
    first_name = StringField(validators=[validators.DataRequired(), validators.Length(min=2)], filters=[lambda x : x.strip() if x else x])
    last_name = StringField(validators=[validators.DataRequired(), validators.Length(min=2)], filters=[lambda x : x.strip() if x else x])
    gender = RadioField(validators=[validators.DataRequired()], choices=[("m", "male"), ("f", "female")])
    year_level = IntegerField(validators=[validators.DataRequired(), validators.NumberRange(min=1, max = 5)])
    program_code = StringField(validators=[program_exists], filters=[convert_to_None])
    student_pfp_file = FileField(validators=[is_image]) 

