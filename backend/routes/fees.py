from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.fee import Fee
from models.student import Student

fees_bp = Blueprint('fees', __name__)

@fees_bp.route('/', methods=['GET'])
@jwt_required()
def get_fees():
    fees = Fee.objects.all()
    result = []
    for f in fees:
        student = Student.objects(student_id=f.student_id).first()
        result.append(f.to_dict(student_name=student.full_name if student else None))
    return jsonify(result)

@fees_bp.route('/', methods=['POST'])
@jwt_required()
def add_fee():
    data = request.get_json()
    if not data.get('invoiceNumber'):
        count = Fee.objects.count()
        data['invoiceNumber'] = f"INV-2026-{str(count + 1).zfill(3)}"
        
    fee = Fee(
        invoice_number=data['invoiceNumber'],
        student_id=data.get('studentId'),
        amount=float(data.get('amount', 0)),
        paid_amount=float(data.get('paidAmount', 0)),
        category=data.get('category'),
        due_date=data.get('dueDate'),
        payment_date=data.get('paymentDate'),
        payment_mode=data.get('paymentMode'),
        status=data.get('status', 'Pending')
    )
    fee.save()
    return jsonify(fee.to_dict()), 201

@fees_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_fee(id):
    fee = Fee.objects(invoice_number=id).first()
    if not fee:
        return jsonify({"msg": "Fee record not found"}), 404
    fee.delete()
    return jsonify({"msg": "Fee record deleted"})
