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


def reset_table():  # pylint: disable=missing-function-docstring
    with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
            for filename in FILENAME_TAB:
                with open(filename, "r", encoding="utf-8") as file:
                    cur.execute(file.read())


def get_data():  # pylint: disable=missing-function-docstring
    with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
            cur.execute(
                "select Nom_produit,Marque,description,prix,quantite from Stock_Quantite;"
            )
            return cur.fetchall()


def init_data():  # pylint: disable=missing-function-docstring
    with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
            with open(FILENAME_DB_DONNE, "r", encoding="utf-8") as file:
                cur.execute(file.read())


def add_produit():  # pylint: disable=missing-function-docstring
    with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
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


def achat(client, paiement, list_achat):  # pylint: disable=missing-function-docstring
    with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
            cur.execute(
                """SELECT transaction(%(client)s,%(paiement)s,%(liste_achat)s);""",
                {"client": client, "paiement": paiement, "liste_achat": list_achat},
            )


def add_transaction():  # pylint: disable=missing-function-docstring
    with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
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
                    client,
                    choice(list_paiement),
                    sample(
                        list_stock,
                        randint(int(len(list_stock) / 8), int(len(list_stock) / 2)),
                    ),
                )

#permet d'obtenir tous les articles disponibles en magasin
def get_stockdispo(): # pylint: disable=missing-function-docstring
     with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
            cur.execute(
                "select * from Stock_Quantite_Disponible;"
            )
            return cur.fetchall()

#permet d'obtenir toutes les infos des stocks
def get_allstock(): # pylint: disable=missing-function-docstring
     with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
            cur.execute(
                "select * from Produit;"
            )
            return cur.fetchall()

#permet l'historique des achats := ligneachat
def get_historique(): # pylint: disable=missing-function-docstring
     with psycopg2.connect(CONN_PARAMS) as conn:  # pylint: disable=not-context-manager
        with conn.cursor() as cur:
            cur.execute(
                "select * from Ligne_Achat;"
            )
            return cur.fetchall()

if __name__ == "__main__":
    reset_table()
    init_data()
    add_produit()
    add_transaction()
