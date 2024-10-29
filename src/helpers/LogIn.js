import { getUrl } from "./GetUrl";
import { eraseCookie, getCookie, setCookie } from "./Cookie";

export function logIn(setIsLogIn, setUsername, setIsAdmin) {
	let localUsername = getCookie("username");
	let localPassword = getCookie("password");
	if (localUsername === undefined || localPassword === undefined) {
		setIsLogIn(false);
		return;
	}
	fetch(getUrl() + "/logIn", {
		method: "POST",
		body: JSON.stringify({
			username: localUsername,
			password: localPassword,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.auth === true) {
				setIsLogIn(true);
				setUsername(localUsername);
				setIsAdmin(data.role === "Admin");
			} else {
				setIsLogIn(false);
				disconnect();
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
