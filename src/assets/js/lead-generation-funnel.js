const funnelForm = document.querySelector("[data-frappe-form-pending]");
const previewSubmit = document.querySelector("[data-preview-submit]");
const formStatus = document.querySelector(".lgf-form-status");
const mobileCta = document.querySelector(".lgf-mobile-cta");
const formSection = document.querySelector("#lead-audit-form");
const funnelFooter = document.querySelector(".lgf-footer");

if (funnelForm && previewSubmit && formStatus) {
  previewSubmit.addEventListener("click", () => {
    const firstInvalidField = [...funnelForm.querySelectorAll("input, select")].find(
      (field) => !field.checkValidity(),
    );

    if (firstInvalidField) {
      firstInvalidField.reportValidity();
      return;
    }

    formStatus.textContent =
      "This preview form is not connected yet. Frappe submission will be enabled when the CRM form details are supplied.";
    formStatus.hidden = false;
    formStatus.focus();
  });
}

if (mobileCta && formSection && "IntersectionObserver" in window) {
  const visibleTargets = new Set();
  const formObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleTargets.add(entry.target);
        } else {
          visibleTargets.delete(entry.target);
        }
      });
      mobileCta.classList.toggle("is-hidden", visibleTargets.size > 0);
    },
    { threshold: 0.08 },
  );

  formObserver.observe(formSection);
  if (funnelFooter) formObserver.observe(funnelFooter);
}
