import React, { useState } from "react";
import ArticleQuantite from "./ArticleQuantite";
import { FaCheck } from "react-icons/fa";
import { getUrl } from "../helpers/GetUrl";
const ArticleRestant = ({
	numero,
	nom,
	marque,
	description,
	prix,
	quantite,
	changementRestant,
	setChangementRestant,
}) => {
	const [ajoutQuantite, setAjoutQuantite] = useState(0);

	function addStock() {
		if (ajoutQuantite === 0) return;
		fetch(getUrl() + "/AjoutStock", {
			method: "POST",
			body: JSON.stringify({
				numProduit: numero,
				quantite: ajoutQuantite,
			}),
		}).then((e) => {
			setChangementRestant(changementRestant + 1);
			setAjoutQuantite(0);
		});
	}

	return (
		<div>
			<ArticleQuantite
				nom={nom}
				marque={marque}
				prix={prix}
				description={description}
				quantite={quantite}
			></ArticleQuantite>
			<input
				type="number"
				onChange={(e) => setAjoutQuantite(e.target.value)}
				value={ajoutQuantite}
				min={0}
			></input>
			<FaCheck className="clickable" onClick={addStock} />
		</div>
	);
};
export default ArticleRestant;
