import React, { useState } from "react";
import ArticleQuantite from "./ArticleQuantite";
import { getUrl } from "../helpers/GetUrl";
import MyInput from "./MyInput";
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
		<span className="articleBox border">
			<ArticleQuantite
				nom={nom}
				marque={marque}
				prix={prix}
				description={description}
				quantite={quantite}
			></ArticleQuantite>
			<div id="containerInput">
				<MyInput
					min={0}
					value={ajoutQuantite}
					setValue={setAjoutQuantite}
					max={100}
				/>
				<span onClick={addStock} className="button">
					Ajouter au stock
				</span>
			</div>
		</span>
	);
};
export default ArticleRestant;
