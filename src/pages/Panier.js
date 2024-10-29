import React, { useEffect, useState } from "react";
import { delPanier, getPanierCookie } from "../helpers/Panier";
import { useNavigate } from "react-router-dom";
import ArticlePanier from "../components/ArticlePanier";
import { getPassword, logIn } from "../helpers/LogIn";
import { getUrl } from "../helpers/GetUrl";
import Account from "../components/Account";

const Panier = () => {
	const navigate = useNavigate();
	const [panier, setPanier] = useState([]);
	const [changePanier, setChangePanier] = useState(0);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLogIn, setIsLogIn] = useState("");
	useEffect(() => {
		setChangePanier(0);
		logIn(setIsLogIn, setUsername, (_) => {});
	}, []);
	useEffect(() => {
		if (isLogIn === false) navigate("/");
		if (isLogIn === true) setPassword(getPassword());
	}, [isLogIn, navigate]);
	useEffect(() => {
		setPanier(getPanierCookie());
	}, [changePanier]);

	function transformPanier() {
		const listeProduit = [];
		Object.entries(panier).forEach(([key, value]) => {
			for (let i = 0; i < value.quantite; i++) {
				listeProduit.push(key);
			}
		});
		return listeProduit;
	}
	function transaction() {
		fetch(getUrl() + "/transaction", {
			method: "POST",
			body: JSON.stringify({
				username: username,
				password: password,
				listeProduit: transformPanier(),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data === "True") {
					delPanier();
					setChangePanier(changePanier + 1);
				}
			});
	}
	return (
		<div>
			<Account
				setIsLogInParents={setIsLogIn}
				setIsLoadParents={(_) => {}}
				setIsAdminParents={(_) => {}}
				setPanierChangeParents={setChangePanier}
				panierChangeParents={changePanier}
				setChoiceAdmin={(_) => {}}
			></Account>
			{Object.keys(panier).length === 0 ? (
				<div>Votre panier est vide.</div>
			) : (
				<>
					<h1>Panier</h1>
					{Object.entries(panier).map(([key, value]) => (
						<ArticlePanier
							key={key}
							nom={value.nom}
							marque={value.marque}
							description={value.description}
							prix={value.prix}
							quantite={value.quantite}
						></ArticlePanier>
					))}
					<button onClick={transaction}>Valider le panier</button>
				</>
			)}
		</div>
	);
};

export default Panier;
