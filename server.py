# pylint:disable=missing-module-docstring
# pylint:disable=missing-function-docstring
# pylint:disable = no-value-for-parameter
# pylint:disable=not-context-manager
# pylint:disable=trailing-whitespace
# pylint:disable=wrong-import-position
# pylint:disable=line-too-long
import os
import json
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS


app = Flask(__name__, static_folder="./build")
CORS(app, origins="http://localhost:3000")
# Si il est mis plus haut la page crash
from database.database import (
    add_produit,
    change_stock_retire_all,
    get_data,
    get_profil,
    get_stock_dispo,
    get_all_stock,
    get_historique,
    get_all_stock_perime_data,
    get_categories,
    connection,
    change_stock_retire,
    transaction,
    get_sous_categories,
    verif_stock,
)


def search_bar_querry(querry):
    if querry["categorie"] == "":
        querry["categorie"] = "all"
    if querry["sousCategorie"] == "":
        querry["sousCategorie"] = "all"
    return querry


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


@app.route("/getDatabase", methods=["GET"])
def get_database():
    return jsonify(get_data())


@app.route("/getProfilClient", methods=["POST"])
def get_profil_client():
    result = request.get_data()
    id = json.loads(result.decode("utf-8"))
    return jsonify(get_profil(id["username"], id["password"]))


@app.route("/getStockDispo", methods=["POST"])
def get_stock_dispo_server():

    result = request.get_data()
    querry = search_bar_querry(json.loads(result.decode("utf-8")))
    return jsonify(
        get_stock_dispo(
            querry["recherche"], querry["categorie"], querry["sousCategorie"]
        )
    )


@app.route("/getAllStock", methods=["POST"])
def get_all_stock_server():
    result = request.get_data()
    querry = search_bar_querry(json.loads(result.decode("utf-8")))
    return jsonify(
        get_all_stock(querry["recherche"], querry["categorie"], querry["sousCategorie"])
    )


@app.route("/getAllStockPerime", methods=["POST"])
def get_all_stock_perime():
    result = request.get_data()
    querry = search_bar_querry(json.loads(result.decode("utf-8")))
    return jsonify(
        get_all_stock_perime_data(
            querry["recherche"], querry["categorie"], querry["sousCategorie"]
        )
    )


@app.route("/getHistorique", methods=["POST"])
def get_historique_server():
    result = request.get_data()
    id = json.loads(result.decode("utf-8"))
    return jsonify(get_historique(id["username"], id["password"]))


@app.route("/logIn", methods=["POST"])
def log_in():
    result = request.get_data()
    id = json.loads(result.decode("utf-8"))
    return jsonify(connection(id["username"], id["password"]))


@app.route("/retireStock", methods=["POST"])
def change_stock_retire_server():
    result = request.get_data()
    result = json.loads(result.decode("utf-8"))
    change_stock_retire(result["numProduit"], result["username"], result["password"])
    return "ok"


@app.route("/retireStockAll", methods=["POST"])
def change_stock_retire_all_server():
    result = request.get_data()
    result = json.loads(result.decode("utf-8"))
    change_stock_retire_all(result["username"], result["password"])
    return "ok"


@app.route("/ajoutStock", methods=["POST"])
def add_stock_server():
    result = request.get_data()
    arg = json.loads(result.decode("utf-8"))
    add_produit(arg["numProduit"], arg["quantite"])
    return "ok"


@app.route("/transaction", methods=["POST"])
def transaction_server():
    result = request.get_data()
    arg = json.loads(result.decode("utf-8"))
    return jsonify(
        str(transaction(arg["username"], arg["password"], arg["listeProduit"]))
    )


@app.route("/getCategorie", methods=["Get"])
def get_categorie_server():
    return jsonify(get_categories())


@app.route("/getSousCategorie", methods=["POST"])
def get_sous_categorie_server():
    result = request.get_data()
    arg = json.loads(result.decode("utf-8"))
    return jsonify(get_sous_categories(arg["categorie"]))


ENV_FILENAME = ".env"


def main():
    os.chdir(os.path.dirname(__file__))
    port = 2500
    app.run(host="0.0.0.0", port=port)
    verif_stock()


if __name__ == "__main__":
    main()
