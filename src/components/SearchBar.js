import React, { useState, useEffect } from "react";
import { getUrl } from "../helpers/GetUrl";
import "../styles/components/SearchBar.css";

const SearchBar = ({
	categorie,
	setCategorie,
	sousCategorie,
	setSousCategorie,
	recherche,
	setRecherche,
}) => {
	const [categorieTab, setCategorieTab] = useState([]);
	const [sousCategorieTab, setSousCategorieTab] = useState([]);

	// useEffect(() => {}, [categorie]); // en theorie ne sert a rien mais empeche un bug de refresh
	useEffect(() => {
		setCategorie("");
		setSousCategorie("");
		setRecherche("");
		fetch(getUrl() + "/getCategorie")
			.then((res) => res.json())
			.then((data) => {
				setCategorieTab(data);
			});
	}, [setCategorie, setSousCategorie, setRecherche]);
	useEffect(() => {
		setSousCategorie("");

		if (categorie === "" || categorie === "all") {
			setSousCategorieTab([]);
			return;
		}
		fetch(getUrl() + "/getSousCategorie", {
			method: "POST",
			body: JSON.stringify({
				categorie,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setSousCategorieTab(data);
			});
	}, [categorie, setSousCategorie]);

	return (
		<div className="searchBar">
			<input
				type="text"
				value={recherche}
				onChange={(e) => setRecherche(e.target.value)}
				placeholder="Recherche..."
			/>
			<select
				onChange={(e) => setCategorie(e.target.value)}
				value={categorie}
			>
				<option value="" disabled hidden>
					Choisir une catégorie
				</option>
				<option value="all">Toute les catégories</option>
				{categorieTab.map((e) => (
					<option key={e} value={e}>
						{e}
					</option>
				))}
			</select>
			{categorie !== "" && categorie !== "all" ? (
				<select
					onChange={(e) => setSousCategorie(e.target.value)}
					value={sousCategorie}
				>
					<option value="" disabled hidden>
						Choisir une Sous categorie
					</option>
					<option value="all">Toute les catégories</option>
					{sousCategorieTab.map((e) => (
						<option key={e} value={e}>
							{e}
						</option>
					))}
				</select>
			) : (
				<></>
			)}
		</div>
	);
};

export default SearchBar;
