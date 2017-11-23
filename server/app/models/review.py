from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app import login_manager
from app.db import get_db

db = get_db()


class Review(db.Model):
    """
    Create Directors table
    """

    # Ensures table will be named in plural and not in singular
    # as is the name of the model
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    film_id = db.Column(db.Integer, db.ForeignKey('films.id'))
