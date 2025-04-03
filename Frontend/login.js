const form = document.getElementById("form-login");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêche la soumission par défaut du formulaire

  // Récupérer les valeurs des champs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Vérifier si les champs sont vides
  if (!email || !password) {
    showModal("error", "Veuillez remplir tous les champs.");
    return; // Empêche l'exécution du code si les champs sont vides
  }

  const idData = {
    email: email,
    password: password,
  };

  try {
    // Envoi de la requête POST via fetch
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idData),
    });

    const data = await response.json();

    // Vérification si un token est renvoyé
    if (data.token) {
      window.localStorage.setItem("token", data.token); // Stocker le token dans le localStorage
      showModal("success", "Connexion réussie !");
      setTimeout(() => {
        window.location.replace("index.html"); // Rediriger vers la page d'accueil après 2 secondes
      }, 2000);
    } else {
      showModal("error", "Email ou mot de passe incorrect.");
    }
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur lors de la connexion", error);
    showModal("error", "Une erreur est survenue. Veuillez réessayer plus tard.");
  }
});

// Fonction pour afficher la modal
function showModal(type, message) {
  const modal = type === "error" ? document.getElementById("error-modal") : document.getElementById("success-modal");
  const messageElement = type === "error" ? document.getElementById("error-message") : document.getElementById("success-message");
  
  messageElement.textContent = message;
  modal.style.display = "block"; // Affiche la modal
}

// Fermeture de la modal
document.getElementById("error-close").onclick = function () {
  document.getElementById("error-modal").style.display = "none";
}

document.getElementById("success-close").onclick = function () {
  document.getElementById("success-modal").style.display = "none";
}

// Fermer la modal si on clique à l'extérieur de celle-ci
window.onclick = function(event) {
  if (event.target === document.getElementById("error-modal") || event.target === document.getElementById("success-modal")) {
    document.getElementById("error-modal").style.display = "none";
    document.getElementById("success-modal").style.display = "none";
  }
}
