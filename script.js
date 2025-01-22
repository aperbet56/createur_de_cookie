// Récupération des éléments HTML5
const inputs = document.querySelectorAll("input");
const cookieForm = document.querySelector("form");
const cookiesList = document.querySelector(".cookies__list");
const toastsContainer = document.querySelector(".toasts__container");
const displayCookieBtn = document.querySelector(".display__cookie__btn");
const infoText = document.querySelector(".info__txt");

// Déclaration de la fonction handleValidationqui va permettre l'affichage d'un message d'erreur si le contenu de l'input est vide
const handleValidation = (e) => {
  if (e.type === "invalid") {
    // La méthode setCustomValidity() permet de définir un message de validité personnalisé pour l'élément
    e.target.setCustomValidity("Ce champ ne peut être vide.");
  } else if (e.type === "input") {
    e.target.setCustomValidity("");
  }
};

// Pour chaque champ de formulaire
inputs.forEach((input) => {
  // Ecoute de l'événement "invalid" et appel de la fonction handleValidation
  input.addEventListener("invalid", handleValidation);
  // Ecoute de l'événement "input" et appel de la fonction handleValidation
  input.addEventListener("input", handleValidation);
});

// Déclaration de la fonction handleSubmit qui va gérer la soumission du formulaire
const handleSubmit = (e) => {
  // Suppression du comportement par défaut
  e.preventDefault();

  // Création de l'objet newCookie
  const newCookie = {};

  // Pour chaque champ de formulaire
  inputs.forEach((input) => {
    // Récupération de l'attribut name des inputs
    const nameAttribute = input.getAttribute("name");
    // Stockage des valeurs dans l'objet newCookie
    newCookie[nameAttribute] = input.value;
  });
  newCookie.expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  // Affichage dans la console
  console.log(newCookie);

  // Appel de la fonction createCookie(newCookie) ayant comme argument newCookie
  createCookie(newCookie);

  // Remise à zéro du formulaire
  cookieForm.reset();
};

// Ecoute de l'événement "submit" et appel de la fonction handleSubmit
cookieForm.addEventListener("submit", handleSubmit);

// Déclaration de la fonction createCookie ayant comme paramètre le cookie  qui  va permettre de créér un cookie et de le modifier
const createCookie = (cookie) => {
  // Si le cookie existe déjà... mise à jour de celui-ci
  if (doesCookieExist(cookie.name)) {
    // Appel de la fonction createToast
    createToast({ name: cookie.name, state: "modifié", color: "orangered" });
  } else {
    // Appel de la fonction createToast
    createToast({ name: cookie.name, state: "créé", color: "green" });
  }
  // La fonction encodeURIComponent() permet d'encoder un composant d'un Uniform Resource Identifier (URI) en remplaçant chaque exemplaire de certains caractères par une, deux, trois ou quatres séquences d'échappement UTF-8 correspondantes
  document.cookie = `${encodeURIComponent(cookie.name)}=${encodeURIComponent(
    cookie.value
  )};expires=${cookie.expires.toUTCString()}`; // La méthode toUTCString() convertit une date en une chaîne de caractères, selon le fuseau horaire UTC.

  if (cookiesList.children.length) displayCookies(); // Appel de la fonction displayCookies
};

// Déclarattion de la fonction doesCookieExist qui va permettre de mettre à jour le cookie existant
const doesCookieExist = (name) => {
  return document.cookie
    .replace(/\s/g, "")
    .split(";")
    .map((cookie) => cookie.split("=")[0])
    .find((cookie) => cookie === encodeURIComponent(name));
};

const createToast = ({ name, state, color }) => {
  // Création de l'élément HTML <p>
  const toastInfo = document.createElement("p");
  // Ajout de la classe toast
  toastInfo.className = "toast";

  toastInfo.textContent = `Cookie ${name} ${state}.`;
  toastInfo.style.backgroundColor = color;
  // Ajout de l'élément <p> créé dans le DOM
  toastsContainer.appendChild(toastInfo);

  // La méthode globale setTimeout() permet de définir un minuteur qui exécute une fonction ou un code donné après la fin du délai indiqué.
  setTimeout(() => {
    toastInfo.remove();
  }, 2500);
};

// Création de la variable lock réglé de base à false
let lock = false;

// Déclaration de la fonction displayCookies qui va permettre d'afficher les cookies
const displayCookies = () => {
  if (cookiesList.children.length) cookiesList.textContent = "";

  const cookies = document.cookie.replace(/\s/g, "").split(";").reverse();

  if (!cookies[0]) {
    if (lock) return;
    lock = true;
    infoText.textContent = "Pas de cookies à afficher, créez-en un ! :)";

    // La méthode globale setTimeout() permet de définir un minuteur qui exécute une fonction ou un code donné après la fin du délai indiqué.
    setTimeout(() => {
      infoText.textContent = "";
      lock = false;
    }, 2500);
    return;
  }

  // Appel de la fonction createElements(cookies)
  createElements(cookies);
};

// Ecoute de l'événement "click" et appel de la fonction displayCookies
displayCookieBtn.addEventListener("click", displayCookies);

// Création de la fonction createElements ayant comme paramètre cookies
const createElements = (cookies) => {
  // Pour chaque cookies
  cookies.forEach((cookie) => {
    const formatCookie = cookie.split("=");
    // Création de l'élément <li>
    const cookieDisplay = document.createElement("li");
    const name = decodeURIComponent(formatCookie[0]);
    const value = decodeURIComponent(formatCookie[1]);
    // Mise en place de la structre html de l'élément <li> créé
    cookieDisplay.innerHTML = `
            <p>
                <span>Nom</span> : ${name}
            </p>
            <p>
                <span>Valeur</span> : ${value}
            </p>
            <button>X</button>
        `;
    // Ecoute de l'événement "click" sur le bouton supprimer et appel de la fonction createToast
    cookieDisplay.querySelector("button").addEventListener("click", (e) => {
      createToast({ name, state: "supprimé", color: "red" });
      document.cookie = `${formatCookie[0]}=;expires=${new Date(0)}`;
      e.target.parentElement.remove();
    });
    // Ajout de l'élément <li> créé dans le DOM
    cookiesList.appendChild(cookieDisplay);
  });
};
