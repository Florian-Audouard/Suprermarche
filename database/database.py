# pylint:disable=missing-module-docstring
# pylint:disable=missing-function-docstring
# pylint:disable = no-value-for-parameter
# pylint:disable=not-context-manager
# pylint:disable=trailing-whitespace
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
        "USER_DB": os.environ.get("USER_DB"),
        "PASSWORD_DB": os.environ.get("PASSWORD_DB"),
        "HOST_DB": os.environ.get("HOST_DB"),
        "PORT_DB": os.environ.get("PORT_DB"),
        "DATABASE_DB": os.environ.get("DATABASE_DB"),
    }

FILENAME_DB_SHEMA = "database.sql"
options = urllib.parse.quote_plus("--search_path=modern,public")
CONN_PARAMS = f"postgresql://{config['USER_DB']}:{config['PASSWORD_DB']}@{config['HOST_DB']}:{config['PORT_DB']}/{config['DATABASE_DB']}?options={options}"  # pylint: disable=line-too-long


FILENAME_TAB = ["database.sql", "function.sql", "trigger.sql"]

FILENAME_DB_DONNE = "donne_test.sql"


def clean_querry(func):
    def wrapper_func(*args, **kwargs):
        res = ""
        conn = psycopg2.connect(CONN_PARAMS)
        try:
            with conn:
                with conn.cursor() as cur:
                    res = func(cur, *args, **kwargs)
        finally:
            conn.close()
        return res

    return wrapper_func


@clean_querry
def reset_table(cur):
    for filename in FILENAME_TAB:
        with open(filename, "r", encoding="utf-8") as file:
            cur.execute(file.read())


@clean_querry
def get_data(cur):
    cur.execute(
        "select Nom_produit,Marque,description,prix,quantite from Stock_Quantite;"
    )
    return cur.fetchall()


@clean_querry
def init_data(cur):
    with open(FILENAME_DB_DONNE, "r", encoding="utf-8") as file:
        cur.execute(file.read())


@clean_querry
def add_produit_init(cur):
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


def achat(cur, client, paiement, list_achat):
    cur.execute(
        """SELECT transaction(%(client)s,%(paiement)s,%(liste_achat)s);""",
        {"client": client, "paiement": paiement, "liste_achat": list_achat},
    )


@clean_querry
def add_transaction(cur):
    cur.execute("""SELECT num_client FROM Client WHERE Client.Statut='Client'; """)
    tmp = cur.fetchall()
    list_cli = [x[0] for x in tmp]
    cur.execute("""SELECT Num_Paiement FROM Paiement """)
    tmp = cur.fetchall()
    list_paiement = [x[0] for x in tmp]
    for client in list_cli:
        cur.execute("""SELECT num_description FROM Stock_Quantite_Disponible """)
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


# permet d'obtenir toutes les informations du clients or mdp et login
@clean_querry
def get_profil(cur, username, password):
    if not auth(cur, username, password):
        return False
    cur.execute(
        """select Num_Client, Nom, Prenom, Pt_Fidelite, Age,Mail,Num_tel,statut from Client
            WHERE ID = %(username)s;""",
        {"username": username},
    )
    return cur.fetchall()


# permet d'obtenir tous les articles disponibles en magasin
@clean_querry
def get_stock_dispo(cur):
    cur.execute("select * from Stock_Quantite_Disponible;")
    return cur.fetchall()


# permet d'obtenir toutes les infos des stocks
@clean_querry
def get_all_stock(cur):
    cur.execute("select * from Stock_Quantite;")
    return cur.fetchall()


# permet l'historique des achats := ligneachat
@clean_querry
def get_historique_data(cur,id,password):
    if not auth(cur, id, password):
        return False
    cur.execute("SELECT Num_client FROM Client WHERE ID=%(id)s",{"id": id})
    client = cur.fetchall()[0][0]
    cur.execute("select Num_achat,Date,mode_paiement,sum(prix) from Client_Produit WHERE num_client=%(client)s Group BY Num_achat,Date,mode_paiement;",{"client": client})
    return cur.fetchall()


# permet d'obtenir le detail de l'historique
@clean_querry
def get_detail_historique(cur,num_achat):
    cur.execute("SELECT prix,nom_produit,marque,description,date_peremption FROM Client_Produit WHERE Num_achat=%(num_achat)s;",{"num_achat":num_achat})
    return cur.fetchall()


# permet d'obtenir tout le stock vendu
@clean_querry
def get_all_stock_perime_data(cur):
    cur.execute(
        """SELECT * FROM Produit_in_stock WHERE Etat ='En Stock' AND Date_Peremption < CURRENT_DATE;"""
    )
    return cur.fetchall()


@clean_querry
def change_stock_retire(cur, num_produit):
    cur.execute(
        """UPDATE stock
            SET Etat = 'Retire'
            WHERE Num_Produit = %(num_produit)s;""",
        {"num_produit": num_produit},
    )


def auth(cur, username, password):
    cur.execute(
        "SELECT count(ID) FROM Client WHERE ID = %(username)s AND MDP = %(password)s;",
        {"username": str(username), "password": str(password)},
    )
    if cur.fetchall()[0][0] == 1:
        return True
    return False


@clean_querry
def connection(cur, username, password):
    return auth(cur, username, password)


@clean_querry
def add_produit(cur, numero, quantite):
    cur.execute(
        """SELECT restock_fixe(%(num_produit)s,%(quantite)s);""",
        {"num_produit": numero, "quantite": quantite},
    )


if __name__ == "__main__":
    reset_table()
    init_data()
    add_produit_init()
    add_transaction()
