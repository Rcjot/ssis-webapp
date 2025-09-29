from . import program_bp
from flask_login import login_required
from flask import jsonify, request
from .forms import ProgramForm
import math
from .model import Programs

@program_bp.route("/")
@login_required
def get_programs() :
    page = int(request.args.get('page', default=1))
    limit = int(request.args.get('limit', default = 10))
    offset = (int(page) - 1) * int(limit) 
    count = Programs.get_count()
    total_pages = math.ceil(count / limit)
    return jsonify(
                   limit=limit, 
                   count=count,
                   page=page, 
                   total_pages=total_pages,
                   programs=Programs.all(limit, offset))

@program_bp.route("/codes")
@login_required
def get_program_codes() :
    return jsonify(codes = Programs.all_codes())

@program_bp.route("/add", methods=["POST"])
@login_required
def add_program() :
    data = request.get_json()
    form = ProgramForm(data=data)
    validated = form.validate()
    error = {
        "code" : form.code.errors,
        "name" : form.name.errors,
        "college_code" : form.college_code.errors,
    }

    if validated :
        new_program = Programs(code=form.code.data,
                               name=form.name.data, 
                               college_code=form.college_code.data
                               )
        
        new_program.add()

        return jsonify(success=True, message="add program successful")
    
    return jsonify(success=False,
                   message="Something went wrong adding program",
                   error =error
                   ), 400

@program_bp.route("/edit/<code>", methods=["POST"])
@login_required
def update_program(code) :
    data = request.get_json()
    data["hidden"] = code
    form = ProgramForm(data=data)
    validated = form.validate()
    error = {
        "code" : form.code.errors,
        "name" : form.name.errors,
        "college_code" : form.college_code.errors,

    }

    if validated :
        Programs.update(code, form.code.data, form.name.data, form.college_code.data)     

        return jsonify(success=True, message="edit program successful")
    
    return jsonify(success=False,
                   message="Something went wrong updating program",
                   error =error
                   ), 400

@program_bp.route("/delete/<code>", methods=["POST"])
@login_required
def delete_program(code) :
    if Programs.delete(code) :
        return jsonify(success=True, message="delete program successful")
    return jsonify(success=False, message="something went wrong deleting")

    