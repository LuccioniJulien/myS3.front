export default async ({ action, method = "GET", body = {}, jwt = false }) => {
	const url = `http://localhost:5000/api${action}`;
	const headers = {
		"Content-Type": "application/json"
	};
	if (jwt) {
		headers.Authorization = `Bearer ${jwt}`;
	}
	const options = {
		headers,
		method
	};
	if (method === "POST") {
		options.body = JSON.stringify(body);
	}
	const res = await fetch(url, options);
	return res.json();
};
