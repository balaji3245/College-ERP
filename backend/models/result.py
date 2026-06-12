from . import db

class Result(db.Document):
    meta = {'collection': 'results'}

    student_id = db.StringField(required=True, max_length=20)
    semester = db.IntField(required=True)
    subject = db.StringField(required=True, max_length=150)
    internal_marks = db.FloatField(default=0)
    external_marks = db.FloatField(default=0)
    total_marks = db.FloatField(default=0)
    grade = db.StringField(max_length=5)
    status = db.StringField(max_length=20) # Pass/Fail
    academic_year = db.StringField(max_length=20)

    def to_dict(self):
        return {
            'id': str(self.id),
            'studentId': self.student_id,
            'semester': self.semester,
            'subject': self.subject,
            'internalMarks': self.internal_marks,
            'externalMarks': self.external_marks,
            'totalMarks': self.total_marks,
            'grade': self.grade,
            'status': self.status,
            'academicYear': self.academic_year
        }
