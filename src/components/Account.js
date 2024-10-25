import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAccount, disconnect, getPassword, logIn } from "../helpers/LogIn";
import md5 from "md5";
import { getUrl } from "../helpers/GetUrl";
import { delPanier, getPanierCookie } from "../helpers/Panier";
import "../styles/components/Account.css";

const Account = ({
	setIsLoadParents,
	setIsLogInParents,
	setIsAdminParents,
	setPanierChangeParents,
	panierChangeParents,
	setChoiceAdmin,
}) => {
	const [panierChange, setPanierChange] = useState(0);
	const [isLoad, setIsLoad] = useState(false);
	const [isLogIn, setIsLogIn] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState("");
	const [textConnection, setTextConnection] = useState("");
	const [panierText, setPanierText] = useState({});
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [points, setPoints] = useState("");
	const input2 = useRef(null);
	const navigate = useNavigate();
	useEffect(() => {
		setPanierChange(panierChangeParents);
	}, [panierChangeParents]);
	useEffect(() => {
		setPanierChangeParents(panierChange);
	}, [panierChange, setPanierChangeParents]);
	useEffect(() => {
		setIsLoadParents(isLoad);
	}, [isLoad, setIsLoadParents]);
	useEffect(() => {
		setIsLogInParents(isLogIn);
	}, [isLogIn, setIsLogInParents]);
	useEffect(() => {
		setIsAdminParents(isAdmin);
	}, [isAdmin, setIsAdminParents]);

	useEffect(() => {
		setIsLoad(false);
		setIsAdmin(false);
		logIn(setIsLogIn, setUsername);
		setTextConnection("");
	}, []);
	useEffect(() => {
		if (isLogIn === false || isLogIn === true) return;
		logIn(setIsLogIn, setUsername);
	}, [isLoad, isLogIn]);
	useEffect(() => {
		if (isLogIn !== false && isLogIn !== true) return;
		if (isLogIn === false) {
			setIsLoad(true);
			return;
		}
		let md5Password = getPassword();

		fetch(getUrl() + "/getProfilClient", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				let table = data.table[0];
				setNom(table[1]);
				setPrenom(table[2]);
				setPoints(table[3]);
				setIsAdmin(table[7] === "Admin");
				setIsLoad(true);
			});
	}, [username, isLogIn]);
	useEffect(() => {
		const panier = getPanierCookie();
		if (Object.keys(panier).length === 0) {
			setPanierText("Votre panier est vide");
			return;
		}

		let totalQuantite = 0;
		let totalPrix = 0;
		for (const key in panier) {
			totalQuantite += parseInt(panier[key].quantite);
			totalPrix += panier[key].prix * panier[key].quantite;
		}
		totalPrix = totalPrix.toFixed(2);
		setPanierText(
			"Nombre d'articles : " +
				totalQuantite +
				" Prix total : " +
				totalPrix +
				"€"
		);
	}, [panierChange]);
	const keyInputHandler = (event) => {
		if (event.key !== "Enter") return;
		switch (event.target.id) {
			case "username":
				input2.current.focus();
				return;
			case "password":
				tryLogIn();
				return;
			default:
				return;
		}
	};
	const tryLogIn = () => {
		if (username === "") {
			setTextConnection("Le nom d'utilisateur ne peut pas être vide");
			return;
		}
		if (password === "") {
			setTextConnection("Le mot de passe ne peut pas être vide");
			return;
		}
		let md5Password = md5(password);
		fetch(getUrl() + "/LogIn", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data === "True") {
					setTextConnection("");
					setAccount(username, md5Password);
					setIsLogIn(true);
				} else {
					setTextConnection(
						"Nom d'utilisateur ou mots de passe incorrect"
					);
				}
			});
	};
	const showPassword = (event) => {
		if (event.target.checked) {
			input2.current.type = "text";
		} else {
			input2.current.type = "password";
		}
	};

	return (
		<div id="account" className="border">
			{isLogIn ? (
				<div>
					<div>
						{nom + " " + prenom + (isAdmin ? " (Admin)" : "")}
					</div>
					{!isAdmin ? (
						<span>
							<div>Nombre de points : {points}</div>
							<div>{panierText} </div>
							{Object.keys(getPanierCookie()).length !== 0 ? (
								<span>
									<div
										className="button"
										onClick={(_) => {
											delPanier();
											setPanierChange((e) => e + 1);
										}}
									>
										Supprimer le panier
									</div>
									<div
										className="button"
										onClick={(_) => navigate("/panier")}
									>
										Voir Panier
									</div>
								</span>
							) : (
								<></>
							)}

							<div
								className="button"
								onClick={(_) => navigate("/profile/")}
							>
								Voir profile
							</div>

							<div
								className="button"
								onClick={(_) => navigate("/")}
							>
								Page d'acceuil
							</div>
						</span>
					) : (
						<span>
							<div
								className="button"
								onClick={(_) => setChoiceAdmin("restant")}
							>
								Voir les stocks restants
							</div>
							<div
								className="button"
								onClick={(_) => setChoiceAdmin("perime")}
							>
								Voir les stocks perimé
							</div>
						</span>
					)}

					<div
						className="button"
						onClick={(_) => {
							disconnect();
							setIsLogIn("");
							setIsAdmin(false);
							setIsLoad(false);
						}}
					>
						Se déconnecter
					</div>
				</div>
			) : (
				<div id="connectionBlock">
					<label>Nom d'utilisateur :</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						onKeyUp={keyInputHandler}
					/>
					<label>Mot de passe :</label>
					<input
						type="password"
						id="password"
						ref={input2}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyUp={keyInputHandler}
					/>
					<div>
						<input
							id="checkBoxPassword"
							type="checkbox"
							onChange={showPassword}
						/>{" "}
						Show password
					</div>
					<button id="connectionButton" onClick={tryLogIn}>
						Connection
					</button>
					<div>{textConnection}</div>
				</div>
			)}
		</div>
	);
};
export default Account;
