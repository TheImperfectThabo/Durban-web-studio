/* ==========================================================
   FORM HELPER, USED BY EVERY PAGE

   Each page calls setUpForm({...}) once. This function then:
   1. waits for the visitor to press the send button,
   2. sends what they typed to Web3Forms (which emails it to you),
   3. shows a "thank you" box, or an error message if it fails.

   It needs assets/config.js to be loaded first (it holds the key).
   ========================================================== */

function setUpForm(options) {
  // ---- 1. Find the parts of the page we need ----
  const form = document.getElementById(options.formId);
  const errorBox = form.querySelector(".form-error");
  const sendButton = form.querySelector("button[type=submit]");
  const successBox = document.getElementById(options.successId);
  const anotherButton = successBox.querySelector("button");
  const nameInSuccess = successBox.querySelector(".who");
  const originalButtonText = sendButton.textContent;

  // ---- 2. When the visitor presses the send button ----
  form.addEventListener("submit", async function (event) {
    // Stop the browser from reloading the page (its normal behaviour).
    event.preventDefault();
    errorBox.textContent = "";

    // The browser has already checked the required fields for us
    // (that is what the "required" and type="email" in the HTML do).

    // Check the access key was added in assets/config.js.
    if (FORM_SETTINGS.accessKey.startsWith("PASTE")) {
      errorBox.textContent =
        "This form is not connected yet. Open assets/config.js and paste in your access key.";
      return;
    }

    // Collect everything the visitor typed into one bundle.
    const data = new FormData(form);
    data.append("access_key", FORM_SETTINGS.accessKey);
    data.append("subject", options.subject);       // becomes the email subject
    data.append("from_name", options.fromName);    // shows who sent it
    if (options.getExtraInfo) {
      // Adds the estimate (price guide) to the email, if the page has one.
      data.append("estimate", options.getExtraInfo());
    }

    // Show that we are working.
    sendButton.disabled = true;
    sendButton.textContent = "Sending...";

    try {
      // Send the bundle to Web3Forms and wait for its answer.
      const response = await fetch(FORM_SETTINGS.endpoint, {
        method: "POST",
        body: data
      });
      const result = await response.json();

      if (result.success) {
        // It worked: hide the form and show the thank-you box.
        nameInSuccess.textContent = data.get("name");
        form.hidden = true;
        successBox.hidden = false;
        successBox.focus();
      } else {
        errorBox.textContent = "Sorry, that did not send. Please try again.";
      }
    } catch (error) {
      // No internet, or the service could not be reached.
      errorBox.textContent =
        "Sorry, we could not connect. Please check your internet and try again.";
    }

    // Put the button back to normal.
    sendButton.disabled = false;
    sendButton.textContent = originalButtonText;
  });

  // ---- 3. The "Send another" button in the thank-you box ----
  anotherButton.addEventListener("click", function () {
    form.reset();
    successBox.hidden = true;
    form.hidden = false;
    if (options.onReset) {
      options.onReset();   // lets the page refresh its estimate
    }
  });
}
