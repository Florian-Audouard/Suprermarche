import { getUrl } from "./GetUrl";
import { eraseCookie, getCookie, setCookie } from "./Cookie";

export function logIn(setIsLogIn, setUsername) {
	let localUsername = getCookie("username");
	let localPassword = getCookie("password");
	if (localUsername === "" || localPassword === "") {
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
export function disconnect() {
	eraseCookie("username");
	eraseCookie("password");
}

export function getUsername() {
	return getCookie("username");
}
export function getPassword() {
	return getCookie("password");
}

export function setAccount(username, password) {
	setCookie("username", username);
	setCookie("password", password);
}
