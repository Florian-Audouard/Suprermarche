import React from "react";
import { RxCross2 } from "react-icons/rx";
import "../styles/components/ArticlePanier.css";

const ArticlePanier = ({
	nom,
	marque,
	description,
	prix,
	quantite,
	fonctionDelete,
}) => {
	return (
		<div id="panierArticle">
			<span>
				{nom} {marque}
			</span>
			<span>{description}</span>
			<span>Quantité : {quantite}</span>
			<span>Prix unité : {prix}€</span>
			<span>Prix total : {(prix * quantite).toFixed(2)}€</span>
			<RxCross2 className="clickable cross" onClick={fonctionDelete} />
		</div>
	);
};

export default ArticlePanier;
