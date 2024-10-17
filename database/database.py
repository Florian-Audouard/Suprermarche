"""_summary_

Returns:
    _type_: _description_
"""

import os
from random import choice, randint, sample
import urllib.parse
import psycopg2
from dotenv import dotenv_values

os.chdir(os.path.dirname(__file__))

ENV_FILENAME = ".env"

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and (sys.argv[0] == "--site" or sys.argv[1] == "--site"):
        ENV_FILENAME = "./site.env"

if os.path.exists(ENV_FILENAME):
    config = dotenv_values(ENV_FILENAME)
else:
    config = {
        "USER": os.environ.get("USER_DB"),
        "PASSWORD": os.environ.get("PASSWORD_DB"),
        "HOST": os.environ.get("HOST_DB"),
        "PORT": os.environ.get("PORT_DB"),
        "DATABASE": os.environ.get("DATABASE_DB"),
    }
FILENAME_TAB = ["database.sql", "function.sql", "trigger.sql"]

FILENAME_DB_DONNE = "donne_test.sql"
options = urllib.parse.quote_plus("--search_path=modern,public")
CONN_PARAMS = f"postgresql://{config['USER']}:{config['PASSWORD']}@{config['HOST']}:{config['PORT']}/{config['DATABASE']}?options={options}"  # pylint: disable=line-too-long


def clean_querry(func):
    def wrapper_func(*args, **kwargs):
        res = ""
        postgres = psycopg2.connect(CONN_PARAMS)
        try:
            with postgres as conn:  # pylint: disable=not-context-manager
                with conn.cursor() as cur:
                    res = func(cur,*args, **kwargs)
        finally:
            postgres.close()
        return res
    return wrapper_func

@clean_querry
def reset_table(cur):  # pylint: disable=missing-function-docstring
    for filename in FILENAME_TAB:
        with open(filename, "r", encoding="utf-8") as file:
            cur.execute(file.read())

@clean_querry
def get_data(cur):  # pylint: disable=missing-function-docstring
    cur.execute(
        "select Nom_produit,Marque,description,prix,quantite from Stock_Quantite;"
    )
    return cur.fetchall()

@clean_querry
def init_data(cur):  # pylint: disable=missing-function-docstring
    with open(FILENAME_DB_DONNE, "r", encoding="utf-8") as file:
        cur.execute(file.read())

@clean_querry
def add_produit(cur):  # pylint: disable=missing-function-docstring
    cur.execute("""SELECT Num_Description FROM Description;""")
    list_produit = cur.fetchall()
    list_produit = [x[0] for x in list_produit]
    for produit in list_produit:
        cur.execute(
            """SELECT add_stock_init(%(Num_Produit)s);""",
            {
                "Num_Produit": produit,
            },
        )

def achat(cur,client, paiement, list_achat):  # pylint: disable=missing-function-docstring
    cur.execute(
        """SELECT transaction(%(client)s,%(paiement)s,%(liste_achat)s);""",
        {"client": client, "paiement": paiement, "liste_achat": list_achat},
    )

@clean_querry
def add_transaction(cur):  # pylint: disable=missing-function-docstring
    cur.execute("""SELECT num_client FROM client; """)
    tmp = cur.fetchall()
    list_cli = [x[0] for x in tmp]
    cur.execute("""SELECT Num_Paiement FROM Paiement """)
    tmp = cur.fetchall()
    list_paiement = [x[0] for x in tmp]
    for client in list_cli:
        cur.execute(
            """SELECT num_description FROM Stock_Quantite_Disponible """
        )
        tmp = cur.fetchall()
        list_stock = [x[0] for x in tmp]
        achat(
            cur,
            client,
            choice(list_paiement),
            sample(
                list_stock,
                randint(int(len(list_stock) / 8), int(len(list_stock) / 2)),
            ),
        )


#permet d'obtenir toutes les informations du clients or mdp et login
@clean_querry
def get_profil(cur): # pylint: disable=missing-function-docstring
    cur.execute(
        "select Num_Client, Nom, Prenom, Pt_Fidelite, Age,Mail,Num_tel from Client;"
    )
    return cur.fetchall()
            
#permet d'obtenir tous les articles disponibles en magasin
@clean_querry
def get_stockdispo(cur): # pylint: disable=missing-function-docstring
    cur.execute(
        "select * from Stock_Quantite_Disponible;"
    )
    return cur.fetchall()

#permet d'obtenir toutes les infos des stocks
@clean_querry
def get_allstock(cur): # pylint: disable=missing-function-docstring
    cur.execute(
        "select * from Stock_Quantite;"
    )
    return cur.fetchall()

#permet l'historique des achats := ligneachat
@clean_querry
def get_historique(cur): # pylint: disable=missing-function-docstring
    cur.execute(
        "select * from Ligne_Achat;"
    )
    return cur.fetchall()
            
#permet d'obtenir le detail de l'historique
@clean_querry
def get_detailhist(cur): # pylint: disable=missing-function-docstring
    cur.execute(
        "SELECT * FROM Client_Produit;"
    )
    return cur.fetchall()

#permet d'obtenir tout le stock vendu
@clean_querry
def get_allstockvendu(cur): # pylint: disable=missing-function-docstring
    cur.execute(
        """SELECT * 
        FROM Produit_in_stock 
        WHERE Produit_in_stock.Etat ='Vendu'; """)
    return cur.fetchall()


if __name__ == "__main__":
    reset_table()
    init_data()
    add_produit()
    add_transaction()
