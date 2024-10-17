import React, { useState, useEffect } from "react";
import Account from "../components/Account";
import { getPassword, logIn } from "../helpers/LogIn";
import { getUrl } from "../helpers/GetUrl";

const Home = () => {
	const [isLogIn, setIsLogIn] = useState(false);
	const [username, setUsername] = useState("");
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [points, setPoints] = useState("");
	useEffect(() => {
		logIn(setIsLogIn, setUsername);
	}, []);
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
	}, [username, isLogIn]);
	return (
		<span className="Home">
			<Account
				isLogIn={isLogIn}
				setIsLogIn={setIsLogIn}
				username={username}
				setUsername={setUsername}
				nom={nom}
				prenom={prenom}
				points={points}
			/>
			{isLogIn ? <div>connecter</div> : <div></div>}
		</span>
	);
};

export default Home;
