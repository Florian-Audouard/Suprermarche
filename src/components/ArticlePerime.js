import React from "react";
import { RxCross2 } from "react-icons/rx";
import { getUrl } from "../helpers/GetUrl";
import "../styles/components/ArticlePerime.css";
import { getPassword, getUsername } from "../helpers/LogIn";

const ArticlePerime = ({
	nom,
	marque,
	dateArrive,
	datePeremption,
	numero,
	changement,
	setChangment,
}) => {
	function deleteArticle() {
		let username = getUsername();
		let password = getPassword();
		fetch(getUrl() + "/retireStock", {
			method: "POST",
			body: JSON.stringify({ numProduit: numero, username, password }),
		}).then((e) => {
			setChangment(changement + 1);
		});
	}

	return (
		<div id="ArticlePerimeContainer">
			<span>Article n°{numero}</span>
			<span>
				{nom} {marque}
			</span>
			<span>
				Date de d'arrivé :{" "}
				{new Date(dateArrive).toLocaleDateString("fr-FR")}
			</span>
			<span>
				Date de premption :{" "}
				{new Date(datePeremption).toLocaleDateString("fr-FR")}
			</span>
			<RxCross2 className="clickable" onClick={deleteArticle} />
		</div>
	);
};
export default ArticlePerime;
