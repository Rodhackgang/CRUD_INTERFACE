// Importation du module multer pour gérer l'upload de fichiers
const multer = require('multer');

// Définition d'un objet MIME_TYPE pour associer les types MIME des images à leurs extensions respectives
const MIME_TYPE = {
	'image/jpg': 'jpg',  // Si le type MIME est 'image/jpg', l'extension sera '.jpg'
	'image/jpeg': 'jpg',  // Si le type MIME est 'image/jpeg', l'extension sera '.jpg'
	'image/png': 'png',   // Si le type MIME est 'image/png', l'extension sera '.png'
	'image/webp': 'webp', // Si le type MIME est 'image/webp', l'extension sera '.webp'
}

// Configuration de l'option de stockage de multer
const storage = multer.diskStorage({
	// Définition de l'emplacement où les fichiers seront stockés
	destination: function (req, file, callback) {
		// Les fichiers seront stockés dans le dossier './images'
		callback(null, './images');
	},

	// Définition du nom du fichier une fois qu'il est téléchargé
	filename: (req, file, callback) => {
		// Remplacement des espaces par des underscores dans le nom du fichier original
		const filename = file.originalname.split(' ').join('_');

		// Séparation du nom du fichier et de son extension
		const filenameArray = filename.split('.');

		// Suppression de l'extension pour éviter les conflits
		filenameArray.pop();

		// Reconstitution du nom de fichier sans l'extension
		const filenameWithoutExtention = filenameArray.join('.');

		// Récupération de l'extension du fichier basée sur son type MIME
		const extension = MIME_TYPE[file.mimetype];

		// Construction du nom final du fichier : nom original + timestamp + extension
		callback(null, filenameWithoutExtention + Date.now() + '.' + extension);
	}
});

// Exportation de la configuration multer pour l'utiliser dans d'autres parties de l'application
module.exports = multer({ storage }).single('image');
