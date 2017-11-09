# -*- coding: utf-8 -*-

from flask import Flask, flash, render_template, redirect, request, jsonify, session
from db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
import json
from sqlalchemy.exc import IntegrityError


def set_routes(app):
    @app.route('/')
    def main():
        return render_template('index.html')

    @app.route('/login', methods=['GET'])
    def login():
        return render_template('index.html')

    @app.route('/get_user', methods=['POST'])
    def get_user():
        db = get_db()
        data = json.loads(request.data)
        response = {}

        user = User.query.filter_by(
            login=data.get('login')
        ).first()

        if user and user.verify_password(data.get('password')):
            session['is_logged_in'] = True
            session['user'] = {
                'id': user.id,
                'login': user.login,
                'email': user.email
            }

            response = {
                'status': 200,
                'user': session['user']
            }
        else:
            response = {
                'status': 400,
                'err': 'Неверный логин или пароль'
            }

        return jsonify(response)


    @app.route('/registration', methods=['GET'])
    def registration():
        print('<<<')
        print(session.get('user'))
        return render_template('index.html')

    @app.route('/register', methods=['POST'])
    def register():
        db = get_db()
        data = json.loads(request.data)
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

    @app.route('/logout', methods=['POST'])
    def logout():
        session.clear()
        return render_template('index.html')

    @app.route('/is_logged_in', methods=['POST'])
    def check():
        return bool(session.get('is_logged_in'))
