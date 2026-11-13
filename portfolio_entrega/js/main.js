
/* =====================================================
   MENÚ RESPONSIVE
   ===================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {
      navLinks.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    });

  });

}


/* =====================================================
   FILTROS DE PROYECTOS
   ===================================================== */

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

      const visible =
        filter === "todos" || categories.includes(filter);

      card.classList.toggle("is-hidden", !visible);

    });

  });

});


/* =====================================================
   INFORMACIÓN DE LOS PROYECTOS
   ===================================================== */

const projectDetails = {

  cafe: {
    title: "Café Luna",
    category: "SITIO WEB · CAFETERÍA",
    description:
      "Sitio web temático para una cafetería, con identidad visual cálida. Incluye catálogo, carrito, registro, términos y condiciones y formularios.",
    tags: ["HTML", "CSS", "JavaScript", "Carrito", "Formularios"],
    note:
      "Abrí el proyecto desde la tarjeta para explorar la página completa en tu navegador."
  },

  viajes: {
    title: "Mundo Viajes",
    category: "SITIO WEB · TURISMO",
    description:
      "Página web de temática turística. Se incluye en la entrega con sus archivos HTML, CSS e imágenes locales.",
    tags: ["HTML", "CSS", "Diseño web"],
    note:
      "La página se abre desde los archivos locales incluidos en esta entrega."
  },

  powerfit: {
    title: "PowerFit",
    category: "SITIO WEB · GIMNASIO",
    description:
      "Sitio web para un gimnasio, con una identidad visual deportiva basada en negro y verde lima.",
    tags: ["HTML", "CSS", "Diseño adaptable"],
    note:
      "Los recursos gráficos forman parte de la propuesta visual del proyecto."
  },

  tecnostore: {
    title: "TecnoStore",
    category: "WEB INTERACTIVA · TECNOLOGÍA",
    description:
      "Interfaz de tienda tecnológica de demostración. Sus archivos incluyen productos, carrito y elementos de interacción con JavaScript.",
    tags: ["HTML", "CSS", "JavaScript", "Interfaz"],
    note:
      "Se presenta como proyecto web interactivo, sin afirmar que sea una tienda real ni que procese pagos reales."
  },

  imperdonables: {
    title: "Imperdonables",
    category: "VIDEOJUEGO · PYTHON",
    description:
      "Proyecto de videojuego narrativo 2D desarrollado con Python y Arcade, con una historia propia y exploración de temas emocionales.",
    tags: ["Python", "Arcade", "Narrativa interactiva"],
    note:
      "Podés ver una grabación del gameplay. La versión jugable todavía necesita prepararse para su distribución."
  },

  vr: {
    title: "Proyecto VR",
    category: "PROYECTO · REALIDAD VIRTUAL",
    description:
      "Experiencia educativa interactiva del Sistema Solar, desarrollada con A-Frame y publicada para ejecutarse directamente desde el navegador.",
    tags: ["A-Frame", "HTML", "JavaScript", "Realidad virtual"],
    note:
      "Usá el enlace Abrir experiencia de la tarjeta para entrar directamente al proyecto publicado."
  }

};


/* =====================================================
   MODAL DE PROYECTOS
   ===================================================== */

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalTags = document.getElementById("modal-tags");
const modalMedia = document.getElementById("modal-media");
const modalNote = document.getElementById("modal-note");
const modalClose = document.querySelector(".modal-close");

let lastFocusedElement = null;


const projectVideos = {

  imperdonables: [
    {
      src: "videos/imperdonables-1.mp4",
      title: "Menú principal"
    },
    {
      src: "videos/imperdonables-2.mp4",
      title: "Gameplay · recorrido por la cueva"
    }
  ],

  vr: [
    {
      src: "videos/proyecto-vr.mp4",
      title: "Demostración del proyecto VR"
    }
  ]

};


function closeModal() {

  if (!modal) return;

  modalMedia.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });

  modal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }

}


document.querySelectorAll(".details-btn").forEach((button) => {

  button.addEventListener("click", () => {

    if (!modal) return;

    const project = button.dataset.project;
    const details = projectDetails[project];

    if (!details) return;

    lastFocusedElement = button;

    modalTitle.textContent = details.title;
    modalCategory.textContent = details.category;
    modalDescription.textContent = details.description;
    modalNote.textContent = details.note;

    modalTags.replaceChildren();
    modalMedia.replaceChildren();


    // Crear etiquetas del proyecto

    details.tags.forEach((tag) => {

      const chip = document.createElement("span");

      chip.textContent = tag;

      modalTags.appendChild(chip);

    });


    // Crear videos cuando el proyecto los tenga

    (projectVideos[project] || []).forEach((item) => {

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
    document.body.classList.add("modal-open");

    modalClose.focus();

  });

});


if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}


if (modal) {

  modal.addEventListener("click", (event) => {

    if (event.target === modal) {
      closeModal();
    }

  });

}


document.addEventListener("keydown", (event) => {

  if (event.key === "Escape" && modal && !modal.hidden) {
    closeModal();
  }

});


/* =====================================================
   AÑO AUTOMÁTICO DEL FOOTER
   ===================================================== */

const year = document.getElementById("year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}


/* =====================================================
   ANIMACIONES AL DESPLAZARSE
   ===================================================== */

const revealTargets = document.querySelectorAll(
  ".section-kicker, .section-heading, .project-card, " +
  ".education-card, .certification-card, .tech-stack-item, " +
  ".quote-card, .mini-card, .contact-card, .stack-heading"
);


if ("IntersectionObserver" in window) {

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("revealed");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12
    }
  );


  revealTargets.forEach((element) => {

    element.classList.add("reveal-ready");

    revealObserver.observe(element);

  });

} else {

  revealTargets.forEach((element) => {
    element.classList.add("revealed");
  });

}


/* =====================================================
   BARRA DE PROGRESO DE LECTURA
   ===================================================== */

const readingProgress = document.getElementById("reading-progress");


function updateReadingProgress() {

  if (!readingProgress) return;

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) {
    readingProgress.style.width = "0%";
    return;
  }

  const progress =
    (window.scrollY / scrollableHeight) * 100;

  readingProgress.style.width = `${Math.min(progress, 100)}%`;

}


window.addEventListener("scroll", updateReadingProgress, {
  passive: true
});

updateReadingProgress();


/* =====================================================
   NAVEGACIÓN ACTIVA SEGÚN LA SECCIÓN
   ===================================================== */

const navigationLinks = document.querySelectorAll(
  ".nav-links a[href^='#']"
);

const pageSections = document.querySelectorAll(
  "main section[id]"
);


if ("IntersectionObserver" in window) {

  const sectionObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const currentId = entry.target.id;

        navigationLinks.forEach((link) => {

          const isCurrent =
            link.getAttribute("href") === `#${currentId}`;

          link.classList.toggle("active", isCurrent);

        });

      });

    },
    {
      rootMargin: "-25% 0px -60% 0px"
    }
  );


  pageSections.forEach((section) => {
    sectionObserver.observe(section);
  });

}
