import React, { useEffect, useState } from "react";
import { getUrl } from "../helpers/GetUrl";
import ArticleAchat from "./ArticleAchat";
import { getPanierCookie, setPanierCookie } from "../helpers/Panier";

const Client = () => {
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
	function ajoutPanier(numero, nom, marque, description, prix, quantite) {
		const tmpPanier = structuredClone(panier);
		numero = numero.toString();
		if (numero in tmpPanier) return;
		tmpPanier[numero] = { nom, marque, description, prix, quantite };
		setPanier(tmpPanier);
		setPanierCookie(tmpPanier);
	}
	return (
		<div>
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
				></ArticleAchat>
			))}
		</div>
	);
};
export default Client;
