from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def hello_world():
    return {
        "Home" : "Hello SSIS!"
    }


@app.route("/students") 
def get_students():
    return {
        "Students" : [
        ]
    }