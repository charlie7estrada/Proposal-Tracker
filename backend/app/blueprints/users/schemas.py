from app.extensions import ma
from app.models import Users
from marshmallow import fields, Schema

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Users
        load_only = ("password_hash",)
        include_fk = True

class UserCreateSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


user_schema = UserSchema()
user_create_schema = UserCreateSchema()
login_schema = LoginSchema()