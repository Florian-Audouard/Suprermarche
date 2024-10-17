import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import { getUrl } from "../helpers/GetUrl";

const Admin = () => {
	const [choice, setChoice] = useState("");

	useEffect(() => {
		setChoice("restant");
		fetch(getUrl() + "/getAllStockPerime")
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
	}, []);

	function restant() {
		setChoice("restant");
	}
	function perime() {
		setChoice("perime");
	}
	return (
		<div id="admin">
			<span id="navAdmin">
				<span onClick={restant}>Stock Restant</span>
				<span onClick={perime}>Stock Périmé</span>
			</span>
			<div>
				{choice === "restant" ? <span>restant</span> : <span></span>}
				{choice === "perime" ? <span>perime</span> : <span></span>}
			</div>
		</div>
	);
};
export default Admin;
