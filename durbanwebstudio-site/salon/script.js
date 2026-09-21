/* =====================================================
   AMBER TIDE HAIR STUDIO: this page's own JavaScript

   Does three things:
   1. Fills the green price guide when a service is chosen.
   2. Makes the "Request" links in the price list pick that
      service in the form.
   3. Connects the form to the shared sending code (form.js).
   ===================================================== */


// ---------- 1. Find the parts of the page we need ----------
const serviceSelect = document.getElementById("service");
const estimatePrice = document.getElementById("estimate-price");
const estimateNote = document.getElementById("estimate-note");


// ---------- 2. The price guide ----------
// Runs at the start, and again every time a different service is chosen.
function updateGuide() {
  // The <option> the visitor picked, and the price and time stored on it in the HTML.
  const option = serviceSelect.selectedOptions[0];

  estimatePrice.textContent = option.value + ", " + option.dataset.price;
  estimateNote.textContent =
    option.dataset.time + ". We confirm the exact price when we reply.";
}

serviceSelect.addEventListener("change", updateGuide);
updateGuide();   // and once right now, so the box is never empty


// ---------- 3. The "Request" links in the price list ----------
// Each link has data-choose="Highlights" (or similar) in the HTML.
document.querySelectorAll("[data-choose]").forEach(function (link) {
  link.addEventListener("click", function () {
    serviceSelect.value = link.dataset.choose;
    updateGuide();
  });
});


// ---------- 4. Connect the form to the shared sending code ----------
setUpForm({
  formId: "enquiry-form",
  successId: "success",
  subject: "Demo appointment request: Amber Tide Hair Studio",
  fromName: "Amber Tide Hair Studio (demo)",
  // Adds a line about the price guide to the email you receive.
  getExtraInfo: function () {
    return estimatePrice.textContent;
  },
  onReset: updateGuide
});
