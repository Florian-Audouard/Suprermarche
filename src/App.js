import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Panier from "./pages/Panier";

function App() {
	useEffect(() => {
		document.title = "Supermarché";
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" exact element={<Home />} />
				<Route path="/Profile" exact element={<Profile />} />
				<Route path="/Panier" element={<Panier />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
