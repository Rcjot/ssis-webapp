from . import college_bp
from .model import Colleges
from flask_login import login_required
from flask import request, jsonify
from .forms import CollegeForm
import math

@college_bp.route("/") 
@login_required
def get_colleges() :
    search = request.args.get('search', default="", type=str)
    sortBy = request.args.get('sortBy', default="none", type=str)
    direction = request.args.get('direction', default="ASC", type=str)
    page = request.args.get('page', default=1, type= int)
    limit = request.args.get('limit', default = 10, type=int)
    offset = (page - 1) * limit
    count = Colleges.get_count(search)
    total_pages = math.ceil(count/limit)

    if sortBy not in ['code', 'name'] :
        sortBy = 'none'

    if direction not in ['ASC', 'DESC'] :
        direction = 'ASC'

    print(search, sortBy, direction, page, limit, offset, count, total_pages)

    return jsonify(                   
                   limit=limit, 
                   count=count,
                   page=page, 
                   total_pages=total_pages,
                   colleges=Colleges.all(limit, offset, search, sortBy, direction))

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


    