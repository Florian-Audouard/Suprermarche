import React from "react";
import { RxCross2 } from "react-icons/rx";
import { getUrl } from "../helpers/GetUrl";
import ArticleDetail from "./ArticleDetail";
const ArticlePerime = ({
	nom,
	marque,
	datePeremption,
	numero,
	changement,
	setChangment,
}) => {
	function deleteArticle() {
		fetch(getUrl() + "/retireStock", {
			method: "POST",
			body: JSON.stringify({ numProduit: numero }),
		}).then((e) => {
			setChangment(changement + 1);
		});
	}

	return (
		<div>
			<ArticleDetail
				nom={nom}
				marque={marque}
				numero={numero}
				datePeremption={datePeremption}
			></ArticleDetail>
			<RxCross2 className="clickable" onClick={deleteArticle} />
		</div>
	);
};
export default ArticlePerime;
