from . import college_bp
from .model import Colleges
from flask_login import login_required
from flask import request, jsonify
from .forms import CollegeForm

@college_bp.route("/") 
@login_required
def get_colleges() :
    return jsonify(colleges=Colleges.all())

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


    