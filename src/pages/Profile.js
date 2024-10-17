import React, { useEffect, useState } from "react";
import { getUrl } from "../helpers/GetUrl";
import { getPassword, getUsername } from "../helpers/LogIn";
import "../styles/Profile.css";
const Profile = () => {
	const [nom, setNom] = useState("allo");

	useEffect(() => {
		let username = getUsername();
		let md5Password = getPassword();
		fetch(getUrl() + "/getProfilClient", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				let table = data.table[0];
				setNom(table[1]);
			});
	}, []);

	return (
		<div id="profile">
			<div>Nom : {nom}</div>
		</div>
	);
};
export default Profile;
