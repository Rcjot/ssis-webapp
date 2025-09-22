from . import student_bp
from ..mockdata import mock_students


@student_bp.route("/")
def get_students() :
    return {
        "students" : mock_students
    }