from flask_wtf import FlaskForm
from wtforms import StringField, ValidationError, validators, SubmitField, BooleanField
from .model import Colleges

def code_not_ditto(form, field) :
    print(field.data, form.hidden.data, field.data == form.hidden.data)
    print(f"'{field.data}' == '{form.hidden.data}'")
    if (Colleges.check_code_exists(field.data) and form.hidden.data != field.data) :
        raise ValidationError("college code alr exists")

class CollegeForm(FlaskForm) :
    hidden = StringField()
    code = StringField(validators=[validators.DataRequired(), code_not_ditto], filters=[lambda x : x.strip() if x else x])
    name = StringField(validators=[validators.DataRequired(), validators.Length(min=7)])
    
