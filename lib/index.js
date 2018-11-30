export default async ({ action, method = "GET", body = {}, jwt = false }) => {
	const url = `http://localhost:5000/api${action}`;
	const headers = {
		"Content-Type": "application/json"
	};
	if (jwt) {
		headers.Authorization = `Bearer ${"yes"}`;
	}
	const option = {
		headers,
		method
	};
	if (method === "POST") {
		option.body = JSON.stringify(this.state);
	}
	fetch = await fetch(url);
	return fetch.json();
};
