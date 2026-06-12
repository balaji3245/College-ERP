from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.teacher import Teacher
from models.department import Department

teachers_bp = Blueprint('teachers', __name__)

@teachers_bp.route('/', methods=['GET'])
@jwt_required()
def get_teachers():
    teachers = Teacher.objects.all()
    result = []
    for t in teachers:
        dept = Department.objects(dept_id=t.department_id).first()
        result.append(t.to_dict(department_name=dept.name if dept else None))
    return jsonify(result)

@teachers_bp.route('/', methods=['POST'])
@jwt_required()
def add_teacher():
    data = request.get_json()
    if not data.get('id'):
        count = Teacher.objects.count()
        data['id'] = f"TCH{str(count + 1).zfill(3)}"
        
    teacher = Teacher(
        teacher_id=data['id'],
        first_name=data.get('firstName', ''),
        last_name=data.get('lastName', ''),
        department_id=data.get('departmentId'),
        designation=data.get('designation'),
        specialization=data.get('specialization'),
        experience=int(data.get('experience', 0)),
        email=data.get('email'),
        phone=data.get('phone')
    )
    teacher.save()
    return jsonify(teacher.to_dict()), 201

@teachers_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_teacher(id):
    teacher = Teacher.objects(teacher_id=id).first()
    if not teacher:
        return jsonify({"msg": "Teacher not found"}), 404
    teacher.delete()
    return jsonify({"msg": "Teacher deleted"})
