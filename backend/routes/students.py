from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.student import Student
from models.department import Department
from models.course import Course

students_bp = Blueprint('students', __name__)

@students_bp.route('/', methods=['GET'])
@jwt_required()
def get_students():
    students = Student.objects.all()
    result = []
    # Optionally map department and course names for the list view
    for s in students:
        dept = Department.objects(dept_id=s.department_id).first()
        course = Course.objects(course_id=s.course_id).first()
        result.append(s.to_dict(
            department_name=dept.name if dept else None,
            course_name=course.name if course else None
        ))
    return jsonify(result)

@students_bp.route('/', methods=['POST'])
@jwt_required()
def add_student():
    data = request.get_json()
    
    # Auto-generate ID if not provided
    if not data.get('id'):
        count = Student.objects.count()
        data['id'] = f"STU{str(count + 1).zfill(4)}"
        
    if not data.get('rollNumber'):
        data['rollNumber'] = f"2025{str(Student.objects.count() + 1).zfill(4)}"

    student = Student(
        student_id=data['id'],
        roll_number=data['rollNumber'],
        first_name=data.get('firstName', ''),
        last_name=data.get('lastName', ''),
        gender=data.get('gender'),
        dob=data.get('dob'),
        email=data.get('email'),
        phone=data.get('phone'),
        department_id=data.get('departmentId'),
        course_id=data.get('courseId'),
        semester=int(data.get('semester')) if data.get('semester') else None
    )
    
    student.save()
    
    return jsonify(student.to_dict()), 201

@students_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_student(id):
    student = Student.objects(student_id=id).first()
    if not student:
        return jsonify({"msg": "Student not found"}), 404
    student.delete()
    return jsonify({"msg": "Student deleted"})
