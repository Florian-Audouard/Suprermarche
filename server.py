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

@app.route("/getProfil",methods=["GET"])
def get_Profil():  # pylint: disable=missing-function-docstring
    return jsonify({"Profil": get_data()})

@app.route("/getStockDispo",methods=["GET"])
def get_StockDispo():  # pylint: disable=missing-function-docstring
    return jsonify({"StockDispo": get_data()})
    
@app.route("/getAllStock",methods=["GET"])
def get_AllStock():  # pylint: disable=missing-function-docstring
    return jsonify({"AllStock": get_data()})
    
@app.route("/getAllStockVendu",methods=["GET"])
def get_AllStockVendu():  # pylint: disable=missing-function-docstring
    return jsonify({"AllStockVendu": get_data()})

@app.route("/getHistorique",methods=["GET"])
def get_Historique():  # pylint: disable=missing-function-docstring
    return jsonify({"Historique": get_data()})

@app.route("/getHistoDetails",methods=["GET"])
def get_HistoDetails():  # pylint: disable=missing-function-docstring
    return jsonify({"HistoDetails": get_data()})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
