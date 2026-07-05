import os

from flask import request, jsonify
from .schemas import user_schema, login_schema, user_create_schema
from marshmallow import ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import Users, db
from . import users_bp
from app.util.auth import encode_token, token_required
from datetime import datetime, timezone, timedelta
import secrets


#Register and create a new user
@users_bp.route('/register', methods=['POST'])
def register():
    try:
        data = user_create_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    # Check if user already exists
    existing_user = db.session.query(Users).where(Users.email == data['email']).first()
    if existing_user:
        return jsonify({
            'error': 'Email already registered.',
            'code': 'EMAIL_EXISTS',
        }), 409

    # Create new user
    new_user = Users(
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role='MEMBER' # Default role is MEMBER. Admins should be created manually or through a separate process.
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'User registered successfully',
        'user': user_schema.dump(new_user)
    }), 201


#Login and get token
@users_bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    user = db.session.query(Users).where(Users.email == data['email']).first()

    if user and check_password_hash(user.password_hash, data['password']):
        token = encode_token(user.id, user.role)
        return jsonify({
            'message': 'Successfully Logged in',
            'token': token,
            'user': user_schema.dump(user)
        }), 200

    return jsonify({
        'error': 'Invalid credentials.',
        'code':  'INVALID_CREDENTIALS',
    }), 401

