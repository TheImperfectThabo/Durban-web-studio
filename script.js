/* =====================================================
   FIRE & SAFFRON CATERING: this page's own JavaScript

   Does three things:
   1. Works out the price estimate in the black box.
   2. Makes the "Get a quote" buttons on the package cards
      pick that package in the form.
   3. Connects the form to the shared sending code (form.js).
   ===================================================== */


// ---------- 1. Find the parts of the page we need ----------
const packageSelect = document.getElementById("package");
const guestsInput = document.getElementById("guests");
const guestsHint = document.getElementById("guests-hint");
const dateInput = document.getElementById("date");
const estimatePrice = document.getElementById("estimate-price");
const estimateNote = document.getElementById("estimate-note");


// ---------- 2. Turn a number into rand, for example 16800 into "R16,800" ----------
function formatRand(amount) {
  return "R" + amount.toLocaleString("en-US");
}


// ---------- 3. The estimate ----------
// Runs at the start, and again every time the package or guest number changes.
function updateEstimate() {
  // The <option> the visitor picked, and the numbers stored on it in the HTML.
  const option = packageSelect.selectedOptions[0];
  const pricePerPerson = Number(option.dataset.price);
  const minGuests = Number(option.dataset.min);
  const maxGuests = Number(option.dataset.max);

  // Tell the guest box its limits, and show a hint under the package.
  guestsInput.min = minGuests;
  guestsInput.max = maxGuests;
  guestsHint.textContent =
    option.value + " packages suit " + minGuests + " to " + maxGuests + " guests.";

  const guests = Number(guestsInput.value);

  if (guestsInput.value === "") {
    // Nothing typed yet.
    estimatePrice.textContent = "Add your guest numbers";
    estimateNote.textContent = "Your estimate appears here.";
  } else if (guests < minGuests || guests > maxGuests) {
    // The number is outside what this package covers.
    estimatePrice.textContent = "Choose " + minGuests + " to " + maxGuests + " guests";
    estimateNote.textContent = "Or pick a different package.";
  } else {
    // All good: guests multiplied by the price per person.
    estimatePrice.textContent = "from " + formatRand(guests * pricePerPerson);
    estimateNote.textContent =
      guests + " guests at " + formatRand(pricePerPerson) +
      " each. The exact price comes with your quote.";
  }
}

// Update the estimate whenever the visitor changes something.
packageSelect.addEventListener("change", updateEstimate);
guestsInput.addEventListener("input", updateEstimate);
updateEstimate();   // and once right now, so the box is never empty


// ---------- 4. The "Get a quote" buttons on the package cards ----------
// Each button has data-choose="Wedding" (or similar) in the HTML.
document.querySelectorAll("[data-choose]").forEach(function (button) {
  button.addEventListener("click", function () {
    packageSelect.value = button.dataset.choose;
    updateEstimate();
  });
});


// ---------- 5. Don't allow event dates in the past ----------
// toISOString gives "2026-09-21T10:30..." and we keep the part before the "T".
dateInput.min = new Date().toISOString().split("T")[0];


// ---------- 6. Connect the form to the shared sending code ----------
setUpForm({
  formId: "enquiry-form",
  successId: "success",
  subject: "Demo quote request: Fire & Saffron Catering",
  fromName: "Fire & Saffron Catering (demo)",
  // Adds a line about the estimate to the email you receive.
  getExtraInfo: function () {
    return packageSelect.value + ", " + guestsInput.value + " guests: " + estimatePrice.textContent;
  },
  onReset: updateEstimate
});
