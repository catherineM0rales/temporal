const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    });
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const visible = filter === "todos" || categories.includes(filter);
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

const projectDetails = {
  cafe: {
    title: "Café Luna",
    category: "SITIO WEB · CAFETERÍA",
    description: "Sitio web temático para una cafetería, con identidad visual cálida. En los archivos se encuentran catálogo, carrito, registro, términos y condiciones y formularios.",
    tags: ["HTML", "CSS", "JavaScript", "Carrito", "Formularios"],
    note: "Abrí el proyecto desde la tarjeta para explorar la página completa en tu navegador."
  },
  viajes: {
    title: "Mundo Viajes",
    category: "SITIO WEB · TURISMO",
    description: "Página web de temática turística. Se incluye en la entrega con sus archivos HTML, CSS e imágenes locales.",
    tags: ["HTML", "CSS", "Diseño web"],
    note: "La página se abre desde los archivos locales incluidos en esta entrega."
  },
  powerfit: {
    title: "PowerFit",
    category: "SITIO WEB · GIMNASIO",
    description: "Sitio web para un gimnasio, con una identidad visual deportiva basada en negro y verde lima.",
    tags: ["HTML", "CSS", "Diseño adaptable"],
    note: "Los recursos gráficos fueron revisados por la autora antes de continuar con esta entrega."
  },
  tecnostore: {
    title: "TecnoStore",
    category: "WEB INTERACTIVA · TECNOLOGÍA",
    description: "Interfaz de tienda tecnológica de demostración. Sus archivos incluyen productos, carrito y elementos de interacción con JavaScript.",
    tags: ["HTML", "CSS", "JavaScript", "Interfaz"],
    note: "Se presenta como proyecto web interactivo, sin afirmar que sea una tienda real ni que procese pagos reales."
  },
  imperdonables: {
    title: "Imperdonables",
    category: "VIDEOJUEGO · PYTHON",
    description: "Proyecto de videojuego narrativo 2D desarrollado con Python y Arcade, con una historia propia y exploración de temas emocionales.",
    tags: ["Python", "Arcade", "Narrativa interactiva"],
    note: "El botón de la tarjeta lleva al repositorio proporcionado en GitHub. No se presenta como juego ejecutable en el navegador."
  },
  vr: {
    title: "Proyecto VR",
    category: "PROYECTO · REALIDAD VIRTUAL",
    description: "Proyecto independiente relacionado con realidad virtual. La descripción se mantiene general hasta verificar el objetivo y las herramientas directamente en el repositorio.",
    tags: ["Realidad virtual", "Proyecto de programación"],
    note: "Consultá el repositorio para conocer sus archivos y detalles técnicos."
  }
};

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalTags = document.getElementById("modal-tags");
const modalMedia = document.getElementById("modal-media");
const modalNote = document.getElementById("modal-note");
const modalClose = document.querySelector(".modal-close");
let lastFocusedElement = null;

function closeModal() {
  modalMedia.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll(".details-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const details = projectDetails[button.dataset.project];
    if (!details) return;

    lastFocusedElement = button;
    modalTitle.textContent = details.title;
    modalCategory.textContent = details.category;
    modalDescription.textContent = details.description;
    modalNote.textContent = details.note;
    modalTags.replaceChildren();
    modalMedia.replaceChildren();

    details.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      modalTags.appendChild(chip);
    });

    const projectVideos = {
      imperdonables: [
        { src: "videos/imperdonables-1.mp4", title: "Menú principal" },
        { src: "videos/imperdonables-2.mp4", title: "Gameplay · recorrido por la cueva" }
      ],
      vr: [
        { src: "videos/proyecto-vr.mp4", title: "Demostración del proyecto VR" }
      ]
    };

    (projectVideos[button.dataset.project] || []).forEach((item, index) => {
      const videoBlock = document.createElement("div");
      videoBlock.className = "modal-video-block";
      const heading = document.createElement("h3");
      heading.textContent = item.title;
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;
      video.setAttribute("aria-label", item.title);
      video.src = item.src;
      videoBlock.append(heading, video);
      modalMedia.appendChild(videoBlock);
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const revealTargets = document.querySelectorAll(
  ".section-kicker, .section-heading, .project-card, .skill-item, .quote-card, .mini-card"
);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((element) => {
    element.classList.add("reveal-ready");
    observer.observe(element);
  });
}
