from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.document import Document

documents_bp = Blueprint('documents', __name__)

@documents_bp.route('/', methods=['GET'])
@jwt_required()
def get_documents():
    student_id = request.args.get('studentId')
    query = {}
    if student_id:
        query['student_id'] = student_id
        
    records = Document.objects(**query)
    return jsonify([d.to_dict() for d in records])

@documents_bp.route('/', methods=['POST'])
@jwt_required()
def add_document():
    data = request.get_json()
    doc = Document(
        student_id=data.get('studentId'),
        name=data.get('name'),
        type=data.get('type'),
        file_path=data.get('url', '/documents/placeholder.pdf'),
        status=data.get('status', 'Pending')
    )
    doc.save()
    return jsonify(doc.to_dict()), 201

@documents_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_document(id):
    doc = Document.objects(id=id).first()
    if not doc:
        return jsonify({"msg": "Document not found"}), 404
    doc.delete()
    return jsonify({"msg": "Document deleted"})
