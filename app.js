const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const whatsappNumber = "50582228669";

function setMenuOpen(isOpen) {
  if (!menuToggle || !primaryNavigation) return;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  primaryNavigation.classList.toggle("is-open", isOpen);
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

document.querySelectorAll('.primary-navigation a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    window.location.hash = target.id;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (link.closest(".primary-navigation")) setMenuOpen(false);
  });
});

const serviceField = contactForm?.elements.namedItem("service");
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (serviceField) serviceField.value = link.dataset.service;
  });
});

function setFieldError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("is-error");

  const name = contactForm.elements.namedItem("name");
  const replyContact = contactForm.elements.namedItem("replyContact");
  const service = contactForm.elements.namedItem("service");
  const message = contactForm.elements.namedItem("message");
  const fields = [
    [name, "Ingrese su nombre completo."],
    [replyContact, "Ingrese un teléfono o correo para contactarle."],
    [service, "Seleccione el servicio de su interés."],
    [message, "Escriba un mensaje para poder orientarle."]
  ];
  let firstInvalidField = null;
  let hasErrors = false;

  fields.forEach(([field, requiredMessage]) => {
    const value = field.value.trim();
    const isEmail = field === replyContact && value.includes("@");
    const emailIsValid = !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const error = !value ? requiredMessage : !emailIsValid ? "Ingrese un correo electrónico válido." : "";
    setFieldError(field, error);
    if (error) {
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = field;
    }
  });

  if (hasErrors) {
    formStatus.textContent = "Revise los campos señalados para continuar.";
    formStatus.classList.add("is-error");
    firstInvalidField?.focus();
    return;
  }

  const whatsappMessage = [
    "Hola, soy " + name.value.trim() + ".",
    "Mi teléfono o correo: " + replyContact.value.trim() + ".",
    "Me interesa: " + service.value + ".",
    "Mensaje: " + message.value.trim()
  ].join("\n");
  const whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappMessage);

  formStatus.textContent = "Abriendo WhatsApp con su mensaje listo para enviar.";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

contactForm?.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") setFieldError(field, "");
  });
  field.addEventListener("change", () => {
    if (field.getAttribute("aria-invalid") === "true") setFieldError(field, "");
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
