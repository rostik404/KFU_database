from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app import login_manager
from app.db import get_db

db = get_db()

class Film(db.Model):
    """
    Create an Films table
    """

    # Ensures table will be named in plural and not in singular
    # as is the name of the model
    __tablename__ = 'films'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(60), index=True, unique=False)
    year = db.Column(db.String(60), index=True, unique=False)
    director = db.Column(db.Integer, db.ForeignKey('directors.id'), index=True)
    genre = db.Column(db.String(60), index=True, unique=False)
    image = db.Column(db.String(260), index=True, unique=False)
