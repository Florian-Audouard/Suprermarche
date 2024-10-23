import { getCookie, setCookie } from "./Cookie";

export function getPanierCookie() {
	try {
		return JSON.parse(getCookie("panier"));
	} catch (error) {
		return {};
	}
}

export function setPanierCookie(panier) {
	setCookie("panier", JSON.stringify(panier));
}
