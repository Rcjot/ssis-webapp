from . import college_bp
from .model import Colleges
from flask_login import login_required
from flask import request, jsonify
from .forms import CollegeForm
import math

@college_bp.route("/") 
@login_required
def get_colleges() :
    page = int(request.args.get('page', default=1))
    limit = int(request.args.get('limit', default = 10))
    offset = (int(page) - 1) * int(limit) 
    count = Colleges.get_count()
    total_pages = math.ceil(count/limit)
    return jsonify(                   
                   limit=limit, 
                   count=count,
                   page=page, 
                   total_pages=total_pages,
                   colleges=Colleges.all(limit, offset))

@college_bp.route("/codes")
@login_required
def get_program_codes() :
    return jsonify(codes = Colleges.all_codes())

@college_bp.route("/add", methods=["POST"])
@login_required
def add_college() :
    data = request.get_json()
    form = CollegeForm(data=data)
    validated = form.validate()
    error = {
        "code" : form.code.errors,
        "name" : form.name.errors
    }

    if validated :
        new_college = Colleges(code=form.code.data, name=form.name.data)
        
        new_college.add()

        return jsonify(success=True, message="add college successful")
    
    return jsonify(success=False,
                   message="Something went wrong adding college",
                   error =error
                   ), 400

@college_bp.route("/edit/<code>", methods=["POST"])
@login_required
def update_college(code) :
    data = request.get_json()
    data["hidden"] = code
    form = CollegeForm(data=data)
    validated = form.validate()
    error = {
        "code" : form.code.errors,
        "name" : form.name.errors
    }

    if validated :
        Colleges.update(code, form.code.data, form.name.data)     

        return jsonify(success=True, message="edit college successful")
    
    return jsonify(success=False,
                   message="Something went wrong updating college",
                   error =error
                   ), 400

@college_bp.route("/delete/<code>", methods=["POST"])
@login_required
def delete_college(code) :
    if Colleges.delete(code) :
        return jsonify(success=True, message="delete college successful")
    return jsonify(success=False, message="something went wrong deleting")


    