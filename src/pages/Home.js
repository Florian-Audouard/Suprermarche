import React, { useState, useEffect } from "react";
import Account from "../components/Account";
import Client from "../components/Client";
import Admin from "../components/Admin";

import Presentation from "../components/Presentation";

const Home = () => {
	const [isLogIn, setIsLogIn] = useState("");

	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoad, setIsLoad] = useState(false);
	const [panierChange, setPanierChange] = useState(0);
	const [choiceAdmin, setChoiceAdmin] = useState("");
	useEffect(() => {
		setIsLoad(false);
		setIsAdmin(false);
		setPanierChange(0);
		setChoiceAdmin("restant");
	}, []);

	return (
		<span className="Home">
			<Account
				setIsLoadParents={setIsLoad}
				setIsLogInParents={setIsLogIn}
				setIsAdminParents={setIsAdmin}
				setPanierChangeParents={setPanierChange}
				panierChangeParents={panierChange}
				setChoiceAdmin={setChoiceAdmin}
			/>
			{isLoad ? (
				isLogIn ? (
					isAdmin ? (
						<Admin choice={choiceAdmin} />
					) : (
						<Client
							setPanierChange={setPanierChange}
							panierChange={panierChange}
						/>
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
