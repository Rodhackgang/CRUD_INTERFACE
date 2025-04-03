// Importation du modèle 'works' depuis les modèles de la base de données
const db = require('./../models');
const Works = db.works;  // Récupération du modèle 'works' à partir de la base de données

// Fonction pour récupérer toutes les œuvres et leurs catégories associées
exports.findAll = async (req, res) => {
	// Récupération de toutes les œuvres depuis la base de données avec l'inclusion des catégories associées
	const works = await Works.findAll({ include: 'category' });

	// Retourne une réponse avec un statut 200 (OK) et la liste des œuvres
	return res.status(200).json(works);
}

// Fonction pour créer une nouvelle œuvre
exports.create = async (req, res) => {
	// Récupération de l'hôte depuis l'en-tête de la requête
	const host = req.get('host');

	// Récupération des données envoyées dans la requête (titre, catégorie, etc.)
	const title = req.body.title;
	const categoryId = req.body.category;
	const userId = req.auth.userId;  // L'ID de l'utilisateur authentifié
	const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;  // Construction de l'URL de l'image

	try {
		// Création d'une nouvelle œuvre dans la base de données
		const work = await Works.create({
			title,
			imageUrl,
			categoryId,
			userId
		});

		// Retourne une réponse avec un statut 201 (Créé) et l'œuvre créée
		return res.status(201).json(work);
	} catch (err) {
		// Si une erreur se produit, retourne une erreur avec un statut 500 (Erreur interne)
		return res.status(500).json({ error: new Error('Une erreur est survenue') });
	}
}

// Fonction pour supprimer une œuvre
exports.delete = async (req, res) => {
	try {
		// Suppression de l'œuvre dont l'ID correspond à l'ID passé dans les paramètres de la requête
		await Works.destroy({ where: { id: req.params.id } });

		// Retourne une réponse avec un statut 204 (Aucun contenu) et un message de succès
		return res.status(204).json({ message: 'Œuvre supprimée avec succès' });
	} catch (e) {
		// En cas d'erreur, retourne une réponse avec un statut 500 et un message d'erreur
		return res.status(500).json({ error: new Error('Une erreur est survenue') });
	}
}
