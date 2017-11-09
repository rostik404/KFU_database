from flask_sqlalchemy import SQLAlchemy

_awesome_db = None
def get_db(app=None, **overrides):
    global _awesome_db
    if _awesome_db is None:
        _awesome_db = SQLAlchemy(app, **overrides)
    return _awesome_db
