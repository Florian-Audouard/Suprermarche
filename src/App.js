import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" exact element={<Home />} />
				<Route path="/Profile" exact element={<Profile />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
