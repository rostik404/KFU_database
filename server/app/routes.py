# -*- coding: utf-8 -*-

from flask import Flask, flash, render_template, redirect, request, jsonify, session, url_for, send_from_directory
from db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.film import Film
from app.models.review import Review
from app.models.directors import Director
from app.models.users_to_films import UsersToFilms
from app.contollers.film import FilmContoller
from app.contollers.user import UserContoller
from app.contollers.director import DirectorContoller
from app.contollers.review import ReviewController
import json
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
import os


def set_routes(app):
    @app.route('/')
    def main():
        return render_template('index.html')

    @app.route('/login', methods=['GET'])
    def login():
        return render_template('index.html')

    @app.route('/search', methods=['GET'])
    def search():
        return render_template('index.html')

    @app.route('/reviews/<id>', methods=['GET'])
    def reviews(id):
        print('HERER')
        print(id)
        return render_template('index.html')

    @app.route('/registration', methods=['GET'])
    def registration():
        return render_template('index.html')

    @app.route('/logout', methods=['POST'])
    def logout():
        session.clear()
        return render_template('index.html')

    @app.route('/is_admin', methods=['GET'])
    def is_admin():
        print(session.get('user'))
        return jsonify({'isAdmin': session.get('user', {}).get('is_admin', False)})

    @app.route('/admin', methods=['GET'])
    def admin():
        return render_template('index.html')

    @app.route('/static/dist/<filename>')
    def uploaded_file(filename):
        return send_from_directory(os.path.join(app.static_folder, app.config['UPLOAD_FOLDER']), filename)


    @app.route('/get/<subj>', methods=['GET', 'POST'])
    def get(subj):
        if subj == 'film':
            filmContoller = FilmContoller()
            filmId = request.args.get('id')
            return filmContoller.get(filmId)
        if subj == 'films':
            filmContoller = FilmContoller()

            for_user = bool(int(request.args.get('forUser')))
            filterField = request.args.get('filterField')
            filterQuery = request.args.get('filterQuery')
            return filmContoller.get_films(for_user, filterField, filterQuery)
            return get_films(for_user, filterField, filterQuery)
        if subj == 'user':
            userContoller = UserContoller()
            data = json.loads(request.data)
            return userContoller.get_user(data)

        if subj == 'directors':
            directorContoller = DirectorContoller()
            return directorContoller.get_all()
        if subj == 'reviews':
            reviewController = ReviewController()
            film_id = request.args.get('filmId')
            return reviewController.get(film_id)

        return jsonify({'status': 'FAIL'})

    @app.route('/delete/<subj>/<film_id>', methods=['POST'])
    def delete(subj, film_id):
        data = {}
        if request.data:
            data = json.loads(request.data)
        response = {
            'status': 'FAIL'
        }
        if subj == 'film':
            filmContoller = FilmContoller()
            if data.get('forUser'):
                return filmContoller.delete_film_for_user(film_id)
            else:
                return filmContoller.delete_film(film_id)

            return jsonify(response)

        return render_template('index.html')

    @app.route('/add/<subj>/<film_id>', methods=['POST'])
    def add(subj, film_id):
        db = get_db()
        data = json.loads(request.data)
        if subj == 'film' and data.get('forUser'):
            note = UsersToFilms(
                user_id=session['user']['id'],
                film_id=film_id
            )
            db.session.add(note)
            db.session.commit()
        return jsonify({'status': 'OK'})

    @app.route('/add/<subj>', methods=['POST'])
    def add_r(subj):
        if subj == 'film':
            filmContoller = FilmContoller()
            data = dict(request.form)
            file = request.files.get('file')
            return filmContoller.add_film(app, data, file)
        if subj == 'user':
            userContoller = UserContoller()
            data = json.loads(request.data)
            return userContoller.add_user(data)
        if subj == 'director':
            directorContoller = DirectorContoller()
            data = dict(request.form)
            return userContoller.add(data)
        if subj == 'review':
            reviewController = ReviewController()
            data = dict(request.form)
            return reviewController.add(data)

        return jsonify({'status': 'FAIL'})

    @app.route('/update/<subj>', methods=['POST'])
    def update(subj):
        if subj == 'film':
            filmContoller = FilmContoller()
            data = dict(request.form)
            file = request.files.get('file')

            return filmContoller.update(app, data, file)
