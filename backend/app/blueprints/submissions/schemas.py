from app.extensions import ma
from app.models import Submissions
from marshmallow import fields, Schema

class SubmissionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Submissions
        include_fk = True


submission_schema = SubmissionSchema()
