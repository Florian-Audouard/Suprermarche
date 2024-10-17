#pylint:disable=missing-module-docstring
#pylint:disable=missing-function-docstring
#pylint:disable = no-value-for-parameter
#pylint:disable=not-context-manager
#pylint:disable=trailing-whitespace
#pylint:disable=wrong-import-position
#pylint:disable=line-too-long
import os
from flask import Flask, jsonify, render_template

os.chdir(os.path.dirname(__file__))

app = Flask(__name__)

# Si il est mis plus haut la page crash
from database.database import get_data,get_profil,get_stockdispo,get_allstock,get_historique_data,get_detail_historique,get_all_stock_vendu_data


@app.route("/")
def index():  # pylint: disable=missing-function-docstring
    return render_template("index.html")


@app.route("/getDatabase", methods=["GET"])
def get_database():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_data()})

@app.route("/getProfilClient", methods=["GET"])
def get_profil_client():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_profil()})

@app.route("/getStockDispo", methods=["GET"])
def get_stock_dispo():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_stockdispo()})

@app.route("/getAllStock", methods=["GET"])
def get_all_stock():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_allstock()})
    
@app.route("/getHistorique",methods=["GET"])
def get_historique():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_historique_data()})

@app.route("/getDetailsHisto",methods=["GET"])
def get_detail_hist():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_detail_historique()})

@app.route("/getAllStockVendu",methods=["GET"])
def get_all_stock_vendu():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_all_stock_vendu_data()})
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
