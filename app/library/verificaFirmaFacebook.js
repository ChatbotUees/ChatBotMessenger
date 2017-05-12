var vericaFirma = module.exports.verificaFirma=function verificaRequestSignature(req, res, buf) {

	//Extraemos la signature del request
	var signature = req.headers["x-hub-signature"];

	if (!signature) {
		//Si no existe
		throw new Error('No se puede validar firma. No existe');
	} else {
		var elementos = signature.split('=');
		var metodo = elementos[0];
		var signatureHash = elementos[1];

		var esperadoHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != esperadoHash) {
			throw new Error("No se puede validar firma del request");
		}
	}
}