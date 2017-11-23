# -*- coding: utf-8 -*-

from flask import Flask, flash, render_template, redirect, request, jsonify, session, url_for, send_from_directory
from app.db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.directors import Director
from app.models.users_to_films import UsersToFilms
import json
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
import os


class DoomDirector(object):
    def __init__(self, *args):
        super(DoomDirector, self).__init__(*args)
        self.name = None
        self.id = None

class DirectorContoller(object):
    def __init__(self, *args):
        super(DirectorContoller, self).__init__(*args)

    def add(self, name):
        response = {'status': 200}

        try:
            db = get_db()
            director = Director(
                name=name
            )
            db.session.add(director)
            # db.session.commit()
        except Exception as e:
            response = {'status': 400}
            response['err'] = e

        return jsonify(response)

    def get_all(self):
        directors = Director.query.all()
        res = []

        for director in directors:
            print(director)
            d = {
                'name': director.name,
                'id': director.id
            }
            res.append(d)
        print(res)
        return jsonify(res)

    def get(self, id=None, name=None):
        if id is not None:
            director = Director.query.filter_by(
                id=id
            ).first()
        if name is not None:
            director = Director.query.filter_by(
                name=name
            ).first()
        if director is None:
            return DoomDirector()
        return director
