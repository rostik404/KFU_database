from flask import Flask, render_template, redirect, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate

import random
import logging
import os
# local imports
from config import app_config

from db import get_db

# db variable initialization
login_manager = LoginManager()


class App(object):
    """docstring for App."""

    def __init__(self, config_name):
        super(App, self).__init__()
        self.app = self.init_app(config_name)

    def init_app(self, config_name):
        app = Flask(__name__, instance_relative_config=True, static_folder='../../static/dist',
                    template_folder='../../static')
        app.config.from_object(app_config[config_name or 'production'])
        app.config.from_pyfile('config.py')

        self.db = get_db(app)
        self.init_login_manager(app)

        from routes import set_routes
        set_routes(app)
        migrate = Migrate(app, self.db)

        # from app import models

        return app

    def init_login_manager(self, app):
        login_manager.init_app(app)
        login_manager.login_message = "You must be logged in to access this page."
        login_manager.login_view = "auth.login"

    def run(self, **args):
        self.app.run(**args)

    def get_db(self):
        return self.db
