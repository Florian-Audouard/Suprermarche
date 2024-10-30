Prénom Nom : Florian Audouard , Loïs Hermelin , Emad Ba Gubair

[Voici le site](https://supermarche-bd.vercel.app)

# Principe de l’application :

L’application vise à gerer les stocks, l’historique des ventes et les informations des clients d’un magasin.
Plus précisement, l’application doit :
- Gerer les stocks ( quantité de produits, élagation des produits qui ne sont plus valable)
- Descriptions détaillés des produits ( Conseils d’utilisation , Risques et conseils , Date )
- Etude statistique sur les produits les plus vendu, date d’achat …
- Gestions des historiques d’achat et des données des clients

# Tables :

**Stock** (<ins>NumProduit</ins> , #Nom , #Marque , DateArrivée , DatePéremption , Etat)
Avec domaine Etat : En stock, Vendu, Retiré 

**Description** (<ins>Nom</ins> , <ins>Marque</ins> , Description , #NumDanger , #Catégorie , #SousCatégorie  , Prix)

**Danger** (<ins>NumDanger</ins>  , Indication , Conseils)

**Catégorie** ( <ins>Catégorie</ins> , <ins>SousCatégorie</ins>  )

**Client** ( <ins>NumClient</ins>  , Nom , Prénom , PointFidélité , Age , Mail , NumTel )

**Achat** ( <ins>NumAchat</ins>  , #NumPaiement , #NumClient , Date )

**Paiement** ( <ins>NumPaiement</ins>  , ModePaiement )

**LigneAchat** (<ins>#NumProduit</ins> , <ins>#NumAchat</ins> )

# Contraintes 
- Les points de fidélité ne doivent pas être négatifs.
- L'âge du client possédant un abonnement doit être supérieur ou égal à 18 ans.
- Le prix des produits ne doit pas être nul.
- Le nom et le prénom du client possédant un abonnement doit être renseigné.

# Trigger

- Quand une certaines quantité de produit a été acheté, il y a une commande automatique pour remplir le stock manquant.
- Quand un produit est acheté, les points de fidélité du client augmentent.

# Concurrence

- Si deux clients achètent un même produit lorqu'il y a peu de stock, il y a un problème de concurrence sur l'achat du produit avec un mëme numéro car il ne peut être acheté qu'une fois.
- Lors d'un achat, si au même moment un restock est effectué, cela peut entrainer une modification de la ligne de l'article. Il y a donc concurrence entre l'achat et la modification du produit.

# Instalation et lancement de l'application en local
## 1 - Lancement du server
- lancer la commande *`pip install -r requirements.txt`* a la racine du projet pour installer tous les packages python nécessaires.
- Créer un fichier *`.env`* dans le dossier database de ce style la :
   ```ini
    HOST_DB=localhost
    PORT_DB=5432
    DATABASE_DB=flaskapp
    USER_DB=flaskapp
    PASSWORD_DB=flaskapp
    ```
- éxecuter le fichier python database.py pour initialiser la base de données
- éxecuter le fichier python server.py pour lancer le server qui va servir d'intermediaire entre la base de données et le site web

## 2 - Lancement du site web
- Il faut avoir [Node](https://nodejs.org/fr) d'installer pour faire fonctionner le site web
- A la racine du projet éxecuter la commande *`npm install`*
- Pour lancer le site web éxecuter la commande *`npm start`*

# Attention il faut que le server sois en route pour que le site web fonctionne correctement