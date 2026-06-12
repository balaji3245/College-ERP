from flask import Blueprint, request, jsonify
from models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.objects(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    if not user.is_active:
        return jsonify({"msg": "Account is inactive"}), 403

    # Generate token (identity must be a string)
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify(access_token=access_token, user=user.to_dict())

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user=user.to_dict())
