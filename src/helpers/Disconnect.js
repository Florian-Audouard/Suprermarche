function eraseCookie(name) {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 100);
	let expires = "expires=" + date.toUTCString();
	document.cookie = name + "=" + 1 + ";" + expires + ";path=/";
}
export function disconnect() {
	eraseCookie("username");
	eraseCookie("password");
}
