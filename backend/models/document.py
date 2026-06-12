from . import db
from datetime import datetime

class Document(db.Document):
    meta = {'collection': 'documents'}

    student_id = db.StringField(required=True, max_length=20)
    name = db.StringField(required=True, max_length=150)
    type = db.StringField(required=True, max_length=50) # e.g., Aadhaar Card, 10th Marksheet
    file_path = db.StringField(required=True, max_length=255)
    status = db.StringField(default='Verified', max_length=20)
    uploaded_at = db.DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'studentId': self.student_id,
            'name': self.name,
            'type': self.type,
            'url': self.file_path,
            'status': self.status,
            'uploadDate': self.uploaded_at.isoformat() if self.uploaded_at else None
        }
