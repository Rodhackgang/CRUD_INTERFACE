// Importation du modèle 'categories' depuis les modèles de la base de données
const db = require('./../models');
const Categories = db.categories;  // Récupération du modèle 'categories' à partir de la base de données

// Fonction pour récupérer toutes les catégories
exports.findAll = async (req, res) => {
	try {
		// Récupération de toutes les catégories depuis la base de données
		const works = await Categories.findAll();

		// Retourne une réponse avec un statut 200 (OK) et les catégories récupérées
		return res.status(200).json(works);
	} catch (err) {
		// En cas d'erreur, retourne une erreur avec un statut 500 (Erreur interne)
		return res.status(500).json({ error: new Error('Une erreur est survenue') });
	}
}

// Fonction pour créer une nouvelle catégorie
exports.create = async (req, res) => {
	// Création d'une nouvelle catégorie dans la base de données
	const category = await Categories.create({
		name: req.body.name  // Le nom de la catégorie est extrait du corps de la requête
	});

	// Retourne une réponse avec un statut 201 (Créé) et la catégorie créée
	return res.status(201).json(category);
}
