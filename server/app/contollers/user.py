# -*- coding: utf-8 -*-

from flask import Flask, flash, render_template, redirect, request, jsonify, session, url_for, send_from_directory
from app.db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.film import Film
from app.models.users_to_films import UsersToFilms
import json
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
import os


class UserContoller(object):
    def __init__(self, *args):
        super(UserContoller, self).__init__(*args)

    def get_user(self, data):
        db = get_db()
        response = {}

        user = User.query.filter_by(
            login=data.get('login')
        ).first()

        if user and user.verify_password(data.get('password')):
            session['is_logged_in'] = True
            session['user'] = {
                'id': user.id,
                'login': user.login,
                'email': user.email,
                'is_admin': user.is_admin
            }

            response = {
                'status': 200,
                'user': {
                    'login': user.login,
                    'email': user.email
                }
            }
        else:
            response = {
                'status': 400,
                'err': 'Неверный логин или пароль'
            }

        return jsonify(response)

    def add_user(self, data):
        db = get_db()
        response = {'status': 200}

        try:
            user = User(
                email=data.get('email'),
                login=data.get('login'),
                password=data.get('password')
            )
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            response['err'] = 'Поля email и login должны быть уникальными'
        except e:
            print(e)
            response['err'] = 'Unknown err'
        return jsonify(response)
