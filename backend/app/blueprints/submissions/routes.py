from flask import request, jsonify
from app.models import Submissions, db
from .schemas import submission_schema
from marshmallow import ValidationError
from . import submissions_bp


# Create a new submission
@submissions_bp.route('/', methods=['POST'])
def create_submission():
    try:
        data = submission_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    try:
        new_submission = Submissions(**data)
        db.session.add(new_submission)
        db.session.commit()

        return jsonify({
            'message': 'Submission created successfully',
            'submission': submission_schema.dump(new_submission)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Get a specific submission by ID
@submissions_bp.route('/<submission_id>', methods=['GET'])
def get_submission(submission_id):
    submission = db.session.query(Submissions).where(Submissions.id == submission_id).first()

    if not submission:
        return jsonify({'error': 'Submission not found'}), 404

    return jsonify({
        'submission': submission_schema.dump(submission)
    }), 200


# Get all submissions
@submissions_bp.route('/', methods=['GET'])
def get_all_submissions():
    submissions = db.session.query(Submissions).all()

    return jsonify({
        'submissions': [submission_schema.dump(sub) for sub in submissions]
    }), 200




