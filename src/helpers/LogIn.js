import { getUrl } from "./GetUrl";

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
export function logIn(setIsLogIn, setUsername) {
	let localUsername = getCookie("username");
	let localPassword = getCookie("password");
	if (
		localUsername === "" ||
		localPassword === "" ||
		localPassword === undefined ||
		localUsername === undefined
	) {
		setIsLogIn(false);
		return;
	}
	fetch(getUrl() + "/LogIn", {
		method: "POST",
		body: JSON.stringify({
			username: localUsername,
			password: localPassword,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data === "True") {
				setIsLogIn(true);
				setUsername(localUsername);
			} else {
				setIsLogIn(false);
			}
		});
}
export function getUsername() {
	return getCookie("username");
}
export function getPassword() {
	return getCookie("password");
}
export function setCookie(cname, cvalue) {
	const date = new Date();
	date.setFullYear(date.getFullYear() + 100);
	let expires = "expires=" + date.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
