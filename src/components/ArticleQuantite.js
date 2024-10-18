import React from "react";

const ArticleQuantite = ({ nom, marque, description, prix, quantite }) => {
	return (
		<span>
			{nom} {marque} {description} {prix}€ {quantite}
		</span>
	);
};
export default ArticleQuantite;
