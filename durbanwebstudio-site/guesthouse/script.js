/* =====================================================
   BLUFF VIEW GUEST HOUSE: this page's own JavaScript

   Does four things:
   1. Works out the price estimate (nights x room price).
   2. Keeps the check-out date after the check-in date.
   3. Makes the "Choose this room" links pick that room in the form.
   4. Connects the form to the shared sending code (form.js).
   ===================================================== */


// ---------- 1. Find the parts of the page we need ----------
const roomSelect = document.getElementById("room");
const guestsInput = document.getElementById("guests");
const guestsHint = document.getElementById("guests-hint");
const checkIn = document.getElementById("checkin");
const checkOut = document.getElementById("checkout");
const estimatePrice = document.getElementById("estimate-price");
const estimateNote = document.getElementById("estimate-note");


// ---------- 2. Small helper functions ----------

// Turn a number into rand, for example 2940 into "R2,940".
function formatRand(amount) {
  return "R" + amount.toLocaleString("en-US");
}

// Count the nights between two dates typed as "2026-11-06".
// A day has 1000 x 60 x 60 x 24 milliseconds.
function countNights(start, end) {
  if (start === "" || end === "") {
    return 0;
  }
  const milliseconds = new Date(end) - new Date(start);
  return Math.round(milliseconds / (1000 * 60 * 60 * 24));
}

// Give back the day after a date, in the same "2026-11-07" style.
function dayAfter(dateText) {
  const date = new Date(dateText);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().split("T")[0];
}


// ---------- 3. The estimate ----------
// Runs at the start, and again every time the room, dates or guests change.
function updateEstimate() {
  // The <option> the visitor picked, and the numbers stored on it in the HTML.
  const option = roomSelect.selectedOptions[0];
  const pricePerNight = Number(option.dataset.price);
  const maxGuests = Number(option.dataset.guests);

  // Tell the guest box its limit, and show a hint under it.
  guestsInput.max = maxGuests;
  guestsHint.textContent = option.value + " sleeps up to " + maxGuests + " guests.";

  const nights = countNights(checkIn.value, checkOut.value);

  if (nights > 0) {
    const nightsText = nights === 1 ? "1 night" : nights + " nights";
    estimatePrice.textContent = formatRand(nights * pricePerNight);
    estimateNote.textContent =
      nightsText + " at " + formatRand(pricePerNight) +
      ". We confirm the final rate by email.";
  } else {
    // No dates yet, or check-out is not after check-in.
    estimatePrice.textContent = "Choose your dates";
    estimateNote.textContent = "Your estimate appears here.";
  }
}


// ---------- 4. Dates ----------
// Don't allow check-in dates in the past.
// toISOString gives "2026-09-21T10:30..." and we keep the part before the "T".
checkIn.min = new Date().toISOString().split("T")[0];

// When check-in changes, check-out must be at least one day later.
checkIn.addEventListener("change", function () {
  if (checkIn.value !== "") {
    checkOut.min = dayAfter(checkIn.value);
  }
  updateEstimate();
});


// ---------- 5. Update the estimate whenever the visitor changes something ----------
roomSelect.addEventListener("change", updateEstimate);
checkOut.addEventListener("change", updateEstimate);
guestsInput.addEventListener("input", updateEstimate);
updateEstimate();   // and once right now, so the box is never empty


// ---------- 6. The "Choose this room" links ----------
// Each link has data-choose="Sea-view room" (or similar) in the HTML.
document.querySelectorAll("[data-choose]").forEach(function (link) {
  link.addEventListener("click", function () {
    roomSelect.value = link.dataset.choose;
    updateEstimate();
  });
});


// ---------- 7. Connect the form to the shared sending code ----------
setUpForm({
  formId: "enquiry-form",
  successId: "success",
  subject: "Demo enquiry: Bluff View Guest House",
  fromName: "Bluff View Guest House (demo)",
  // Adds a line about the estimate to the email you receive.
  getExtraInfo: function () {
    return roomSelect.value + ", " + guestsInput.value + " guests: " + estimatePrice.textContent;
  },
  onReset: updateEstimate
});
