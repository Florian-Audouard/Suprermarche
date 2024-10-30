import React, { useEffect, useState } from "react";
import "../styles/components/Admin.css";
import { getUrl } from "../helpers/GetUrl";
import ArticlePerime from "./ArticlePerime";
import ArticleRestant from "./ArticleRestant";
import SearchBar from "./SearchBar";
import { getPassword, getUsername } from "../helpers/LogIn";

const Admin = ({ choice }) => {
	const [tabPerime, setTabPerime] = useState([]);
	const [tabRestant, setTabRestant] = useState([]);
	const [changementPerime, setChangementPerime] = useState(0);
	const [changementRestant, setChangementRestant] = useState(0);
	const [categorie, setCategorie] = useState("");
	const [sousCategorie, setSousCategorie] = useState("");
	const [recherche, setRecherche] = useState("");
	useEffect(() => {
		setChangementPerime(0);
		setChangementRestant(0);
	}, []);
	useEffect(() => {
		if (choice !== "perime") return;
		fetch(getUrl() + "/getAllStockPerime", {
			method: "POST",
			body: JSON.stringify({
				categorie,
				sousCategorie,
				recherche,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setTabPerime(data);
			});
	}, [changementPerime, choice, categorie, sousCategorie, recherche]);
	useEffect(() => {
		if (choice !== "restant") return;
		fetch(getUrl() + "/getAllStock", {
			method: "POST",
			body: JSON.stringify({
				categorie,
				sousCategorie,
				recherche,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setTabRestant(data);
			});
	}, [changementRestant, choice, categorie, sousCategorie, recherche]);
	function deleteAllArticle() {
		let username = getUsername();
		let password = getPassword();
		fetch(getUrl() + "/retireStockAll", {
			method: "POST",
			body: JSON.stringify({ username, password }),
		}).then((e) => {
			setChangementPerime(changementPerime + 1);
		});
	}
	return (
		<div id="admin">
			<div>
				<SearchBar
					categorie={categorie}
					setCategorie={setCategorie}
					sousCategorie={sousCategorie}
					setSousCategorie={setSousCategorie}
					recherche={recherche}
					setRecherche={setRecherche}
				></SearchBar>
				{choice === "restant" ? (
					<span className="restantContainer">
						{tabRestant.map((e) => (
							<ArticleRestant
								key={e[0]}
								numero={e[0]}
								nom={e[1]}
								marque={e[2]}
								description={e[3]}
								prix={e[4]}
								quantite={e[5]}
								changementRestant={changementRestant}
								setChangementRestant={setChangementRestant}
							></ArticleRestant>
						))}
					</span>
				) : (
					<span></span>
				)}
				{choice === "perime" ? (
					<>
						{tabPerime.length !== 0 ? (
							<span className="perimeContainer">
								<div
									className="button"
									onClick={deleteAllArticle}
								>
									Mettre tous les artciles en etat retiré
								</div>

								{tabPerime.map((e) => (
									<ArticlePerime
										key={e[0]}
										numero={e[0]}
										nom={e[1]}
										marque={e[2]}
										dateArrive={e[3]}
										datePeremption={e[4]}
										changement={changementPerime}
										setChangment={setChangementPerime}
									></ArticlePerime>
								))}
							</span>
						) : (
							<h1 className="middle">Aucun article perimé</h1>
						)}
					</>
				) : (
					<span></span>
				)}
			</div>
		</div>
	);
};
export default Admin;
