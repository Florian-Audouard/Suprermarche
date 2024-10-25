import React, { useEffect, useState } from "react";
import "../styles/components/Admin.css";
import { getUrl } from "../helpers/GetUrl";
import ArticlePerime from "./ArticlePerime";
import ArticleRestant from "./ArticleRestant";

const Admin = ({ choice }) => {
	const [tabPerime, setTabPerime] = useState([]);
	const [tabRestant, setTabRestant] = useState([]);
	const [changementPerime, setChangementPerime] = useState(0);
	const [changementRestant, setChangementRestant] = useState(0);
	useEffect(() => {
		setChangementPerime(0);
		setChangementRestant(0);
	}, []);
	useEffect(() => {
		fetch(getUrl() + "/getAllStockPerime")
			.then((res) => res.json())
			.then((data) => {
				setTabPerime(data.table);
			});
	}, [changementPerime]);
	useEffect(() => {
		fetch(getUrl() + "/getAllStock")
			.then((res) => res.json())
			.then((data) => {
				setTabRestant(data.table);
			});
	}, [changementRestant]);
	return (
		<div id="admin">
			<div>
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
								quantite={e[9]}
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
