--Programme de recherche

-- Combien y'a t il d'evian en stock?
SELECT COUNT(Nom_Produit) 
FROM Produit_in_Stock
WHERE marque LIKE 'Evian' 
AND Etat = 'En Stock';

-- Quels sont les noms des client possedant plus de 100 points de fidelite?
SELECT Nom
FROM Client
WHERE Pt_Fidelite >100;

-- Quel article n'a jamais ete achete?
SELECT DISTINCT Produit.Nom_Produit,Produit.Marque
FROM Produit
WHERE Produit.Num_Description NOT IN (
    SELECT Stock.Num_Description
    FROM Stock
    INNER JOIN Ligne_Achat ON Stock.Num_Produit = Ligne_Achat.Num_Produit
    );

-- Quel est le montant paye pour l'achat de reference "5"
SELECT sum(Produit_in_Stock.Prix)
FROM Produit_in_Stock
INNER JOIN Ligne_Achat ON Produit_in_Stock.Num_Produit=Ligne_Achat.Num_Produit
WHERE Ligne_Achat.Num_Achat = 5 ;

--Quels sont les noms et les contacts des clients ayant achete du 'lait' de la marque 'lactel'?
SELECT Nom_client , Mail , Num_Tel
FROM Client_Produit
WHERE Nom_Produit LIKE 'Lait' 
AND Marque LIKE 'Lactel';

-- Combien reste-t-il d'articles de categorie alimentation qui se perime dans 2 jours?
SELECT COUNT(*)
FROM Produit_in_Stock
WHERE Categorie LIKE 'Alimentation' 
AND CURRENT_DATE + interval '1 day' * 2 > Date_Peremption;

-- Quels sont les articles achete par des clients prenommees Pierre?
SELECT nom_client,Prenom,Nom_Produit , Marque
FROM Client_Produit
WHERE Prenom LIKE 'Pierre';

-- Combien les clients ont-t-ils dépensé ?
SELECT Num_Client,nom_client,Prenom,sum(prix)
from Client_Produit
group by Num_Client,nom_client,Prenom;

-- Quels sont les 3 articles les plus acheté dans la categorie alimentation?
SELECT Nom_Produit, COUNT(Nom_Produit)
FROM Produit_in_Stock
WHERE Categorie LIKE 'Alimentation'
GROUP BY Nom_Produit
ORDER BY COUNT(Nom_Produit) DESC
LIMIT 3;

-- Quel est le montant total des achat payé par type de moyen de paiement
SELECT Mode_Paiement ,SUM(Prix)
FROM Client_Produit
GROUP BY Mode_Paiement;
