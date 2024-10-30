import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();
	useEffect(() => {
		navigate("/");
	}, [navigate]);
	return (
		<div id="middle">
			Cette page n'existe pas vous aller être redirigé si cela n'est pas
			le cas :{" "}
			<span className="button" onClick={(_) => navigate("/")}>
				Page d'accueil
			</span>
		</div>
	);
};
export default NotFound;
