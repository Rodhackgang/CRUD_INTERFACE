// Middleware qui vérifie les données de l'œuvre envoyées dans la requête avant de les sauvegarder
module.exports = (req, res, next) => {
	try {
		// Récupération de l'hôte (host) depuis l'en-tête de la requête
		const host = req.get('host');

		// Récupération et nettoyage du titre (trim pour enlever les espaces avant et après)
		const title = req.body.title.trim() ?? undefined;

		// Récupération de l'ID de la catégorie et conversion en entier
		const categoryId = parseInt(req.body.category) ?? undefined;

		// Récupération de l'ID de l'utilisateur authentifié
		const userId = req.auth.userId ?? undefined;

		// Création de l'URL de l'image à partir du protocole, de l'hôte et du nom du fichier de l'image
		const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}` ?? undefined;

		// Affichage dans la console des valeurs récupérées pour le débogage
		console.log(title, categoryId, userId, imageUrl);

		// Validation des données de l'œuvre
		if (
			title !== undefined &&  // Vérification que le titre existe
			title.length > 0 &&     // Vérification que le titre n'est pas vide
			categoryId !== undefined && // Vérification que l'ID de la catégorie existe
			categoryId > 0 &&       // Vérification que l'ID de la catégorie est valide
			userId !== undefined && // Vérification que l'ID de l'utilisateur existe
			userId > 0 &&           // Vérification que l'ID de l'utilisateur est valide
			imageUrl !== undefined  // Vérification que l'URL de l'image existe
		) {
			// Si toutes les validations sont correctes, on passe les données dans l'objet `req.work`
			req.work = { title, categoryId, userId, imageUrl };
			next();  // Appel du middleware suivant
		} else {
			// Si une des conditions n'est pas remplie, on retourne une erreur 400 avec un message
			return res.status(400).json({ error: new Error("Bad Request") });
		}
	} catch (e) {
		// Si une erreur se produit dans le bloc try, on renvoie une erreur 500
		return res.status(500).json({ error: new Error("Something wrong occurred") });
	}
};
