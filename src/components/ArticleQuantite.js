import React from "react";

const ArticleQuantite = ({ nom, marque, description, prix, quantite }) => {
	return (
		<span>
			<div>
				{nom} {marque}
			</div>
			<div>{description}</div> <div>{prix}€ </div>
			<div>Quantite restante : {quantite}</div>
		</span>
	);
};
export default ArticleQuantite;
