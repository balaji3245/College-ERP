from . import db
from datetime import datetime

class Department(db.Document):
    meta = {'collection': 'departments'}

    dept_id = db.StringField(required=True, unique=True, max_length=10) # D001
    name = db.StringField(required=True, max_length=150)
    short_name = db.StringField(required=True, max_length=20)
    hod = db.StringField(max_length=100)
    established = db.StringField(max_length=10)
    description = db.StringField()
    total_faculty = db.IntField(default=0)
    total_students = db.IntField(default=0)
    status = db.StringField(default='Active', max_length=20)
    created_at = db.DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.dept_id, # return dept_id as 'id' for frontend
            'name': self.name,
            'shortName': self.short_name,
            'hod': self.hod,
            'established': self.established,
            'description': self.description,
            'totalFaculty': self.total_faculty,
            'totalStudents': self.total_students,
            'status': self.status,
        }
