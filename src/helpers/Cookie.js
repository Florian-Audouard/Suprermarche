export function setCookie(cname, cvalue) {
	const date = new Date();
	date.setFullYear(date.getFullYear() + 100);
	let expires = "expires=" + date.toUTCString();
	document.cookie =
		cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

export function getCookie(cname) {
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
export function eraseCookie(name) {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 100);
	let expires = "expires=" + date.toUTCString();
	document.cookie =
		name + "=" + 1 + ";" + expires + ";path=/;SameSite=Strict";
}
