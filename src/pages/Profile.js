import React, { useEffect, useState } from "react";
import { getUrl } from "../helpers/GetUrl";
import { getPassword, getUsername } from "../helpers/LogIn";
import "../styles/Profile.css";
const Profile = () => {
	const [nom, setNom] = useState("allo");
	const [isClicked, setIsClicked] = useState(false);
	const test_map = ["1", "2", "3"];
	useEffect(() => {
		setIsClicked(false);
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
	function testClick(event) {
		setIsClicked(!isClicked);
	}
	return (
		<div id="profile">
			<div onClick={testClick}>Nom : {nom}</div>
			{isClicked ? (
				test_map.map((e) => <div key={e}>{e}</div>)
			) : (
				<span></span>
			)}
		</div>
	);
};
export default Profile;
