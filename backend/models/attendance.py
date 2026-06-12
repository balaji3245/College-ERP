from . import db
from datetime import datetime

class Attendance(db.Document):
    meta = {'collection': 'attendance'}

    student_id = db.StringField(required=True, max_length=20)
    date = db.StringField(required=True)
    status = db.StringField(required=True, max_length=20) # Present, Absent, Late, Half Day
    subject = db.StringField(max_length=100)
    marked_by = db.StringField(max_length=150) # Teacher name/id
    created_at = db.DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'studentId': self.student_id,
            'date': self.date,
            'status': self.status,
            'subject': self.subject,
            'markedBy': self.marked_by
        }
