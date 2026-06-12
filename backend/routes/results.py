from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.result import Result

results_bp = Blueprint('results', __name__)

@results_bp.route('/', methods=['GET'])
@jwt_required()
def get_results():
    student_id = request.args.get('studentId')
    query = {}
    if student_id:
        query['student_id'] = student_id
        
    records = Result.objects(**query)
    return jsonify([r.to_dict() for r in records])

@results_bp.route('/', methods=['POST'])
@jwt_required()
def add_result():
    data = request.get_json()
    res = Result(
        student_id=data.get('studentId'),
        semester=int(data.get('semester')),
        subject=data.get('subject'),
        internal_marks=float(data.get('internalMarks', 0)),
        external_marks=float(data.get('externalMarks', 0)),
        total_marks=float(data.get('totalMarks', 0)),
        grade=data.get('grade'),
        status=data.get('status', 'Pass'),
        academic_year=data.get('academicYear')
    )
    res.save()
    return jsonify(res.to_dict()), 201

@results_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_result(id):
    res = Result.objects(id=id).first()
    if not res:
        return jsonify({"msg": "Result not found"}), 404
    res.delete()
    return jsonify({"msg": "Result deleted"})
