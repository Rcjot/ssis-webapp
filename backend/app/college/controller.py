from . import college_bp
from ..mockdata import mock_colleges

@college_bp.route("/") 
def get_colleges() :
    return {
        "colleges" : mock_colleges
    }