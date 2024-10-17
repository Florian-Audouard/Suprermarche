import React, { useState, useEffect } from "react";
import Account from "../components/Account";
import { logIn } from "../helpers/LogIn";

const Home = () => {
	const [isLogIn, setIsLogIn] = useState(false);
	const [username, setUsername] = useState("");
	useEffect(() => {
		logIn(setIsLogIn, setUsername);
	}, []);
	return (
		<span className="Home">
			{!isLogIn ? (
				<Account
					isLogIn={isLogIn}
					setIsLogIn={setIsLogIn}
					username={username}
					setUsername={setUsername}
				/>
			) : (
				""
			)}
		</span>
	);
};

export default Home;
