"""Serializers for the client portal.

Hand-rolled dicts rather than SQLAlchemyAutoSchema on purpose: these shapes
mirror the frontend's types in frontend/src/types/index.ts, and being explicit
guarantees internal columns (pipeline status, foreign keys, stored filenames)
never leak into responses by accident.
"""
from marshmallow import Schema, fields, validate

from app.models import ProposalFiles, ProposalMessages, Submissions, Users

# Internal pipeline status -> which portal tab the proposal shows under
PORTAL_STATUS = {
    'NEW': 'active',
    'CONTACTED': 'active',
    'PROPOSAL_SENT': 'active',
    'WON': 'completed',
    'LOST': 'declined',
}


class MessageCreateSchema(Schema):
    body = fields.Str(required=True, validate=validate.Length(min=1, max=5000))


message_create_schema = MessageCreateSchema()


def dump_client(user: Users) -> dict:
    return {
        'firstName': user.first_name or '',
        'lastName': user.last_name or '',
        'email': user.email,
        'phone': user.phone or '',
        'companyName': user.company_name or '',
    }


def dump_message(message: ProposalMessages) -> dict:
    return {
        'id': message.id,
        'from': 'client' if message.sender.role == 'CLIENT' else 'team',
        'text': message.body,
        'sent': message.created_at.strftime('%-m/%-d/%Y'),
    }


def dump_file(file: ProposalFiles) -> dict:
    size_bytes = file.size_bytes
    if size_bytes >= 1024 * 1024:
        size = f'{round(size_bytes / (1024 * 1024))} MB'
    else:
        size = f'{max(1, round(size_bytes / 1024))} KB'

    return {
        'id': file.id,
        'name': file.original_name,
        'type': file.original_name.rsplit('.', 1)[-1].upper() if '.' in file.original_name else 'FILE',
        'size': size,
        'uploaded': file.created_at.strftime('%-m/%-d/%Y'),
        'uploadedByClient': file.uploader.role == 'CLIENT',
    }


def dump_proposal(submission: Submissions) -> dict:
    last_updated = submission.proposal.updated_at if submission.proposal else submission.created_at

    return {
        'id': submission.id,
        'title': submission.project.title if submission.project else submission.project_type,
        'status': PORTAL_STATUS.get(submission.status, 'active'),
        'lastUpdated': last_updated.strftime('%B %-d, %Y'),
        'budget': submission.budget_range,
        'timeline': f'{submission.timeline_weeks} Weeks',
        'projectType': submission.project_type,
        'details': submission.description,
        'files': [dump_file(f) for f in submission.files],
        'messages': [dump_message(m) for m in submission.messages],
    }
