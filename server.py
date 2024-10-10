import os
from flask import Flask, jsonify, render_template

os.chdir(os.path.dirname(__file__))

app = Flask(__name__)

# Si il est mis plus haut la page crash
from database.database import get_data


@app.route("/")
def index():  # pylint: disable=missing-function-docstring
    return render_template("index.html")


@app.route("/getDatabase", methods=["GET"])
def get_database():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_data()})

@app.route("/getProfilClient", methods=["GET"])
def get_ProfilClient():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_profil()})

@app.route("/getStockDispo", methods=["GET"])
def get_StockDispo():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_stockdispo()})

@app.route("/getAllStock", methods=["GET"])
def get_AllStock():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_allstock()})
    
@app.route("/getHistorique",methods=["GET"])
def get_Historique():  # pylint: disable=missing-function-docstring
    return jsonify({"table": get_historique()})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
