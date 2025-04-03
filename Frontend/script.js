// Fonction d'animation des images lorsque la section est visible
let monToken = localStorage.getItem("token");
window.addEventListener('scroll', () => {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const gallerySection = document.querySelector('#projects');
    const sectionTop = gallerySection.getBoundingClientRect().top;
    const sectionHeight = gallerySection.offsetHeight;
    if (sectionTop <= window.innerHeight * 0.5 && sectionTop + sectionHeight >= 0) {
        animateImages(galleryItems);
    }
});

function animateImages(galleryItems) {
    galleryItems.forEach((item, index) => {
        const delay = index * 0.3;
        const direction = getDirection();
        item.classList.add('animate__animated', `animate__${direction}`);
        item.style.animationDelay = `${delay}s`;
    });
}

function getDirection() {
    const directions = ['fadeInUp', 'fadeInLeft', 'fadeInRight', 'fadeInDown'];
    return directions[Math.floor(Math.random() * directions.length)];
}

// Déclaration des éléments
const editButton = document.querySelector('.edit-button');
const photoModal = document.getElementById('photo-modal');
const closeBtnPhotoModal = document.querySelector('.close');
const imageContainer = document.getElementById('image-container');
const addPhotoButton = document.getElementById('add-photo-button');
const  addPhotoModal = document.getElementById('add-photo-modal');
const closeBtnAddPhotoModal = document.querySelector('.close');
const backButton = document.querySelector('.back-button');
const photoInput = document.getElementById('photo');
const imagePreview = document.getElementById('image-preview');

backButton.addEventListener('click', closeAddPhotoModal);
// Fonction d'affichage et fermeture des modaux
function showPhotoModal() {
    photoModal.style.display = 'block';
    imageContainer.innerHTML = '';  // Clear the container before loading images
    loadGalleryImages();  // Load the gallery images inside the modal
}

function closePhotoModal() {
    photoModal.style.display = 'none';
}

function showAddPhotoModal() {
    addPhotoModal.style.display = 'block';
}

function closeAddPhotoModal() {
    addPhotoModal.style.display = 'none';
}

addPhotoButton.addEventListener('click', showAddPhotoModal);
closeBtnAddPhotoModal.addEventListener('click', closeAddPhotoModal);
addPhotoModal.addEventListener('click', (event) => {
    if (event.target === addPhotoModal) {
        closeAddPhotoModal();
    }
});
photoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Actions pour fermer les modaux
backButton.addEventListener('click', closeAddPhotoModal);
closeBtnPhotoModal.addEventListener('click', closePhotoModal);
closeBtnAddPhotoModal.addEventListener('click', closeAddPhotoModal);

// Fermeture des modaux quand on clique à l'extérieur
photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
        closePhotoModal();
    }
});


// Événement pour le bouton d'édition (modal photo)
editButton.addEventListener('click', showPhotoModal);
closeBtnPhotoModal.addEventListener('click', closePhotoModal);
photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
        closePhotoModal();
    }
});

// Soumettre l'ajout de photo via formulaire
const submitButton = document.getElementById('validate');
submitButton.addEventListener('click', async function (event) {
    event.preventDefault();
    const formData = new FormData();
    const files = photoInput.files;
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;

    if (files.length > 0) {
        formData.append("image", files[0]);
    }
    formData.append("title", title);
    formData.append("category", category);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { Authorization: `Bearer ${monToken}` },
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de la photo");
        }
        alert("Photo ajoutée avec succès!");
        closeAddPhotoModal();
        loadGalleryImages(); // Recharger la galerie après ajout
    } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de l'ajout de la photo.");
    }
});

// Charger les images depuis l'API dans la galerie
async function loadGalleryImages() {
    const response = await fetch("http://localhost:5678/api/works");
    const worksList = await response.json();
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';

    worksList.forEach(work => {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");
        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;

        const caption = document.createElement("p");
        caption.classList.add("project-caption");
        caption.innerText = work.title;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-icon");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => deleteImage(work.id, galleryItem));

        galleryItem.appendChild(imgElement);
        galleryItem.appendChild(caption);
        galleryItem.appendChild(deleteButton);
        gallery.appendChild(galleryItem);
        const modalImageWrapper = document.createElement('div');
        modalImageWrapper.classList.add('image-wrapper');
        const modalImgElement = document.createElement("img");
        modalImgElement.src = work.imageUrl;
        modalImgElement.alt = work.title;
        const deleteIcon = document.createElement("button");
        deleteIcon.classList.add('delete-icon');
        deleteIcon.innerHTML = '<i class="fas fa-trash"></i>';
        deleteIcon.addEventListener('click', () => deleteImage(work.id, modalImageWrapper));

        modalImageWrapper.appendChild(modalImgElement);
        modalImageWrapper.appendChild(deleteIcon);
        imageContainer.appendChild(modalImageWrapper);
    });
}

// Supprimer une image via l'API
async function deleteImage(id, elementToRemove) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${monToken}` },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'image");
        }

        elementToRemove.remove();
        alert('Photo supprimée avec succès!');
    } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de la suppression de la photo.");
    }
}
// Charger les catégories et afficher les boutons de filtre
async function loadCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categoriesList = await response.json();
    const filterContainer = document.getElementById('filtres');

    // Créer et ajouter un bouton "Tous" pour afficher toutes les œuvres
    const buttonAll = document.createElement('button');
    buttonAll.classList.add('btn-filtres');
    buttonAll.innerText = "Tous";
    buttonAll.addEventListener('click', () => filterWorks("0"));
    filterContainer.appendChild(buttonAll);

    // Créer un bouton pour chaque catégorie
    categoriesList.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('btn-filtres');
        button.innerText = category.name;
        button.addEventListener('click', () => filterWorks(category.id));
        filterContainer.appendChild(button);
    });
}

// Filtrer les œuvres par catégorie
async function filterWorks(categoryId) {
    const url = categoryId === "0" 
        ? "http://localhost:5678/api/works"  // Si "Tous" est sélectionné, récupérer toutes les œuvres
        : `http://localhost:5678/api/works?category=${categoryId}`;  // Sinon filtrer par catégorie
    
    const response = await fetch(url);
    const allWorks = await response.json();
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les œuvres filtrées

    // Si "Tous" est sélectionné, on affiche toutes les œuvres sans filtrage
    let filteredWorks = allWorks;
    if (categoryId !== "0") {
        filteredWorks = allWorks.filter(work => {
            return work.categoryId === parseInt(categoryId); // Comparer categoryId uniquement si une catégorie est sélectionnée
        });
    }

    // Ajouter les œuvres filtrées dans la galerie
    filteredWorks.forEach(work => {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");

        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;

        const caption = document.createElement("p");
        caption.classList.add("project-caption");
        caption.innerText = work.title;

        galleryItem.appendChild(imgElement);
        galleryItem.appendChild(caption);
        gallery.appendChild(galleryItem);
    });
}


// Initialiser la galerie et les filtres
loadGalleryImages();
loadCategories();


