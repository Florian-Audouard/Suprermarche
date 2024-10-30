import React, { useEffect, useState } from "react";
import {
	deleteArticlePanier,
	delPanier,
	getPanierCookie,
} from "../helpers/Panier";
import { useNavigate } from "react-router-dom";
import ArticlePanier from "../components/ArticlePanier";
import { getPassword, logIn } from "../helpers/LogIn";
import { getUrl } from "../helpers/GetUrl";
import Account from "../components/Account";
import "../styles/pages/Panier.css";

const Panier = () => {
	const navigate = useNavigate();
	const [panier, setPanier] = useState([]);
	const [changePanier, setChangePanier] = useState(0);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLogIn, setIsLogIn] = useState("");
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantite, setTotalQuantite] = useState(0);
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

	useEffect(() => {
		let price = 0;
		let quantite = 0;
		Object.entries(panier).forEach(([key, value]) => {
			price += value.prix * value.quantite;
			quantite += value.quantite;
		});
		setTotalPrice(price.toFixed(2));
		setTotalQuantite(quantite);
	}, [panier]);
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
				<h1 id="middle">Votre panier est vide</h1>
			) : (
				<div className="containerPanier">
					<h1>Votre Panier : </h1>
					<div id="ArticlePanierContainer">
						{Object.entries(panier).map(([key, value]) => (
							<ArticlePanier
								key={key}
								nom={value.nom}
								marque={value.marque}
								description={value.description}
								prix={value.prix}
								quantite={value.quantite}
								fonctionDelete={() => {
									deleteArticlePanier(key);
									setChangePanier(changePanier + 1);
								}}
							></ArticlePanier>
						))}
					</div>
					<div id="totalPanier">
						<h2>
							Total : {totalQuantite} article
							{totalQuantite !== 1 ? "s" : ""} pour {totalPrice}€
						</h2>
					</div>
					<div
						className="button validateButton"
						onClick={transaction}
					>
						Valider le panier
					</div>
				</div>
			)}
		</div>
	);
};

export default Panier;
