DROP FUNCTION IF EXISTS add_stock , add_stock_multiple , add_stock_init , restock ,get_stock_Num , transaction , get_price , get_num_cli , modif_vendu;

-- Ajout d'un produit dans la table stock
CREATE OR REPLACE FUNCTION add_stock(Num_Produit Stock.Num_Description%TYPE,num_debut_date_arrive INT,interval_date_fin INT) RETURNS void LANGUAGE PLPGSQL AS $$
    DECLARE
        future_date_arrive Stock.Date_Arrive%TYPE;
        future_date_peremptuion Stock.Date_Peremption%TYPE;
    BEGIN
        --tmp_random := ROUND(RANDOM()*num_debut_date_arrive)+1;
        future_date_arrive := CURRENT_DATE + interval '1 day' * (-num_debut_date_arrive);
        --tmp_random := ROUND(RANDOM()*interval_date_fin)+1;
        future_date_peremptuion := future_date_arrive + interval '1 day' * (interval_date_fin);
        INSERT INTO STOCK (Num_Description,Date_Arrive,Date_Peremption,Etat)
            VALUES (Num_Produit,future_date_arrive,future_date_peremptuion,'En Stock');
    END$$;



-- Ajout
CREATE OR REPLACE FUNCTION add_stock_multiple(Num_Produit Stock.Num_Description%TYPE,num_debut_date_arrive INT,interval_date_fin INT,nombre_ajout INT) RETURNS void LANGUAGE PLPGSQL AS $$
    DECLARE
        future_date_arrive INT;
        future_date_peremptuion INT;
    BEGIN

        FOR i IN 1..nombre_ajout LOOP
            future_date_arrive := ROUND(RANDOM()*num_debut_date_arrive);
            future_date_peremptuion := ROUND(RANDOM()*(interval_date_fin-2))+2;
            PERFORM add_stock(Num_Produit,future_date_arrive,future_date_peremptuion);
        END LOOP;
    END$$;


--Creation d'une 
CREATE OR REPLACE FUNCTION add_stock_init(Num_Produit Stock.Num_Description%TYPE) RETURNS void LANGUAGE PLPGSQL AS $$
    DECLARE
        loop_num INT;
    BEGIN
        loop_num = ROUND(RANDOM()*(10-5))+5;
        PERFORM add_stock_multiple(Num_Produit,5,10,loop_num);
    END$$;

--Creation d'une fonction qui permet de remplir un stock de produit d'une quantité fixé
CREATE OR REPLACE FUNCTION restock_fixe(Num_Produit Stock.Num_Description%TYPE, nombre_ajout INT) RETURNS void LANGUAGE PLPGSQL AS $$
    BEGIN
        PERFORM add_stock_multiple(Num_Produit,0,5,nombre_ajout);
    END$$;

--Creation d'une fonction qui permet de remplir un stock de produit d'une quantité aléatoire
CREATE OR REPLACE FUNCTION restock(Num_Produit Stock.Num_Description%TYPE) RETURNS void LANGUAGE PLPGSQL AS $$
    DECLARE
        loop_num INT;
    BEGIN
        loop_num = ROUND(RANDOM()*(10-0))+0;
        PERFORM add_stock_multiple(Num_Produit,0,5,loop_num);
    END$$;


-- Creation d'une fonction qui permet d'obtenir les produits dans les stock qui ne sont pas perime et qui n'ont pas encore ete vendu
CREATE OR REPLACE FUNCTION get_stock_Num(NumDescription stock.Num_Description%TYPE) RETURNS SETOF Stock.num_produit%TYPE LANGUAGE SQL AS $$
    SELECT num_produit FROM Stock WHERE NumDescription = Num_Description AND Etat = 'En Stock' AND Date_Peremption > CURRENT_DATE LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION transaction(client client.Num_Client%TYPE,paiement paiement.Num_Paiement%TYPE,liste_produit integer[]) RETURNS void LANGUAGE PLPGSQL AS $$
    DECLARE
        result  Achat.Num_Achat%TYPE;
        num_produit INT;
    BEGIN
        INSERT INTO Achat (Num_Client,Date,Num_Paiement) VALUES
            (client,CURRENT_DATE,paiement) RETURNING Num_Achat into result;
        FOREACH num_produit IN ARRAY liste_produit LOOP
            INSERT INTO Ligne_Achat VALUES (get_stock_Num(num_produit),result);
        END LOOP;
    END$$;


CREATE OR REPLACE FUNCTION get_price(num_produit_var Produit_in_stock.num_produit%TYPE) RETURNS  Produit_in_stock.prix%TYPE LANGUAGE PLPGSQL AS $$
    DECLARE
        res Produit_in_stock.prix%TYPE;
    BEGIN
        SELECT prix INTO res FROM Produit_in_stock WHERE num_produit = num_produit_var;
        RETURN res;
    END
    $$;

CREATE OR REPLACE FUNCTION get_num_cli(num_achat_var Achat.num_achat%TYPE) RETURNS SETOF client.Num_Client%TYPE LANGUAGE SQL AS $$
        SELECT achat.Num_Client FROM achat INNER JOIN Ligne_Achat ON achat.num_achat = Ligne_Achat.num_achat where num_achat_var = achat.num_achat;
    $$;


CREATE OR REPLACE FUNCTION modif_vendu() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
    BEGIN
        UPDATE stock
        SET Etat = 'Vendu'
        WHERE Num_Produit = NEW.Num_Produit;
        UPDATE client
        SET Pt_Fidelite = Pt_Fidelite + get_price(NEW.Num_Produit)
        WHERE client.Num_Client in (SELECT * from get_num_cli(NEW.Num_Achat));
        RETURN NEW;
    END$$;


CREATE OR REPLACE FUNCTION return_quantite(num_description_var description.num_description%TYPE ) RETURNS INT LANGUAGE PLPGSQL AS $$
    DECLARE
        res INT;
    BEGIN
        SELECT quantite INTO res FROM Stock_Quantite_Disponible WHERE num_description_var = num_description;
        RETURN res;
    END
    $$;

CREATE OR REPLACE FUNCTION restock_trigger_func() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
    BEGIN
        IF return_quantite(NEW.num_description) < 5 THEN
            PERFORM restock(NEW.num_description);
        END IF;
        RETURN NEW;
    END$$;
