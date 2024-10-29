import React, { useEffect, useState } from "react";
import { getUrl } from "../helpers/GetUrl";
import { getPassword, getUsername, logIn } from "../helpers/LogIn";
import "../styles/pages/Profile.css";
import Historique from "../components/Historique";
import { useNavigate } from "react-router-dom";
import Account from "../components/Account";

const Profile = () => {
	const [nom, setNom] = useState("Nom");
	const [prenom, setPrenom] = useState("Prenom");
	const [ptfidelite, setPtfidelite] = useState("pt_fidelite");
	const [age, setAge] = useState("age");
	const [mail, setMail] = useState("mail");
	const [tel, setTel] = useState("num_tel");
	const [isLoad, setIsLoad] = useState(false);
	const [historique, setHistorique] = useState([]);
	const [isLogIn, setIsLogIn] = useState("");
	const [isAdmin, setIsAdmin] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		logIn(setIsLogIn, (_) => {}, setIsAdmin);
	}, []);

	useEffect(() => {
		if (isLogIn === "") return;
		if (isAdmin === true) {
			navigate("/");
			return;
		}
		if (isLogIn === false) {
			navigate("/");
			return;
		}
		let username = getUsername();
		let md5Password = getPassword();

		fetch(getUrl() + "/getProfilClient", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				setNom(data[1]);
				setPrenom(data[2]);
				setPtfidelite(data[3]);
				setAge(data[4]);
				setMail(data[5]);
				setTel(data[6]);
				setIsLoad(true);
			});
		fetch(getUrl() + "/getHistorique", {
			method: "POST",
			body: JSON.stringify({ username, password: md5Password }),
		})
			.then((res) => res.json())
			.then((data) => {
				setHistorique(data);
			});
	}, [isAdmin, isLogIn, navigate]);

	return (
		<span>
			<Account
				setIsLogInParents={(_) => {}}
				setIsLoadParents={(_) => {}}
				setIsAdminParents={(_) => {}}
				setChoiceAdmin={(_) => {}}
				setPanierChangeParents={(_) => {}}
				panierChange={0}
			></Account>
			{isLoad ? (
				<div id="profile">
					<h1>Vos information :</h1>
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
					<h1>Votre historique :</h1>{" "}
					{historique?.map((e) => (
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
