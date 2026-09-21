DURBAN WEB STUDIO SITE: READ ME FIRST
=====================================

WHAT IS IN THIS FOLDER
  index.html, style.css, script.js   The home page (examples and contact form)
  privacy/                           The privacy notice
  salon/                             Demo: Amber Tide Hair Studio
  caterer/                           Demo: Fire & Saffron Catering
  guesthouse/                        Demo: Bluff View Guest House
  assets/config.js                   YOUR ACCESS KEY GOES HERE (the only file to edit to connect forms)
  assets/form.js                     Shared code that sends every form
  images/                            The preview pictures on the home page
  404.html                           The "page not found" page
  favicon.svg, og.png                Browser tab icon and sharing picture

Each site folder has three files:
  index.html   the content and structure (what is on the page)
  style.css    how it looks (colours, sizes, layout)
  script.js    what it does (estimates, buttons, sending the form)

STEP 1: CONNECT THE FORMS (free, no phone needed)
  1. Go to https://web3forms.com and enter your email address.
  2. They email you an access key.
  3. Open assets/config.js and paste the key between the quote marks.
  Until you do this, every form shows "This form is not connected yet".
  To change the email later: get a new key for the new email and replace the old one.

STEP 2: PUBLISH THE SITE
  Upload this whole folder to Cloudflare Pages, Netlify or GitHub Pages.
  The file called index.html must sit at the top of the folder.

STEP 3: AFTER PUBLISHING
  1. Open index.html and replace REPLACE_WITH_YOUR_SITE_ADDRESS with your real
     address (for example  yourname.pages.dev ). This makes link previews work.
  2. Send a test message from all four forms and check each one arrives in your inbox.
  3. Open every button and link on a phone.

WHERE TO CHANGE THINGS
  Colours:  the :root block at the top of each style.css
  Words:    the HTML files (comments mark every section)
  Prices:   in the HTML, both the visible price and the data-price numbers
            on the <option> tags of the form (the estimate reads those)

A GOOD ORDER TO LEARN IT
  1. salon/index.html, then salon/style.css (the simplest one)
  2. salon/script.js
  3. assets/form.js
  4. The other two demos, which repeat the same ideas
