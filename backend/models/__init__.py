import mongoengine as db

def init_db(app):
    db.connect(
        db=app.config['MONGODB_SETTINGS']['db'],
        host=app.config['MONGODB_SETTINGS']['host']
    )

# Import models to ensure they are registered
from .user import User
from .department import Department
from .course import Course
from .student import Student
from .teacher import Teacher
from .attendance import Attendance
from .result import Result
from .fee import Fee
from .document import Document
