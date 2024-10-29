import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import "../styles/components/Historique.css";

const Historique = ({ histprincipal, histdetail }) => {
	const [detail, setDetail] = useState(false);
	useEffect((_) => {
		setDetail(false);
	}, []);
	function handleClick() {
		setDetail(!detail);
	}
	return (
		<div id="historique">
			<div id="historiquePrincipal">
				<IoIosArrowDown className="clickable" onClick={handleClick} />

				<span>Numéro de commande : {histprincipal[0]}</span>
				<span>
					Date d'achat :{" "}
					{new Date(histprincipal[1]).toLocaleDateString("fr-FR")}
				</span>
				<span>Type de paiement : {histprincipal[2]}</span>
				<span>Nombre d'article : {histprincipal[3]}</span>
				<span>Prix total : {histprincipal[4]} €</span>
			</div>
			{detail ? (
				<div className="gridWrapper">
					{histdetail.map((e, i) => (
						<div key={i} id="historiqueDetail">
							<span>{e[0] + " " + e[1]}</span>
							<span>Quantité : {e[2]}</span>
							<span>Prix unité : {e[3]} €</span>
							<span>
								Prix total :{" "}
								{(parseFloat(e[3]) * parseFloat(e[2])).toFixed(
									2
								)}{" "}
								€
							</span>
						</div>
					))}
				</div>
			) : (
				<span></span>
			)}
		</div>
	);
};
export default Historique;
