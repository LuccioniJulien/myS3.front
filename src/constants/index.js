const formatBucket = (uuid, id = "") => {
	let bid = id;
	if (id != "") {
		bid = "/" + id;
	}
	return `/users/${uuid}/buckets${bid}`;
};
const formatUser = (uuid) => {
	return `/users/${uuid}`
};
const formatBlob = (uuid, id = "", blob_id = "") => {
	let bid = blob_id;
	if (blob_id != "") {
		bid = "/" + blob_id;
	}
	return `/users/${uuid}/buckets/${id}/blobs${bid}`;
};

export default {
	BASE: "http://localhost:5000/api",
	REGISTER: "/auth/register",
	LOGIN: "/auth/login",
	POSTBUCKET: formatBucket,
	GETBUCKETS: formatBucket,
	DELETEBUCKET: formatBucket,
	PUTBUCKET: formatBucket,
	POSTBLOB: formatBlob,
	GETBLOBS: formatBlob,
	GETBLOB:formatBlob,
	DELETEBLOB: formatBlob,
	PUTBLOB: formatBlob,
	PUTUSER:formatUser
};
