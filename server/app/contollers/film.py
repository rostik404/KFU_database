# -*- coding: utf-8 -*-

from flask import Flask, flash, render_template, redirect, request, jsonify, session, url_for, send_from_directory
from app.db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.film import Film
from app.models.directors import Director
from app.contollers.director import DirectorContoller
from app.models.users_to_films import UsersToFilms
import json
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
import os
from flask import abort

class FilmContoller(object):
    def __init__(self, *args):
        super(FilmContoller, self).__init__(*args)

    def get(self, id):
        directorContoller = DirectorContoller()
        film = Film.query.filter_by(
            id=id
        ).first()
        res = {}
        if film:
            res = {
                'title': film.title,
                'year': film.year,
                'director': directorContoller.get(id=film.director).name,
                'genre': film.genre,
                'image': film.image,
                'id': film.id
            }
            return jsonify(res)

        return abort(404)

    def get_films(self, for_user=False, filterField=None, filterQuery=None):
        films = Film.query.all()
        res = []

        for film in films:
            note = UsersToFilms.query.filter_by(
                film_id=film.id, user_id=session.get('user', {}).get('id', None)).first()
            directorContoller = DirectorContoller()
            if not for_user or note:
                f = {
                    'title': film.title,
                    'year': film.year,
                    'director': directorContoller.get(id=film.director).name,
                    'genre': film.genre,
                    'image': film.image,
                    'id': film.id,
                    'added': bool(note)
                }

                if filterField and filterQuery:
                    if filterQuery.lower() in f[filterField].lower():
                        res.append(f)
                else:
                    res.append(f)

        return jsonify(res)

    def delete_film_for_user(self, film_id):
        response = {
            'status': 'FAIL'
        }
        db = get_db()
        note = UsersToFilms.query.filter_by(
            film_id=film_id, user_id=session['user']['id']).first()
        if note:
            db.session.delete(note)
            db.session.commit()
            response = {
                'status': 'OK'
            }

        return jsonify(response)

    def delete_film(self, film_id):
        response = {
            'status': 'FAIL'
        }
        db = get_db()

        film = Film.query.filter_by(id=film_id).first()

        if film and session['user']['is_admin']:
            db.session.delete(film)
            db.session.commit()
            response = {
                'status': 'OK'
            }

        return jsonify(response)

    def add_film(self, app, data, file):
        file_url = url_for('uploaded_file', filename='default.svg')
        response = {'status': 200}

        if file:
            file_url = self.get_file_url(app, file)

        try:
            db = get_db()
            directorId = self.get_director_id(data)

            film = Film(
                title=data.get('title'),
                year=data.get('year'),
                director=directorId,
                genre=data.get('genre'),
                image=file_url
            )
            db.session.add(film)
            db.session.commit()
        except Exception as e:
            response['err'] = e

        return jsonify(response)

    def update(self, app, data, file):
        response = {'status': 200}

        try:
            db = get_db()
            directorId = self.get_director_id(data)
            print('ID')
            print(data.get('id'))
            film = Film.query.filter_by(id=data.get('id')).first()

            film.director = directorId
            if file:
                file_url = self.get_file_url(app, file)
                film.image = file_url
            if data.get('title') is not None and data.get('title') != '':
                film.title = data.get('title')

            if data.get('year') is not None and data.get('year') != '':
                film.year = data.get('year')

            if data.get('genre') is not None and data.get('genre') != '':
                film.genre = data.get('genre')

            # db.session.add(film)
            db.session.commit()
        except Exception as e:
            response['err'] = e

        return jsonify(response)

    def get_file_url(self, app, file):
        filename = secure_filename(file.filename)
        file.save(os.path.join(
            app.static_folder,
            app.config['UPLOAD_FOLDER'],
            filename)
        )
        return url_for('uploaded_file', filename=filename)

    def get_director_id(self, data):
        directorContoller = DirectorContoller()
        directorName = directorContoller.get(
            id=int(data.get('directorId')[0])).name

        directorId = data.get('directorId')[0]
        if directorName != data.get('director')[0]:
            directorNewId = directorContoller.get(
                name=data.get('director')[0]).id
            if directorNewId is not None:
                directorId = directorNewId
            else:
                directorContoller.add(name=data.get('director')[0])
                directorId = Director.query.order_by(
                    Director.id.desc()).first().id

        return directorId
