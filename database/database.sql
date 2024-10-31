DROP TABLE IF EXISTS
    Categorie,
    Client,
    Admin,
    Paiement,
    Description,
    Stock,
    Achat,
    Ligne_Achat CASCADE;

-- Creation des tables


CREATE TABLE Categorie(
Num_Categorie INT PRIMARY KEY,
Categorie VARCHAR(250) NOT NULL,
Sous_Categorie VARCHAR(250) NOT NULL
);

CREATE TABLE Client(
Num_Client SERIAL PRIMARY KEY,
Nom VARCHAR(250) NOT NULL,
Prenom VARCHAR(250) NOT NULL,
Pt_Fidelite DECIMAL(18,2),
Age INT NOT NULL,
Mail VARCHAR(250),
Num_Tel VARCHAR(10),
Username VARCHAR(20) UNIQUE,
Password VARCHAR(32) NOT NULL,

CONSTRAINT Age CHECK (Age>=18), --les clients doivent avoir au moins 18 ans pour être abonné au magasin
CONSTRAINT PointsFidelite CHECK(Pt_Fidelite >= 0) --Il est impossible que les client aient des points de fidelite negatifs
);

CREATE TABLE Admin(
    Num_Admin SERIAL PRIMARY KEY,
    Nom VARCHAR(250) NOT NULL,
    Prenom VARCHAR(250) NOT NULL,
    Username VARCHAR(20) UNIQUE,
    Password VARCHAR(32) NOT NULL
);

CREATE TABLE Paiement(
Num_Paiement INT PRIMARY KEY,
Mode_Paiement VARCHAR(250) NOT NULL
);

CREATE TABLE Description(
Num_Description SERIAL PRIMARY KEY,
Nom VARCHAR(250) NOT NULL,
Marque VARCHAR(250) NOT NULL,
Description VARCHAR(250),
Prix DECIMAL(18,2) NOT NULL,
Num_Categorie INT NOT NULL,

FOREIGN KEY(Num_Categorie) REFERENCES Categorie(Num_Categorie),

CONSTRAINT Prix CHECK (Prix>0)
);

CREATE TABLE Stock(
Num_Produit SERIAL PRIMARY KEY,
Num_Description INT,
Date_Arrive DATE NOT NULL,
Date_Peremption DATE,
Etat TEXT NOT NULL,

FOREIGN KEY(Num_Description) REFERENCES Description(Num_Description)
);

CREATE TABLE Achat(
Num_Achat SERIAL PRIMARY KEY,
Num_Client INT,
Date DATE,
Num_Paiement INT,


FOREIGN KEY(Num_Client) REFERENCES Client(Num_Client),
FOREIGN KEY(Num_Paiement) REFERENCES Paiement(Num_Paiement)
);

CREATE TABLE Ligne_Achat(
Num_Produit INT,
Num_Achat INT,
PRIMARY KEY (Num_Produit,Num_Achat),

FOREIGN KEY(Num_Produit) REFERENCES Stock(Num_Produit),
FOREIGN KEY(Num_Achat) REFERENCES Achat(Num_Achat)
);


-- Creation d'une view pour joindre toutes les informations relatives aux produits
CREATE OR REPLACE VIEW Produit AS (
    SELECT description.num_description,description.nom AS Nom_Produit,description.Marque,description.description,description.prix,Categorie.Categorie,Categorie.Sous_Categorie
        FROM description JOIN Categorie ON description.Num_Categorie = Categorie.Num_Categorie
);


-- Creation d'une view pour recuperer les quantites non vendu et non perime d'un produit
CREATE OR REPLACE VIEW Stock_Quantite AS (
    SELECT produit.num_description,produit.Nom_Produit,produit.Marque,produit.description,produit.prix,produit.Categorie,produit.Sous_Categorie,coalesce(tmp.quantite,0) AS quantite
        FROM (SELECT stock.num_description, count(stock.num_description) AS quantite FROM Stock WHERE stock.Etat = 'En Stock'  GROUP BY stock.num_description) as tmp
        RIGHT OUTER JOIN Produit ON Produit.num_description = tmp.num_description  
        ORDER BY Produit.num_description ASC
);


-- Creation d'une view pour récuperer les produits non vendu et non perime qui sont disponibles en magasin
CREATE OR REPLACE VIEW Stock_Quantite_Disponible AS (
    SELECT produit.num_description,produit.Nom_Produit,produit.Marque,produit.description,produit.prix,produit.Categorie,produit.Sous_Categorie,coalesce(tmp.quantite,0) AS quantite
        FROM (SELECT stock.num_description, count(stock.num_description) AS quantite FROM Stock WHERE stock.Etat = 'En Stock' AND Date_Peremption > CURRENT_DATE  GROUP BY stock.num_description) as tmp
        RIGHT OUTER JOIN Produit ON Produit.num_description = tmp.num_description
        WHERE tmp.quantite > 0
        ORDER BY Produit.num_description ASC
);


-- Creation d'une view pour joindre les données des produits avec leurs dates d'arrivée, de péremption ainsi que leur état (vendu, en stock, retiré)
CREATE OR REPLACE VIEW Produit_in_stock AS (
    SELECT Produit.* , Stock.Date_Arrive , Stock.Date_Peremption , Stock.Num_Produit , Stock.Etat
    FROM Stock
    INNER JOIN Produit ON Stock.Num_Description = Produit.Num_Description
);

-- Creation d'une view pour joindre les données des paiements avec les données des clients pour connaitre les paiements qu'ils ont realises
CREATE OR REPLACE VIEW Achat_Paiement AS (
    SELECT tmp.Num_Client,TMP.Nom as Nom_client,TMP.Prenom,TMP.Pt_Fidelite,TMP.Age,TMP.Mail, TMP.Num_Tel,TMP.Num_Achat,TMP.Date, Paiement.Mode_Paiement
    FROM Paiement
    INNER JOIN (
        SELECT client.Num_Client , client.nom,client.Prenom,client.mail,client.Num_Tel,client.age,client.Pt_Fidelite,achat.date,achat.Num_Paiement,achat.num_achat
        FROM Achat
        INNER JOIN Client ON Achat.Num_Client=Client.Num_Client
    ) 
    AS TMP ON Paiement.Num_Paiement = TMP.Num_Paiement
);


-- Creation d'une view pour connaitre faire le lien entre un client et les produits qu'il a achete
CREATE OR REPLACE VIEW Client_Produit AS (
    SELECT Achat_Paiement.* , Produit_in_Stock.*
    FROM Ligne_Achat
    INNER JOIN Achat_Paiement ON Achat_Paiement.num_achat = Ligne_Achat.num_achat
    INNER JOIN Produit_in_Stock ON Produit_in_Stock.num_produit = Ligne_Achat.num_produit
);



CREATE OR REPLACE VIEW Connexion AS (
    SELECT Username, Password, 'Client' as Role
    FROM Client
    UNION
    SELECT Username, Password, 'Admin' as Role
    FROM Admin
);