const http = require('http');  // Module Node.js pour créer un serveur HTTP
const app = require('./app');  // Importation de l'application Express (ou autre) configurée dans 'app.js'

// Fonction pour normaliser le port
const normalizePort = val => {
    const port = parseInt(val, 10);  // Conversion de la valeur en entier

    // Si la valeur n'est pas un nombre, retourne la valeur telle quelle
    if (isNaN(port)) {
        return val;
    }
    // Si la valeur est un nombre valide et supérieur ou égal à 0, retourne ce nombre comme port
    if (port >= 0) {
        return port;
    }
    // Si la valeur du port est négative, retourne false
    return false;
};

// Normalisation du port, soit en utilisant la variable d'environnement PORT (si définie), soit 5678 par défaut
const port = normalizePort(process.env.PORT || '5678');

// Enregistrement du port dans l'application Express
app.set('port', port);

// Fonction pour gérer les erreurs du serveur
const errorHandler = error => {
    // Si l'erreur n'est pas liée à une tentative de "listen" (écoute du serveur), on la relance
    if (error.syscall !== 'listen') {
        throw error;
    }

    // Récupération de l'adresse où le serveur écoute
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    // Gestion des erreurs spécifiques
    switch (error.code) {
        case 'EACCES':  // Erreur liée aux permissions (privilèges insuffisants)
            console.error(bind + ' nécessite des privilèges élevés.');
            process.exit(1);  // On arrête le processus avec un code d'erreur
            break;
        case 'EADDRINUSE':  // Erreur liée au port déjà utilisé
            console.error(bind + ' est déjà utilisé.');
            process.exit(1);  // On arrête le processus avec un code d'erreur
            break;
        default:  // Autres erreurs
            throw error;  // On relance l'erreur pour la gérer ailleurs
    }
};

// Création du serveur HTTP avec l'application Express (ou autre)
const server = http.createServer(app);

// Enregistrement du gestionnaire d'erreur du serveur
server.on('error', errorHandler);

// Quand le serveur commence à écouter, on affiche un message dans la console
server.on('listening', () => {
    const address = server.address();  // Récupération de l'adresse du serveur
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;  // Définition du type de bind (pipe ou port)
    console.log('Écoute sur ' + bind);  // Affichage du message dans la console
});

// Le serveur commence à écouter sur le port spécifié
server.listen(port);
