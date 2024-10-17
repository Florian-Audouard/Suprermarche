import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPassword, setCookie } from "../helpers/LogIn";
import { disconnect } from "../helpers/Disconnect";
import "../styles/Account.css";
import md5 from "md5";
import { getUrl } from "../helpers/GetUrl";

const Account = ({ isLogIn, setIsLogIn, username, setUsername }) => {
	const [password, setPassword] = useState("");
	const [textConnection, setTextConnection] = useState("");
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [points, setPoints] = useState("");
	const input2 = useRef(null);
	const navigate = useNavigate();
	useEffect(() => {
		if (username === "" || username === undefined) return;
		let md5Password = getPassword();

		if (md5Password === "" || md5Password === undefined) return;

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
			});
	}, [username, isLogIn, password]);

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
			setTextConnection("Username can't be empty");
			return;
		}
		if (password === "") {
			setTextConnection("Password can't be empty");
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
					setTextConnection("Connected");
					setCookie("username", username);
					setCookie("password", md5Password);
					setIsLogIn(true);
				} else {
					setTextConnection("Invalid username or password");
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
					<div>Bonjour Monsieur {nom + " " + prenom}</div>
					<div>Nombre de points : {points}</div>
					<button
						className="autor"
						onClick={(_) => navigate("/profile/")}
					>
						Voir profile
					</button>
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
