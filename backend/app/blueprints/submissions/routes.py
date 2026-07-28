from flask import current_app, request, jsonify
from app.models import Submissions, Users, db
from .schemas import submission_schema
from marshmallow import ValidationError
from app.util.auth import roles_required
from . import submissions_bp


# Create a new submission (public: this is the intake form)
@submissions_bp.route('/', methods=['POST'])
def create_submission():
    try:
        data = submission_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    try:
        new_submission = Submissions(**data)

        # If this email already has a portal account, attach the new request
        # to it so it appears on their dashboard right away
        client = db.session.query(Users).where(
            Users.email == new_submission.contact_email,
            Users.role == 'CLIENT',
        ).first()
        if client:
            new_submission.client_id = client.id

        db.session.add(new_submission)
        db.session.commit()

        return jsonify({
            'message': 'Submission created successfully',
            'submission': submission_schema.dump(new_submission)
        }), 201

    except Exception:
        db.session.rollback()
        current_app.logger.exception('failed to create submission')
        return jsonify({'error': 'internal server error'}), 500


# Get a specific submission by ID (team only: submissions hold lead PII)
@submissions_bp.route('/<submission_id>', methods=['GET'])
@roles_required('MEMBER', 'ADMIN')
def get_submission(submission_id):
    submission = db.session.query(Submissions).where(Submissions.id == submission_id).first()

    if not submission:
        return jsonify({'error': 'Submission not found'}), 404

    return jsonify({
        'submission': submission_schema.dump(submission)
    }), 200


# Get all submissions (team only)
@submissions_bp.route('/', methods=['GET'])
@roles_required('MEMBER', 'ADMIN')
def get_all_submissions():
    submissions = db.session.query(Submissions).all()

    return jsonify({
        'submissions': [submission_schema.dump(sub) for sub in submissions]
    }), 200




