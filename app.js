const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".primary-navigation");
const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

function closeMobileMenu() {
  if (!menuToggle || !primaryNavigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
  primaryNavigation.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú de navegación" : "Cerrar menú de navegación");
  primaryNavigation?.classList.toggle("is-open", !isExpanded);
});

dropdownToggle?.addEventListener("click", () => {
  const isExpanded = dropdownToggle.getAttribute("aria-expanded") === "true";
  dropdownToggle.setAttribute("aria-expanded", String(!isExpanded));
  dropdown?.classList.toggle("is-open", !isExpanded);
});

document.addEventListener("click", (event) => {
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.remove("is-open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    dropdown?.classList.remove("is-open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
    closeMobileMenu();
    menuToggle?.focus();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMobileMenu();
    dropdown?.classList.remove("is-open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  });
});

function showFieldError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("is-error");

  const name = contactForm.elements.namedItem("name");
  const email = contactForm.elements.namedItem("email");
  const message = contactForm.elements.namedItem("message");
  let firstInvalidField = null;
  let hasErrors = false;

  [
    [name, "Ingrese su nombre o el de su empresa."],
    [email, "Ingrese su correo electrónico."],
    [message, "Escriba un mensaje para poder orientarle."]
  ].forEach(([field, emptyMessage]) => {
    const value = field.value.trim();
    let error = "";

    if (!value) {
      error = emptyMessage;
    } else if (field === email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Ingrese un correo electrónico válido.";
    }

    showFieldError(field, error);
    if (error) {
      hasErrors = true;
      firstInvalidField ||= field;
    }
  });

  if (hasErrors) {
    formStatus.textContent = "Revise los campos señalados antes de continuar.";
    formStatus.classList.add("is-error");
    firstInvalidField?.focus();
    return;
  }

  formStatus.textContent = "Mensaje validado. Esta demostración estática no transmite sus datos.";
  contactForm.reset();
  [name, email, message].forEach((field) => showFieldError(field, ""));
});

contactForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") showFieldError(field, "");
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
