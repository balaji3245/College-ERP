from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.department import Department
from models.student import Student
from models.teacher import Teacher
from models.course import Course
import hashlib

departments_bp = Blueprint('departments', __name__)

COLORS = ['indigo', 'blue', 'teal', 'green', 'purple', 'orange', 'red', 'yellow']

def enrich_dept(d):
    d_dict = d.to_dict()
    d_dict['totalStudents'] = Student.objects(department_id=d.dept_id).count()
    d_dict['totalFaculty'] = Teacher.objects(department_id=d.dept_id).count()
    d_dict['totalCourses'] = Course.objects(department_id=d.dept_id).count()
    color_idx = int(hashlib.md5(d.dept_id.encode()).hexdigest(), 16) % len(COLORS)
    d_dict['color'] = COLORS[color_idx]
    d_dict['description'] = d_dict.get('description') or f"Department of {d.name} offering undergraduate and postgraduate programs."
    d_dict['established'] = d_dict.get('established') or '2000'
    return d_dict

@departments_bp.route('/', methods=['GET'])
@jwt_required()
def get_departments():
    departments = Department.objects.all()
    return jsonify([enrich_dept(d) for d in departments])

@departments_bp.route('/', methods=['POST'])
@jwt_required()
def add_department():
    data = request.get_json()
    if not data.get('name') or not data.get('shortName'):
        return jsonify({'msg': 'Name and Short Name are required'}), 400

    # Auto-generate dept_id
    count = Department.objects.count()
    dept_id = f"D{str(count + 1).zfill(3)}"
    # Make sure it's unique
    while Department.objects(dept_id=dept_id).first():
        count += 1
        dept_id = f"D{str(count + 1).zfill(3)}"

    dept = Department(
        dept_id=dept_id,
        name=data['name'],
        short_name=data['shortName'],
        hod=data.get('hod', ''),
        established=data.get('established', '2024'),
        description=data.get('description', ''),
        total_faculty=0,
        total_students=0,
        status='Active'
    )
    dept.save()
    return jsonify(enrich_dept(dept)), 201

@departments_bp.route('/<dept_id>', methods=['PUT'])
@jwt_required()
def update_department(dept_id):
    dept = Department.objects(dept_id=dept_id).first()
    if not dept:
        return jsonify({'msg': 'Department not found'}), 404
    data = request.get_json()
    if data.get('name'):
        dept.name = data['name']
    if data.get('shortName'):
        dept.short_name = data['shortName']
    if data.get('hod') is not None:
        dept.hod = data['hod']
    if data.get('established') is not None:
        dept.established = data['established']
    if data.get('description') is not None:
        dept.description = data['description']
    dept.save()
    return jsonify(enrich_dept(dept))

@departments_bp.route('/<dept_id>', methods=['DELETE'])
@jwt_required()
def delete_department(dept_id):
    dept = Department.objects(dept_id=dept_id).first()
    if not dept:
        return jsonify({'msg': 'Department not found'}), 404
    dept.delete()
    return jsonify({'msg': 'Department deleted'})
