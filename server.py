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
    get_stockdispo,
    get_allstock,
    get_historique_data,
    get_detail_historique,
    get_all_stock_vendu_data,
    connection,
)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):  # pylint: disable=missing-function-docstring
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


@app.route("/getDatabase", methods=["GET"])
def get_database():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_data()})


@app.route("/getProfilClient", methods=["POST"])
def get_profil_client():
    result = request.get_data()
    id = json.loads(result.decode("utf-8"))
    return jsonify({"table": get_profil(id["username"], id["password"])})


@app.route("/getStockDispo", methods=["GET"])
def get_stock_dispo():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_stockdispo()})


@app.route("/getAllStock", methods=["GET"])
def get_all_stock():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_allstock()})


@app.route("/getHistorique", methods=["GET"])
def get_historique():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_historique_data()})


@app.route("/getDetailsHisto", methods=["GET"])
def get_detail_hist():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_detail_historique()})


@app.route("/getAllStockVendu", methods=["GET"])
def get_all_stock_vendu():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_all_stock_vendu_data()})


@app.route("/LogIn", methods=["POST"])
def log_in():  # pylint: disable=missing-function-docstring
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
