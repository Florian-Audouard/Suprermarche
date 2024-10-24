import React from "react";

const ArticlePanier = ({ nom, marque, description, prix, quantite }) => {
	return (
		<div>
			{nom} {marque} {description} {prix}€ {quantite}
		</div>
	);
};

export default ArticlePanier;
