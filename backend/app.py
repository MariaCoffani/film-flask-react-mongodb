import os

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
app.config["SECRET_KEY"] = "chiave-segreta-esempio"
CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
)

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(mongo_uri)
db = mongo_client["film_app"]
films_collection = db["films"]

users = [
    {"username": "maria", "password": "123stella"}
]


def is_logged_in():
    return "user" in session


def seed_movies():
    if films_collection.count_documents({}) == 0:
        films_collection.insert_many([
            {"titolo": "Inception", "anno": 2010, "genere": "Fantascienza"},
            {"titolo": "Interstellar", "anno": 2014, "genere": "Avventura"},
            {"titolo": "Il Cavaliere Oscuro", "anno": 2008, "genere": "Azione"},
        ])


def get_movies():
    movies = []
    for film in films_collection.find():
        movies.append({
            "id": str(film["_id"]),
            "titolo": film["titolo"],
            "anno": film["anno"],
            "genere": film["genere"],
        })
    return movies


def add_movie(titolo, anno, genere):
    new_movie = {
        "titolo": titolo,
        "anno": anno,
        "genere": genere,
    }
    result = films_collection.insert_one(new_movie)
    return {
        "id": str(result.inserted_id),
        "titolo": titolo,
        "anno": anno,
        "genere": genere,
    }


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    for user in users:
        if user["username"] == username and user["password"] == password:
            session["user"] = username
            return jsonify({"message": "Login effettuato con successo", "username": username})

    return jsonify({"message": "Credenziali non valide"}), 401


@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logout effettuato"})


@app.route("/api/session", methods=["GET"])
def check_session():
    if is_logged_in():
        return jsonify({"logged_in": True, "username": session["user"]})
    return jsonify({"logged_in": False}), 401


@app.route("/api/films", methods=["GET"])
def get_films():
    if not is_logged_in():
        return jsonify({"message": "Utente non autenticato"}), 401

    movies = get_movies()
    return jsonify(movies)


@app.route("/api/films", methods=["POST"])
def create_film():
    if not is_logged_in():
        return jsonify({"message": "Utente non autenticato"}), 401

    data = request.get_json()
    titolo = data.get("titolo", "").strip()
    anno = data.get("anno")
    genere = data.get("genere", "").strip()

    if not titolo or not anno or not genere:
        return jsonify({"message": "Tutti i campi sono obbligatori"}), 400

    new_movie = add_movie(titolo, anno, genere)
    return jsonify(new_movie), 201


if __name__ == "__main__":
    seed_movies()
    app.run(debug=True)
