import { eraseCookie, getCookie, setCookie } from "./Cookie";

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

export function delPanier() {
	eraseCookie("panier");
}

export function deleteArticlePanier(numero) {
	const panier = getPanierCookie();
	delete panier[numero];
	setPanierCookie(panier);
}
