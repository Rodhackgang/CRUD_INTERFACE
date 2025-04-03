// Importation de la configuration de la base de données et des modules nécessaires
const dbConfig = require("./../config/db.config.js");  // Importation du fichier de configuration de la base de données
const { Sequelize } = require("sequelize");  // Importation du constructeur Sequelize de la bibliothèque Sequelize
const config = require("../config/db.config");  // Importation de la configuration de la base de données (une autre façon de l'importer)


// Création d'une instance de Sequelize pour connecter l'application à la base de données
const sequelize = new Sequelize('project6-db', 'user', 'pass', config);  // Connexion à la base de données 'project6-db' avec les informations d'authentification (user et pass) et la configuration stockée dans le fichier db.config

// Objet qui va contenir tous les modèles et connexions
const db = {}

// Assignation des propriétés de Sequelize et de la connexion sequelize à l'objet db
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importation des modèles pour les utilisateurs, les œuvres et les catégories
db.users = require('./users.model.js')(sequelize, Sequelize);  // Le modèle 'users' est importé et lié à la connexion sequelize et Sequelize
db.works = require('./works.model.js')(sequelize, Sequelize);  // Le modèle 'works' est importé et lié à la connexion sequelize et Sequelize
db.categories = require('./categories.model.js')(sequelize, Sequelize);  // Le modèle 'categories' est importé et lié à la connexion sequelize et Sequelize

// Définition des relations entre les modèles

// Relation entre les catégories et les œuvres
db.categories.hasMany(db.works, { as: "works" });  // Une catégorie peut avoir plusieurs œuvres (relation un-à-plusieurs)
db.works.belongsTo(db.categories, {
    foreignKey: 'categoryId',  // La clé étrangère dans le modèle des œuvres fait référence à la catégorie
    as: 'category'  // L'alias pour la relation (permet d'utiliser `work.category` pour accéder à la catégorie de l'œuvre)
});

// Relation entre les utilisateurs et les œuvres
db.users.hasMany(db.works, { as: "works" });  // Un utilisateur peut avoir plusieurs œuvres (relation un-à-plusieurs)
db.works.belongsTo(db.users, {
    foreignKey: 'userId',  // La clé étrangère dans le modèle des œuvres fait référence à l'utilisateur
    as: 'user'  // L'alias pour la relation (permet d'utiliser `work.user` pour accéder à l'utilisateur qui a créé l'œuvre)
});

// Exportation de l'objet db pour l'utiliser dans d'autres parties de l'application (par exemple dans les contrôleurs ou les services)
module.exports = db;
