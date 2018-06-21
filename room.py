from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)


# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)

#     def __repr__(self):
#         return '<User %r>' % self.username


class Room(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	pin = db.Column(db.Integer, nullable=False)

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True, nullable=False)
	roomID = db.Column(db.Integer)

class Image(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	path = db.Column(db.String(120), nullable=False)
	roomID = db.Column(db.Integer)