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
	const [path, setPath] = useState("");
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
		setPath(window.location.pathname);
		logIn(setIsLogIn, setUsername, setIsAdmin);
		setTextConnection("");
	}, []);
	useEffect(() => {
		if (isLogIn === false || isLogIn === true) return;
		logIn(setIsLogIn, setUsername, setIsAdmin);
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
				setNom(data[1]);
				setPrenom(data[2]);
				if (!isAdmin) setPoints(data[3]);
				setIsLoad(true);
			});
	}, [username, isLogIn, isAdmin, panierChange]);
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
		fetch(getUrl() + "/logIn", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.auth === true) {
					setTextConnection("");
					setAccount(username, md5Password);
					setIsLogIn(true);
					setIsAdmin(data.role === "Admin");
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
									{path !== "/panier" ? (
										<div
											className="button"
											onClick={(_) => navigate("/panier")}
										>
											Voir Panier
										</div>
									) : (
										<></>
									)}
								</span>
							) : (
								<></>
							)}

							{path !== "/profile" ? (
								<div
									className="button"
									onClick={(_) => navigate("/profile")}
								>
									Voir profile
								</div>
							) : (
								<></>
							)}
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
					{path !== "/" ? (
						<div className="button" onClick={(_) => navigate("/")}>
							Page d'acceuil
						</div>
					) : (
						<></>
					)}
					<div
						className="button"
						onClick={(_) => {
							disconnect();
							setIsLogIn("");
							setIsAdmin(false);
							setIsLoad(false);
							if (path !== "/") navigate("/");
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
					<div className="checkbox-wrapper-14">
						<input
							id="s1-14"
							type="checkbox"
							className="switch"
							onChange={showPassword}
						/>
						<label htmlFor="s1-14" className="clickable">
							Montrer le mot de passe
						</label>
					</div>
					<span
						id="connectionButton"
						className="button"
						onClick={tryLogIn}
					>
						Connection
					</span>
					<div>{textConnection}</div>
				</div>
			)}
		</div>
	);
};
export default Account;
