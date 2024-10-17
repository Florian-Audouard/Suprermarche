# pylint:disable=missing-module-docstring
# pylint:disable=missing-function-docstring
# pylint:disable = no-value-for-parameter
# pylint:disable=not-context-manager
# pylint:disable=trailing-whitespace
# pylint:disable=wrong-import-position
# pylint:disable=line-too-long
import os
from flask import Flask, jsonify, send_from_directory, request
import json
from flask_cors import CORS
from dotenv import dotenv_values


app = Flask(__name__, static_folder="./build")
CORS(app, origins="http://localhost:3000")
# Si il est mis plus haut la page crash
from database.database import (
    get_data,
    get_profil,
    get_stock_dispo,
    get_all_stock,
    get_historique_data,
    get_detail_historique,
    get_all_stock_perime_data,
    connection,
)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


@app.route("/getDatabase", methods=["GET"])
def get_database():
    return jsonify({"table": get_data()})


@app.route("/getProfilClient", methods=["POST"])
def get_profil_client():
    result = request.get_data()
    id = json.loads(result.decode("utf-8"))
    return jsonify({"table": get_profil(id["username"], id["password"])})


@app.route("/getStockDispo", methods=["GET"])
def get_stock_dispo_server():
    return jsonify({"table": get_stock_dispo()})


@app.route("/getAllStock", methods=["GET"])
def get_all_stock_server():
    return jsonify({"table": get_all_stock()})


@app.route("/getHistorique", methods=["GET"])
def get_historique():
    return jsonify({"table": get_historique_data()})


@app.route("/getDetailsHisto", methods=["GET"])
def get_detail_hist():
    return jsonify({"table": get_detail_historique()})


@app.route("/getAllStockPerime", methods=["GET"])
def get_all_stock_perime():
    return jsonify({"table": get_all_stock_perime_data()})


@app.route("/LogIn", methods=["POST"])
def log_in():
    result = request.get_data()
    id = json.loads(result.decode("utf-8"))
    return jsonify(str(connection(id["username"], id["password"])))


ENV_FILENAME = ".env"


def main():
    os.chdir(os.path.dirname(__file__))
    port = 80
    if os.path.exists(ENV_FILENAME):
        config = dotenv_values(ENV_FILENAME)
        port = int(config["PORT"])
    app.run(host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
