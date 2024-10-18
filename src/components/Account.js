import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../helpers/LogIn";
import { disconnect } from "../helpers/Disconnect";
import "../styles/Account.css";
import md5 from "md5";
import { getUrl } from "../helpers/GetUrl";

const Account = ({
	isLogIn,
	setIsLogIn,
	username,
	setUsername,
	nom,
	prenom,
	points,
	isAdmin,
}) => {
	const [password, setPassword] = useState("");
	const [textConnection, setTextConnection] = useState("");

	const input2 = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		setTextConnection("");
	}, []);
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
					setCookie("username", username);
					setCookie("password", md5Password);
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
		<div id="account">
			{isLogIn ? (
				<div>
					<div>
						{nom + " " + prenom + (isAdmin ? " (Admin)" : "")}
					</div>
					{!isAdmin ? (
						<span>
							<div>Nombre de points : {points}</div>
							<button
								className="profile"
								onClick={(_) => navigate("/profile/")}
							>
								Voir profile
							</button>
						</span>
					) : (
						<span></span>
					)}

					<button
						onClick={(_) => {
							disconnect();
							setIsLogIn(false);
						}}
					>
						Se déconnecter
					</button>
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
