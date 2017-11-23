from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app import login_manager
from app.db import get_db

db = get_db()


class UsersToFilms(db.Model):
    """
    Create an Films table
    """

    # Ensures table will be named in plural and not in singular
    # as is the name of the model
    __tablename__ = 'users_to_films'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
    film_id = db.Column('film_id', db.Integer, db.ForeignKey('films.id'))
