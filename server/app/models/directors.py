from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app import login_manager
from app.db import get_db

db = get_db()


class Director(db.Model):
    """
    Create Directors table
    """

    # Ensures table will be named in plural and not in singular
    # as is the name of the model
    __tablename__ = 'directors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('director_name', db.String(60), unique=True)
