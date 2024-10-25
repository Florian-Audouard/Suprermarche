import Cookies from "js-cookie";

export function setCookie(cname, cvalue) {
	const date = new Date();
	date.setFullYear(date.getFullYear() + 100);
	let expires = "expires=" + date.toUTCString();
	document.cookie =
		cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

export function getCookie(cname) {
	return Cookies.get(cname);
}
export function eraseCookie(name) {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 100);
	let expires = "expires=" + date.toUTCString();
	document.cookie =
		name + "=" + 1 + ";" + expires + ";path=/;SameSite=Strict";
}
