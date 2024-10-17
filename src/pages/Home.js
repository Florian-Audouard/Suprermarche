import React, { useState, useEffect } from "react";
import Account from "../components/Account";
import Client from "../components/Client";
import Admin from "../components/Admin";
import { getPassword, logIn } from "../helpers/LogIn";
import { getUrl } from "../helpers/GetUrl";
import Presentation from "../components/Presentation";

const Home = () => {
	const [isLogIn, setIsLogIn] = useState(false);
	const [username, setUsername] = useState("");
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [points, setPoints] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoad, setIsLoad] = useState(false);

	useEffect(() => {
		logIn(setIsLogIn, setUsername);
		setIsLoad(false);
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
				setIsAdmin(table[7] === "Admin");
				setIsLoad(true);
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
				isAdmin={isAdmin}
			/>
			{isLoad ? (
				isLogIn ? (
					isAdmin ? (
						<Admin />
					) : (
						<Client />
					)
				) : (
					<Presentation />
				)
			) : (
				<span></span>
			)}
		</span>
	);
};

export default Home;
