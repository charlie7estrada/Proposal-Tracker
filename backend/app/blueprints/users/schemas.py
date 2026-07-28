from app.extensions import ma
from app.models import Users
from marshmallow import fields, Schema, validate

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Users
        load_only = ("password_hash",)
        include_fk = True

class UserCreateSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8, max=200))
    # Profile shown on the portal's "My Details" card
    first_name = fields.Str(load_default=None, validate=validate.Length(max=100))
    last_name = fields.Str(load_default=None, validate=validate.Length(max=100))
    phone = fields.Str(load_default=None, validate=validate.Length(max=50))
    company_name = fields.Str(load_default=None, validate=validate.Length(max=200))

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


user_schema = UserSchema()
user_create_schema = UserCreateSchema()
login_schema = LoginSchema()