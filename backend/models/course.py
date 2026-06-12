from . import db
from datetime import datetime

class Course(db.Document):
    meta = {'collection': 'courses'}

    course_id = db.StringField(required=True, unique=True, max_length=10) # C001
    name = db.StringField(required=True, max_length=150)
    department_id = db.StringField(required=True, max_length=10)
    duration = db.StringField(max_length=20) # e.g., '4 Years'
    semesters = db.IntField(default=8)
    total_seats = db.IntField(default=60)
    fees = db.FloatField(default=0.0)
    status = db.StringField(default='Active', max_length=20)
    created_at = db.DateTimeField(default=datetime.utcnow)

    def to_dict(self, department_name=None):
        return {
            'id': self.course_id,
            'name': self.name,
            'departmentId': self.department_id,
            'departmentName': department_name,
            'duration': self.duration,
            'semesters': self.semesters,
            'totalSeats': self.total_seats,
            'fees': self.fees,
            'status': self.status,
        }
