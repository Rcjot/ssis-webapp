from flask import Flask, render_template
from mockdata import mock_students, mock_programs, mock_colleges
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins="*")

@app.route("/")
def hello_world():
    return {
        "Home" : "Hello SSIS!"
    }


@app.route("/students") 
def get_students():
    return {
        "students" : mock_students
    }

@app.route("/programs") 
def get_programs() :
    return {
        "programs" : mock_programs
    }

@app.route("/colleges") 
def get_colleges() :
    return {
        "colleges" : mock_colleges
    }


if __name__ == "__main__" :
    app.run()