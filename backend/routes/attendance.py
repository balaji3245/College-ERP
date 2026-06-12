from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.attendance import Attendance

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['GET'])
@jwt_required()
def get_attendance():
    # Allow filtering by studentId or date
    student_id = request.args.get('studentId')
    date = request.args.get('date')
    
    query = {}
    if student_id:
        query['student_id'] = student_id
    if date:
        query['date'] = date
        
    records = Attendance.objects(**query)
    return jsonify([a.to_dict() for a in records])

@attendance_bp.route('/', methods=['POST'])
@jwt_required()
def mark_attendance():
    data = request.get_json()
    
    # If array is passed (batch update)
    if isinstance(data, list):
        created = []
        for record in data:
            att = Attendance(
                student_id=record.get('studentId'),
                date=record.get('date'),
                status=record.get('status'),
                subject=record.get('subject'),
                marked_by=record.get('markedBy')
            )
            att.save()
            created.append(att.to_dict())
        return jsonify(created), 201
        
    # Single update
    att = Attendance(
        student_id=data.get('studentId'),
        date=data.get('date'),
        status=data.get('status'),
        subject=data.get('subject'),
        marked_by=data.get('markedBy')
    )
    att.save()
    return jsonify(att.to_dict()), 201
