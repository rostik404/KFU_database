import os

from app import App

config_name = os.getenv('FLASK_CONFIG')
app = App(config_name).app

if __name__ == '__main__':
    app.run()
