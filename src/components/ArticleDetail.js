import React from "react";

const ArticleDetail = ({ nom, marque, datePeremption, numero }) => {
	return (
		<span>
			N° {numero} {nom} {marque} {datePeremption}{" "}
		</span>
	);
};
export default ArticleDetail;
