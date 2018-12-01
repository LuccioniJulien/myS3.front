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
	if (method === "POST" || method === "PUT") {
		options.body = JSON.stringify(body);
	}
	try {
		const res = await fetch(url, options);

		if (method == "DELETE" || method == "PUT") {
			return await res.status;
		}
		const json = await res.json();
		return json;
	} catch (error) {
		// window.localStorage.clear()
		// window.location.href = "http://localhost:3000/"
	}
};
