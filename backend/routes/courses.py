from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.course import Course
from models.department import Department

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/', methods=['GET'])
@jwt_required()
def get_courses():
    courses = Course.objects.all()
    result = []
    for c in courses:
        dept = Department.objects(dept_id=c.department_id).first()
        result.append(c.to_dict(department_name=dept.name if dept else None))
    return jsonify(result)

@courses_bp.route('/', methods=['POST'])
@jwt_required()
def add_course():
    data = request.get_json()
    if not data.get('id'):
        count = Course.objects.count()
        data['id'] = f"C{str(count + 1).zfill(3)}"
        
    course = Course(
        course_id=data['id'],
        name=data.get('name'),
        department_id=data.get('departmentId'),
        duration=data.get('duration'),
        semesters=int(data.get('semesters', 8)),
        total_seats=int(data.get('totalSeats', 60)),
        fees=float(data.get('fees', 0.0))
    )
    course.save()
    return jsonify(course.to_dict()), 201

@courses_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_course(id):
    course = Course.objects(course_id=id).first()
    if not course:
        return jsonify({"msg": "Course not found"}), 404
    course.delete()
    return jsonify({"msg": "Course deleted"})
