import React, { useEffect, useState } from "react";
import "../styles/components/Admin.css";
import { getUrl } from "../helpers/GetUrl";
import ArticlePerime from "./ArticlePerime";
import ArticleRestant from "./ArticleRestant";
import SearchBar from "./SearchBar";

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
					<span>
						{tabPerime.map((e) => (
							<ArticlePerime
								key={e[11]}
								nom={e[1]}
								marque={e[2]}
								numero={e[11]}
								datePeremption={e[10]}
								changement={changementPerime}
								setChangment={setChangementPerime}
							></ArticlePerime>
						))}
					</span>
				) : (
					<span></span>
				)}
			</div>
		</div>
	);
};
export default Admin;
