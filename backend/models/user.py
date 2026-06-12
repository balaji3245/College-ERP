from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Document):
    meta = {'collection': 'users'}
    
    email = db.EmailField(required=True, unique=True)
    password_hash = db.StringField(required=True)
    name = db.StringField(required=True, max_length=100)
    role = db.StringField(required=True, choices=('admin', 'teacher', 'student', 'parent'))
    linked_id = db.StringField(max_length=20)  # Links to student/teacher ID
    is_active = db.BooleanField(default=True)
    created_at = db.DateTimeField(default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'linkedId': self.linked_id,
            'isActive': self.is_active,
        }
