from . import db
from datetime import datetime

class Teacher(db.Document):
    meta = {'collection': 'teachers'}

    teacher_id = db.StringField(required=True, unique=True, max_length=20)  # TCH001, etc.
    first_name = db.StringField(required=True, max_length=100)
    last_name = db.StringField(required=True, max_length=100)
    department_id = db.StringField(max_length=10)
    designation = db.StringField(max_length=100)
    qualification = db.StringField(max_length=150)
    specialization = db.StringField(max_length=150)
    experience = db.IntField(default=0) # in years
    
    email = db.EmailField(required=True, unique=True)
    phone = db.StringField(max_length=20)
    joining_date = db.StringField()
    status = db.StringField(default='Active', max_length=20)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def to_dict(self, department_name=None):
        return {
            'id': self.teacher_id,
            'employeeId': self.teacher_id,  # frontend uses employeeId for display
            'firstName': self.first_name,
            'lastName': self.last_name,
            'fullName': self.full_name,
            'departmentId': self.department_id,
            'departmentName': department_name,
            'designation': self.designation,
            'qualification': self.qualification,
            'specialization': self.specialization,
            'experience': self.experience or 0,
            'email': self.email,
            'phone': self.phone,
            'joiningDate': self.joining_date,
            'status': self.status or 'Active',
            'classesPerWeek': 15
        }
