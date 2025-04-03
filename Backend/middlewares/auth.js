// Importation du module jsonwebtoken (JWT) pour gérer l'authentification via token
const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authentification de l'utilisateur à l'aide d'un token JWT
module.exports = (req, res, next) => {
	try {
		// Affichage du header d'autorisation pour le débogage
		console.log(req.headers.authorization);

		// Récupération du token à partir de l'en-tête 'Authorization'
		// L'en-tête est au format 'Bearer <token>', donc on extrait le token
		const token = req.headers.authorization.split(' ')[1];

		// Décodage et vérification du token avec la clé secrète (TOKEN_SECRET) stockée dans les variables d'environnement
		const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

		// Récupération de l'ID de l'utilisateur à partir du token décodé
		const userId = decodedToken.userId;

		// Ajout de l'ID de l'utilisateur à l'objet 'req.auth', pour qu'il soit accessible dans les autres middlewares et contrôleurs
		req.auth = { userId };

		// Vérification que l'ID de l'utilisateur dans la requête correspond à celui du token
		// Cela permet de s'assurer que l'utilisateur ne tente pas d'accéder à des données qui ne lui appartiennent pas
		if (req.body.userId && req.body.userId !== userId) {
			// Si l'ID de l'utilisateur dans la requête est invalide, on lève une erreur
			throw 'ID utilisateur invalide';
		} else {
			// Si tout est valide, on passe au middleware suivant
			next();
		}
	} catch {
		// Si une erreur se produit (par exemple, token invalide, expiration, ou ID utilisateur incorrect)
		// On renvoie une réponse 401 (Non autorisé) avec un message d'erreur
		res.status(401).json({
			error: new Error('Vous n\'êtes pas authentifié')
		});
	}
};
