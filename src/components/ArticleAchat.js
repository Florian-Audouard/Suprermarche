import React, { useEffect, useState } from "react";

const ArticleAchat = ({
	numero,
	marque,
	nom,
	prix,
	quantite,
	description,
	fonctionAjout,
}) => {
	const [ajoutQuantite, setAjoutQuantite] = useState(0);
	useEffect(() => {
		setAjoutQuantite(0);
	}, []);
	function ajoutPanier() {
		setAjoutQuantite(0);
		if (ajoutQuantite === 0) return;
		fonctionAjout(numero, ajoutQuantite);
	}
	return (
		<div>
			{numero} {marque} {nom} {prix} {quantite} {description}
			<input
				type="number"
				onChange={(e) => setAjoutQuantite(e.target.value)}
				value={ajoutQuantite}
				min={0}
				max={quantite}
			></input>
			<button onClick={ajoutPanier}>Ajouter au panier</button>
		</div>
	);
};
export default ArticleAchat;
