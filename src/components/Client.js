import React, { useEffect, useState } from "react";
import { getUrl } from "../helpers/GetUrl";
import ArticleAchat from "./ArticleAchat";
import { getPanierCookie, setPanierCookie } from "../helpers/Panier";
import "../styles/components/Client.css";

const Client = ({ panierChange, setPanierChange }) => {
	const [articleTab, setArticleTab] = useState([]);
	const [panier, setPanier] = useState({});
	useEffect(() => {
		setPanier(getPanierCookie());
		fetch(getUrl() + "/getStockDispo")
			.then((res) => res.json())
			.then((data) => {
				setArticleTab(data.table);
			});
	}, []);
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
		<div className="clientContainer">
			{articleTab.map((e) => (
				<ArticleAchat
					key={e[0]}
					numero={e[0]}
					nom={e[1]}
					marque={e[2]}
					description={e[3]}
					prix={e[4]}
					quantite={e[9]}
					fonctionAjout={ajoutPanier}
					nombrePanier={panier[e[0]] ? panier[e[0]].quantite : 0}
					deleteArticlePanier={deleteArticlePanier}
				></ArticleAchat>
			))}
		</div>
	);
};
export default Client;
