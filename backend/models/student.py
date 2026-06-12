from . import db
from datetime import datetime

class Student(db.Document):
    meta = {'collection': 'students'}

    student_id = db.StringField(required=True, unique=True, max_length=20)  # STU0001, etc.
    roll_number = db.StringField(required=True, unique=True, max_length=50)
    first_name = db.StringField(required=True, max_length=100)
    last_name = db.StringField(required=True, max_length=100)
    gender = db.StringField(max_length=20)
    dob = db.StringField() # Storing as string or DateTime, string is easier for ISO dates from UI
    blood_group = db.StringField(max_length=10)
    nationality = db.StringField(default='Indian', max_length=50)
    
    phone = db.StringField(max_length=20)
    alternate_phone = db.StringField(max_length=20)
    email = db.EmailField(required=True, unique=True)
    address = db.StringField()
    city = db.StringField(max_length=100)
    state = db.StringField(max_length=100)
    pincode = db.StringField(max_length=20)

    father_name = db.StringField(max_length=150)
    father_occupation = db.StringField(max_length=100)
    father_phone = db.StringField(max_length=20)
    mother_name = db.StringField(max_length=150)
    mother_occupation = db.StringField(max_length=100)
    mother_phone = db.StringField(max_length=20)
    guardian_name = db.StringField(max_length=150)
    guardian_contact = db.StringField(max_length=20)

    department_id = db.StringField(max_length=10)
    course_id = db.StringField(max_length=10)
    semester = db.IntField()
    section = db.StringField(max_length=10)
    academic_year = db.StringField(max_length=20)
    admission_date = db.StringField()
    status = db.StringField(default='Active', max_length=20)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def to_dict(self, department_name=None, course_name=None):
        return {
            'id': self.student_id,
            'rollNumber': self.roll_number,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'fullName': self.full_name,
            'gender': self.gender,
            'dob': self.dob,
            'bloodGroup': self.blood_group,
            'nationality': self.nationality,
            'phone': self.phone,
            'alternatePhone': self.alternate_phone,
            'email': self.email,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'fatherName': self.father_name,
            'fatherOccupation': self.father_occupation,
            'fatherPhone': self.father_phone,
            'motherName': self.mother_name,
            'motherOccupation': self.mother_occupation,
            'motherPhone': self.mother_phone,
            'guardianName': self.guardian_name,
            'guardianContact': self.guardian_contact,
            'departmentId': self.department_id,
            'departmentName': department_name,
            'courseId': self.course_id,
            'courseName': course_name,
            'semester': self.semester,
            'section': self.section,
            'academicYear': self.academic_year,
            'admissionDate': self.admission_date,
            'status': self.status,
            'attendancePercentage': 100, 
            'feeStatus': 'Paid',
            'totalFees': 0,
            'paidAmount': 0,
            'pendingAmount': 0
        }
