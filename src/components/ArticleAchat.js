import React, { useEffect, useState } from "react";
import "../styles/components/ArticleAchat.css";
import { RxCross2 } from "react-icons/rx";
import MyInput from "./MyInput";

const ArticleAchat = ({
	numero,
	marque,
	nom,
	prix,
	quantite,
	description,
	fonctionAjout,
	nombrePanier,
	deleteArticlePanier,
}) => {
	const [ajoutQuantite, setAjoutQuantite] = useState(0);
	useEffect(() => {
		setAjoutQuantite(0);
	}, []);
	function ajoutPanier() {
		setAjoutQuantite(0);
		fonctionAjout(numero, nom, marque, description, prix, ajoutQuantite);
	}
	function deleteArticle() {
		deleteArticlePanier(numero);
	}
	return (
		<span className="articleBox border">
			<div>
				{nom} {marque}
			</div>
			<div className="descriptionArticleClient">{description}</div>
			<div>{prix}€</div>
			<div>Quantité disponible: {quantite}</div>
			{nombrePanier !== 0 ? (
				<div className="containerCross">
					Quantité dans le panier : {nombrePanier}
					<RxCross2
						className="clickable cross"
						onClick={deleteArticle}
					/>
				</div>
			) : (
				<div className="videPanier"> </div>
			)}
			<div id="containerInput">
				<MyInput
					max={quantite - nombrePanier}
					setValue={setAjoutQuantite}
					value={ajoutQuantite}
					min={0}
				/>
				<div className="button" id="buttonInline" onClick={ajoutPanier}>
					Ajouter au panier
				</div>
			</div>
		</span>
	);
};
export default ArticleAchat;
