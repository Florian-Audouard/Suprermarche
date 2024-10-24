import React, { useEffect, useState } from "react";
import "../styles/ArticleClient.css";

const ArticleAchat = ({
	numero,
	marque,
	nom,
	prix,
	quantite,
	description,
	fonctionAjout,
	nombrePanier,
}) => {
	const [ajoutQuantite, setAjoutQuantite] = useState(0);
	useEffect(() => {
		setAjoutQuantite(0);
	}, []);
	function ajoutPanier() {
		setAjoutQuantite(0);
		fonctionAjout(numero, nom, marque, description, prix, ajoutQuantite);
	}
	return (
		<span className="articleClient border">
			<div>
				{nom} {marque}
			</div>
			<div className="descriptionArticleClient">{description}</div>
			<div>{prix}€</div>
			<div>Quantité disponible: {quantite}</div>
			{nombrePanier !== 0 ? (
				<div>Quantité dans le panier : {nombrePanier}</div>
			) : (
				<div className="videPanier">e</div>
			)}
			<input
				type="number"
				onChange={(e) => setAjoutQuantite(e.target.value)}
				value={ajoutQuantite}
				min={0}
				max={quantite - nombrePanier}
			></input>
			<div className="button" onClick={ajoutPanier}>
				Ajouter au panier
			</div>
		</span>
	);
};
export default ArticleAchat;
