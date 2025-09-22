from . import program_bp
from ..mockdata import mock_programs


@program_bp.route("/")
def get_programs() :
    return {
        "programs" : mock_programs
    }