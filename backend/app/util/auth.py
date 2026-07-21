from datetime import datetime, timedelta, timezone
from functools import wraps

import jose
from flask import current_app, jsonify, request
from jose import jwt


def encode_token(user_id, role):
    payload = {
        'exp': datetime.now(timezone.utc) + timedelta(hours=14),
        'iat': datetime.now(timezone.utc),
        'sub': str(user_id),
        'role': role,
    }

    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def token_required(f):
    @wraps(f)
    def decoration(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'token missing from authorization headers'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            # auth user id is text/UUID. Don't coerce to int.
            request.user_id = data['sub']
            request.user_role = data['role']

        except jose.exceptions.ExpiredSignatureError:
            return jsonify({'message': 'token is expired'}), 403
        except jose.exceptions.JWTError:
            return jsonify({'message': 'invalid token'}), 403

        return f(*args, **kwargs)

    return decoration


def roles_required(*roles):
    """Like token_required, but the token's role must also be in `roles`.

    Use for team-only endpoints, e.g. @roles_required('MEMBER', 'ADMIN').
    """
    def decorator(f):
        @wraps(f)
        @token_required
        def decoration(*args, **kwargs):
            if request.user_role not in roles:
                return jsonify({'error': 'forbidden'}), 403
            return f(*args, **kwargs)

        return decoration

    return decorator
