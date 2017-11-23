# -*- coding: utf-8 -*-

import re
from flask import Flask, flash, render_template, redirect, request, jsonify, session, url_for, send_from_directory
from app.db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.film import Film
from app.models.review import Review
from app.models.users_to_films import UsersToFilms
import json
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
import os


class ReviewController(object):
    def __init__(self, *args):
        super(ReviewController, self).__init__(*args)

    def get(self, film_id):
        db = get_db()
        response = {}
        print('<????')
        print(film_id)

        reviews = db.engine.execute("SELECT * FROM reviews WHERE film_id={}".format(film_id))

        res = []
        for review in reviews:
            user = User.query.filter_by(id=review.user_id).first()
            print(user.login)
            res.append({'user': user.login, 'content': review.content})
        return jsonify(res)

    def add(self, data):
        db = get_db()
        response = {'status': 200}


        print('>?>?')
        print(data.get('filmId'))
        print(data.get('content'))

        # test'); INSERT INTO reviews (user_id,film_id,content) VALUES('10','1', 'AAAA');"#
        content = data.get('content')[0]
        # content = re.escape(data.get('content')[0])
        db.engine.execute("INSERT INTO reviews (user_id,film_id,content) VALUES('{}','{}','{}')".format(
            int(session['user']['id']), int(data.get('filmId')[0]), content
        ))
        # db.session.add(review)
        # db.session.commit()

        return jsonify(response)
