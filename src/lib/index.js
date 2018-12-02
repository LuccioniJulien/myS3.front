export default async ({
	action,
	method = "GET",
	body = {},
	jwt = false,
	file = false,
	download = false
}) => {
	const url = `http://localhost:5000/api${action}`;
	const headers = {
		"Content-Type": "application/json"
	};
	if (file) {
		delete headers["Content-Type"];
	}
	if (jwt) {
		headers.Authorization = `Bearer ${jwt}`;
	}
	const options = {
		headers,
		method
	};
	if (method === "POST" || method === "PUT") {
		if (file) {
			options.body = body;
		} else {
			options.body = JSON.stringify(body);
		}
	}
	try {
		const res = await fetch(url, options);

		if (download) {
			return res.blob();
		}
		if ((method == "DELETE" || method == "PUT") && res.status == 204) {
			return res.status;
		}
		const json = await res.json();
		return json;
	} catch (error) {
		// window.localStorage.clear();
		// window.location.href = "http://localhost:3000/";
	}
};
