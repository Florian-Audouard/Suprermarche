import React, { useEffect, useState } from "react";
import { getUrl } from "../helpers/GetUrl";
import { getPassword, getUsername } from "../helpers/LogIn";
import "../styles/Profile.css";
import Historique from "../components/Historique";

const Profile = () => {
	const [nom, setNom] = useState("Nom");
	const [prenom, setPrenom] = useState("Prenom");
	const [ptfidelite, setPtfidelite] = useState("pt_fidelite");
	const [age, setAge] = useState("age");
	const [mail, setMail] = useState("mail");
	const [tel, setTel] = useState("num_tel");
	const [isLoad, setIsLoad] = useState(false);
	const [historique, setHistorique] = useState([]);

	useEffect(() => {
		let username = getUsername();
		let md5Password = getPassword();

		fetch(getUrl() + "/getProfilClient", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.table === "False") {
					//redirection home
					return;
				}
				let table = data.table[0];
				setNom(table[1]);
				setPrenom(table[2]);
				setPtfidelite(table[3]);
				setAge(table[4]);
				setMail(table[5]);
				setTel(table[6]);
				setIsLoad(true);
			});
		fetch(getUrl() + "/getHistorique", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.table === "False") {
					//redirection home
					return;
				}
				setHistorique(data.table);
			});
	}, []);

	return (
		<span>
			{isLoad ? (
				<div id="profile">
					<div>Nom : {nom} </div>
					<div> Prénom: {prenom} </div>
					<div> Points: {ptfidelite} </div>
					<div> Age: {age}</div>
					<div> Adresse mail: {mail}</div>
					<div> Numéro de téléphone: {tel}</div>
				</div>
			) : (
				<span></span>
			)}

			<div>
				<div id="historique_achat">
					{" "}
					{historique.map((e) => (
						<Historique
							key={e[0][0]}
							histprincipal={e[0]}
							histdetail={e[1]}
						></Historique>
					))}
				</div>
			</div>
		</span>
		//menu deroulant des achat
		/* bouton pour retourner vers home depuis profil*/
	);
};
export default Profile;
