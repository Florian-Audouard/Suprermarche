export function getUrl() {
	let url_add = "";
	if (process.env.NODE_ENV === "development") url_add = "http://localhost:2500";
	return url_add;
}
