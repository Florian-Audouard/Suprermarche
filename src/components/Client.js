import React, { useEffect, useState } from "react";
import { getUrl } from "../helpers/GetUrl";
import ArticleAchat from "./ArticleAchat";
import { getPanierCookie, setPanierCookie } from "../helpers/Panier";
import "../styles/components/Client.css";
import SearchBar from "./SearchBar";

const Client = ({ panierChange, setPanierChange }) => {
	const [articleTab, setArticleTab] = useState([]);
	const [panier, setPanier] = useState({});
	const [categorie, setCategorie] = useState("");
	const [sousCategorie, setSousCategorie] = useState("");
	const [recherche, setRecherche] = useState("");
	useEffect(() => {
		setPanier(getPanierCookie());
		fetch(getUrl() + "/getStockDispo", {
			method: "POST",
			body: JSON.stringify({
				categorie,
				sousCategorie,
				recherche,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setArticleTab(data);
			});
	}, [categorie, sousCategorie, recherche]);
	useEffect(() => {
		setPanier(getPanierCookie());
	}, [panierChange]);
	function ajoutPanier(numero, nom, marque, description, prix, quantite) {
		const tmpPanier = structuredClone(panier);
		numero = numero.toString();
		if (numero in tmpPanier) {
			tmpPanier[numero].quantite =
				parseInt(tmpPanier[numero].quantite) + parseInt(quantite);
		} else {
			tmpPanier[numero] = { nom, marque, description, prix, quantite };
		}
		setPanier(tmpPanier);
		setPanierCookie(tmpPanier);
		setPanierChange(panierChange + 1);
	}

	function deleteArticlePanier(numero) {
		const tmpPanier = structuredClone(panier);
		delete tmpPanier[numero];
		setPanier(tmpPanier);
		setPanierCookie(tmpPanier);
		setPanierChange(panierChange + 1);
	}
	return (
		<div className="client">
			<SearchBar
				categorie={categorie}
				setCategorie={setCategorie}
				sousCategorie={sousCategorie}
				setSousCategorie={setSousCategorie}
				recherche={recherche}
				setRecherche={setRecherche}
			></SearchBar>
			<h1>Articles : </h1>
			<div className="clientContainer">
				{articleTab.map((e) => (
					<ArticleAchat
						key={e[0]}
						numero={e[0]}
						nom={e[1]}
						marque={e[2]}
						description={e[3]}
						prix={e[4]}
						quantite={e[5]}
						fonctionAjout={ajoutPanier}
						nombrePanier={panier[e[0]] ? panier[e[0]].quantite : 0}
						deleteArticlePanier={deleteArticlePanier}
					></ArticleAchat>
				))}
			</div>
		</div>
	);
};
export default Client;
