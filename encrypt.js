const pemEncodedKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqNPlFMTt1qbIs+74Jo5p
xlmveC6YHNkgow982Ko1iPkNbXY9nu8ulqABbuIuH6ekbvfwtyX8wmjxZKwWLsXo
Bc1x7mVUkIaioQeerXvI3J2QQlw1XD71CocBwkGhXcV5N8hwdQG+/A++cjTajzE+
zHNQDV93seSzGbtAUYu63l2x7Ir68YvJCkrWW5i8ZA9Ybf2UcPPnlZ2o9iQ3BXYZ
UdWIUfrUeo0UZudd8Z359WGS/Zu60znZddG3XXqSkxD4ptPU86EqRWfTUGp9EJSg
wvtHdyUuDylwxNBE3W5nGPQWOGd6g0+r+Q4+jDhhofAiKiKpsWRCb5ebr0NGvwUz
4QIDAQAB
-----END PUBLIC KEY-----`;

function str2ab(str) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

function importPublicKey(pem) {
	const pemHeader = "-----BEGIN PUBLIC KEY-----";
	const pemFooter = "-----END PUBLIC KEY-----";
	const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length).replace('\n', '');
	const binaryDerString = window.atob(pemContents);
	const binaryDer = str2ab(binaryDerString);

	return window.crypto.subtle.importKey(
		"spki",
		binaryDer,
		{
			name: "RSA-OAEP",
			hash: "SHA-256"
		},
		true,
		["encrypt"]
	);
}

async function encrypt(message) {
	return window.crypto.subtle.encrypt(
		{ name: "RSA-OAEP", },
		await importPublicKey(pemEncodedKey),
		new TextEncoder().encode(message)
	);
}
