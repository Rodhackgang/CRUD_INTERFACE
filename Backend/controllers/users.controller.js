// Importation des modules nécessaires : db, bcrypt et jwt
const db = require('./../models');
const bcrypt = require('bcrypt');  // Bibliothèque pour le hachage des mots de passe
const jwt = require('jsonwebtoken');  // Bibliothèque pour la gestion des tokens JWT
const Users = db.users;  // Récupération du modèle 'users' de la base de données

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = async (req, res) => {
	// Vérification que l'email et le mot de passe sont fournis dans la requête
	if (!req.body.email || !req.body.password) {
		// Si l'email ou le mot de passe est manquant, renvoie une erreur 400 (Bad Request)
		return res.status(400).send({
			message: "L'email et le mot de passe sont requis"
		});
	}
	try {
		// Hachage du mot de passe avec bcrypt (salté avec un facteur de complexité de 10)
		const hash = await bcrypt.hash(req.body.password, 10);

		// Création de l'objet utilisateur avec l'email et le mot de passe haché
		const user = {
			email: req.body.email,
			password: hash
		};

		// Création de l'utilisateur dans la base de données
		await Users.create(user);

		// Réponse de succès, utilisateur créé
		return res.status(201).json({ message: 'Utilisateur créé avec succès' });
	} catch (err) {
		// En cas d'erreur, on retourne un message d'erreur 500 (Erreur interne)
		return res.status(500).send({
			message: err.message
		});
	}
}

// Fonction pour la connexion d'un utilisateur
exports.login = async (req, res) => {
	// Recherche de l'utilisateur dans la base de données par son email
	const user = await Users.findOne({ where: { email: req.body.email } });

	// Si l'utilisateur n'existe pas, on renvoie une erreur 404 (Non trouvé)
	if (user === null) {
		return res.status(404).json({ message: 'Utilisateur non trouvé' });
	} else {
		// Si l'utilisateur existe, on compare les mots de passe (le mot de passe envoyé avec celui stocké)
		const valid = await bcrypt.compare(req.body.password, user.password);

		// Si les mots de passe ne correspondent pas, on renvoie une erreur 401 (Non autorisé)
		if (!valid) {
			return res.status(401).json({ error: new Error('Non autorisé') });
		}

		// Si l'authentification est réussie, on génère un token JWT
		return res.status(200).json({
			userId: user.id,  // L'ID de l'utilisateur
			token: jwt.sign(  // Le token JWT avec l'ID de l'utilisateur, signé avec une clé secrète et une durée de validité de 24 heures
				{ userId: user.id },
				process.env.TOKEN_SECRET,
				{ expiresIn: '24h' }
			)
		});
	}
}
