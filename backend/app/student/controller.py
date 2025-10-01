from . import student_bp
from .model import Students
from flask_login import login_required
from flask import request, jsonify
from .forms import StudentForm
import math


@student_bp.route("/")
# @login_required
def get_students() :
    search = request.args.get('search', default="", type=str)
    sortBy = request.args.get('sortBy', default="none", type=str)
    direction = request.args.get('direction', default="ASC", type=str)

    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default = 10, type=int)
    offset = (page - 1) * limit
    count = Students.get_count(search)
    total_pages = math.ceil(count/limit)

    if sortBy not in ['id','first_name', 'last_name','gender', 'year_level', 'program_code'] :
        sortBy = 'none'

    if direction not in ['ASC', 'DESC'] :
        direction = 'ASC'
        

    return jsonify(limit=limit, 
                   count=count,
                   page=page, 
                   total_pages=total_pages,
                   students=Students.all(limit, offset, search, sortBy, direction))

@student_bp.route("/add", methods=["POST"])
@login_required
def add_student() :
    data = request.get_json()
    form = StudentForm(data=data)
    validated = form.validate()
    error = {
        "id" : form.id.errors,
        "first_name" : form.first_name.errors,
        "last_name" : form.last_name.errors,
        "gender" : form.gender.errors,
        "year_level" : form.year_level.errors,
        "program_code" : form.program_code.errors
    }

    if validated :
        new_student = Students(id=form.id.data,
                               first_name=form.first_name.data,
                               last_name=form.last_name.data,
                               gender=form.gender.data,
                               year_level=form.year_level.data,
                               program_code=form.program_code.data
                               )
        
        new_student.add()

        return jsonify(success=True, message="add student successful")
    
    return jsonify(success=False,
                   message="Something went wrong adding student",
                   error =error
                   ), 400

@student_bp.route("/edit/<id>", methods=["POST"])
@login_required
def update_student(id) :
    data = request.get_json()
    data["hidden"] = id
    form = StudentForm(data=data)
    validated = form.validate()
    error = {
        "id" : form.id.errors,
        "first_name" : form.first_name.errors,
        "last_name" : form.last_name.errors,
        "gender" : form.gender.errors,
        "year_level" : form.year_level.errors,
        "program_code" : form.program_code.errors
    }

    if validated :
        if Students.update(id, 
                        id=form.id.data,
                        first_name=form.first_name.data,
                        last_name=form.last_name.data,
                        gender=form.gender.data,
                        year_level=form.year_level.data,
                        program_code=form.program_code.data
                        )    :
            return jsonify(success=True, message="edit student successful")

            
    return jsonify(success=False,
                   message="Something went wrong updating student",
                   error =error
                   ), 400

@student_bp.route("/delete/<code>", methods=["POST"])
@login_required
def delete_student(code) :
    if Students.delete(code) :
        return jsonify(success=True, message="delete student successful")
    return jsonify(success=False, message="something went wrong deleting")

    